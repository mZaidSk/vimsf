import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { AlertService } from 'src/app/shared/services/alert-service/alert.service';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { Utils } from 'src/app/shared/utilities/utils';
import { toggle } from 'src/app/shared/data/data';
import { Constants } from 'src/app/shared/api/constant';

@Component({
  selector: 'app-add-bank',
  templateUrl: './add-bank.component.html',
  styleUrls: ['./add-bank.component.scss'],
})
export class AddBankComponent implements OnInit {
  form: FormGroup;
  bankId: string;
  isLoading: boolean;
  panelOpenState: boolean;
  actives: any[] = toggle;
  bank_types: any[] = [];
  child_users: any[] = [];
  user_type_id = +localStorage.getItem(Constants.user_type_id);

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
      branch: [null, Validators.required],
      amount: [null, Validators.required],
      inactive: [0],
      cust_id: [null],
      username: [null],
      mobile: [null],
      password: [null],
      account_number: [null],
      atm: [null],
      cvv: [null],
      exp_month: [null],
      exp_year: [null],
      pin: [null],
      ifsc_code: [null],
      account_holder_name: [null],
      upi_id: [null],
      description: [null],
      bank_type_id: [null],
      child_user_id: [null],
    });
  }

  ngOnInit(): void {
    this.getBankType();
    this.getChildUser();
    this.getParam();
  }

  getBankType() {
    this.baseService.getAllBankType().subscribe((response) => {
      if (response && response['success'])
        this.bank_types = response['data'].data;
      else this.bank_types = [];
    });
  }

  getChildUser() {
    this.baseService.getAllChildUser().subscribe((response) => {
      if (response && response['success'])
        this.child_users = response['data'].data;
      else this.child_users = [];
    });
  }

  onKeyPress(event, max_chars = undefined) {
    Utils.onKeyPress(event);
    if (max_chars && event.target.value.length > max_chars) {
      event.target.value = event.target.value.substr(0, max_chars);
    }
  }

  emitResponse() {
    this.getParam();
  }

  getParam() {
    this.activateRoute.params.subscribe((data) => {
      this.bankId = data['id'];
      if (this.bankId) {
        this.isLoading = true;
        this.getBankDetail();
      }
    });
  }

  getBankDetail() {
    this.isLoading = true;
    this.baseService.getBank(this.bankId).subscribe((response) => {
      if (response && response['success']) {
        this.isLoading = false;
        this.subBankDetailPatch(response['data']['data']);
      } else {
        this.isLoading = false;
      }
    });
  }

  subBankDetailPatch(data) {
    const {
      name,
      branch,
      amount,
      inactive,
      cust_id,
      username,
      password,
      mobile,
      account_number,
      atm,
      pin,
      cvv,
      exp_month,
      exp_year,
      ifsc_code,
      account_holder_name,
      upi_id,
      description,
      bank_type_id,
      child_user_id,
    } = data;
    this.form.patchValue({
      name,
      branch,
      amount,
      inactive,
      cust_id,
      username,
      password,
      mobile,
      account_number,
      atm,
      pin,
      cvv,
      exp_month,
      exp_year,
      ifsc_code,
      account_holder_name,
      upi_id,
      description,
      bank_type_id,
      child_user_id,
    });
  }

  back() {
    this._location.back();
  }

  onSubmit() {
    this.isLoading = true;
    if (this.bankId) this.updateBank(this.bankId, false);
    else this.createBank();
  }

  additionalInfo() {
    this.updateBank(this.bankId, true);
  }

  createBank() {
    this.baseService.createBank(this.form.value).subscribe(
      (response) => {
        if (response && response['success']) {
          this.isLoading = false;
          this.router.navigate(['client/bank-list']);
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

  updateBank(bankId, is_addtional) {
    const payload = { ...this.form.value, is_addtional };
    this.baseService.updateBank(payload, bankId).subscribe(
      (response) => {
        if (response && response['success']) {
          this.isLoading = false;
          this.router.navigate(['client/bank-list']);
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
