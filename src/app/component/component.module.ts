import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMatModule } from 'src/app/shared/module/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { SettingRoutingModule } from 'src/app/pages/setting/setting-routing.module';
import { LoaderComponent } from './loader/loader.component';
import { AddedRoleComponent } from './added-role/added-role.component';
import { AddedUserComponent } from './added-user/added-user.component';
import { AddedGroupComponent } from './added-group/added-group.component';
import { MultipleImageUploadComponent } from './multiple-image-upload/multiple-image-upload.component';
import { AddedPermissionComponent } from './added-permission/added-permission.component';
import { TableExpandable } from './table-expandable/table-expandable.component';

const components = [
    LoaderComponent, AddedRoleComponent, AddedUserComponent, AddedGroupComponent, AddedPermissionComponent, TableExpandable, MultipleImageUploadComponent
];

@NgModule({
    imports: [
        CommonModule,
        SettingRoutingModule,
        AngularMatModule,
        FormsModule,
        NgSelectModule,
        ReactiveFormsModule
    ],
    exports: [
        ...components,
        CommonModule
    ],
    declarations: [...components]
})

export class ComponentModule { }
