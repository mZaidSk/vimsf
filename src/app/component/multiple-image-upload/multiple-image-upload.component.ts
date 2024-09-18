import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { ComfirmationModalComponent } from 'src/app/shared/modal/comfirmation-modal/comfirmation-modal.component';

@Component({
  selector: 'app-multiple-image-upload',
  templateUrl: './multiple-image-upload.component.html',
  styleUrls: ['./multiple-image-upload.component.scss'],
})
export class MultipleImageUploadComponent implements OnInit {
  myform: FormGroup;
  isLoading: boolean;
  @ViewChild('fileInput') fileInput: ElementRef;
  fileAttr = 'Choose File';
  @Input() id: any;
  @Input() dataSource: any;
  @Input() maxSize: string;
  @Output() emitResponse: EventEmitter<boolean> = new EventEmitter();
  @Output() emitRequest: EventEmitter<boolean> = new EventEmitter();
  is_admin: any = 0;
  displayedColumns: string[] = [
    'file_name',
    'created_at',
    'website',
    'uploaded_by',
    'status',
    'total_deposit',
    'total_withdrawal',
    'total_deposit_num',
    'total_withdrawal_num',
    'diff_amount',
    'action',
  ];
  @ViewChild(MatAccordion) accordion: MatAccordion;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private baseService: BaseService,
    private fb: FormBuilder
  ) {
    this.is_admin = Number(localStorage.getItem('is_admin'));
  }
  selectedFiles: any[] = [];
  websites: any[] = [];
  toggles: any[] = [
    {
      key: 1,
      value: 'Yes',
    },
    {
      key: 0,
      value: 'No',
    },
  ];
  ngOnInit(): void {
    this.getWebsite();
    this.myform = this.fb.group({
      website_id: [null, Validators.required],
      settlement_file: [],
      file: [null, Validators.required],
    });
  }

  @Input() detail: any;

  getWebsite() {
    this.baseService.getBranchWebsite().subscribe((response) => {
      if (response && response['success'])
        this.websites = response['data'].data;
      else this.websites = [];
    });
  }

  selectFiles(event: any): void {
    let files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }
  }

  uploadFile() {
    if (this.myform.invalid) return;
    this.isLoading = true;
    let formData = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('work_sheets', this.selectedFiles[i]);
      formData.append('website_id', this.myform.value['website_id']);
    }
    this.baseService
      .postProductGalary(this.id, formData, this.detail.url)
      .subscribe((response) => {
        if (response && response['success']) {
          this.isLoading = false;
          this.emitResponse.emit();
        } else this.isLoading = false;
      });
  }

  delete(item) {
    const dialogRef = this.dialog.open(ComfirmationModalComponent, {
      height: '200px',
      width: '500px',
      data: {
        text: `Are you sure you want to delete this ${item.file_name} file(s)`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.baseService
          .deleteImage(this.id, { worksheet_ids: [item.id] })
          .subscribe((response) => {
            if (response && response['success']) {
              this.isLoading = false;
              this.emitResponse.emit();
            }
          });
      }
    });
  }

  statusUpdate(item) {
    const dialogRef = this.dialog.open(ComfirmationModalComponent, {
      height: '200px',
      width: '500px',
      data: {
        text: `Are you sure you want to Approve this ${item.file_name} file(s)`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.baseService.statusUpdate(item.id).subscribe((response) => {
          if (response && response['success']) {
            this.isLoading = false;
            this.emitResponse.emit();
          }
        });
      }
    });
  }

  download(data) {
    let link = document.createElement('a');
    link.setAttribute('download', data.file_name);
    link.href = data.url;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  download_failed(data) {
    let link = document.createElement('a');
    link.setAttribute('download', data.file_name);
    link.href = data.missing_data_url;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  sync(data) {
    this.isLoading = true;
    this.baseService.getSyncWorksheet(data.id).subscribe((response) => {
      if (response && response['success']) {
        this.isLoading = false;
        this.emitResponse.emit();
      } else this.isLoading = false;
    });
  }

  openFile({ id }) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        '/client/work-slot-list/edit-work-slot/file',
        id,
      ])
    );

    window.open(url, '_blank');
  }

  readmore(name) {
    const dialogRef = this.dialog.open(ComfirmationModalComponent, {
      height: '200px',
      width: '500px',
      data: {
        text: ``,
        name: name,
        done: 'no',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
}
