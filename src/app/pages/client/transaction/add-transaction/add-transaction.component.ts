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
import { ClientModalComponent } from 'src/app/shared/modal/client-modal/client-modal.component';
import { actions, status } from 'src/app/shared/data/data';
import { Constants } from 'src/app/shared/api/constant';
import { Utils } from 'src/app/shared/utilities/utils';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss'],
})
export class AddTransactionComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  searchText: string;
  form: FormGroup;
  transactionId: string;
  isLoading: boolean;
  websites: any[] = [];
  banks: any[] = [];
  actions: any[] = actions;
  statuses: any[] = status;
  clients: any[] = [];
  is_admin: any = 0;
  available_balance: number = 0;
  available_balance_after: number = 0;
  isRecoveryStatus: any = { descprition: '', id: '' };
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

  onKeyPress(event) {
    Utils.onKeyPress(event);
  }

  onAmountChange(event) {
    let amount = event.target.value;
    let bonus_amount = this.form.controls['bonus_amount']?.value;
    this.available_balance_after = 0;
    if (this.form.value.action_id == 1) {
      this.available_balance_after =
        Number(this.available_balance) -
        (Number(amount) + Number(bonus_amount));
    } else if (this.form.value.action_id == 2) {
      this.available_balance_after =
        Number(this.available_balance) + Number(amount) + Number(bonus_amount);
    }
  }

  onBonusAmountChange(event) {
    let bonus_amount = event.target.value;
    let amount = this.form.controls['amount']?.value;
    this.available_balance_after = 0;
    if (this.form.value.action_id == 1) {
      this.available_balance_after =
        Number(this.available_balance) -
        (Number(amount) + Number(bonus_amount));
    } else if (this.form.value.action_id == 2) {
      this.available_balance_after =
        Number(this.available_balance) + Number(amount) + Number(bonus_amount);
    }
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
      this.transactionId = data['id'];
      if (this.transactionId) {
        this.isLoading = true;
        this.getTransactionDetail();
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

  getTransactionDetail() {
    this.isLoading = true;
    this.baseService
      .getTransaction(this.transactionId)
      .subscribe((response) => {
        if (response && response['success']) {
          this.isLoading = false;
          this.subTransactionDetailPatch(response['data']['data']);
        } else {
          this.isLoading = false;
        }
      });
  }

  subTransactionDetailPatch(data) {
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

  CreateNew() {
    const dialogRef = this.dialog.open(ClientModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '43%',
      width: '60%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        const { data } = result;
        this.baseService.createClient(data).subscribe(
          (response) => {
            if (response && response['success']) {
              this.isLoading = false;
              this.getClientList();
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
    });
  }

  actionChange(eve) {
    this.form.controls['is_process'].setValue(eve === 1 ? 1 : 0);
  }

  clientChange(eve) {
    const client = this.clients.find((client) => client.id === eve);
    this.getRecoveryStatus(eve);
    if (client?.website?.id)
      this.form.controls['website_id'].setValue(client?.website?.id);
    this.getAvailableBalance(client?.website?.id);
  }

  getAvailableBalance(website_id) {
    this.baseService.getAvailableBalance(website_id).subscribe(
      (response) => {
        if (response && response['success']) {
          this.available_balance = response['data'].data.balance;
        } else {
          this.available_balance = 0;
        }
      },
      (error) => {
        const { reason } = error.error;
        const keys = Object.keys(reason);
        keys.forEach((key, index) => {
          this.alertService.multipleAlert(reason[key][0], index);
        });
      }
    );
  }

  getRecoveryStatus(id) {
    this.baseService.getRecoveryStatus(id).subscribe(
      (response) => {
        if (response && response['success']) {
          console.log(response);
          this.isRecoveryStatus = response['data'].data;
        } else {
          this.isRecoveryStatus = { descprition: '', id: '' };
        }
      },
      (error) => {
        const { reason } = error.error;
        const keys = Object.keys(reason);
        keys.forEach((key, index) => {
          this.alertService.multipleAlert(reason[key][0], index);
        });
      }
    );
  }

  back() {
    this._location.back();
  }

  onSubmit() {
    this.isLoading = true;
    if (this.transactionId) this.updateTransaction(this.transactionId);
    else this.createTransaction();
  }

  createTransaction() {
    this.baseService.createTransaction(this.form.value).subscribe(
      (response) => {
        if (response && response['success']) {
          this.isLoading = false;
          this.router.navigate(['client/transaction-list/']);
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

  updateTransaction(transactionId) {
    this.baseService
      .updateTransaction(this.form.value, transactionId)
      .subscribe(
        (response) => {
          if (response && response['success']) {
            this.isLoading = false;
            this.router.navigate(['client/transaction-list']);
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

  onclickRecovery(id) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/client/recovery-list/edit-recovery`, id])
    );
    window.open(url, '_blank');
  }
}
