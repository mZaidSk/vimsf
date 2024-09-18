import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { BaseService } from 'src/app/shared/services/base-service/base.service';

@Component({
    selector: 'app-bank-calculator-form',
    templateUrl: './bank-calculator-form.component.html',
    styleUrls: ['./bank-calculator-form.component.scss']
})
export class BankCalculatorFormComponent implements OnInit {

    form: FormGroup;
    isLoading: boolean;
    banks: any[] = [];
    subscriptions: Subscription[] = [];
    bbmsBankAmount: number;
    bankAmount: number;
    name: string;
    description: string;
    calculatorId: any;

    constructor(
        private fb: FormBuilder,
        private baseService: BaseService,
        private activateRoute: ActivatedRoute,
        private _location: Location,
        private router: Router,
    ) {
        this.form = this.fb.group({
            bank_data: this.fb.array([]),
        });
    }

    ngOnInit(): void {
        this.getBankList();
        this.getParam();
    }

    getParam() {
        this.activateRoute.params.subscribe((data) => {
            this.calculatorId = data['id'];
            if (this.calculatorId) {
                this.isLoading = true;
                this.getCalculatorDetail();
            }
        });
    }

    getCalculatorDetail() {
        this.isLoading = true;
        this.baseService.getBankCalculator(this.calculatorId).subscribe((response) => {
            if (response && response['success']) {
                this.isLoading = false;
                this.bankCalculatorDetailPatch(response['data']['data']);
            } else {
                this.isLoading = false;
            }
        });
    }

    bankCalculatorDetailPatch(data) {
        const { name, description, banks } = data;
        this.name = name;
        this.description = description;
        banks.forEach(prop => {
            const { bank_name, website_bank_amount, bank_amount } = prop;
            this.bankDetailPatch({ name: bank_name, amount: website_bank_amount, bank_amount });
        })
    }

    get banksForms() {
        return this.form.get('bank_data') as FormArray;
    }

    getBankList() {
        this.baseService.getAllBank().subscribe((response) => {
            if (response && response['success']) this.banks = response['data'].data;
            else this.banks = [];
        });
    }

    onKeyPress(event) {
        this.calculateAmount();
        this.calculateRowAmount();
    }

    addFun(accumulator, a) {
        return accumulator + a;
    }

    calculateAmount() {
        setTimeout(() => {
            const banks = this.form.get('bank_data') as FormArray;
            const bbmks_bank_amount = banks.value
                .map((prop) => prop.website_bank_amount)
                .reduce(this.addFun, 0);
            const bank_amount = banks.value
                .map((prop) => +prop.bank_amount)
                .reduce(this.addFun, 0);
            this.bbmsBankAmount = bbmks_bank_amount;
            this.bankAmount = bank_amount;
        }, 100);
    }

    calculateRowAmount() {
        setTimeout(() => {
            const banks = this.form.get('bank_data') as FormArray;
            banks.value.forEach((prop, index) => {
                const { bank_amount, website_bank_amount } = prop;
                const result = bank_amount - website_bank_amount;
                banks.controls[index]['controls'].difference.setValue(result);
            });
        }, 1000);
    }

    back() {
        this._location.back();
    }

    addAllBank() {
        this.banks.forEach(prop => {
            this.bankChange(prop);
        })
    }

    removeAllBank() {
        const banks = this.form.get('bank_data') as FormArray;
        banks.clear();
        this.calculateAmount();
        this.calculateRowAmount();
    }

    saveBank() {
        const banks = this.form.get('bank_data') as FormArray;
        const postData = {
            name: this.name,
            description: this.description,
            banks: banks.value
        }
        if (this.calculatorId) this.updateBankCalculator(postData);
        else this.createBankCalculator(postData);
    }

    createBankCalculator(data) {
        this.baseService.createBankCalculaator(data).subscribe(response => {
            if (response && response['success']) this.router.navigate(['client/bank-calculator-list']);
        })
    }

    updateBankCalculator(data) {
        this.baseService.updateBankCalculaator(this.calculatorId, data).subscribe(response => {
            if (response && response['success']) this.router.navigate(['client/bank-calculator-list']);
        })
    }

    bankChange(data) {
        this.baseService.getBank(data.id).subscribe((response) => {
            if (response && response['success']) this.bankDetailPatch(response['data']['data']);
        });
    }

    bankDetailPatch(data) {
        const { name, amount, bank_amount } = data;
        const bank = this.fb.group({
            name: [{ value: name, disabled: true }],
            bank_name: [name],
            bbms_bank_amount: [{ value: amount, disabled: true }],
            website_bank_amount: [amount],
            difference: [{ value: 0, disabled: true }],
            bank_amount: [bank_amount ? bank_amount : 0],
        });
        this.banksForms.push(bank);
        this.calculateAmount();
        this.calculateRowAmount();
    }

    removeBank(index) {
        const banks = this.form.get('bank_data') as FormArray;
        banks.removeAt(index);
        this.calculateAmount();
        this.calculateRowAmount();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((s) => s.unsubscribe());
    }

}
