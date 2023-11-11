import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataService } from '../service/data.service';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable()
export class MyResolver implements Resolve<any> {
  constructor(
    private http: HttpClient,
    private router: Router,
    private dataService: DataService,
    private localStorage: LocalStorageService
  ) { }

  resolve(activatedRoute: ActivatedRouteSnapshot, routeState: RouterStateSnapshot): Observable<any> {
    let source = activatedRoute.queryParams['t'];
    let hash = activatedRoute.queryParams['confirm_hash'];
    let id = activatedRoute.queryParams['id'];
    let baseUrl = this.dataService.getBaseUrl2();

    return this.http.get(baseUrl + '/FirstTimeLogin/' + source + '?ID=' + id + '&ConfirmHash=' + hash).pipe(
      catchError((error: any) => {
        console.error('Error in resolver:', error);
        return throwError(error);
      })
    );
  }
}