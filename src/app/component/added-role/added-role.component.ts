import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';

import { AssignEntityComponent } from 'src/app/shared/modal/assign-entity/assign-entity.component';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { ComfirmationModalComponent } from 'src/app/shared/modal/comfirmation-modal/comfirmation-modal.component';

@Component({
    selector: 'app-added-role',
    templateUrl: './added-role.component.html',
    styleUrls: ['./added-role.component.scss']
})
export class AddedRoleComponent implements OnInit {

    @Input() id: any;
    @Input() dataSource: any;
    @Output() emitResponse: EventEmitter<boolean> = new EventEmitter();
    roles: any[] = [];
    displayedColumns: string[] = ['name', 'description', 'action'];
    @ViewChild(MatAccordion) accordion: MatAccordion;

    constructor(public dialog: MatDialog, private baseService: BaseService) { }

    ngOnInit(): void {
        this.getRoleList();
    }

    getRoleList() {
        this.baseService.getRoleListAll().subscribe(response => {
            if (response && response['success']) this.roles = response['data'].data;
            else this.roles = [];
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
            data: { label: 'Roles', records: this.roles, selected: this.dataSource.map(data => data.id) }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.flag) {
                this.baseService.assignrolestogroup({ roles: result.data }, this.id).subscribe(response => {
                    if (response && response['success']) {
                        this.emitResponse.emit();
                    }
                });
            }
        });
    }

}
