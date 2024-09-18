import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge, of as observableOf, Subscription, Subject } from 'rxjs';
import {
    startWith,
    switchMap,
    map,
    catchError,
    debounceTime,
} from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { AlertService } from 'src/app/shared/services/alert-service/alert.service';
import { TableConstants } from 'src/app/shared/api/table-constant';
import { actions } from 'src/app/shared/data/data';
import { ComfirmationModalComponent } from 'src/app/shared/modal/comfirmation-modal/comfirmation-modal.component';

@Component({
    selector: 'app-bank-transaction',
    templateUrl: './bank-transaction.component.html',
    styleUrls: ['./bank-transaction.component.scss'],
})
export class BankTransactionComponent implements OnInit, OnDestroy {
    form: FormGroup;
    isLoading: boolean;
    banks: any[] = [];
    displayedColumns: string[] = [
        'name',
        'type',
        'action'
    ];
    actions: any[] = actions;
    subscriptions: Subscription[] = [];
    dataSource: any;
    total: number;
    searchText: string;
    pageSizeOptions = TableConstants.pageSizesOptions;
    pageSize = TableConstants.pageSizes;

    searchData: Subject<string> = new Subject<string>();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private fb: FormBuilder,
        public dialog: MatDialog,
        private baseService: BaseService,
        private alertService: AlertService,
        private _location: Location
    ) {
        this.form = this.fb.group({
            action_id: [null, Validators.required],
            bank_id: [null, Validators.required],
        });
    }

    ngOnInit(): void {
        this.getBankList();
        this.getBankTransactionList();
    }

    getBankTransactionList() {
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
                        return this.baseService.getBankTransaction(
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

    getBankList() {
        this.baseService.getAllBank().subscribe((response) => {
            if (response && response['success']) this.banks = response['data'].data;
            else this.banks = [];
        });
    }

    onSubmit = () => {
        this.isLoading = true;
        this.baseService
            .bankTransaction(this.form.value)
            .subscribe((response) => {
                if (response && response['success']) {
                    this.getBankTransactionList();
                    this.form.reset();
                    this.alertService.showSuccess(response['reason'], 'Success');
                } else this.alertService.showError(response['reason'], 'Error');
                this.isLoading = false;
            });
    };

    back() {
        this._location.back();
    }

    delete(bank) {
        const dialogRef = this.dialog.open(ComfirmationModalComponent, {
            height: '200px',
            width: '500px',
            data: {
                text: `Are you sure you want to delete this bank map`,
                name: bank.name,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.isLoading = true;
                this.baseService.deleteMapBankTransaction(bank.id).subscribe(
                    (response) => {
                        if (response && response['success']) this.getBankTransactionList();
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
