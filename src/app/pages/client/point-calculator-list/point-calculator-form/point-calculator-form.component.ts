import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { BaseService } from 'src/app/shared/services/base-service/base.service';

@Component({
    selector: 'app-point-calculator-form',
    templateUrl: './point-calculator-form.component.html',
    styleUrls: ['./point-calculator-form.component.scss'],
})
export class PointCalculatorFormComponent implements OnInit {
    form: FormGroup;
    isLoading: boolean;
    websites: any[] = [];
    subscriptions: Subscription[] = [];
    bbmsBankAmount: number;
    bankAmount: number;
    name: string;
    description: string;
    pointId: any;
    sum = 0;
    bank = 0;
    result = 0;
    settlement = 0;
    bonus = 0;
    extra = 0;

    constructor(
        private fb: FormBuilder,
        private baseService: BaseService,
        private activateRoute: ActivatedRoute,
        private _location: Location,
        private router: Router
    ) {
        this.form = this.fb.group({
            bank_data: this.fb.array([]),
        });
    }

    ngOnInit(): void {
        this.getWebsiteList();
        this.getParam();
    }

    getParam() {
        this.activateRoute.params.subscribe((data) => {
            this.pointId = data['id'];
            if (this.pointId) {
                this.isLoading = true;
                this.getCalculatorDetail();
            }
        });
    }

    getCalculatorDetail() {
        this.isLoading = true;
        this.baseService.getPointCalculator(this.pointId).subscribe((response) => {
            if (response && response['success']) {
                this.isLoading = false;
                this.pointCalculatorDetailPatch(response['data']['data']);
            } else {
                this.isLoading = false;
            }
        });
    }

    pointCalculatorDetailPatch(data) {
        const { name, description, websites } = data;
        const { result, records } = websites;
        const { sum, bank, settlement, bonus, extra } = result || {};
        (this.sum = sum),
            (this.bank = bank),
            (this.result = result?.result),
            (this.settlement = settlement),
            (this.bonus = bonus),
            (this.extra = extra);
        this.name = name;
        this.description = description;
        records.forEach((prop) => {
            this.websiteDetailPatchEdit({
                name: prop?.website_name,
                upline_name: prop?.upline_name,
                wallet_name: prop?.wallet_name,
                upline: prop?.upline,
                wallet: prop?.wallet,
                sum: prop?.sum,
                available_balance: prop?.available_balance
            });
        });
    }

    get banksForms() {
        return this.form.get('bank_data') as FormArray;
    }

    getWebsiteList() {
        this.baseService.getBranchWebsite().subscribe((response) => {
            if (response && response['success'])
                this.websites = response['data'].data;
            else this.websites = [];
        });
    }

    onKeyPress() {
        this.calculateRowAmount();
    }

    addFun(accumulator, a) {
        return accumulator + a;
    }

    calculateRowAmount() {
        setTimeout(() => {
            const points = this.form.get('bank_data') as FormArray;
            points.value.forEach((prop, index) => {
                const { upline, wallet } = prop;
                const result = upline + wallet;
                points.controls[index]['controls'].total.setValue(result);
                points.controls[index]['controls'].sum.setValue(result);
            });
            const sum = points.value.map((prop) => +prop.sum).reduce(this.addFun, 0);
            this.sum = sum;
        }, 1000);
    }

    back() {
        this._location.back();
    }

    addAllBank() {
        this.websites.forEach((prop) => {
            this.websiteChange(prop);
        });
    }

    removeAllBank() {
        const banks = this.form.get('bank_data') as FormArray;
        banks.clear();
        this.calculateRowAmount();
    }

    saveBank() {
        const websites = this.form.get('bank_data') as FormArray;
        const postData = {
            name: this.name,
            description: this.description,
            websites: {
                records: websites.value,
                result: {
                    sum: this.sum,
                    bank: this.bank,
                    result: this.result,
                    settlement: this.settlement,
                    bonus: this.bonus,
                    extra: this.extra,
                },
            },
        };
        if (this.pointId) this.updatePointCalculaator(postData);
        else this.createPointCalculaator(postData);
    }

    createPointCalculaator(data) {
        this.baseService.createPointCalculaator(data).subscribe((response) => {
            if (response && response['success'])
                this.router.navigate(['client/point-calculator-list']);
        });
    }

    updatePointCalculaator(data) {
        this.baseService
            .updatePointCalculaator(this.pointId, data)
            .subscribe((response) => {
                if (response && response['success'])
                    this.router.navigate(['client/point-calculator-list']);
            });
    }

    websiteChange(data) {
        this.baseService.getBranchWebsiteById(data.id).subscribe((response) => {
            console.log("response", response);
            if (response && response['success'])
                this.baseService.getAvailableBalance(data.id).subscribe(
                    (res) => {
                        if (res && res['success']) {
                            this.websiteDetailPatch(response['data']['data'], res['data'].data.balance);
                        } else {
                            this.websiteDetailPatch(response['data']['data'], 0);
                        }
                    }
                );
        });
    }

    websiteDetailPatch(data, avbleBlnc) {
        const { name, upline, wallet, sum } = data;
        const prop = data.json_data;
        const bank = this.fb.group({
            name: [{ value: name, disabled: true }],
            website_name: [name],
            upline_name: [prop?.upline_name || '-'],
            wallet_name: [prop?.wallet_name || '-'],
            upline: [upline || 0],
            wallet: [wallet || 0],
            total: [{ value: sum || 0, disabled: true }],
            sum: [sum || 0],
            available_balance: [avbleBlnc || 0]
        });
        this.banksForms.push(bank);
    }

    websiteDetailPatchEdit(data) {
        console.log(data);
        const { name, upline, wallet, sum, available_balance } = data;
        const prop = data;
        const bank = this.fb.group({
            name: [{ value: name, disabled: true }],
            website_name: [name],
            upline_name: [prop?.upline_name || '-'],
            wallet_name: [prop?.wallet_name || '-'],
            upline: [upline || 0],
            wallet: [wallet || 0],
            total: [{ value: sum || 0, disabled: true }],
            sum: [sum || 0],
            available_balance: [available_balance || 0]
        });
        this.banksForms.push(bank);
    }

    removeBank(index) {
        const banks = this.form.get('bank_data') as FormArray;
        banks.removeAt(index);
        this.calculateRowAmount();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((s) => s.unsubscribe());
    }
}
