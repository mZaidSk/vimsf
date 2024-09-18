import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { toggle } from 'src/app/shared/data/data';

@Component({
    selector: 'app-deposit-payment-form',
    templateUrl: './deposit-payment-form.component.html',
    styleUrls: ['./deposit-payment-form.component.scss']
})

export class DepositPaymentFormComponent implements OnInit {

    form: FormGroup;
    requests: any[] = toggle;
    id: any;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<DepositPaymentFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private baseService: BaseService,
    ) {
        this.form = this.fb.group({
            payment_method_id: [null, Validators.required],
            bank_id: [null, Validators.required],
            is_active: [1],
        });
    }

    ngOnInit() {
        this.id = this.data?.payload?.id;
        if (this.id)
            this.baseService.getDepositPaymentMethod(this.id).subscribe(response => {
                const {
                    payment_method_id,
                    bank_id,
                    is_active,
                } = response['data']['data'];
                this.form.patchValue({
                    payment_method_id,
                    bank_id,
                    is_active,
                });
            });
    }

    onSubmit() {
        if (this.data?.payload) {
            this.baseService.updateDepositPaymentMethod(this.form.value, this.data?.payload?.id).subscribe(response => {
                if (response['success']) this.dialogRef.close({ response: true });
            });
        } else {
            this.baseService.createDepositPaymentMethod(this.form.value).subscribe(response => {
                if (response['success']) this.dialogRef.close({ response: true });
            });
        }
    }

    closeModal() {
        this.dialogRef.close({ response: false });
    }

}
