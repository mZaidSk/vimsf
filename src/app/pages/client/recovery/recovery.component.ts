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
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { Sort } from '@angular/material/sort';

import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { TableConstants } from 'src/app/shared/api/table-constant';
import { ComfirmationModalComponent } from 'src/app/shared/modal/comfirmation-modal/comfirmation-modal.component';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss'],
})
export class RecoveryComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  displayedColumns: string[] = [
    'id',
    'bank',
    'client',
    'website',
    'amount',
    'bonus_amount',
    'created_at',
    'is_process',
    'description',
    'action',
  ];
  subscriptions: Subscription[] = [];
  dataSource: any;
  total: number;
  searchText: string;
  orderBy: string = 'action_id';
  orderType: string = 'asc';
  pageSizeOptions = TableConstants.pageSizesOptions;
  pageSize = TableConstants.pageSizes;

  searchData: Subject<string> = new Subject<string>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private baseService: BaseService,
    public dialog: MatDialog,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.getRecoveryList();
    this.subscriptions.push(
      this.searchData
        .pipe(debounceTime(750), distinctUntilChanged())
        .subscribe((value) => {
          this.searchText = value;
          this.getRecoveryList();
        })
    );
  }

  sortData(sort: Sort) {
    if (sort.direction) {
      this.orderBy = sort.active;
      this.orderType = sort.direction;
      this.getRecoveryList();
    }
  }

  getRecoveryList() {
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
            return this.baseService.getRecoveryList(
              this.paginator.pageIndex,
              this.pageSize,
              this.searchText,
              this.orderBy,
              this.orderType
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

  onSearch(event) {
    this.searchData.next(event.target.value);
  }

  back() {
    this._location.back();
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

  delete(recovery) {
    const dialogRef = this.dialog.open(ComfirmationModalComponent, {
      height: '200px',
      width: '500px',
      data: {
        text: `Are you sure you want to delete this recovery`,
        name: recovery.name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.baseService.deleteRecovery(recovery.id).subscribe((response) => {
          if (response && response['success']) this.getRecoveryList();
          else this.isLoading = false;
        });
      }
    });
  }

  updateStatus(recovery) {
    const dialogRef = this.dialog.open(ComfirmationModalComponent, {
      height: '200px',
      width: '500px',
      data: {
        text: `Are you sure you want to update this recovery`,
        name: recovery.name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.baseService
          .updateRecoveryStatus(recovery.id)
          .subscribe((response) => {
            if (response && response['success']) this.getRecoveryList();
            else this.isLoading = false;
          });
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
