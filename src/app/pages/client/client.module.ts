import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { ClientRoutingModule } from './client-routing.module';
import { AngularMatModule } from 'src/app/shared/module/material.module';
import { ComponentModule } from 'src/app/component/component.module';
import { ClientComponent } from './client/client.component';
import { AddClientComponent } from './client/add-client/add-client.component';
import { TransactionComponent } from './transaction/transaction.component';
import { AddTransactionComponent } from './transaction/add-transaction/add-transaction.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { AddRecoveryComponent } from './recovery/add-recovery/add-recovery.component';
import { TransactionReportComponent } from './transaction-report/transaction-report.component';
import { ExpenseComponent } from './expense/expense.component';
import { AddExpenseComponent } from './expense/add-expense/add-expense.component';
import { BankComponent } from './bank/bank.component';

import { AddBankComponent } from './bank/add-bank/add-bank.component';
import { WorkSheetComponent } from './work-sheet/work-sheet.component';
import { WorkSheetFileComponent } from './work-sheet/work-sheet-file/work-sheet-file.component';
import { AddWorkSheetComponent } from './work-sheet/add-work-sheet/add-work-sheet.component';
import { BankTransferComponent } from './bank-transfer/bank-transfer.component';
import { BankCalculatorListComponent } from './bank-calculator-list/bank-calculator-list.component';
import { BankCalculatorFormComponent } from './bank-calculator-list/bank-calculator-form/bank-calculator-form.component';
import { PointCalculatorListComponent } from './point-calculator-list/point-calculator-list.component';
import { PointCalculatorFormComponent } from './point-calculator-list/point-calculator-form/point-calculator-form.component';
import { ViewWorkSheetComponent } from './work-sheet/view-work-sheet/view-work-sheet.component';

@NgModule({
  declarations: [
    ClientComponent,
    AddClientComponent,
    TransactionComponent,
    AddTransactionComponent,
    TransactionHistoryComponent,
    RecoveryComponent,
    AddRecoveryComponent,
    TransactionReportComponent,
    BankComponent,
    AddBankComponent,
    WorkSheetComponent,
    WorkSheetFileComponent,
    ViewWorkSheetComponent,
    AddWorkSheetComponent,
    ExpenseComponent,
    AddExpenseComponent,
    BankTransferComponent,
    BankCalculatorListComponent,
    BankCalculatorFormComponent,
    PointCalculatorListComponent,
    PointCalculatorFormComponent,
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    AngularMatModule,
    ComponentModule,
    MatButtonToggleModule,
  ],
})
export class ClientModule {}
