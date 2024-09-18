import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { AlertService } from 'src/app/shared/services/alert-service/alert.service';
import { merge, Subscription, Subject } from 'rxjs';
import {
  startWith,
  switchMap,
  map,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import { Constants } from 'src/app/shared/api/constant';
import { Router } from '@angular/router';

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Bulb', name: '2 Years', weight: '100 kg' },
  { position: 'Bulb', name: '2 Years', weight: '100 kg' },
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  showFiller = false;
  displayedColumns: string[] = ['name', 'branch', 'amount'];
  pointsColumns: string[] = ['name', 'balance'];
  dataSource = ELEMENT_DATA;
  panelOpenState = false;
  isLoading: boolean;
  dashboardItems: any;
  searchData: Subject<string> = new Subject<string>();
  subscriptions: Subscription[] = [];
  clients: any[] = [];
  searchText: string;

  constructor(
    private fb: FormBuilder,
    private baseService: BaseService,
    private router: Router,
    private alertService: AlertService
  ) {
    let date = new Date();
    const day = date.getTime() - 1 * 24 * 60 * 60 * 1000;
    date.setTime(day);
    this.form = this.fb.group({
      client_id: [null],
      start_date_time: [this.getDateFormat(new Date(date))],
      end_date_time: [this.getDateFormat(new Date())],
    });
  }

  clientSearch({ term }) {
    if (term.trim().length > 2) this.searchData.next(term);
  }

  getDateFormat(date) {
    const formatted =
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1) +
      '-' +
      date.getDate() +
      'T' +
      date.getHours() +
      ':' +
      date.getMinutes();
    return formatted;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.searchData
        .pipe(debounceTime(750), distinctUntilChanged())
        .subscribe((value) => {
          this.searchText = value;
          this.getClientList();
        })
    );
    if (!localStorage.getItem(Constants.token))
      this.router.navigate(['/login']);
    this.getDashboard();
  }

  getClientList() {
    this.subscriptions.push(
      merge(this.searchText)
        .pipe(
          startWith({}),
          debounceTime(1000),
          switchMap(() => {
            return this.baseService.getAllBankSearch(this.searchText);
          }),
          map((response: any) => {
            if (response.success) this.clients = response['data']?.data;
            else this.clients = [];
          })
        )
        .subscribe((res) => res)
    );
  }

  formGroup() {
    this.getDashboard();
  }

  getDashboard() {
    this.isLoading = true;
    let data = this.form.value;
    this.baseService.getDashboardItems(data).subscribe(
      (response) => {
        if (response && response['success']) {
          this.dashboardItems = response['data'];
          this.isLoading = false;
        } else this.isLoading = false;
      },
      (error) => {
        const { reason } = error.error;
        const keys = Object.keys(reason);
        keys.forEach((key, index) => {
          this.alertService.multipleAlert(reason[key][0], index);
        });
        this.isLoading = false;
      }
    );
  }
}
