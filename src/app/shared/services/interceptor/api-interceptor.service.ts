import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHeaders,
    HttpHandler,
    HttpEvent,
    HttpResponse,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Constants } from 'src/app/shared/api/constant';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class ApiInterceptorService {
    constructor(private router: Router) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const authToken = localStorage.getItem(Constants.token);
        const parentId = localStorage.getItem(Constants.parent_id);
        let headers = new HttpHeaders();
        if (req.headers) {
            const contentType = req.headers.get('Content-Type');
            if (!contentType) {
                headers = new HttpHeaders({
                    'X-Requested-With': 'XMLHttpRequest',
                });
            }
        }
        if (authToken) headers = headers.append('Authorization', `Bearer ${authToken}`);
        if (parentId) headers = headers.append('parent-token', parentId);
        req = req.clone({ headers, url: environment.baseUrl + req.url });
        return next.handle(req).pipe(
            tap(
                (event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                    }
                },
                (err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 401) {
                            localStorage.removeItem(Constants.token);
                            this.router.navigateByUrl('/');
                        }
                    }
                }
            )
        );
    }
}
