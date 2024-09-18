import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { Constants } from 'src/app/shared/api/constant';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    count: any;
    @Output() eEmitToggle = new EventEmitter<any>();
    branch_id = localStorage.getItem(Constants.branch_id);
    user_name = localStorage.getItem(Constants.user_name);

    constructor(private router: Router, private baseService: BaseService,) { }

    ngOnInit() {
        this.getNotifications();
        setInterval(() => {
            this.getNotifications();
        }, 90000)
    }

    getNotifications() {
        this.baseService.getPushNotification().subscribe(
            (response) => {
                if (response && response['success']) {
                    this.count = response['data'].pending_request;
                }
            });
    }

    eventOnNotification() {
        this.router.navigate(['/dashboard']);
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['/login']);
    }

}
