import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ApiInterceptorService } from './interceptor/api-interceptor.service';

@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiInterceptorService,
            multi: true
        }
    ]
})

export class ServiceModule { }