import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';

import { AssignEntityComponent } from 'src/app/shared/modal/assign-entity/assign-entity.component';
import { BaseService } from 'src/app/shared/services/base-service/base.service';

@Component({
    selector: 'app-added-user',
    templateUrl: './added-user.component.html',
    styleUrls: ['./added-user.component.scss']
})
export class AddedUserComponent implements OnInit {

    @Input() id: any;
    @Input() dataSource: any;
    @Output() emitResponse: EventEmitter<boolean> = new EventEmitter();
    users: any[] = [];
    displayedColumns: string[] = ['name', 'email', 'action'];
    @ViewChild(MatAccordion) accordion: MatAccordion;

    constructor(public dialog: MatDialog, private baseService: BaseService) { }

    ngOnInit(): void {
        this.getGroupList();
    }

    getGroupList() {
        this.baseService.getUserListAll().subscribe(response => {
            if (response && response['success']) this.users = response['data'].data;
            else this.users = [];
        });
    }

    openDialog() {
        const dialogRef = this.dialog.open(AssignEntityComponent, {
            height: '220px',
            width: '600px',
            data: { label: 'Users', records: this.users, selected: this.dataSource.map(data => data.id) }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result.flag) {
                this.baseService.assignUserToGroup({ users: result.data }, this.id).subscribe(response => {
                    if (response && response['success']) {
                        this.emitResponse.emit();
                    }
                });
            }
        });
    }

}
