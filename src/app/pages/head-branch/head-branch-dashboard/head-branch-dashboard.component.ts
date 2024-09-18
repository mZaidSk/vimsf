import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { TableConstants } from 'src/app/shared/api/table-constant';
import { AllStatuses } from 'src/app/shared/data/data';

@Component({
    selector: 'app-head-branch-dashboard',
    templateUrl: './head-branch-dashboard.component.html',
    styleUrls: ['./head-branch-dashboard.component.scss'],
})

export class HeadBranchDashboardComponent implements OnInit, OnDestroy {

    isLoading: boolean;
    searchText: string;
    displayedColumns: string[] = [
        'id',
        'request_type',
        'branch_id',
        'client_name',
        'website_name',
        'created_at',
        'delayed',
        'current_status',
    ];
    branches: any[] = [];
    requests: any[] = [];
    statuses: any[] = AllStatuses;
    subscriptions: Subscription[] = [];
    dataSource: any;
    payload = { status_id: '0,1' };
    status_id = [0, 1];
    branch_id: any;
    request_type_id: any;
    total: number;
    pageSizeOptions = TableConstants.pageSizesOptions;
    pageSize = TableConstants.pageSizes;

    searchData: Subject<string> = new Subject<string>();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private baseService: BaseService,
        public dialog: MatDialog,
        private _location: Location,
    ) { }

    ngOnInit(): void {
        this.getBranches();
        this.getRequestType();
        this.getAllUserrequest();
    }

    diff_minutes(ele) {
        const dt2 = new Date();
        const dt1 = new Date(ele)
        const diff = ((dt2.getTime() - dt1.getTime()) / 1000)/60;
        const num = Math.abs(Math.round(diff));
        const hours = (num / 60);
        const rhours = Math.floor(hours);
        const minutes = (hours - rhours) * 60;
        const rminutes = Math.round(minutes);
        return rhours ? rhours + " hour(s) and " + rminutes + " minute(s)." : rminutes + " minute(s).";
    }

    onChange(event, type) {
        if (type === 'status_id') this.payload[type] = event.join(',');
        else this.payload[type] = event;
        if (event === null) delete this.payload[type];
        this.getAllUserrequest();
    }

    getAllUserrequest() {
        this.baseService.getAllUserrequest(this.payload).subscribe((response) => {
            if (response && response['success']) {
                this.dataSource = response['data'].data;
                this.total = response['data'].total;
                this.dataSource.paginator = this.paginator;
            } else this.dataSource = [];
        })
    }

    getBranches() {
        this.baseService.getAllBranch().subscribe((response) => {
            if (response && response['success']) this.branches = response['data'].data;
            else this.branches = [];
        });
    }

    getRequestType() {
        this.baseService.getUserRequestType().subscribe((response) => {
            if (response && response['success']) this.requests = response['data'].data;
            else this.requests = [];
        });
    }

    back() {
        this._location.back();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((s) => s.unsubscribe());
    }
}
