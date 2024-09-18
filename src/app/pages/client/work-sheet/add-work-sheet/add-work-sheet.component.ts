import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { AlertService } from 'src/app/shared/services/alert-service/alert.service';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { ComfirmationModalComponent } from 'src/app/shared/modal/comfirmation-modal/comfirmation-modal.component';
import { slots } from 'src/app/shared/data/data';

@Component({
  selector: 'app-add-work-sheet',
  templateUrl: './add-work-sheet.component.html',
  styleUrls: ['./add-work-sheet.component.scss'],
})
export class AddWorkSheetComponent implements OnInit {
  form: FormGroup;
  worksheetId: string;
  isLoading: boolean;
  workslot = {
    total_deposit_in_slot: 0,
    total_withdrawal_in_slot: 0,
    deposit_num_in_slot: 0,
    withdrawal_num_in_slot: 0,
  };
  workSheets: any[] = [];
  slots: any[] = slots;
  work_sheet = {
    label: 'Files',
    url: '/worksheet',
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private _location: Location,
    public dialog: MatDialog,
    private alertService: AlertService,
    private baseService: BaseService
  ) {
    this.form = this.fb.group({
      name: [null, Validators.required],
      work_start_date: [null, Validators.required],
      slot_id: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getParam();
  }

  emitResponse() {
    this.getParam();
  }

  getParam() {
    this.activateRoute.params.subscribe((data) => {
      this.worksheetId = data['id'];
      if (this.worksheetId) {
        this.isLoading = true;
        this.getWorksheetDetail();
      }
    });
  }

  getWorksheetDetail() {
    this.isLoading = true;
    this.baseService.getWorkSlot(this.worksheetId).subscribe((response) => {
      if (response && response['success']) {
        this.isLoading = false;
        this.worksheetPatch(response['data']['data']);
        this.workslot = response['data']['data'];
        this.workSheets = response['data'].data.work_sheets;
      } else {
        this.isLoading = false;
      }
    });
  }

  worksheetPatch(data) {
    this.form.patchValue({
      name: data.name,
      work_start_date: data.work_start_date,
      slot_id: data.slot_id,
    });
  }

  back() {
    this._location.back();
  }

  onSubmit() {
    this.isLoading = true;
    if (this.worksheetId) this.updateWorkSheet(this.worksheetId);
    else this.createWorkSheet();
  }

  createWorkSheet() {
    this.baseService.createWorkSlot(this.form.value).subscribe(
      (response) => {
        if (response && response['success']) {
          this.isLoading = false;
          this.router.navigate(['client/work-slot-list']);
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

  updateWorkSheet(worksheetId) {
    this.baseService.updateWorkSlot(this.form.value, worksheetId).subscribe(
      (response) => {
        if (response && response['success']) {
          this.isLoading = false;
          this.router.navigate(['client/work-slot-list']);
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
