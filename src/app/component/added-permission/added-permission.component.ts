import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';

import { BaseService } from 'src/app/shared/services/base-service/base.service';

@Component({
    selector: 'app-added-permission',
    templateUrl: './added-permission.component.html',
    styleUrls: ['./added-permission.component.scss']
})
export class AddedPermissionComponent implements OnInit {

    @Input() id: any;
    @Input() dataSource: any;
    @Input() permissions: any;
    @Output() emitResponse: EventEmitter<boolean> = new EventEmitter();
    groups: any[] = [];
    displayedColumns: string[] = ['module_name'];
    @ViewChild(MatAccordion) accordion: MatAccordion;

    constructor(public dialog: MatDialog, private baseService: BaseService) { }

    ngOnInit(): void {
    }

    submit(data) {
        const selectedPermissions = [];
        data.forEach(prop => {
            prop.arrs.forEach(arr => {
                if (arr.selected) selectedPermissions.push(arr.permission_id);
            });
        });
        if (selectedPermissions && selectedPermissions.length) {
            this.baseService.assignPermissionToRole({ permissions: selectedPermissions }, this.id).subscribe(response => {
                if (response && response['success']) this.emitResponse.emit();
            });
        }
    }

    onChange(permission, change) {
        permission.arrs.filter(arr => arr.permission_id === change.option.value)[0]['selected'] = change.option.selected;
    }

}
