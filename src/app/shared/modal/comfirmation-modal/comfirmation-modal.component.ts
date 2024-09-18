import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-comfirmation-modal',
    templateUrl: './comfirmation-modal.component.html',
    styleUrls: ['./comfirmation-modal.component.scss']
})
export class ComfirmationModalComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<ComfirmationModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
    }

    cancel() {
        this.dialogRef.close(false);
    }

    done() {
        this.dialogRef.close(true);
    }

}
