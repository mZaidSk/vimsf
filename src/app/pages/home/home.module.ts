import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { HomeRoutingModule } from './home-routing.module';
import { ComponentModule } from 'src/app/component/component.module';
import { HomeComponent } from './home/home.component';
import { AngularMatModule } from 'src/app/shared/module/material.module';

@NgModule({
    declarations: [HomeComponent],
    imports: [
        CommonModule,
        HomeRoutingModule,
        FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
        AngularMatModule,
        ComponentModule
    ]
})
export class HomeModule { }
