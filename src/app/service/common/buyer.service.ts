import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { LocalStorageService } from 'ngx-webstorage';
import { share } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable()
export class BuyerService {

  constructor(private localStorage: LocalStorageService, private config: DataService, private http: HttpClient) { }

  loginId = this.config.getLoginID();
  baseUrl = this.config.getBaseUrl();
  pageSize = this.config.getPageSize();
  pageNo = this.config.getBasePageNo();
  groupId = this.config.getGroupId();
  projectId = this.config.getProjectId();
  orderByBuyerName = this.config.getDefaultOrderByBuyerName();

  getBuyersList() {
    return this.http.get(this.baseUrl + '/GetBuyersDetailList?GroupID=' + this.groupId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + this.pageNo)
  }

  getBuyersListByPageNo(pg: any) {
    let orderBy = this.localStorage.retrieve('orderBy');

    if (orderBy == null) {
      orderBy = 'order by buyerName'
    }

    return this.http.get(this.baseUrl + '/GetBuyersDetailList?GroupID=' + this.groupId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=' + orderBy)
  }

  getBuyersByOrder(sortOrder: any) {
    return this.http.get(this.baseUrl + '/GetBuyersDetailList?GroupID=' + this.groupId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + this.pageSize + '&OrderByExpression=' + sortOrder)
  }

  getBuyerDetails(id: any) {
    return this.http.get(this.baseUrl + '/GetUnitListOnclickBuyerName?GroupID=' + this.groupId + '&BuyerAppLoginID=' + id + '&LoginID=' + this.loginId)
  }

  getBuyerListByCompanyId(compId: any, pg: any) {
    return this.http.get(this.baseUrl + '/GetBuyersDetailList?GroupID=' + this.groupId + '&CompanyID=' + compId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=' + this.orderByBuyerName)
  }

  getBuyerListByCompanyIdAndLocationId(compId: any, locId: any, pg: any) {
    return this.http.get(this.baseUrl + '/GetBuyersDetailList?GroupID=' + this.groupId + '&CompanyID=' + compId + '&LocationID=' + locId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=' + this.orderByBuyerName)
  }

  getBuyerListByCompanyIdAndLocationIdAndProjectId(compId: any, locId: any, projId: any, pg: any) {
    return this.http.get(this.baseUrl + '/GetBuyersDetailList?GroupID=' + this.groupId + '&CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + projId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=' + this.orderByBuyerName)
  }

  getBuyerListByCompanyIdAndLocationIdAndProjectIdAndUsertype(compId: any, locId: any, projId: any, userStatus: any, pg: any) {
    return this.http.get(this.baseUrl + '/GetBuyersDetailList?GroupID=' + this.groupId + '&CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + projId + '&IsActive=' + userStatus + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=' + this.orderByBuyerName)
  }

  getBuyerListBySearchInputValue(searchText: string, pageNum: number) {
    return this.http.get(this.baseUrl + '/GetBuyersDetailList?GroupID=' + this.groupId + '&LoginID=' + this.loginId + '&SearchText=' + searchText + '&PageSize=' + this.pageSize + '&PageNo=' + pageNum)
  }

  sendManualEmailFromBuyer(emailAddr: string, subject: any, message: string, tranId: any) {
    return this.http.post(this.baseUrl + '/Email?Tranid=' + tranId + '&Companylocationid=0' + '&loginID=' + this.loginId + '&ProcessID=16&EmailTo=' + emailAddr + '&Subject=' + subject + '&Message=' + message, {})
  }

  sendManualSms(message: string, mobileNo: any, tranId: any) {
    return this.http.post(this.baseUrl + '/Sms?Tranid=' + tranId + '&Companylocationid=0&loginID=' + this.loginId + '&ProcessID=16&MobileNo=' + mobileNo + '&Message=' + message, {})
  }

  sendToInactiveBuyers() {
    return this.http.get(this.baseUrl + '/ActiveAllInactiveUser/' + this.groupId + '?LoginId=' + this.loginId + '&ModuleName=CustomerLogin')
  }

  sendActivateEmailToSelectedBuyers(arr: any) {
    return this.http.put(this.baseUrl + '/ActivateUser/' + this.loginId + '?ModuleName=CustomerLogin', arr)
  }
}
