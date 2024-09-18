import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { toggle } from 'src/app/shared/data/data';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { Utils } from 'src/app/shared/utilities/utils';

@Component({
    selector: 'app-branch-form',
    templateUrl: './branch-form.component.html',
    styleUrls: ['./branch-form.component.scss']
})

export class BranchFormComponent implements OnInit {
    form: FormGroup;
    id: any;
    actives: any[] = toggle;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<BranchFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private baseService: BaseService,
    ) {
        this.form = this.fb.group({
            branch_id: [null],
            name: [null, Validators.required],
            support_number: [null],
            bonus: [null],
            is_active: [1]
        });
    }

    ngOnInit() {
        this.id = this.data?.payload?.id;
        if (this.id)
            this.baseService.getBranch(this.id).subscribe(response => {
                const {
                    branch_id,
                    name,
                    support_number,
                    bonus,
                    is_active
                } = response['data']['data'];
                this.form.patchValue({
                    branch_id,
                    name,
                    support_number,
                    bonus,
                    is_active: +is_active
                });
            });
    }

    onKeyPress(event) {
        Utils.onKeyPress(event);
    }

    onSubmit() {
        if (this.data?.payload) {
            this.baseService.updateBranch(this.form.value, this.data?.payload?.id).subscribe(response => {
                if (response['success']) this.dialogRef.close({ response: true });
            });
        } else {
            this.baseService.createBranch(this.form.value).subscribe(response => {
                if (response['success']) this.dialogRef.close({ response: true });
            });
        }
    }

    closeModal() {
        this.dialogRef.close({ response: false });
    }

}
