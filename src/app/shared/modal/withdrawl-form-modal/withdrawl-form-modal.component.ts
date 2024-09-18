import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { statusTypes } from 'src/app/shared/data/data';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { AlertService } from 'src/app/shared/services/alert-service/alert.service';
import { Utils } from 'src/app/shared/utilities/utils';

@Component({
  selector: 'app-withdrawl-form-modal',
  templateUrl: './withdrawl-form-modal.component.html',
  styleUrls: ['./withdrawl-form-modal.component.scss'],
})
export class WithdrawlFormModalComponent implements OnInit {
  form: FormGroup;
  requests: any[] = statusTypes;
  banks: any[] = [];
  file: any;
  withdrawl: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<WithdrawlFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private baseService: BaseService,
    private alertService: AlertService
  ) {
    const { description, request_data } = this.data;
    this.form = this.fb.group({
      username: [{ value: '', disabled: true }],
      website: [{ value: '', disabled: true }],
      status_id: [2, Validators.required],
      file: [null, Validators.required],
      bank_id: [null, Validators.required],
      amount: [{ value: request_data?.amount, disabled: true }],
      bonus_amount: [0],
      description: [description],
      utr: [null],
    });
    this.getBanks();
  }

  ngOnInit(): void {
    const { id } = this.data;
    this.baseService.getUserrequest(id).subscribe((response) => {
      if (response['success']) {
        this.withdrawl = response['data'].data;
        const { user_client, website } = this.withdrawl;
        this.form.patchValue({
          username: user_client?.name,
          website: website?.name,
        });
      }
    });
  }

  copyClipboard() {
    const { user_client } = this.withdrawl;
    navigator.clipboard.writeText(user_client?.name);
  }

  getBanks() {
    this.baseService.getAllBank().subscribe((response) => {
      if (response && response['success']) this.banks = response['data'].data;
      else this.banks = [];
    });
  }

  selectFiles(event: any): void {
    this.file = event.target.files[0];
  }

  close() {
    this.dialogRef.close({ reason: false });
  }

  getPayload(payload) {
    let form_data = new FormData();
    for (let key in payload) {
      const value = payload[key];
      if (key === 'file') {
        form_data.append('image', this.file);
      } else form_data.append(key, value);
    }
    return form_data;
  }

  onKeyPress(event) {
    const maximum_bonus = +localStorage.getItem('maximum_bonus');
    Utils.onKeyPress(event);
    setTimeout(() => {
      if (event.target.value > maximum_bonus)
        event.target.value = maximum_bonus;
    }, 0);
  }

  checkNumber(event) {
    Utils.onKeyPress(event);
  }

  onSubmit() {
    const { status_id, description, bank_id, utr } = this.form.value;
    const { request_type_id, id } = this.data;
    const payload = {
      status_id,
      request_type_id,
      description,
      bank_id,
      file: this.file,
      utr,
    };
    this.baseService.updateUserrequest(this.getPayload(payload), id).subscribe(
      (response) => {
        if (response['success']) this.dialogRef.close({ reason: true });
      },
      (error) => {
        const { reason } = error.error;
        const keys = Object.keys(reason);
        keys.forEach((key, index) => {
          this.alertService.multipleAlert(reason[key][0], index);
        });
      }
    );
  }
}
