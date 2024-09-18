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

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit, OnDestroy {
    isLoading: boolean;
    displayedColumns: string[] = [
        'client_id',
        'user_id',
        'name',
        'phone',
        'type',
        'website',
        'balance',
        'action',
    ];
    subscriptions: Subscription[] = [];
    dataSource: any;
    total: number;
    searchText: string;
    pageSizeOptions = TableConstants.pageSizesOptions;
    pageSize = TableConstants.pageSizes;
    is_admin: any = 0;

    searchData: Subject<string> = new Subject<string>();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private baseService: BaseService,
        public dialog: MatDialog,
        private _location: Location,
        private alertService: AlertService
    ) {
        this.is_admin = localStorage.getItem('is_admin');
    }

    ngOnInit(): void {
        this.getClientList();
        this.subscriptions.push(
            this.searchData
                .pipe(debounceTime(750), distinctUntilChanged())
                .subscribe((value) => {
                    this.searchText = value;
                    this.getClientList();
                })
        );
    }

    getClientList() {
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
                        return this.baseService.getClientList(
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

    onSearch(event) {
        this.searchData.next(event.target.value);
    }

    back() {
        this._location.back();
    }

    delete(client) {
        const dialogRef = this.dialog.open(ComfirmationModalComponent, {
            height: '200px',
            width: '500px',
            data: {
                text: `Are you sure you want to delete this client`,
                name: client.name,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.isLoading = true;
                this.baseService.deleteClient(client.id).subscribe(
                    (response) => {
                        if (response && response['success']) this.getClientList();
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
