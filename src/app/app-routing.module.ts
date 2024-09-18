import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { AuthGuard } from 'src/app/shared/gaurd/auth/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./auth/auth.module').then((mod) => mod.AuthModule),
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/home/home.module').then((mod) => mod.HomeModule),
      },
      {
        path: 'client',
        loadChildren: () =>
          import('./pages/client/client.module').then(
            (mod) => mod.ClientModule
          ),
      },
      {
        path: 'setting',
        loadChildren: () =>
          import('./pages/setting/setting.module').then(
            (mod) => mod.SettingModule
          ),
      },
      // {
      //     path: 'request',
      //     loadChildren: () => import('./pages/request/request.module').then(
      //         (mod) => mod.RequestModule),
      // },
      {
        path: 'master',
        loadChildren: () =>
          import('./pages/master/master.module').then(
            (mod) => mod.PaymentMethodTypeModule
          ),
      },
      // {
      //     path: 'head-branch',
      //     loadChildren: () =>
      //         import('./pages/head-branch/head-branch.module').then(
      //             (mod) => mod.HeadBranchModule
      //         ),
      // },
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
      },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
