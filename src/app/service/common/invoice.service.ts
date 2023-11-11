import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { LocalStorageService } from 'ngx-webstorage';
// import { ResponseContentType } from '@angular/http';

@Injectable()
export class InvoiceService {
  // buyerId: number;

  constructor(private localStorage: LocalStorageService, private config: DataService, private http: HttpClient) { }

  loginId = this.config.getLoginID();
  groupId = this.config.getGroupId();
  baseUrl = this.config.getBaseUrl();
  pageSize = this.config.getPageSize();
  pageNo = this.config.getBasePageNo();
  orderByInvoiceDate = this.config.getDefaultOrderByInvoiceDate();

  getInvoiceList(buyerID: any, pg: any) {
    return this.http.get(this.baseUrl + '/Invoice?GroupId=' + this.groupId + '&LoginID=' + this.loginId + '&UnitId=' + buyerID + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=' + this.orderByInvoiceDate)
  }

  getAllInvoices() {
    return this.http.get(this.baseUrl + '/Invoice?GroupId=' + this.groupId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + this.pageNo + '&OrderByExpression=' + this.orderByInvoiceDate)
  }

  getBankNameList() {
    return this.http.get(this.baseUrl + '/BankList');
  }

  getAllInvoicesByPageNo(pg: any) {
    let orderBy = this.localStorage.retrieve('orderBy');

    if (orderBy == null) {
      orderBy = 'order by invoiceDate desc'
    }

    return this.http.get(this.baseUrl + '/Invoice?GroupId=' + this.groupId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=' + orderBy)
  }

  getInvoicebyOrder(sortOrder: any) {
    return this.http.get(this.baseUrl + '/Invoice?GroupId=' + this.groupId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + this.pageNo + '&OrderByExpression=' + sortOrder)
  }

  getInvoicesByCompanyId(compId: any, pageNum: number) {
    return this.http.get(this.baseUrl + '/Invoice?GroupId=' + this.groupId + '&CompanyId=' + compId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pageNum + '&OrderByExpression=order%20by%20invoiceNo')
  }

  getInvoicesByCompanyIdAndLocationId(compId: any, locId: any, pageNum: number) {
    return this.http.get(this.baseUrl + '/Invoice?GroupId=' + this.groupId + '&CompanyId=' + compId + '&LocationID=' + locId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pageNum + '&OrderByExpression=order%20by%20invoiceNo')
  }

  getInvoicesByCompanyIdAndLocationIdAndProjectId(compId: any, locId: any, projId: any, pageNum: number) {
    return this.http.get(this.baseUrl + '/Invoice?GroupId=' + this.groupId + '&CompanyId=' + compId + '&LocationID=' + locId + '&ProjectID=' + projId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pageNum + '&OrderByExpression=order%20by%20invoiceNo')
  }

  getInvoicesByCompanyIdAndLocationIdAndProjectIdAndUnitNo(compId: any, locId: any, projId: any, unitNo: number, pageNum: number) {
    return this.http.get(this.baseUrl + '/Invoice?GroupId=' + this.groupId + '&CompanyId=' + compId + '&LocationID=' + locId + '&ProjectID=' + projId + '&LoginID=' + this.loginId + '&UnitId=' + unitNo + '&PageSize=' + this.pageSize + '&PageNo=' + pageNum + '&OrderByExpression=order%20by%20invoiceNo')
  }

  getBuyerInvoiceCharge(groupID: any, serverID: any, moduleName: string, installID: any) {
    return this.http.get(this.baseUrl + '/Chargeswisedue?GroupID=' + groupID + '&ServerID=' + serverID + '&ModuleName=' + moduleName + '&installid=' + installID)
  }

  searchInvoice(buyerID: any, fromDate: Date, toDate: Date) {
    return this.http.get(this.baseUrl + '/Invoice?GroupId=' + this.groupId + '&LoginID=' + this.loginId + '&UnitId=' + buyerID + '&FromDate=' + fromDate + '&ToDate=' + toDate + '&PageSize=' + this.pageSize + '&PageNo=' + this.pageNo)
  }

  getBuyerGeneralSettings(buyerID: any) {
    return this.http.get(this.baseUrl + '/GetGeneralSetting?BuyerID=' + buyerID)
  }

  paymentGatewayConfig() {
    return this.http.get(this.baseUrl + '/PaymentGatewayConfigure?GroupId=' + this.groupId)
  }

  onSelectPrjctpaymentGatewayConfig(projectID: any) {
    return this.http.get(this.baseUrl + '/PaymentGatewayConfigure?groupid=' + this.groupId + '&projectid=' + projectID)
  }
  getOnlinepaymenttype(projectID: any) {
    return this.http.get(this.baseUrl + '/GetAllPaymentGateways?groupid=' + this.groupId + '&projectid=' + projectID)
  }
  meterUniquePoints(buyerID: any) {
    return this.http.get(this.baseUrl + '/GetMeterUniquePoint/' + buyerID)
  }
  getInvoiceDownloadLink(tranID: any, groupID: any, serverID: any, modeuleName: string, loginID: any) {
    return this.http.get(this.baseUrl + '/Invoice/Download?tranid=' + tranID + '&groupid=' + groupID + '&serverid=' + serverID + '&modulename=' + modeuleName + '&loginid=' + loginID, { responseType: 'blob' });
  }
}
