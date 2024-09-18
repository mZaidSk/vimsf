import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatChipsModule } from '@angular/material/chips';

import { HeadBranchRoutingModule } from './head-branch-routing.module';
import { ComponentModule } from 'src/app/component/component.module';
import { AngularMatModule } from 'src/app/shared/module/material.module';
import { HeadBranchDashboardComponent } from './head-branch-dashboard/head-branch-dashboard.component';

@NgModule({
    declarations: [
        HeadBranchDashboardComponent
    ],
    imports: [
        CommonModule,
        HeadBranchRoutingModule,
        FormsModule,
        NgSelectModule,
        MatChipsModule,
        ReactiveFormsModule,
        AngularMatModule,
        ComponentModule
    ]
})
export class HeadBranchModule { }
