import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { TransactionComponent } from './transaction/transaction.component';
import { ExpenseComponent } from './expense/expense.component';
import { BankComponent } from './bank/bank.component';
import { WorkSheetComponent } from './work-sheet/work-sheet.component';
import { WorkSheetFileComponent } from './work-sheet/work-sheet-file/work-sheet-file.component';
import { AddTransactionComponent } from './transaction/add-transaction/add-transaction.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { AddRecoveryComponent } from './recovery/add-recovery/add-recovery.component';
import { AddExpenseComponent } from './expense/add-expense/add-expense.component';
import { AddClientComponent } from './client/add-client/add-client.component';
import { AddBankComponent } from './bank/add-bank/add-bank.component';
import { AddWorkSheetComponent } from './work-sheet/add-work-sheet/add-work-sheet.component';
import { TransactionReportComponent } from './transaction-report/transaction-report.component';
import { BankTransferComponent } from './bank-transfer/bank-transfer.component';
import { BankCalculatorListComponent } from './bank-calculator-list/bank-calculator-list.component';
import { BankCalculatorFormComponent } from './bank-calculator-list/bank-calculator-form/bank-calculator-form.component';
import { PointCalculatorListComponent } from './point-calculator-list/point-calculator-list.component';
import { PointCalculatorFormComponent } from './point-calculator-list/point-calculator-form/point-calculator-form.component';
import { ViewWorkSheetComponent } from './work-sheet/view-work-sheet/view-work-sheet.component';

const routes: Routes = [
  {
    path: 'bank-calculator-list',
    component: BankCalculatorListComponent,
  },
  {
    path: 'bank-calculator-list/add',
    component: BankCalculatorFormComponent,
  },
  {
    path: 'bank-calculator-list/:id',
    component: BankCalculatorFormComponent,
  },
  {
    path: 'point-calculator-list',
    component: PointCalculatorListComponent,
  },
  {
    path: 'point-calculator-list/add',
    component: PointCalculatorFormComponent,
  },
  {
    path: 'point-calculator-list/:id',
    component: PointCalculatorFormComponent,
  },
  {
    path: 'client-list',
    component: ClientComponent,
  },
  {
    path: 'transaction-history/:id',
    component: TransactionHistoryComponent,
  },
  {
    path: 'client-list/add-client',
    component: AddClientComponent,
  },
  {
    path: 'client-list/edit-client/:id',
    component: AddClientComponent,
  },
  {
    path: 'transaction-list',
    component: TransactionComponent,
  },
  {
    path: 'transaction-list/report',
    component: TransactionReportComponent,
  },
  {
    path: 'transaction-list/add-transaction',
    component: AddTransactionComponent,
  },
  {
    path: 'transaction-list/edit-transaction/:id',
    component: AddTransactionComponent,
  },
  {
    path: 'recovery-list',
    component: RecoveryComponent,
  },
  {
    path: 'recovery-list/add-recovery',
    component: AddRecoveryComponent,
  },
  {
    path: 'recovery-list/edit-recovery/:id',
    component: AddRecoveryComponent,
  },
  {
    path: 'expense-list',
    component: ExpenseComponent,
  },
  {
    path: 'expense-list/add-expense',
    component: AddExpenseComponent,
  },
  {
    path: 'expense-list/edit-expense/:id',
    component: AddExpenseComponent,
  },
  {
    path: 'bank-transfer',
    component: BankTransferComponent,
  },
  {
    path: 'bank-list',
    component: BankComponent,
  },
  {
    path: 'bank-list/add-bank',
    component: AddBankComponent,
  },
  {
    path: 'bank-list/edit-bank/:id',
    component: AddBankComponent,
  },
  {
    path: 'work-slot-list',
    component: WorkSheetComponent,
  },
  {
    path: 'work-slot-list/edit-work-slot/file/:id',
    component: WorkSheetFileComponent,
  },
  {
    path: 'work-slot-list/add-work-slot',
    component: AddWorkSheetComponent,
  },
  {
    path: 'work-slot-list/edit-work-slot/:id',
    component: AddWorkSheetComponent,
  },
  {
    path: 'work-slot-list/view-work-slot/:id',
    component: ViewWorkSheetComponent,
  },
  {
    path: '',
    redirectTo: 'client-list',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
