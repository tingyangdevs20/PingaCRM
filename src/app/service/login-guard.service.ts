import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, RoutesRecognized } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from './auth.service';
import { Location } from '@angular/common';

@Injectable()
export class LoginGuardService implements CanActivate {

  constructor(private localStorage: LocalStorageService, private router: Router, private authService: AuthService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let token = this.localStorage.retrieve('token');

    if (!token) {
      return true;
    }

    this.router.navigate([this.authService.getRedirectUrl()])
    return false;
  }

}
