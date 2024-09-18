import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('drawer') drawer: any;

  constructor() {}

  ngOnInit(): void {}

  eEmitToggle() {
    this.drawer.toggle();
  }
}
