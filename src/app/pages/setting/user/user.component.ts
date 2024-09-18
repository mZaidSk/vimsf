import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { merge, of as observableOf, Subscription, Subject } from 'rxjs';
import { Router } from '@angular/router';
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
import { BaseService } from 'src/app/shared/services/base-service/base.service';
import { TableConstants } from 'src/app/shared/api/table-constant';
import { ComfirmationModalComponent } from 'src/app/shared/modal/comfirmation-modal/comfirmation-modal.component';
import { AuthService } from 'src/app/shared/services/auth-service/auth.service';
import { AlertService } from 'src/app/shared/services/alert-service/alert.service';
import { Constants } from 'src/app/shared/api/constant';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  displayedColumns: string[] = ['checkbox', 'name', 'email', 'action'];
  subscriptions: Subscription[] = [];
  dataSource: any;
  total: number;
  searchText: string;
  pageSizeOptions = TableConstants.pageSizesOptions;
  pageSize = TableConstants.pageSizes;
  allChecked: boolean = false;
  searchData: Subject<string> = new Subject<string>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private baseService: BaseService,
    private alertService: AlertService,
    private authService: AuthService,
    public dialog: MatDialog,
    private _location: Location,
    private router: Router
  ) {
    let is_admin = Number(localStorage.getItem('is_admin'));
    if (is_admin === 0) {
      this.router.navigate(['dashboard']);
    }
  }

  ngOnInit(): void {
    this.getUserList();
    this.subscriptions.push(
      this.searchData
        .pipe(debounceTime(750), distinctUntilChanged())
        .subscribe((value) => {
          this.searchText = value;
          this.getUserList();
        })
    );
  }

  getUserList() {
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
            return this.baseService.getUserList(
              this.paginator.pageIndex,
              this.pageSize,
              this.searchText
            );
          }),
          map((response: any) => {
            this.isLoading = false;
            this.dataSource = response.data.data;
            this.total = response.data.total;
            this.dataSource.paginator = this.paginator;
          }),
          catchError((error) => {
            this.isLoading = false;
            return observableOf([]);
          })
        )
        .subscribe((res) => res)
    );
  }

  loginAsChild(user) {
    this.authService.loginAsChild({ child_id: user.id }).subscribe(
      (response: any) => {
        if (response && response['success']) {
          localStorage.setItem(Constants.token, response.data.data.token);
          localStorage.setItem(Constants.parent_id, response.data.data.user.parent_id);
          localStorage.setItem(
            Constants.maximum_bonus,
            response.data.data.setting.maximum_bonus
          );
          localStorage.setItem(
            Constants.branch_id,
            response.data.data.user.branch_id
          );
          localStorage.setItem(
            Constants.user_type_id,
            response.data.data.user.user_type_id
          );
          console.log("Hello",response.data.data.user);
          let user_type_id = response.data.data.user.user_type_id
          let parent_user_type_id = response.data.data.parent_user_type_id

          if (user_type_id == 1 || user_type_id==2 || parent_user_type_id==1 || parent_user_type_id==2) {
            localStorage.setItem(Constants.is_admin, '1');
          } else {
            localStorage.setItem(Constants.is_admin, '0');
          }

          localStorage.setItem(
            Constants.user_name,
            response.data.data.user.name
          );
          this.router.navigate(['/dashboard']);
          window.location.reload()
        }
      },
      (error) => {
        const { data } = error.error.data;
        data.forEach((message: string, index: number) => {
          this.alertService.multipleAlert(message, index);
        });
      }
    );
  }

  onSearch(event) {
    this.searchData.next(event.target.value);
  }

  back() {
    this._location.back();
  }

  delete(user) {
    const dialogRef = this.dialog.open(ComfirmationModalComponent, {
      height: '200px',
      width: '500px',
      data: {
        text: `Are you sure you want to delete this user`,
        name: user.name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.baseService.deleteUser(user.id).subscribe((response) => {
          if (response && response['success']) this.getUserList();
          else this.isLoading = false;
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  checkedAll(checked: boolean) {
    this.allChecked = checked;
    if (checked) this.dataSource.forEach((t) => (t.checked = checked));
    else this.dataSource.forEach((t) => (t.checked = checked));
  }

  checkedOne(checked: boolean, element) {
    if (checked) element.checked = checked;
    else element.checked = checked;
    if (
      this.dataSource.filter((prop) => prop['checked']).length ===
      this.dataSource.length
    )
      this.allChecked = true;
    else this.allChecked = false;
  }
}
