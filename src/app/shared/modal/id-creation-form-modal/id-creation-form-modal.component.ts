import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { statusTypes } from 'src/app/shared/data/data';
import { Utils } from 'src/app/shared/utilities/utils';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { AlertService } from 'src/app/shared/services/alert-service/alert.service';

@Component({
    selector: 'app-id-creation-form-modal',
    templateUrl: './id-creation-form-modal.component.html',
    styleUrls: ['./id-creation-form-modal.component.scss'],
})
export class IDCreationFormModalComponent implements OnInit {
    form: FormGroup;
    requests: any[] = statusTypes;
    hide = true;
    IDCreation: any;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<IDCreationFormModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private baseService: BaseService,
        private alertService: AlertService
    ) {
        const { description, request_data } = this.data;
        this.form = this.fb.group({
            status_id: [2, Validators.required],
            utr: [request_data?.utr, Validators.required],
            client_user_name: [request_data.username, Validators.required],
            client_user_password: [null, Validators.required],
            bonus_amount: [0],
            amount: [{ value: request_data?.amount, disabled: true }],
            description: [description],
        });
    }

    ngOnInit(): void {
        const { id } = this.data;
        this.baseService.getUserrequest(id).subscribe((response) => {
            if (response['success']) this.IDCreation = response['data'].data;
        })
    }

    copyClipboard() {
        navigator.clipboard.writeText(this.form.value.client_user_name);
    }

    onKeyPress(event) {
        const maximum_bonus = +localStorage.getItem('maximum_bonus');
        Utils.onKeyPress(event);
        setTimeout(() => {
            if (event.target.value > maximum_bonus) event.target.value = maximum_bonus;
        }, 0);
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
        const { status_id, description, client_user_password, bonus_amount, utr, client_user_name } =
            this.form.value;
        const { request_type_id, id } = this.data;
        const payload = {
            status_id,
            request_type_id,
            description,
            client_user_name,
            bonus_amount,
            client_user_password,
            utr: utr,
        };
        this.baseService.updateUserrequest(this.getPayload(payload), id).subscribe(
            (response) => {
                if (response['success']) this.dialogRef.close({ reason: true });
            },
            (error) => {
                const { reason } = error.error;
                const keys = Object.keys(reason);
                keys.forEach((key, index) => {
                    this.alertService.multipleAlert(reason[key][0], index);
                });
            }
        );
    }
}
