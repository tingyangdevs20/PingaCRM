import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private localStorage: LocalStorageService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Get current url
    // let url: string = state.url;

    // Get Value from token for verify after refresh
    let token = this.localStorage.retrieve('token');

    // Compare token value with the string
    if (token == 'isLoggedIn') {
      return true;
    }

    // Set redirect to the current url after login success
    //this.authService.setRedirectUrl(url);

    // Redirect to login Url if False
    this.router.navigate([this.authService.getLoginUrl()])

    return false;


  }

  getRole(): string {
    let role = this.localStorage.retrieve('role');
    if (role == 'buyer') {
      return 'main/buyer/units'
    }
    return '/';
  }

}
