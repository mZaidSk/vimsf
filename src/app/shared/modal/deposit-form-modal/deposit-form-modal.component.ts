import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { statusTypes } from 'src/app/shared/data/data';
import { Utils } from 'src/app/shared/utilities/utils';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { AlertService } from 'src/app/shared/services/alert-service/alert.service';

@Component({
    selector: 'app-deposit-form-modal',
    templateUrl: './deposit-form-modal.component.html',
    styleUrls: ['./deposit-form-modal.component.scss']
})

export class DepositFormModalComponent implements OnInit {
    form: FormGroup;
    requests: any[] = statusTypes;
    hide = true;
    deposit: any;
    isRecoveryStatus: any = { descprition: '', id: '' };

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public dialogRef: MatDialogRef<DepositFormModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private baseService: BaseService,
        private alertService: AlertService
    ) {
        const { description, request_data } = this.data;
        this.form = this.fb.group({
            status_id: [2, Validators.required],
            utr: [request_data?.utr, Validators.required],
            client_user_name: [{ value: '', disabled: true }],
            website: [{ value: '', disabled: true }],
            amount: [{ value: request_data?.amount, disabled: true }],
            bonus_amount: [0],
            description: [description],
        });
    }

    ngOnInit(): void {
        const { id } = this.data;
        this.baseService.getUserrequest(id).subscribe((response) => {
            if (response['success']) {
                this.deposit = response['data'].data;
                const { user_client, website, user_client_id } = response['data'].data;
                this.form.patchValue({
                    client_user_name: user_client?.name,
                    website: website?.name
                });
                this.getRecoveryStatus(user_client_id);
            }
        })
    }

    getRecoveryStatus(id) {
        this.baseService.getRecoveryStatus(id).subscribe(
            (response) => {
                if (response && response['success']) {
                    this.isRecoveryStatus = response['data'].data;
                } else {
                    this.isRecoveryStatus = { descprition: '', id: '' };
                }
            });
    }

    onclickRecovery(id) {
        const url = this.router.serializeUrl(
            this.router.createUrlTree([`/client/recovery-list/edit-recovery`, id])
        );
        window.open(url, '_blank');
    }

    copyClipboard() {
        const { user_client } = this.deposit;
        navigator.clipboard.writeText(user_client?.name);
    }

    onKeyPress(event) {
        const maximum_bonus = +localStorage.getItem('maximum_bonus');
        Utils.onKeyPress(event);
        setTimeout(() => {
            if (event.target.value > maximum_bonus) event.target.value = maximum_bonus;
        }, 0);
    }

    checkNumber(event) {
        Utils.onKeyPress(event);
    }

    showPassword() {
        this.hide = !this.hide;
    }

    close() {
        this.dialogRef.close({ reason: false });
    }

    getPayload(payload) {
        let form_data = new FormData();
        for (let key in payload) {
            const value = payload[key];
            form_data.append(key, value);
        }
        return form_data;
    }

    onSubmit() {
        const { status_id, description, bonus_amount, utr } = this.form.value;
        const { request_type_id, id } = this.data;
        const payload = { status_id, request_type_id, description, bonus_amount, utr };
        this.baseService.updateUserrequest(this.getPayload(payload), id).subscribe(response => {
            if (response['success']) this.dialogRef.close({ reason: true });
        }, error => {
            const { reason } = error.error;
            const keys = Object.keys(reason);
            keys.forEach((key, index) => {
                this.alertService.multipleAlert(reason[key][0], index);
            });
        });
    }

}
