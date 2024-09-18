import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
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

import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { DepositFormModalComponent } from 'src/app/shared/modal/deposit-form-modal/deposit-form-modal.component';
import { TableConstants } from 'src/app/shared/api/table-constant';
import { Constants } from 'src/app/shared/api/constant';
import { reqStatuses } from 'src/app/shared/data/data';
import { ComfirmationModalComponent } from 'src/app/shared/modal/comfirmation-modal/comfirmation-modal.component';

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
    styleUrls: ['./deposit.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class DepositComponent implements OnInit, OnDestroy {
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
        public dialog: MatDialog,
        private _location: Location
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
                            Constants.DepositRequest,
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
        const dialogRef = this.dialog.open(DepositFormModalComponent, {
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
