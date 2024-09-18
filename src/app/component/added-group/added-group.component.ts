import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';

import { AssignEntityComponent } from 'src/app/shared/modal/assign-entity/assign-entity.component';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { ComfirmationModalComponent } from 'src/app/shared/modal/comfirmation-modal/comfirmation-modal.component';

@Component({
    selector: 'app-added-group',
    templateUrl: './added-group.component.html',
    styleUrls: ['./added-group.component.scss']
})
export class AddedGroupComponent implements OnInit {

    @Input() id: any;
    @Input() dataSource: any;
    @Output() emitResponse: EventEmitter<boolean> = new EventEmitter();
    groups: any[] = [];
    displayedColumns: string[] = ['name', 'description', 'action'];
    @ViewChild(MatAccordion) accordion: MatAccordion;

    constructor(public dialog: MatDialog, private baseService: BaseService) { }

    ngOnInit(): void {
        this.getGroupList();
    }

    getGroupList() {
        this.baseService.getGroupListAll().subscribe(response => {
            if (response && response['success']) this.groups = response['data'].data;
            else this.groups = [];
        });
    }

    readmore(description) {
        const dialogRef = this.dialog.open(ComfirmationModalComponent, {
          height: '200px',
          width: '500px',
          data: {
            text: ``,
            name: description,
            done: "no"
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          console.log(result);
        });
      }

    openDialog() {
        const dialogRef = this.dialog.open(AssignEntityComponent, {
            height: '220px',
            width: '600px',
            data: { label: 'Groups', records: this.groups, selected: this.dataSource.map(data => data.id) }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.flag) {
                this.baseService.assignGroupToRole({ groups: result.data }, this.id).subscribe(response => {
                    if (response && response['success']) this.emitResponse.emit();
                });
            }
        });
    }

}
