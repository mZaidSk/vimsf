import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { merge, of as observableOf, Subscription, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
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

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
})
export class TransactionHistoryComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  displayedColumns: string[] = [
    'client',
    'website',
    'bank',
    'action',
    'status',
    'amount',
    'bonus',
    'utr',
    'backdate',
    'description',
    'updated_at',
  ];
  subscriptions: Subscription[] = [];
  dataSource: any;
  historyId: any;
  total: number;
  searchText: string;
  pageSizeOptions = TableConstants.pageSizesOptions;
  pageSize = TableConstants.pageSizes;

  searchData: Subject<string> = new Subject<string>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private activateRoute: ActivatedRoute,
    private baseService: BaseService,
    public dialog: MatDialog,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.activateRoute.params.subscribe((data) => {
      this.historyId = data['id'];
      this.getTransactionHistoryList();
    });
    this.subscriptions.push(
      this.searchData
        .pipe(debounceTime(750), distinctUntilChanged())
        .subscribe((value) => {
          this.searchText = value;
          this.getTransactionHistoryList();
        })
    );
  }

  getTransactionHistoryList() {
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
            return this.baseService.getTransactionHistoryList(
              this.historyId,
              this.paginator.pageIndex,
              this.pageSize,
              this.searchText
            );
          }),
          map((response: any) => {
            if (response.success) {
              //console.log(response.data);
              this.dataSource = response.data.map((prop) => prop.contents);
              console.log(this.dataSource);
              this.total = response.total;
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

  readmore(description) {
    const dialogRef = this.dialog.open(ComfirmationModalComponent, {
      height: '200px',
      width: '500px',
      data: {
        text: ``,
        name: description,
        done: "no"
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
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
