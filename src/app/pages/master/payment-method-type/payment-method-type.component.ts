import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { merge, of as observableOf, Subscription, Subject } from 'rxjs';
import {
  startWith,
  switchMap,
  map,
  catchError,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { PaymentMethodFormComponent } from 'src/app/shared/modal/payment-method-form-modal/payment-method-form.component';
import { TableConstants } from 'src/app/shared/api/table-constant';
import { ComfirmationModalComponent } from 'src/app/shared/modal/comfirmation-modal/comfirmation-modal.component';

@Component({
  selector: 'app-payment-method-type',
  templateUrl: './payment-method-type.component.html',
  styleUrls: ['./payment-method-type.component.scss'],
})
export class PaymentMethodTypeComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  displayedColumns: string[] = [
    'title',
    'is_upi',
    'is_bank',
    'is_active',
    'is_receipt_required',
    'action',
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
    private baseService: BaseService,
    public dialog: MatDialog,
    private _location: Location,
    private router: Router
  ) {
    this.getParam();
  }

  getParam() {
    const data = this.router.url.split('/');
  }

  ngOnInit(): void {
    this.getPaymentMethodTypeList();
    this.subscriptions.push(
      this.searchData
        .pipe(debounceTime(750), distinctUntilChanged())
        .subscribe((value) => {
          this.searchText = value;
          this.getPaymentMethodTypeList();
        })
    );
  }

  getPaymentMethodTypeList() {
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
            return this.baseService.getPaymentMethodTypeList(
              this.paginator.pageIndex,
              this.pageSize,
              this.searchText
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

  editView(payload = undefined) {
    const dialogRef = this.dialog.open(PaymentMethodFormComponent, {
      height: '100%',
      width: '30%',
      position: {
        top: '0px',
        right: '0px',
      },
      data: { payload },
    });
    dialogRef.afterClosed().subscribe((result) => {
      const { response } = result;
      if (response) this.getPaymentMethodTypeList();
    });
  }

  delete(payment) {
    const dialogRef = this.dialog.open(ComfirmationModalComponent, {
      height: '200px',
      width: '500px',
      data: {
        text: `Are you sure you want to delete this Payment Method Type`,
        name: payment.name,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.baseService.deletePaymentMethodType(payment.id).subscribe(
          (response) => {
            if (response && response['success'])
              this.getPaymentMethodTypeList();
            else this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
          }
        );
      }
    });
  }

  onSearch(event) {
    this.searchData.next(event.target.value);
  }

  back() {
    this._location.back();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
