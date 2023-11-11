import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private localStorage: LocalStorageService,
        private cookie: CookieService,
        private route: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authorization;

        authorization = this.checkToken();
        req = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + authorization),
            withCredentials: true
        }), (error: any) => {
            console.log(error.error);
        }
        return next.handle(req);
    }

    checkToken() {
        let authorization;
        authorization = this.localStorage.retrieve('respBody');

        const jwtHelper = new JwtHelperService();
        const decodedToken = jwtHelper.decodeToken(authorization);
        if (decodedToken) {
            const ssoDecodedToken = jwtHelper.decodeToken(decodedToken.token);
            const refresh_DecodedToken = jwtHelper.decodeToken(decodedToken.refresh_token);
            const refresh_tokenExpiry = refresh_DecodedToken.exp;
            // const expirationDate = helper.getTokenExpirationDate(ssoDecodedToken);
            const tokenExpiry = ssoDecodedToken.exp;
            if (tokenExpiry != null || tokenExpiry != '') {
                const currentTime = Date.now().valueOf() / 1000;

                if (currentTime > tokenExpiry) {

                    if (currentTime > refresh_tokenExpiry) {
                        //logout code
                        console.log("refresh token expired");
                        let logUserName = this.localStorage.retrieve('userName');
                        this.localStorage.clear();
                        this.localStorage.store('userName', logUserName);
                        this.cookie.deleteAll();
                        this.authService.logoutUser();
                        location.href = this.authService.getLoginUrl();
                        // this.route.navigate([ this.authService.getLoginUrl() ]);
                    }
                    else {
                        if (!this.localStorage.retrieve('refreshTokenInProgress')) {
                            this.localStorage.store('refreshTokenInProgress', true);
                            // document.getElementById('refreshtoken-loading').style.display = 'block';
                            this.authService.getRefreshToken();
                        } else {
                            return null;
                        }
                    }
                }
            }
        }
        return authorization;
    }
}
