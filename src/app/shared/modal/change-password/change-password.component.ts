import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { types } from 'src/app/shared/data/data';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent implements OnInit {
    form: FormGroup;
    requests: any[] = types;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<ChangePasswordComponent>,
    ) {
        this.form = this.fb.group({
            name: [null, Validators.required]
        });
    }

    ngOnInit(): void { }

    onSubmit() {
        this.dialogRef.close({ data: this.form.value });
    }

}
