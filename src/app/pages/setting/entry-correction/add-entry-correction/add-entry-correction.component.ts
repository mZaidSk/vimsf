import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { merge, Subscription, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  startWith,
  switchMap,
  map,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import { AlertService } from 'src/app/shared/services/alert-service/alert.service';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { actions, status } from 'src/app/shared/data/data';
import { Constants } from 'src/app/shared/api/constant';

@Component({
  selector: 'app-add-entry-correction',
  templateUrl: './add-entry-correction.component.html',
  styleUrls: ['./add-entry-correction.component.scss'],
})
export class AddEntryCorrectionComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  searchText: string;
  form: FormGroup;
  entryCorrectionId: string;
  isLoading: boolean;
  websites: any[] = [];
  banks: any[] = [];
  actions: any[] = actions;
  statuses: any[] = status;
  clients: any[] = [];
  is_admin: any = 0;
  searchData: Subject<string> = new Subject<string>();
  maximumBonus = +localStorage.getItem(Constants.maximum_bonus);

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private _location: Location,
    private alertService: AlertService,
    private baseService: BaseService
  ) {
    this.is_admin = Number(localStorage.getItem('is_admin'));
    this.form = this.fb.group({
      website_id: [null, Validators.required],
      action_id: [1, Validators.required],
      bank_id: [null, Validators.required],
      client_id: [null, Validators.required],
      amount: [null, Validators.required],
      bonus_amount: [
        0,
        [Validators.required, Validators.max(this.maximumBonus)],
      ],
      is_process: [1, Validators.required],
      utr: [null],
      description: [null],
      created_at: [this.getDateFormat(new Date())],
    });
  }

  getDateFormat(date) {
    const formatted =
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1) +
      '-' +
      date.getDate() +
      'T' +
      date.getHours() +
      ':' +
      date.getMinutes();
    return formatted;
  }

  ngOnInit(): void {
    this.getWebsite();
    this.getBank();
    this.getParam();
    this.subscriptions.push(
      this.searchData
        .pipe(debounceTime(750), distinctUntilChanged())
        .subscribe((value) => {
          this.searchText = value;
          this.getClientList();
        })
    );
  }

  emitResponse() {
    this.getParam();
  }

  getParam() {
    this.activateRoute.params.subscribe((data) => {
      this.entryCorrectionId = data['id'];
      if (this.entryCorrectionId) {
        this.isLoading = true;
        this.getEntryCorrectionDetail();
      }
    });
  }

  getWebsite() {
    this.baseService.getBranchWebsite().subscribe((response) => {
      if (response && response['success'])
        this.websites = response['data'].data;
      else this.websites = [];
    });
  }

  getBank() {
    this.baseService.getAllBank().subscribe((response) => {
      if (response && response['success']) this.banks = response['data'].data;
      else this.banks = [];
    });
  }

  getClientList() {
    this.subscriptions.push(
      merge(this.searchText)
        .pipe(
          startWith({}),
          debounceTime(1000),
          switchMap(() => {
            return this.baseService.getAllBankSearch(this.searchText);
          }),
          map((response: any) => {
            if (response.success) this.clients = response['data']?.data;
            else this.clients = [];
          })
        )
        .subscribe((res) => res)
    );
  }

  clientSearch({ term }) {
    if (term.trim().length > 2) this.searchData.next(term);
  }

  getEntryCorrectionDetail() {
    this.isLoading = true;
    this.baseService
      .getEntryCorrection(this.entryCorrectionId)
      .subscribe((response) => {
        if (response && response['success']) {
          this.isLoading = false;
          this.subEntryCorrectionDetailPatch(response['data']['data']);
        } else {
          this.isLoading = false;
        }
      });
  }

  subEntryCorrectionDetailPatch(data) {
    const {
      action_id,
      bank_id,
      client_id,
      website_id,
      amount,
      description,
      utr,
      bonus_amount,
      is_process,
      client,
    } = data;
    this.clients = [client];
    this.form.patchValue({
      action_id,
      website_id,
      bank_id,
      client_id,
      amount,
      description,
      utr,
      bonus_amount,
      is_process,
      created_at: this.getDateFormat(new Date(data?.created_at)),
    });
  }

  actionChange(eve) {
    this.form.controls['is_process'].setValue(eve === 1 ? 1 : 0);
  }

  clientChange(eve) {
    const client = this.clients.find((client) => client.id === eve);
    if (client?.website?.id)
      this.form.controls['website_id'].setValue(client?.website?.id);
  }

  back() {
    this._location.back();
  }

  onSubmit() {
    this.isLoading = true;
    if (this.entryCorrectionId)
      this.updateEntryCorrection(this.entryCorrectionId);
  }

  updateEntryCorrection(entryCorrectionId) {
    this.baseService
      .updateEntryCorrection(this.form.value, entryCorrectionId)
      .subscribe(
        (response) => {
          if (response && response['success']) {
            this.isLoading = false;
            this.router.navigate(['client/recovery-list']);
          } else this.isLoading = false;
        },
        (error) => {
          const { reason } = error.error;
          const keys = Object.keys(reason);
          keys.forEach((key, index) => {
            this.alertService.multipleAlert(reason[key][0], index);
          });
          this.isLoading = false;
        }
      );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
