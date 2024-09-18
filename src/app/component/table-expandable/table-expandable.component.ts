import { Component, ViewChild, ViewChildren, QueryList, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf, Subscription, Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { TableConstants } from 'src/app/shared/api/table-constant';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import {
    startWith,
    switchMap,
    map,
    catchError,
    debounceTime,
    distinctUntilChanged,
} from 'rxjs/operators';

@Component({
    selector: 'table-expandable',
    templateUrl: './table-expandable.component.html',
    styleUrls: ['./table-expandable.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class TableExpandable implements OnInit, OnDestroy {

    @ViewChild('outerSort', { static: true }) sort: MatSort;
    @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
    @ViewChildren('innerTables') innerTables: QueryList<MatTable<any>>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    searchData: Subject<string> = new Subject<string>();
    pageSizeOptions = TableConstants.pageSizesOptions;
    pageSize = TableConstants.pageSizes;
    subscriptions: Subscription[] = [];
    isLoading: boolean;
    dataSource: any;
    usersData: any[] = [];
    total: number;
    searchText: string;
    columnsToDisplay = ['name', 'branch', 'amount'];
    innerDisplayedColumns = ['name', 'branch', 'amount'];
    expandedElement: any | null;

    constructor(
        private baseService: BaseService,
        private cd: ChangeDetectorRef
    ) { }

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

    onSearch(event) {
        this.searchData.next(event.target.value);
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
                        return this.baseService.getMapBank(
                            this.paginator.pageIndex,
                            this.pageSize,
                            this.searchText
                        );
                    }),
                    map((response: any) => {
                        if (response.success) {
                            const results = response.data.data || [];
                            this.usersData = [];
                            results.forEach(bank => {
                                if (bank.to_bank && Array.isArray(bank.to_bank) && bank.to_bank.length) {
                                    this.usersData = [...this.usersData, { ...bank.from_bank, to_bank: new MatTableDataSource(bank.to_bank) }];
                                } else {
                                    this.usersData = [...this.usersData, bank.from_bank];
                                }
                            });
                            this.dataSource = this.usersData;
                            this.dataSource.sort = this.sort;
                            this.total = response.data.total;
                            this.dataSource.paginator = this.paginator;
                        }
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

    toggleRow(element) {
        element.to_bank && (element.to_bank as MatTableDataSource<any>).data?.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
        this.cd.detectChanges();
        this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<any>).sort = this.innerSort.toArray()[index]);
    }

    ngOnDestroy() {
        this.subscriptions.forEach((s) => s.unsubscribe());
    }

    /*applyFilter(filterValue: string) {
        this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<any>).filter = filterValue.trim().toLowerCase());
    }*/
}