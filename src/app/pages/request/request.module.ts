import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatChipsModule } from '@angular/material/chips';

import { RequestRoutingModule } from './request-routing.module';
import { ComponentModule } from 'src/app/component/component.module';
import { AngularMatModule } from 'src/app/shared/module/material.module';
import { DepositComponent } from './deposit/deposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { IDCreationComponent } from './id-creation/id-creation.component';
import { IDChangePasswordComponent } from './id-change-password/id-change-password.component';

@NgModule({
    declarations: [
        DepositComponent,
        WithdrawComponent,
        IDCreationComponent,
        IDChangePasswordComponent
    ],
    imports: [
        CommonModule,
        RequestRoutingModule,
        FormsModule,
        NgSelectModule,
        MatChipsModule,
        ReactiveFormsModule,
        AngularMatModule,
        ComponentModule
    ]
})
export class RequestModule { }
