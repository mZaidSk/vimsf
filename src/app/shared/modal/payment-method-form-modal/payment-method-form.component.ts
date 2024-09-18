import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { toggle } from 'src/app/shared/data/data';
import { BaseService } from 'src/app/shared/services/base-service/base.service';

@Component({
  selector: 'app-payment-method-form',
  templateUrl: './payment-method-form.component.html',
  styleUrls: ['./payment-method-form.component.scss'],
})
export class PaymentMethodFormComponent implements OnInit {
  form: FormGroup;
  requests: any[] = toggle;
  file: any;
  id: any;
  image_url: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PaymentMethodFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private baseService: BaseService
  ) {
    this.form = this.fb.group({
      title: [null, Validators.required],
      file: [null],
      action_id: [data?.action_id],
      is_receipt_required: [1],
      is_upi: [1],
      is_bank: [1],
      is_active: [1],
    });
  }

  ngOnInit(): void {
    this.id = this.data?.payload?.id;
    if (this.id)
      this.baseService.getPaymentMethodType(this.id).subscribe((response) => {
        const {
          title,
          action_id,
          is_receipt_required,
          is_upi,
          is_bank,
          is_active,
          image_url,
        } = response['data']['data'];
        this.form.patchValue({
          title,
          action_id,
          is_receipt_required,
          is_upi,
          is_bank,
          is_active,
        });
        this.image_url = image_url;
      });
  }

  selectFiles(event: any): void {
    this.file = event.target.files[0];
    this.image_url = null;
  }

  onSubmit() {
    let form_data = new FormData();
    for (let key in this.form.value) {
      const value = this.form.value[key];
      if (key === 'file') {
        form_data.append('image', this.file);
      } else form_data.append(key, value);
    }
    if (this.data?.payload) {
      this.baseService
        .updatePaymentMethodType(form_data, this.data?.payload?.id)
        .subscribe((response) => {
          if (response['success']) this.dialogRef.close({ response: true });
        });
    } else {
      this.baseService
        .createPaymentMethodType(form_data)
        .subscribe((response) => {
          if (response['success']) this.dialogRef.close({ response: true });
        });
    }
  }

  closeModal() {
    this.dialogRef.close({ response: false });
  }
}
