import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge, of as observableOf, Subscription, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  startWith,
  switchMap,
  map,
  catchError,
  debounceTime,
} from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';

import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { AlertService } from 'src/app/shared/services/alert-service/alert.service';
import { Utils } from 'src/app/shared/utilities/utils';
import { TableConstants } from 'src/app/shared/api/table-constant';
import { ComfirmationModalComponent } from 'src/app/shared/modal/comfirmation-modal/comfirmation-modal.component';

@Component({
  selector: 'app-bank-transfer',
  templateUrl: './bank-transfer.component.html',
  styleUrls: ['./bank-transfer.component.scss'],
})
export class BankTransferComponent implements OnInit, OnDestroy {
  form: FormGroup;
  filterForm: FormGroup;
  isLoading: boolean;
  banks: any[] = [];
  displayedColumns: string[] = [
    'fromname',
    'toname',
    'amount',
    'date',
    'utr',
    'created_by',
    'description',
  ];
  subscriptions: Subscription[] = [];
  dataSource: any;
  total: number;
  searchText: string;
  pageSizeOptions = TableConstants.pageSizesOptions;
  pageSize = TableConstants.pageSizes;

  searchData: Subject<string> = new Subject<string>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private baseService: BaseService,
    private alertService: AlertService,
    private _location: Location
  ) {
    this.form = this.fb.group({
      from_bank_id: [null, Validators.required],
      to_bank_id: [null, Validators.required],
      amount: [null, Validators.required],
      utr: [null, Validators.required],
      description: [null],
    });
    this.filterForm = this.fb.group({
      from_bank_id: [null],
      to_bank_id: [null],
      amount: [null],
      utr: [null],
    });
  }

  ngOnInit(): void {
    this.getBankList();
    this.getTransferBankList();
  }

  readmore(description) {
    const dialogRef = this.dialog.open(ComfirmationModalComponent, {
      height: '200px',
      width: '500px',
      data: {
        text: ``,
        name: description,
        done: 'no',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  getTransferBankList() {
    this.isLoading = true;
    this.subscriptions.push(
      merge(this.paginator.page)
        .pipe(
          startWith({}),
          debounceTime(1000),
          switchMap(() => {
            this.isLoading = true;
            this.pageSize =
              this.paginator.pageSize == undefined
                ? this.pageSize
                : this.paginator.pageSize;
            return this.baseService.getTransferBank(
              this.paginator.pageIndex,
              this.pageSize,
              this.searchText,
              this.filterForm.value
            );
          }),
          map((response: any) => {
            if (response.success) {
              this.dataSource = response.data.data;
              this.total = response.data.total;
              this.dataSource.paginator = this.paginator;
            } else this.dataSource = [];
            this.isLoading = false;
          }),
          catchError((error) => {
            this.isLoading = false;
            return observableOf([]);
          })
        )
        .subscribe((res) => res)
    );
  }

  getBankList() {
    this.baseService.getAllBank().subscribe((response) => {
      if (response && response['success']) this.banks = response['data'].data;
      else this.banks = [];
    });
  }

  onKeyPress(event) {
    Utils.onKeyPress(event);
  }

  onFilterSubmit() {
    this.getTransferBankList();
  }

  onSubmit = () => {
    this.isLoading = true;
    this.baseService.bankAmountTransfer(this.form.value).subscribe(
      (response) => {
        if (response && response['success']) {
          this.getTransferBankList();
          this.form.reset();
          this.alertService.showSuccess(response['reason'], 'Success');
        } else this.alertService.showError(response['reason'], 'Error');
        this.isLoading = false;
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
  };

  back() {
    this._location.back();
  }

  delete(ele) {
    const { id } = ele;
    this.baseService.deleteTransferAmount(id).subscribe((response) => {
      if (response && response['success']) {
        this.getTransferBankList();
        this.alertService.showSuccess(response['reason'], 'Success');
      } else this.alertService.showError(response['reason'], 'Error');
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
