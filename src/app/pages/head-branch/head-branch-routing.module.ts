import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeadBranchDashboardComponent } from './head-branch-dashboard/head-branch-dashboard.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: HeadBranchDashboardComponent
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HeadBranchRoutingModule { }
