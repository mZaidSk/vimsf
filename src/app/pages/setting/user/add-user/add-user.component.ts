import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { AlertService } from 'src/app/shared/services/alert-service/alert.service';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { Utils } from 'src/app/shared/utilities/utils';

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
    form: FormGroup;
    userId: string;
    isLoading: boolean;
    groups: any[] = [];
    branches: any[] = [];
    hide: boolean;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private activateRoute: ActivatedRoute,
        private _location: Location,
        private alertService: AlertService,
        private baseService: BaseService
    ) {
        let is_admin = Number(localStorage.getItem('is_admin'));
        if (is_admin === 0) {
            this.router.navigate(['dashboard']);
        }
        this.form = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            branch_id: ['', Validators.required],
            mobile: ['', Validators.required],
        });
    }

    onKeyPress(event) {
        Utils.onKeyPress(event);
    }

    emitResponse() {
        this.getParam();
    }

    ngOnInit(): void {
        this.getParam();
        this.getBranches();
    }

    showPassword() {
        this.hide = !this.hide;
    }

    getBranches() {
        this.baseService.getAllBranch().subscribe((response) => {
            if (response && response['success'])
                this.branches = response['data']['data'];
        });
    }

    getParam() {
        this.activateRoute.params.subscribe((data) => {
            this.userId = data['id'];
            if (this.userId) {
                this.isLoading = true;
                this.getUserDetail();
            }
        });
    }

    getUserDetail() {
        this.isLoading = true;
        this.baseService.getUser(this.userId).subscribe((response) => {
            if (response && response['success']) {
                this.groups = response['data']['userData']['groups'];
                this.userDetailPatch(response['data']['userData']);
                this.isLoading = false;
            } else {
                this.isLoading = false;
            }
        });
    }

    userDetailPatch(data) {
        this.form.patchValue({
            name: data.name,
            email: data.email,
            branch_id: data.branch_id,
            password: data.password,
        });
    }

    back() {
        this._location.back();
    }

    onSubmit() {
        this.isLoading = true;
        if (this.userId) this.updateUser(this.userId);
        else this.createUser();
    }

    createUser() {
        this.form.value.password = 'password';
        this.baseService.createUser(this.form.value).subscribe(
            (response) => {
                if (response && response['success']) {
                    this.isLoading = false;
                    this.router.navigate(['setting/user-list']);
                } else this.isLoading = false;
            },
            (error) => {
                const { errors } = error.error;
                const keys = Object.keys(errors);
                keys.forEach((key, index) => {
                    this.alertService.multipleAlert(errors[key][0], index);
                });
                this.isLoading = false;
            }
        );
    }

    updateUser(userId) {
        this.baseService.updateUser(this.form.value, userId).subscribe(
            (response) => {
                if (response && response['success']) {
                    this.isLoading = false;
                    this.router.navigate(['setting/user-list']);
                } else this.isLoading = false;
            },
            (error) => {
                const { errors } = error.error;
                const keys = Object.keys(errors);
                keys.forEach((key, index) => {
                    this.alertService.multipleAlert(errors[key][0], index);
                });
                this.isLoading = false;
            }
        );
    }
}
