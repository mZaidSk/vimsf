import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertService } from 'src/app/shared/services/alert-service/alert.service';
import { AuthService } from 'src/app/shared/services/auth-service/auth.service';
import { Constants } from 'src/app/shared/api/constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  signinForm: FormGroup;
  hide: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.signinForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }

  ngOnInit(): void {}

  showPassword() {
    this.hide = !this.hide;
  }

  PostData() {
    if (this.signinForm.valid) {
      this.authService.login(this.signinForm.value).subscribe(
        (response: any) => {
          if (response && response['success']) {
            localStorage.setItem(Constants.token, response.data.data.token);
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

            if (
              response.data.data.user.user_type_id == 1 ||
              response.data.data.user.user_type_id == 2
            ) {
              localStorage.setItem(Constants.is_admin, '1');
            } else {
              localStorage.setItem(Constants.is_admin, '0');
            }

            localStorage.setItem(
              Constants.user_name,
              response.data.data.user.name
            );
            this.router.navigate(['/dashboard']);
          }
        },
        (error) => {
          const { data } = error.error.data;
          data.forEach((message: string, index: number) => {
            this.alertService.multipleAlert(message, index);
          });
        }
      );
    } else {
      if (this.signinForm.controls.email.invalid)
        this.alertService.showWarning('email is invalid', 'warning!');
      if (this.signinForm.controls.password.invalid)
        this.alertService.showWarning('password is invalid', 'warning!');
    }
  }
}
