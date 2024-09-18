import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatChipsModule } from '@angular/material/chips';

import { PaymentMethodRoutingModule } from './master-routing.module';
import { ComponentModule } from 'src/app/component/component.module';
import { AngularMatModule } from 'src/app/shared/module/material.module';
import { PaymentMethodTypeComponent } from './payment-method-type/payment-method-type.component';
import { BranchComponent } from './branch/branch.component';
import { NotificationComponent } from './notification/notification.component';
import { BannerComponent } from './banner/banner.component';
import { OfferComponent } from './offer/offer.component';
import { DepositPaymentMethodComponent } from './deposit-payment-method/deposit-payment-method.component';

@NgModule({
    declarations: [
        PaymentMethodTypeComponent,
        BranchComponent,
        NotificationComponent,
        BannerComponent,
        OfferComponent,
        DepositPaymentMethodComponent
    ],
    imports: [
        CommonModule,
        PaymentMethodRoutingModule,
        FormsModule,
        NgSelectModule,
        MatChipsModule,
        ReactiveFormsModule,
        AngularMatModule,
        ComponentModule
    ]
})
export class PaymentMethodTypeModule { }
