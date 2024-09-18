import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-assign-entity',
    templateUrl: './assign-entity.component.html',
    styleUrls: ['./assign-entity.component.scss']
})
export class AssignEntityComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<AssignEntityComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
    }

    cancel() {
        this.dialogRef.close({ flag: false, data: this.data.selected });
    }

    done() {
        this.dialogRef.close({ flag: true, data: this.data.selected });
    }

}
