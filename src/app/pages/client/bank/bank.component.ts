import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { merge, of as observableOf, Subscription, Subject } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert-service/alert.service';
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
import { statuses } from 'src/app/shared/data/data';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss'],
})
export class BankComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  displayedColumns: string[] = [
    'name',
    'branch',
    'amount',
    'inactive',
    'action',
  ];
  subscriptions: Subscription[] = [];
  statuses: any[] = statuses;
  status = 0;
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
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getBankList();
    this.subscriptions.push(
      this.searchData
        .pipe(debounceTime(750), distinctUntilChanged())
        .subscribe((value) => {
          this.searchText = value;
          this.getBankList();
        })
    );
  }

  statusChange(event) {
    this.status = event;
    this.getBankList();
  }

  getBankList() {
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
            return this.baseService.getBankList(
              this.paginator.pageIndex,
              this.pageSize,
              this.searchText,
              this.status
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

  onSearch(event) {
    this.searchData.next(event.target.value);
  }

  back() {
    this._location.back();
  }

  delete(bank) {
    const dialogRef = this.dialog.open(ComfirmationModalComponent, {
      height: '200px',
      width: '500px',
      data: {
        text: `Are you sure you want to delete this bank`,
        name: bank.name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.baseService.deleteBank(bank.id).subscribe(
          (response) => {
            if (response && response['success']) this.getBankList();
            else this.isLoading = false;
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

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
