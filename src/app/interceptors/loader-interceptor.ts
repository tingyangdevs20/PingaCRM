import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
// import 'rxjs/add/operator/do';
// import { SlimLoadingBarService } from "ngx-slim-loading-bar";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // start our loader here
    // this._loadingBar.start();

    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        // if the event is for http response
        if (event instanceof HttpResponse) {
          // stop our loader here
          // this._loadingBar.complete();
        }

      }, (err: any) => {
        // if any error (not for just HttpResponse) we stop our loader bar
        // this._loadingBar.complete();
      }));
  }

}
