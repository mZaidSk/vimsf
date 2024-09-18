import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { Utils } from 'src/app/shared/utilities/utils';
import { types } from 'src/app/shared/data/data';

@Component({
  selector: 'app-client-modal',
  templateUrl: './client-modal.component.html',
  styleUrls: ['./client-modal.component.scss'],
})
export class ClientModalComponent implements OnInit {
  form: FormGroup;
  types: any[] = types;
  websites: any[] = [];
  isLoading: boolean;

  constructor(
    private fb: FormBuilder,
    private baseService: BaseService,
    public dialogRef: MatDialogRef<ClientModalComponent>
  ) {
    this.form = this.fb.group({
      name: [null, Validators.required],
      website_id: [null],
      type: [1],
      balance: [0, Validators.required],
      phone: [null, Validators.required, Validators.pattern(Utils.phoneRegex)],
    });
  }

  ngOnInit(): void {
    this.getWebsite();
  }

  onKeyPress(event, max_chars = undefined) {
    Utils.onKeyPress(event);
    if (max_chars && event.target.value.length > max_chars) {
      event.target.value = event.target.value.substr(0, max_chars);
    }
  }

  getWebsite() {
    this.baseService.getBranchWebsite().subscribe((response) => {
      if (response && response['success'])
        this.websites = response['data'].data;
      else this.websites = [];
    });
  }

  onSubmit() {
    this.dialogRef.close({ data: this.form.value });
  }
}
