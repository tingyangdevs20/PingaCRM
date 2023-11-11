import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { Route } from '@angular/router';

@Injectable()
export class ClientRoleGuardService implements CanLoad {

  constructor(private router: Router, private localStorage: LocalStorageService) { }

  canLoad(route: Route) {
    let role = this.localStorage.retrieve('role');

    if (role == 'Client Admin') {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

}
