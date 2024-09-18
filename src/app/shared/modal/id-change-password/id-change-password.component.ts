import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { statusTypes } from 'src/app/shared/data/data';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { AlertService } from 'src/app/shared/services/alert-service/alert.service';

@Component({
    selector: 'app-id-change-password',
    templateUrl: './id-change-password.component.html',
    styleUrls: ['./id-change-password.component.scss']
})

export class IDChangePasswordFormModalComponent implements OnInit {
    form: FormGroup;
    requests: any[] = statusTypes;
    hide: boolean;
    changePassword: any;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<IDChangePasswordFormModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private baseService: BaseService,
        private alertService: AlertService,
    ) {
        const { description, request_data } = this.data
        this.form = this.fb.group({
            status_id: [2, Validators.required],
            client_user_name: [{value: request_data.username, disabled: true}],
            client_user_password: [null, Validators.required],
            description: [description]
        });
    }

    ngOnInit(): void {
        const { id } = this.data;
        this.baseService.getUserrequest(id).subscribe((response) => {
            if (response['success']) {
                this.changePassword = response['data'].data;
                const { user_client } = response['data'].data;
                this.form.patchValue({
                    client_user_name: user_client?.name
                })
            }
        })
    }

    copyClipboard() {
        const { user_client } = this.changePassword;
        navigator.clipboard.writeText(user_client?.name);
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
        const { status_id, description, client_user_password } = this.form.value;
        const { request_type_id, id } = this.data;
        const { user_client } = this.changePassword;
        const payload = { status_id, request_type_id, description, client_user_name: user_client.name, client_user_password };
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
