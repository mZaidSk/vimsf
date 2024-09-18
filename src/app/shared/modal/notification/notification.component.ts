import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { plainStatuses, notificationTypes } from 'src/app/shared/data/data';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})

export class NotificationFormComponent implements OnInit {

    form: FormGroup;
    types: any[] = notificationTypes;
    statuses: any[] = plainStatuses;
    file: any;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<NotificationFormComponent>,
        private baseService: BaseService,
    ) {
        this.form = this.fb.group({
            notice_title: [null, Validators.required],
            notice_body: [null, Validators.required],
            type: ['Flash', Validators.required],
            status: [0, Validators.required],
            file: [null]
        });
    }

    ngOnInit(): void { }

    selectFiles(event: any): void {
        this.file = event.target.files[0];
    }

    onSubmit() {
        let form_data = new FormData();
        for (let key in this.form.value) {
            const value = this.form.value[key];
            if (key === 'file') {
                form_data.append('image', this.file);
            } else form_data.append(key, value);
        }
        this.baseService.createNotification(form_data).subscribe(response => {
            if (response['success']) this.dialogRef.close({ response: true });
        });
    }

    closeModal() {
        this.dialogRef.close({ response: false });
    }

}
