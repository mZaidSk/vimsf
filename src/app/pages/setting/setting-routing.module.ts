import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { RoleComponent } from './role/role.component';
import { AddRoleComponent } from './role/add-role/add-role.component';
import { GroupComponent } from './group/group.component';
import { AddGroupComponent } from './group/add-group/add-group.component';
import { AdminBankTransferComponent } from './admin-bank-transfer/admin-bank-transfer.component';
import { BankTransactionComponent } from '../setting/bank-transaction/bank-transaction.component';
import { WebsiteComponent } from './website/website.component';
import { AddWebsiteComponent } from './website/add-website/add-website.component';
import { SettlementComponent } from './settlement/settlement.component';
import { AddSettlementComponent } from './settlement/add-settlement/add-settlement.component';
import { EntryCorrectionComponent } from './entry-correction/entry-correction.component';
import { AddEntryCorrectionComponent } from './entry-correction/add-entry-correction/add-entry-correction.component';

const routes: Routes = [
    {
        path: 'bank-transfer',
        component: AdminBankTransferComponent
    },
    {
        path: 'bank-transaction',
        component: BankTransactionComponent,
    },
    {
        path: 'user-list',
        component: UserComponent
    },
    {
        path: 'user-list/add-user',
        component: AddUserComponent
    },
    {
        path: 'user-list/edit-user/:id',
        component: AddUserComponent
    },
    {
        path: 'entry-correction-list',
        component: EntryCorrectionComponent
    },
    {
        path: 'entry-correction-list/edit-entry-correction/:id',
        component: AddEntryCorrectionComponent
    },
    {
        path: 'settlement-list',
        component: SettlementComponent
    },
    {
        path: 'settlement-list/add-settlement',
        component: AddSettlementComponent
    },
    {
        path: 'settlement-list/edit-settlement/:id',
        component: AddSettlementComponent
    },
    {
        path: 'role-list',
        component: RoleComponent
    },
    {
        path: 'role-list/add-role',
        component: AddRoleComponent
    },
    {
        path: 'role-list/edit-role/:id',
        component: AddRoleComponent
    },
    {
        path: 'group-list',
        component: GroupComponent
    },
    {
        path: 'group-list/add-group',
        component: AddGroupComponent
    },
    {
        path: 'group-list/edit-group/:id',
        component: AddGroupComponent
    },
    {
      path: 'website-list',
      component: WebsiteComponent,
    },
    {
      path: 'website-list/add-website',
      component: AddWebsiteComponent,
    },
    {
      path: 'website-list/edit-website/:id',
      component: AddWebsiteComponent,
    },
    {
        path: '',
        redirectTo: 'bank-transfer',
        pathMatch: 'full'
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule {}
