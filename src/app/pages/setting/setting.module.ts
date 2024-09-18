import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { SettingRoutingModule } from './setting-routing.module';
import { UserComponent } from './user/user.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { AngularMatModule } from 'src/app/shared/module/material.module';
import { ComponentModule } from 'src/app/component/component.module';
import { MatTableModule } from '@angular/material/table';
import { RoleComponent } from './role/role.component';
import { AddRoleComponent } from './role/add-role/add-role.component';
import { EntryCorrectionComponent } from './entry-correction/entry-correction.component';
import { AddEntryCorrectionComponent } from './entry-correction/add-entry-correction/add-entry-correction.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { GroupComponent } from './group/group.component';
import { AddGroupComponent } from './group/add-group/add-group.component';
import { AdminBankTransferComponent } from './admin-bank-transfer/admin-bank-transfer.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BankTransactionComponent } from '../setting/bank-transaction/bank-transaction.component';
import { WebsiteComponent } from './website/website.component';
import { AddWebsiteComponent } from './website/add-website/add-website.component';
import { SettlementComponent } from './settlement/settlement.component';
import { AddSettlementComponent } from './settlement/add-settlement/add-settlement.component';

@NgModule({
    declarations: [
        UserComponent,
        AddUserComponent,
        EntryCorrectionComponent,
        AddEntryCorrectionComponent,
        RoleComponent,
        AddRoleComponent,
        GroupComponent,
        AddGroupComponent,
        AdminBankTransferComponent,
        WebsiteComponent,
        AddWebsiteComponent,
        BankTransactionComponent,
        SettlementComponent,
        AddSettlementComponent
    ],
    imports: [
        CommonModule,
        SettingRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        AngularMatModule,
        ComponentModule,
        MatTableModule,
        MatExpansionModule,
        MatDialogModule,
        MatPaginatorModule,
        MatSelectModule,
        NgSelectModule,
        MatCheckboxModule
    ]
})
export class SettingModule {}
