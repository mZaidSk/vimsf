import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchComponent } from './branch/branch.component';
import { NotificationComponent } from './notification/notification.component';
import { PaymentMethodTypeComponent } from './payment-method-type/payment-method-type.component';
import { BannerComponent } from './banner/banner.component';
import { OfferComponent } from './offer/offer.component';
import { DepositPaymentMethodComponent } from './deposit-payment-method/deposit-payment-method.component';

const routes: Routes = [
  {
    path: 'payment-method-type',
    component: PaymentMethodTypeComponent,
  },
  {
    path: 'branch',
    component: BranchComponent,
  },
  {
    path: 'notification',
    component: NotificationComponent,
  },
  {
    path: 'banner',
    component: BannerComponent,
  },
  {
    path: 'offer',
    component: OfferComponent,
  },
  {
    path: 'deposit-payment-method',
    component: DepositPaymentMethodComponent,
  },
  {
    path: '',
    redirectTo: 'payment-method-type/:id',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentMethodRoutingModule {}
