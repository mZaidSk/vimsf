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

import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { BannerFormComponent } from 'src/app/shared/modal/banner-form/banner-form.component';
import { TableConstants } from 'src/app/shared/api/table-constant';
import { ComfirmationModalComponent } from 'src/app/shared/modal/comfirmation-modal/comfirmation-modal.component';

@Component({
    selector: 'app-banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit, OnDestroy {
    isLoading: boolean;
    displayedColumns: string[] = [
        'title',
        'start_date',
        'end_date',
        'is_active',
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
    ) { }

    ngOnInit(): void {
        this.getBannerList();
        this.subscriptions.push(
            this.searchData
                .pipe(debounceTime(750), distinctUntilChanged())
                .subscribe((value) => {
                    this.searchText = value;
                    this.getBannerList();
                })
        );
    }

    getBannerList() {
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
                        return this.baseService.getBannerList(
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
        const dialogRef = this.dialog.open(BannerFormComponent, {
            height: '100%',
            width: '30%',
            position: {
                top: '0px',
                right: '0px'
            },
            data: { payload }
        });
        dialogRef.afterClosed().subscribe((result) => {
            const { response } = result;
            if (response) this.getBannerList();
        });
    }

    delete(data) {
        const dialogRef = this.dialog.open(ComfirmationModalComponent, {
            height: '200px',
            width: '500px',
            data: {
                text: `Are you sure you want to delete this banner`,
                name: data.name,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.isLoading = true;
                this.baseService.deleteBanner(data.id).subscribe(
                    (response) => {
                        if (response && response['success']) this.getBannerList();
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
