import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceModule } from './shared/services/service.module';
import { AngularMatModule } from 'src/app/shared/module/material.module';
import { ComfirmationModalComponent } from './shared/modal/comfirmation-modal/comfirmation-modal.component';
import { GlbModalComponent } from './shared/modal/glb-modal/glb-modal.component';
import { AssignEntityComponent } from './shared/modal/assign-entity/assign-entity.component';
import { ClientModalComponent } from './shared/modal/client-modal/client-modal.component';
import { DepositFormModalComponent } from './shared/modal/deposit-form-modal/deposit-form-modal.component';
import { ChangePasswordComponent } from './shared/modal/change-password/change-password.component';
import { PaymentMethodFormComponent } from './shared/modal/payment-method-form-modal/payment-method-form.component';
import { BranchFormComponent } from './shared/modal/branch-form/branch-form.component';
import { NotificationFormComponent } from './shared/modal/notification/notification.component';
import { BannerFormComponent } from './shared/modal/banner-form/banner-form.component';
import { OfferFormComponent } from 'src/app/shared/modal/offer-form/offer-form.component';
import { DepositPaymentFormComponent } from './shared/modal/deposit-payment-form/deposit-payment-form.component';
import { WithdrawlFormModalComponent } from './shared/modal/withdrawl-form-modal/withdrawl-form-modal.component';
import { IDCreationFormModalComponent } from './shared/modal/id-creation-form-modal/id-creation-form-modal.component';
import { IDChangePasswordFormModalComponent } from './shared/modal/id-change-password/id-change-password.component';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        HeaderComponent,
        SidebarComponent,
        ComfirmationModalComponent,
        GlbModalComponent,
        AssignEntityComponent,
        ClientModalComponent,
        DepositFormModalComponent,
        ChangePasswordComponent,
        PaymentMethodFormComponent,
        BranchFormComponent,
        NotificationFormComponent,
        BannerFormComponent,
        OfferFormComponent,
        DepositPaymentFormComponent,
        WithdrawlFormModalComponent,
        IDCreationFormModalComponent,
        IDChangePasswordFormModalComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        ServiceModule,
        HttpClientModule,
        AngularMatModule,
        NgSelectModule,
        ToastrModule.forRoot({
            timeOut: 5000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
        }),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
