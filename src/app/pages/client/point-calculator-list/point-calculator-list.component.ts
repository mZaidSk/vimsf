import { Component, OnInit, ViewChild } from '@angular/core';
import { merge, of as observableOf, Subscription, Subject } from 'rxjs';
import { startWith, switchMap, map, catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { TableConstants } from 'src/app/shared/api/table-constant';
import { ComfirmationModalComponent } from 'src/app/shared/modal/comfirmation-modal/comfirmation-modal.component';

@Component({
    selector: 'app-point-calculator-list',
    templateUrl: './point-calculator-list.component.html',
    styleUrls: ['./point-calculator-list.component.scss']
})
export class PointCalculatorListComponent implements OnInit {

    isLoading: boolean;
    displayedColumns: string[] = ['name', 'created_at', 'updated_at', 'action'];
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
        private _location: Location) { }

    ngOnInit(): void {
        this.getPointCalculatorList();
        this.subscriptions.push(
            this.searchData.pipe(
                debounceTime(750),
                distinctUntilChanged()
            ).subscribe(value => {
                this.searchText = value;
                this.getPointCalculatorList();
            })
        );
    }

    getPointCalculatorList() {
        this.isLoading = true;
        this.subscriptions.push(
            merge(this.paginator.page)
                .pipe(
                    startWith({}),
                    debounceTime(1000),
                    switchMap(() => {
                        this.isLoading = true;
                        this.pageSize = (this.paginator.pageSize == undefined) ? this.pageSize : this.paginator.pageSize;
                        return this.baseService.getPointCalculatorList(this.paginator.pageIndex, this.pageSize, this.searchText)
                    }),
                    map((response: any) => {
                        if (response.success) {
                            this.dataSource = response.data.data;
                            this.total = response.data.total;
                            this.dataSource.paginator = this.paginator;
                        } else this.dataSource = [];
                        this.isLoading = false;
                    }),
                    catchError(error => {
                        this.isLoading = false;
                        return observableOf([]);
                    })
                ).subscribe(res => res)
        );
    }

    onSearch(event) {
        this.searchData.next(event.target.value);
    }

    back() {
        this._location.back();
    }

    delete(record) {
        const dialogRef = this.dialog.open(ComfirmationModalComponent, {
            height: '200px',
            width: '500px',
            data: { text: `Are you sure you want to delete this record`, name: record.name }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.isLoading = true;
                this.baseService.deletePointCalculator(record.id).subscribe(response => {
                    if (response && response['success']) this.getPointCalculatorList();
                    else this.isLoading = false;
                });
            }
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
