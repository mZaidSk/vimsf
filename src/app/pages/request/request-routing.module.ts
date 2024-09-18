import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepositComponent } from './deposit/deposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { IDCreationComponent } from './id-creation/id-creation.component';
import { IDChangePasswordComponent } from './id-change-password/id-change-password.component';

const routes: Routes = [
    {
        path: 'deposit',
        component: DepositComponent
    },
    {
        path: 'withdrawal',
        component: WithdrawComponent
    },
    {
        path: 'id-creation',
        component: IDCreationComponent
    },
    {
        path: 'id-change-password',
        component: IDChangePasswordComponent
    },
    {
        path: '',
        redirectTo: 'deposit',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RequestRoutingModule { }
