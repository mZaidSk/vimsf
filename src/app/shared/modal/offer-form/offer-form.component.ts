import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { toggle } from 'src/app/shared/data/data';

@Component({
    selector: 'app-offer-form',
    templateUrl: './offer-form.component.html',
    styleUrls: ['./offer-form.component.scss']
})

export class OfferFormComponent implements OnInit {

    form: FormGroup;
    requests: any[] = toggle;
    id: any;
    file: any;
    image_url: any;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<OfferFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private baseService: BaseService,
    ) {
        this.form = this.fb.group({
            title: [null, Validators.required],
            file: [null],
            start_date: [null],
            end_date: [null],
            is_active: [1],
            description: [null]
        });
    }

    selectFiles(event: any): void {
        this.file = event.target.files[0];
        this.image_url = null;
    }

    ngOnInit() {
        this.id = this.data?.payload?.id;
        if (this.id)
            this.baseService.getOffer(this.id).subscribe(response => {
                const {
                    title,
                    is_active,
                    start_date,
                    end_date,
                    description,
                    image_url
                } = response['data']['data'];
                this.form.patchValue({
                    title,
                    is_active,
                    start_date: start_date.substring(0, 10),
                    end_date: end_date.substring(0, 10),
                    description
                });
                this.image_url = image_url;
            });
    }

    onSubmit() {
        let form_data = new FormData();
        for (let key in this.form.value) {
            const value = this.form.value[key];
            if (key === 'file') {
                form_data.append('image', this.file);
            } else form_data.append(key, value);
        }
        if (this.data?.payload) {
            this.baseService.updateOffer(form_data, this.data?.payload?.id).subscribe(response => {
                if (response['success']) this.dialogRef.close({ response: true });
            });
        } else {
            this.baseService.createOffer(form_data).subscribe(response => {
                if (response['success']) this.dialogRef.close({ response: true });
            });
        }
    }

    closeModal() {
        this.dialogRef.close({ response: false });
    }

}
