import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LOGIN_API, LOGIN_AS_CHILD_API } from 'src/app/shared/api/api.constant';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) { }

    login (data) {
        return this.http.post<Response>(LOGIN_API, data);
    }

    loginAsChild (data) {
        return this.http.post<Response>(LOGIN_AS_CHILD_API, data);
    }
}
