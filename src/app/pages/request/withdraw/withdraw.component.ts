import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { merge, of as observableOf, Subscription, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
    startWith,
    switchMap,
    map,
    catchError,
    debounceTime,
    distinctUntilChanged,
} from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { Location } from '@angular/common';

import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { TableConstants } from 'src/app/shared/api/table-constant';
import { Constants } from 'src/app/shared/api/constant';
import { reqStatuses } from 'src/app/shared/data/data';
import { WithdrawlFormModalComponent } from 'src/app/shared/modal/withdrawl-form-modal/withdrawl-form-modal.component';
import { ComfirmationModalComponent } from 'src/app/shared/modal/comfirmation-modal/comfirmation-modal.component';

@Component({
    selector: 'app-withdraw',
    templateUrl: './withdraw.component.html',
    styleUrls: ['./withdraw.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class WithdrawComponent implements OnInit, OnDestroy {
    isLoading: boolean;
    displayedColumns: string[] = [
        'id',
        'website_name',
        'client_name',
        'current_status',
        'created_at',
        'description',
        'action',
    ];
    statuses: any[] = reqStatuses;
    status = [0, 1];
    payload = '0,1';
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
        private _location: Location,
        public dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.getUserRequest();
        this.subscriptions.push(
            this.searchData
                .pipe(debounceTime(750), distinctUntilChanged())
                .subscribe((value) => {
                    this.searchText = value;
                    this.getUserRequest();
                })
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

    statusChange(event) {
        this.status = event;
        this.payload = this.status.join(',');
        this.getUserRequest();
    }

    getUserRequest() {
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
                        return this.baseService.getUserRequest(
                            this.paginator.pageIndex,
                            this.pageSize,
                            this.searchText,
                            Constants.WithdrawalRequest,
                            this.payload
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

    editView(data) {
        const dialogRef = this.dialog.open(WithdrawlFormModalComponent, {
            height: '100%',
            width: '50%',
            position: {
                top: '0px',
                right: '0px'
            },
            data
        });
        dialogRef.afterClosed().subscribe((result) => {
            const { reason } = result;
            if (reason) this.getUserRequest();
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