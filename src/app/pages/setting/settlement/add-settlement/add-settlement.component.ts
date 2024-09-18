import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { AlertService } from 'src/app/shared/services/alert-service/alert.service';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { ComfirmationModalComponent } from 'src/app/shared/modal/comfirmation-modal/comfirmation-modal.component';

@Component({
    selector: 'app-add-settlement',
    templateUrl: './add-settlement.component.html',
    styleUrls: ['./add-settlement.component.scss'],
})
export class AddSettlementComponent implements OnInit {
    form: FormGroup;
    settlementId: string;
    isLoading: boolean;
    expenses = [];
    expense: any;
    displayedColumns: string[] = ['amount', 'expense_date', 'description'];

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private activateRoute: ActivatedRoute,
        private _location: Location,
        public dialog: MatDialog,
        private alertService: AlertService,
        private baseService: BaseService
    ) {
        this.form = this.fb.group({
            settlement_date: [null, Validators.required],
            settlement_amount: [null, Validators.required],
        });
    }

    ngOnInit(): void {
        this.getParam();
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

    emitResponse() {
        this.getParam();
    }

    getParam() {
        this.activateRoute.params.subscribe((data) => {
            this.settlementId = data['id'];
            if (this.settlementId) {
                this.isLoading = true;
                this.getSettlementDetail();
            }
        });
    }

    getSettlementDetail() {
        this.isLoading = true;
        this.baseService.getSettlement(this.settlementId).subscribe((response) => {
            if (response && response['success']) {
                this.isLoading = false;
                this.subSettlementDetailPatch(response['data']['data']);
                this.expense = response['data']['data'];
                this.expenses = response['data']['data']['expenses'];
            } else {
                this.isLoading = false;
            }
        });
    }

    subSettlementDetailPatch(data) {
        this.form.patchValue({
            settlement_date: data.settlement_date,
            settlement_amount: data.settlement_amount,
        });
    }

    back() {
        this._location.back();
    }

    onSubmit() {
        this.isLoading = true;
        if (this.settlementId) this.updateSettlement(this.settlementId);
        else this.createSettlement();
    }

    createSettlement() {
        this.baseService.createSettlement(this.form.value).subscribe(
            (response) => {
                if (response && response['success']) {
                    this.isLoading = false;
                    this.router.navigate(['setting/settlement-list']);
                } else this.isLoading = false;
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

    updateSettlement(settlementId) {
        this.baseService.updateSettlement(this.form.value, settlementId).subscribe(
            (response) => {
                if (response && response['success']) {
                    this.isLoading = false;
                    this.router.navigate(['setting/settlement-list']);
                } else this.isLoading = false;
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
}
