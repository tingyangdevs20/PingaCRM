import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { LocalStorageService } from 'ngx-webstorage';
// import {SlimLoadingBarService} from 'ngx-slim-loading-bar';
import { shareReplay } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs'

@Injectable()
export class UserService {

  constructor(private localStorage: LocalStorageService, private config: DataService, private http: HttpClient/**service**/) { }

  loginId = this.config.getLoginID();
  baseUrl = this.config.getBaseUrl();
  baseUrl2 = this.config.getBaseUrl2();
  pageSize = this.config.getPageSize();
  pageNo = this.config.getBasePageNo();
  groupId = this.config.getGroupId();
  orderByFirstName = this.config.getDefaultOrderByFirstName();
  userInfo = new Subject<any>();

  getUserList(pg: any): Observable<any> {
    return this.http.get(this.baseUrl + '/GetUserList?GroupId=' + this.groupId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=' + this.orderByFirstName).
      pipe(shareReplay());
  }

  getUserListByPageNo(pg: any) {
    let orderBy = this.localStorage.retrieve('orderBy');

    if (orderBy == null) {
      orderBy = 'order by firstname'
    }

    return this.http.get(this.baseUrl + '/GetUserList?GroupId=' + this.groupId + '&userid=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=' + orderBy)
  }

  getUserListByCompanyId(compId: any, pg: any) {
    return this.http.get(this.baseUrl + '/GetUserList?GroupId=' + this.groupId + '&Companyid=' + compId + '&userid=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=order%20by%20firstname')
  }

  getUserListByCompanyIdAndLocationId(compId: any, locId: any, pg: any) {
    return this.http.get(this.baseUrl + '/GetUserList?GroupId=' + this.groupId + '&Companyid=' + compId + '&userid=' + this.loginId + '&LocationID=' + locId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=order%20by%20firstname')
  }

  getUserListByCompanyIdAndLocationIdAndProjectID(compId: any, locId: any, projId: any, pg: any) {
    return this.http.get(this.baseUrl + '/GetUserList?GroupId=' + this.groupId + '&Companyid=' + compId + '&userid=' + this.loginId + '&LocationID=' + locId + '&ProjectID=' + projId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=order%20by%20firstname')
  }

  getUserListByCompanyIdAndLocationIdAndProjectIdAndUsertype(compId: any, locId: any, projId: any, userStatus: any, pg: any) {
    return this.http.get(this.baseUrl + '/GetUserList?GroupId=' + this.groupId + '&Companyid=' + compId + '&userid=' + this.loginId + '&LocationID=' + locId + '&ProjectID=' + projId + '&IsActive=' + userStatus + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=order%20by%20firstname')
  }

  sendManualEmail(emailAddr: string, subject: any, message: string, tranId: any) {
    return this.http.post(this.baseUrl + '/Email?Tranid=' + tranId + '&Companylocationid=0' + '&loginID=' + this.loginId + '&ProcessID=16&EmailTo=' + emailAddr + '&Subject=' + subject + '&Message=' + message, {})
  }

  sendManualSms(appLoginId: any, message: string, mobileNo: any) {
    return this.http.post(this.baseUrl + '/Sms?Tranid=' + appLoginId + '&Companylocationid=0&loginID=' + this.loginId + '&ProcessID=16&MobileNo=' + mobileNo + '&Message=' + message, {})
  }

  resetPassword(appLoginId: any) {
    return this.http.put(this.baseUrl2 + '/ResetPassword/' + this.groupId + '/' + appLoginId + '/' + this.loginId, {})
  }

  createNewUser(user: any) {
    return this.http.post(this.baseUrl + '/CreateUser', user)
  }

  updateUser(user: any) {
    return this.http.put(this.baseUrl + '/UpdateUser', user)
  }

  getUser(appLoginId: any) {
    return this.http.get(this.baseUrl + '/GetUser?Apploginid=' + appLoginId)
  }

  getUsersByOrder(sortOrder: any) {
    return this.http.get(this.baseUrl + '/GetUserList?GroupId=' + this.groupId + '&userid=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + this.pageNo + '&OrderByExpression=' + sortOrder)
  }

}
