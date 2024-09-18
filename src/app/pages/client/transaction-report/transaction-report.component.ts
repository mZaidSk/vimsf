import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { merge, of as observableOf, Subscription, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  startWith,
  switchMap,
  map,
  catchError,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { TableConstants } from 'src/app/shared/api/table-constant';
import { ComfirmationModalComponent } from 'src/app/shared/modal/comfirmation-modal/comfirmation-modal.component';
import { actions } from 'src/app/shared/data/data';
import { Utils } from 'src/app/shared/utilities/utils';

@Component({
  selector: 'app-transaction-report',
  templateUrl: './transaction-report.component.html',
  styleUrls: ['./transaction-report.component.scss'],
})
export class TransactionReportComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isLoading: boolean;
  searchText: string;
  displayedColumns: string[] = [
    'id',
    'action_id',
    'utr',
    'bank',
    'client',
    'website',
    'amount',
    'bonus_amount',
    'created_at',
    'created_by',
    'is_process',
    'action',
  ];
  banks: any[] = [];
  clients: any[] = [];
  websites: any[] = [];
  actions: any[] = actions;
  subscriptions: Subscription[] = [];
  dataSource: any;
  total: number;
  pageSizeOptions = TableConstants.pageSizesOptions;
  pageSize = TableConstants.pageSizes;

  searchData: Subject<string> = new Subject<string>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private baseService: BaseService,
    public dialog: MatDialog,
    private _location: Location,
    private router: Router
  ) {
    this.form = this.fb.group({
      action_id: [null],
      amount: [''],
      bank_id: [null],
      client_id: [null],
      website_id: [null],
      start_date_time: [null],
      end_date_time: [null],
    });
  }

  ngOnInit(): void {
    this.getTransactionList();
    this.subscriptions.push(
      this.searchData
        .pipe(debounceTime(750), distinctUntilChanged())
        .subscribe((value) => {
          this.searchText = value;
          this.getClientList();
        })
    );
    this.getBank();
    this.getWebsite();
  }

  onKeyPress(event) {
    Utils.onKeyPress(event);
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

  getBank() {
    this.baseService.getAllBank().subscribe((response) => {
      if (response && response['success']) this.banks = response['data'].data;
      else this.banks = [];
    });
  }

  getWebsite() {
    this.baseService.getBranchWebsite().subscribe((response) => {
      if (response && response['success'])
        this.websites = response['data'].data;
      else this.websites = [];
    });
  }

  getTransactionList() {
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
            return this.baseService.getAllTransactionReport(
              this.paginator.pageIndex,
              this.pageSize,
              this.searchText,
              this.form.value
            );
          }),
          map((response: any) => {
            this.isLoading = false;
            if (response.success) {
              this.dataSource = response.data.data;
              this.total = response.data.total;
              this.dataSource.paginator = this.paginator;
            } else this.dataSource = [];
          }),
          catchError((error) => {
            this.isLoading = false;
            return observableOf([]);
          })
        )
        .subscribe((res) => res)
    );
  }

  back() {
    this._location.back();
  }

  delete(transaction) {
    const dialogRef = this.dialog.open(ComfirmationModalComponent, {
      height: '200px',
      width: '500px',
      data: {
        text: `Are you sure you want to delete this transaction`,
        name: transaction.name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.baseService
          .deleteTransaction(transaction.id)
          .subscribe((response) => {
            if (response && response['success']) this.getTransactionList();
            else this.isLoading = false;
          });
      }
    });
  }

  updateStatus(transaction) {
    const dialogRef = this.dialog.open(ComfirmationModalComponent, {
      height: '200px',
      width: '500px',
      data: {
        text: `Are you sure you want to update this transaction`,
        name: transaction.name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.baseService
          .updateTransactionStatus(transaction.id)
          .subscribe((response) => {
            if (response && response['success']) this.getTransactionList();
            else this.isLoading = false;
          });
      }
    });
  }

  onSubmit() {
    this.getTransactionList();
  }

  navigateToResource(element): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        `client/transaction-list/edit-transaction/${element.id}`,
      ])
    );
    window.open(url, '_blank');
  }

  routeToTransaction() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`client/transaction-list/add-transaction`])
    );
    window.open(url, '_blank');
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}