import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { merge, of as observableOf, Subscription, Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  startWith,
  switchMap,
  map,
  catchError,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { actions } from 'src/app/shared/data/data';

import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { TableConstants } from 'src/app/shared/api/table-constant';
import { Utils } from 'src/app/shared/utilities/utils';

@Component({
  selector: 'app-view-work-sheet',
  templateUrl: './view-work-sheet.component.html',
  styleUrls: ['./view-work-sheet.component.scss'],
})
export class ViewWorkSheetComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isLoading: boolean;
  displayedColumns: string[] = [
    'client_user_id',
    'admin_user_id',
    'website_amount',
    'website',
    'datetime',
    'action',
    'is_process',
    'tid',
    'event',
  ];
  subscriptions: Subscription[] = [];
  dataSource: any;
  total: number;
  searchText: string;
  pageSizeOptions = TableConstants.pageSizesOptions;
  pageSize = 100;
  id: any;
  tab: string = 'all';
  actions: any[] = actions;
  clients: any[] = [];
  websites: any[] = [];

  searchData: Subject<string> = new Subject<string>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private baseService: BaseService,
    public dialog: MatDialog,
    private activateRoute: ActivatedRoute,
    private _location: Location,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      amount: [''],
      action_id: [null],
      client_id: [null],
      website_id: [null],
      start_date_time: [null],
      end_date_time: [null],
    });
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe((data) => {
      this.id = data['id'];
      this.getWorkSheetList();
      this.subscriptions.push(
        this.searchData
          .pipe(debounceTime(750), distinctUntilChanged())
          .subscribe((value) => {
            this.searchText = value;
            this.getWorkSheetList();
          })
      );
    });
    this.getWebsite();
  }

  onKeyPress(event) {
    Utils.onKeyPress(event);
  }

  clientSearch({ term }) {
    if (term.trim().length > 2) {
      this.subscriptions.push(
        merge(term)
          .pipe(
            startWith({}),
            debounceTime(1000),
            switchMap(() => {
              return this.baseService.getAllBankSearch(term);
            }),
            map((response: any) => {
              if (response.success) this.clients = response['data']?.data;
              else this.clients = [];
            })
          )
          .subscribe((res) => res)
      );
    }
  }

  onSubmit() {
    this.getWorkSheetList();
  }

  getWebsite() {
    this.baseService.getBranchWebsite().subscribe((response) => {
      if (response && response['success'])
        this.websites = response['data'].data;
      else this.websites = [];
    });
  }

  onValChange({ value }) {
    this.tab = value;
    this.getWorkSheetList();
  }

  getWorkSheetList() {
    this.isLoading = true;
    this.subscriptions.push(
      merge(this.paginator.page)
        .pipe(
          startWith({}),
          debounceTime(1000),
          switchMap(() => {
            this.isLoading = true;
            this.pageSize =
              this.paginator.pageSize == undefined
                ? this.pageSize
                : this.paginator.pageSize;
            return this.baseService.getViewWorkSlotList(
              this.paginator.pageIndex,
              this.pageSize,
              this.searchText,
              this.id,
              this.tab,
              this.form.value
            );
          }),
          map((response: any) => {
            if (response.success) {
              this.dataSource = response.data.data;
              this.total = response.data.total;
              this.dataSource.paginator = this.paginator;
            } else this.dataSource = [];
            this.isLoading = false;
          }),
          catchError((error) => {
            this.isLoading = false;
            return observableOf([]);
          })
        )
        .subscribe((res) => res)
    );
  }

  onSearch(event) {
    this.searchData.next(event.target.value);
  }

  back() {
    this._location.back();
  }

  toggleEvent({ id }) {
    this.isLoading = true;
    this.baseService.changeWorkSlotStatus(id).subscribe((response) => {
      if (response && response['success']) this.getWorkSheetList();
      else this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
