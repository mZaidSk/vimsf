import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Utils } from 'src/app/shared/utilities/utils';
import { AlertService } from 'src/app/shared/services/alert-service/alert.service';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { types } from 'src/app/shared/data/data';
import { Constants } from 'src/app/shared/api/constant';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss'],
})
export class AddClientComponent implements OnInit {
  form: FormGroup;
  clientId: string;
  isLoading: boolean;
  websites: any[] = [];
  user_types: any[] = [];
  types: any[] = types;
  is_admin: any = 0;
  user_type_id = +localStorage.getItem(Constants.user_type_id);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private _location: Location,
    private alertService: AlertService,
    private baseService: BaseService
  ) {
    this.is_admin = localStorage.getItem('is_admin');
    this.form = this.fb.group({
      name: [null, Validators.required],
      website_id: [null],
      type: [1],
      balance: [0, Validators.required],
      phone: [
        null,
        [Validators.required, Validators.pattern(Utils.phoneRegex)],
      ],
    });
  }

  ngOnInit(): void {
    this.getWebsite();
    this.getUserType();
    this.getParam();
  }

  emitResponse() {
    this.getParam();
  }

  onKeyPress(event, max_chars = undefined) {
    Utils.onKeyPress(event);
    if (max_chars && event.target.value.length > max_chars) {
      event.target.value = event.target.value.substr(0, max_chars);
    }
  }

  getParam() {
    this.activateRoute.params.subscribe((data) => {
      this.clientId = data['id'];
      if (this.clientId) {
        this.isLoading = true;
        this.getClientDetail();
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

  getUserType() {
    this.baseService.getAllUserType().subscribe((response) => {
      if (response && response['success'])
        this.user_types = response['data'].data;
      else this.user_types = [];
    });
  }

  getClientDetail() {
    this.isLoading = true;
    this.baseService.getClient(this.clientId).subscribe((response) => {
      if (response && response['success']) {
        this.isLoading = false;
        this.subClientDetailPatch(response['data']['data']);
      } else {
        this.isLoading = false;
      }
    });
  }

  subClientDetailPatch(data) {
    const { name, type, website_id, phone, balance } = data;
    this.form.patchValue({
      name,
      type: +type,
      website_id,
      phone,
      balance,
    });
  }

  back() {
    this._location.back();
  }

  onSubmit() {
    this.isLoading = true;
    if (this.clientId) this.updateClient(this.clientId);
    else this.createClient();
  }

  createClient() {
    this.baseService.createClient(this.form.value).subscribe(
      (response) => {
        if (response && response['success']) {
          this.isLoading = false;
          this.router.navigate(['client/client-list']);
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

  updateClient(clientId) {
    this.baseService.updateClient(this.form.value, clientId).subscribe(
      (response) => {
        if (response && response['success']) {
          this.isLoading = false;
          this.router.navigate(['client/client-list']);
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
