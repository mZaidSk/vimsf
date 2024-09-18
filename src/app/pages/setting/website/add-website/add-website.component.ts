import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { AlertService } from 'src/app/shared/services/alert-service/alert.service';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { toggle } from 'src/app/shared/data/data';
import { Utils } from 'src/app/shared/utilities/utils';

@Component({
    selector: 'app-add-website',
    templateUrl: './add-website.component.html',
    styleUrls: ['./add-website.component.scss'],
})
export class AddWebsiteComponent implements OnInit {
    form: FormGroup;
    websiteId: string;
    isLoading: boolean;
    actives: any[] = toggle;
    file: any;
    logo_url: any;
    hide: boolean;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private activateRoute: ActivatedRoute,
        private _location: Location,
        private alertService: AlertService,
        private baseService: BaseService
    ) {
        this.form = this.fb.group({
            name: [null, Validators.required],
            points: [null, Validators.required],
            login_url: [null],
            file: [null],
            demo_id: [null],
            demo_password: [null],
            min_deposit_amt: [null, Validators.required],
            max_withdrawal_amt: [null, Validators.required],
            min_withdrawal_amt: [null, Validators.required],
            min_balance_amt: [null, Validators.required],
            is_active: [1]
        });
    }

    ngOnInit(): void {
        this.getParam();
    }

    emitResponse() {
        this.getParam();
    }

    showPassword() {
        this.hide = !this.hide;
    }

    onKeyPress(event) {
        Utils.onKeyPress(event);
    }

    selectFiles(event: any): void {
        this.file = event.target.files[0];
        this.logo_url = null;
    }

    getParam() {
        this.activateRoute.params.subscribe((data) => {
            this.websiteId = data['id'];
            if (this.websiteId) {
                this.isLoading = true;
                this.getWebsiteDetail();
            }
        });
    }

    getWebsiteDetail() {
        this.isLoading = true;
        this.baseService.getWebsite(this.websiteId).subscribe((response) => {
            if (response && response['success']) {
                this.isLoading = false;
                this.subWebsiteDetailPatch(response['data']['data']);
            } else {
                this.isLoading = false;
            }
        });
    }

    subWebsiteDetailPatch(data) {
        const {
            name,
            points,
            login_url,
            logo,
            demo_id,
            demo_password,
            min_deposit_amt,
            max_withdrawal_amt,
            min_withdrawal_amt,
            min_balance_amt,
            is_active
        } = data;
        this.form.patchValue({
            name,
            points,
            login_url,
            demo_id,
            demo_password,
            min_deposit_amt,
            max_withdrawal_amt,
            min_withdrawal_amt,
            min_balance_amt,
            is_active
        });
        this.logo_url = logo;
    }

    back() {
        this._location.back();
    }

    onSubmit() {
        this.isLoading = true;
        if (this.websiteId) this.updateWebsite(this.websiteId);
        else this.createWebsite();
    }

    getPayload() {
        let form_data = new FormData();
        for (let key in this.form.value) {
            const value = this.form.value[key];
            if (key === 'file') {
                form_data.append('logo', this.file);
            } else form_data.append(key, value);
        }
        return form_data;
    }

    createWebsite() {
        this.baseService.createWebsite(this.getPayload()).subscribe(
            (response) => {
                if (response && response['success']) {
                    this.isLoading = false;
                    this.router.navigate(['client/website-list']);
                } else this.isLoading = false;
            },
            (error) => {
                const { reason } = error.error;
                const keys = Object.keys(reason);
                keys.forEach((key, index) => {
                    this.alertService.multipleAlert(reason[key][0], index);
                });
                this.isLoading = false;
            }
        );
    }

    updateWebsite(websiteId) {
        this.baseService.updateWebsite(this.getPayload(), websiteId).subscribe(
            (response) => {
                if (response && response['success']) {
                    this.isLoading = false;
                    this.router.navigate(['client/website-list']);
                } else this.isLoading = false;
            },
            (error) => {
                const { reason } = error.error;
                const keys = Object.keys(reason);
                keys.forEach((key, index) => {
                    this.alertService.multipleAlert(reason[key][0], index);
                });
                this.isLoading = false;
            }
        );
    }
}
