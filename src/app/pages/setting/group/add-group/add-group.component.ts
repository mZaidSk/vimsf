import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

import { AlertService } from 'src/app/shared/services/alert-service/alert.service';
import { BaseService } from 'src/app/shared/services/base-service/base.service';

@Component({
    selector: 'app-add-group',
    templateUrl: './add-group.component.html',
    styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {

    form: FormGroup;
    groupId: string;
    isLoading: boolean;
    roles: any[] = [];
    users: any[] = [];
    displayedColumns: string[] = ['name', 'email', 'active', 'action'];
    @ViewChild(MatAccordion) accordion: MatAccordion;

    constructor(private fb: FormBuilder,
        private router: Router,
        private activateRoute: ActivatedRoute,
        private baseService: BaseService,
        private _location: Location,
        private alertService: AlertService,
        public dialog: MatDialog) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            description: ['']
        });
    }

    emitResponse() {
        this.getParam();
    }

    ngOnInit(): void {
        this.getParam();
    }

    getParam() {
        this.activateRoute.params.subscribe(data => {
            this.groupId = data['id'];
            if (this.groupId) {
                this.isLoading = true;
                this.getGroupDetail();
            }
        });
    }

    getGroupDetail() {
        this.isLoading = true;
        this.baseService.getGroup(this.groupId).subscribe(response => {
            if (response && response['success']) {
                this.isLoading = false;
                this.roles = response['data'].data.roles;
                this.users = response['data'].data.users;
                this.groupDetailPatch(response['data'].data);
            } else {
                this.isLoading = false;
            }
        });
    }

    groupDetailPatch(data) {
        this.form.patchValue({
            name: data.name,
            description: data.description
        });
    }

    back() {
        this._location.back();
    }

    onSubmit() {
        this.isLoading = true;
        if (this.groupId) this.updateGroup(this.groupId);
        else this.createGroup();
    }

    createGroup() {
        this.baseService.createGroup(this.form.value).subscribe(response => {
            if (response && response['success']) {
                this.isLoading = false;
                this.router.navigate(['setting/group-list']);
            } else this.isLoading = false;
        }, error => {
            const { reason } = error.error;
            const keys = Object.keys(reason);
            keys.forEach((key, index) => {
                this.alertService.multipleAlert(reason[key][0], index);
            });
            this.isLoading = false;
        });
    }

    updateGroup(groupId) {
        this.baseService.updateGroup(this.form.value, groupId).subscribe(response => {
            if (response && response['success']) {
                this.isLoading = false;
                this.router.navigate(['setting/group-list']);
            } else this.isLoading = false;
        }, error => {
            const { reason } = error.error;
            const keys = Object.keys(reason);
            keys.forEach((key, index) => {
                this.alertService.multipleAlert(reason[key][0], index);
            });
            this.isLoading = false;
        });
    }
}
