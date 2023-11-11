import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';
import { Users } from '../models/users';
import { DataService } from './data.service';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/map';
import { JwtHelperService } from '@auth0/angular-jwt';


const USERS: Users[] = [
  {
    username: 'vipul@gmail.com',
    firstname: 'Vipul',
    middlename: '',
    lastname: 'Verma',
    workphone: 123456789,
    mobilephone: 9999999999,
    usertype: 'Buyer',
    password: '12345'
  },
  {
    username: 'john@gmail.com',
    firstname: 'john',
    middlename: '',
    lastname: 'doe',
    workphone: 123456789,
    mobilephone: 9999999999,
    usertype: 'Client',
    password: '12345'
  }
]

let userObservable = of(USERS);

@Injectable()
export class AuthService {

  private redirectUrl: string = '';
  private loginUrl: string = '/login';
  private isLoggedIn: boolean = false;

  protected getAllUser(): Observable<Users[]> {
    return userObservable;
  }

  constructor(
    private localStorage: LocalStorageService,
    private http: HttpClient,
    private dataService: DataService) { }

  isUserAuthenticated(username: string, password: string): Observable<any> {
    let usr = username;
    let pass = password;
    let groupId = this.localStorage.retrieve('groupid')
    // let header = new HttpHeaders();
    let baseUrl = this.dataService.getBaseUrl2()

    // header.append('X-Forwarded-For','203.0.113.195')
    // header.append('user-agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0')

    return this.http.post(baseUrl + '/auth',
      { 'username': usr, 'password': pass, 'groupid': groupId },
      { responseType: 'text' })
  }

  getRefreshToken() {
    var that = this
    var xhttp = new XMLHttpRequest();
    let refreshUrl = this.dataService.getBaseUrl2() + '/refreshToken'
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          const resp = this.responseText
          that.localStorage.store('respBody', resp);
          const jwtHelper = new JwtHelperService();
          const decodedToken = jwtHelper.decodeToken(resp);
          that.localStorage.store('respBody', resp);
          that.localStorage.store('role', decodedToken.crm_role_name);
          that.localStorage.store('loginId', decodedToken.app_login_id);
          that.localStorage.store('crmRoleId', decodedToken.crm_role_id);
          that.localStorage.store('refreshTokenInProgress', false);
          window.location.reload()
        } else {
          that.localStorage.store('refreshTokenInProgress', false);
        }
      }
    };
    xhttp.open("POST", refreshUrl, false)
    let authorization = this.localStorage.retrieve('respBody')
    xhttp.setRequestHeader("Refresh", 'Bearer ' + authorization);
    xhttp.withCredentials = true
    xhttp.send();
  }

  getRole() {
    let role = this.localStorage.retrieve('role');
  }

  isUserLoggedIn() {
    return this.isLoggedIn;
  }

  getRedirectUrl() {
    let role = this.localStorage.retrieve('role');

    if (role == 'Buyer') {
      return this.redirectUrl = '/pinga/buyer/unist';
    }
    if (role == 'Client Admin') {
      return this.redirectUrl = '/pinga/client/managementdashboard';
    }
    return 'pinga/buyer/unist/';
  }

  setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  getLoginUrl() {
    return this.loginUrl;
  }

  logoutUser() {
    this.isLoggedIn = false;
  }

}
