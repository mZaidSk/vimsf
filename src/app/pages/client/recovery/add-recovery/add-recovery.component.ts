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
  selector: 'app-add-recovery',
  templateUrl: './add-recovery.component.html',
  styleUrls: ['./add-recovery.component.scss'],
})
export class AddRecoveryComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  searchText: string;
  form: FormGroup;
  recoveryId: string;
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
      website_id: [null],
      action_id: [null],
      bank_id: [null],
      client_id: [null],
      amount: [null],
      bonus_amount: [0, [Validators.max(this.maximumBonus)]],
      is_process: [0, Validators.required],
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
      this.recoveryId = data['id'];
      if (this.recoveryId) {
        this.isLoading = true;
        this.getRecoveryDetail();
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

  getRecoveryDetail() {
    this.isLoading = true;
    this.baseService.getRecovery(this.recoveryId).subscribe((response) => {
      if (response && response['success']) {
        this.isLoading = false;
        this.subRecoveryDetailPatch(response['data']['data']);
      } else {
        this.isLoading = false;
      }
    });
  }

  subRecoveryDetailPatch(data) {
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
    if (this.recoveryId) this.updateRecovery(this.recoveryId);
    else this.createRecovery();
  }

  createRecovery() {
    this.baseService.createRecovery(this.form.value).subscribe(
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

  updateRecovery(recoveryId) {
    this.baseService.updateRecovery(this.form.value, recoveryId).subscribe(
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
