import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Constants } from 'src/app/shared/api/constant';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        if (localStorage.getItem(Constants.token)) {
            this.router.navigate(['/dashboard']);
        } else return true;
    }

}
