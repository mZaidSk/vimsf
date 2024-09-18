import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { AlertService } from 'src/app/shared/services/alert-service/alert.service';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { actions } from 'src/app/shared/data/data';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss'],
})
export class AddExpenseComponent implements OnInit {
  form: FormGroup;
  expenseId: string;
  isLoading: boolean;
  websites: any[] = [];
  banks: any[] = [];
  actions: any[] = actions;
  clients: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private _location: Location,
    private alertService: AlertService,
    private baseService: BaseService
  ) {
    this.form = this.fb.group({
      action_id: [2, Validators.required],
      bank_id: [null, Validators.required],
      amount: [null, Validators.required],
      expense_date: [null, Validators.required],
      description: [null],
    });
  }

  ngOnInit(): void {
    this.getWebsite();
    this.getBank();
    this.getParam();
  }

  emitResponse() {
    this.getParam();
  }

  getParam() {
    this.activateRoute.params.subscribe((data) => {
      this.expenseId = data['id'];
      if (this.expenseId) {
        this.isLoading = true;
        this.getExpenseDetail();
      }
    });
  }

  getWebsite() {
    this.baseService.getBranchWebsite().subscribe((response) => {
      if (response && response['success'])
        this.websites = response['data'].data;
      else this.websites = [];
    });
  }

  getBank() {
    this.baseService.getAllBank().subscribe((response) => {
      if (response && response['success']) this.banks = response['data'].data;
      else this.banks = [];
    });
  }

  getExpenseDetail() {
    this.isLoading = true;
    this.baseService.getExpense(this.expenseId).subscribe((response) => {
      if (response && response['success']) {
        this.isLoading = false;
        this.subExpenseDetailPatch(response['data']['data']);
      } else {
        this.isLoading = false;
      }
    });
  }

  subExpenseDetailPatch(data) {
    this.form.patchValue({
      action_id: data.action_id,
      website_id: data.website_id,
      bank_id: data.bank_id,
      client_id: data.client_id,
      amount: data.amount,
      expense_date: data.expense_date,
      description: data.description,
    });
  }

  back() {
    this._location.back();
  }

  onSubmit() {
    this.isLoading = true;
    if (this.expenseId) this.updateExpense(this.expenseId);
    else this.createExpense();
  }

  createExpense() {
    this.baseService.createExpense(this.form.value).subscribe(
      (response) => {
        if (response && response['success']) {
          this.isLoading = false;
          this.router.navigate(['client/expense-list']);
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

  updateExpense(expenseId) {
    this.baseService.updateExpense(this.form.value, expenseId).subscribe(
      (response) => {
        if (response && response['success']) {
          this.isLoading = false;
          this.router.navigate(['client/expense-list']);
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
