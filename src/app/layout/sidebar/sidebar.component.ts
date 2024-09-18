import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  settingObject: any = {
    title: 'Setting',
    baseUrl: 'assets/images/',
    image: 'setting (1).png',
    name: 'setting',
    route: 'setting/website-list',
    subMenus: [
      { title: 'Website', route: 'setting/website-list' },
      { title: 'Settlement', route: 'setting/settlement-list' },
      // { title: 'Bank Transfer', route: 'setting/bank-transfer' },
      // { title: 'Bank Transaction', route: 'setting/bank-transaction' },
      // { title: 'Entry Correction', route: 'setting/entry-correction-list' },
      { title: 'User', route: 'setting/user-list' },
      { title: 'Group', route: 'setting/group-list' },
      { title: 'Role', route: 'setting/role-list' },
    ],
  };

  menus: any[] = [
    // {
    //   title: 'Request',
    //   baseUrl: 'assets/images/',
    //   image: 'request.png',
    //   name: 'Request',
    //   route: 'request/id-creation',
    //   subMenus: [
    //     { title: 'Deposit', route: 'request/deposit' },
    //     { title: 'Withdrawal', route: 'request/withdrawal' },
    //     { title: 'ID Creation', route: 'request/id-creation' },
    //     { title: 'ID Change Password', route: 'request/id-change-password' },
    //   ],
    // },
    {
      title: 'Branch',
      baseUrl: 'assets/images/',
      image: 'branch.png',
      name: 'client',
      route: 'client/transaction-list',
      subMenus: [
        // { title: 'Report', route: 'client/transaction-list/report' },
        { title: 'Transaction', route: 'client/transaction-list' },
        { title: 'Client', route: 'client/client-list' },
        { title: 'Bank', route: 'client/bank-list' },
        { title: 'Bank Transfer', route: 'client/bank-transfer' },
        { title: 'Bank Calculator', route: 'client/bank-calculator-list' },
        { title: 'Point Calculator', route: 'client/point-calculator-list' },
        { title: 'Work Slot', route: 'client/work-slot-list' },
        { title: 'Recovery', route: 'client/recovery-list' },
        { title: 'Expense', route: 'client/expense-list' },
      ],
    },
    {
      title: 'Master',
      baseUrl: 'assets/images/',
      image: 'master.png',
      name: 'Master',
      route: 'master/payment-method-type/deposit',
      subMenus: [
        // { title: 'Payment Method', route: 'master/payment-method-type' },
        // { title: 'Deposit Method', route: 'master/deposit-payment-method' },
        { title: 'Branch', route: 'master/branch' },
        // { title: 'Notification', route: 'master/notification' },
        // { title: 'Banner', route: 'master/banner' },
        // { title: 'Offer', route: 'master/offer' },
      ],
    },
  ];

  constructor() {
    let is_admin = Number(localStorage.getItem('is_admin'));
    if (is_admin === 1) {
      this.menus.push(this.settingObject);
    }
  }

  ngOnInit(): void {}
}
