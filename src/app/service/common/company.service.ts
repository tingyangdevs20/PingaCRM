import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { LocalStorageService } from 'ngx-webstorage';
import { Subject } from 'rxjs';
// import {SlimLoadingBarService} from 'ngx-slim-loading-bar';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';



@Injectable()
export class CompanyService {

  constructor(private localStorage: LocalStorageService, private config: DataService, private http: HttpClient/**service**/) { }

  loginId = this.config.getLoginID();
  baseUrl = this.config.getBaseUrl();
  pageSize = this.config.getPageSize();
  pageNo = this.config.getBasePageNo();
  groupId = this.config.getGroupId();
  orderByCompanyName = this.config.getDefaultOrderByCompanyName();
  companyEmailConfig = new Subject<any>();
  companySmsConfig = new Subject<any>();
  companyGenSettings = new Subject<any>();
  companyLocId = new Subject<any>();
  companyId = new Subject<any>();

  setCompanyLocId(id: any) {
    this.companyLocId.next(id);
  }

  setCompanyId(id: any) {
    this.companyId.next(id);
  }

  setCompanyEmailConfig(config: any) {
    this.companyEmailConfig.next(config);
  }

  setCompanySmsConfig(config: any) {
    this.companySmsConfig.next(config);
  }

  setGeneralSettingsConfig(config: any) {
    this.companyGenSettings.next(config);
  }

  getCompaniesList() {
    return this.http.get(this.baseUrl + '/GetcompanyList?GroupID=' + this.groupId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + this.pageNo + '&OrderByExpression=' + this.orderByCompanyName);
  }

  getCompaniesListByPageNo(pg: any) {
    let orderBy = this.localStorage.retrieve('orderBy');

    if (orderBy == null) {
      orderBy = 'order by companyname';
    }
    return this.http.get(this.baseUrl + '/GetcompanyList?GroupID=' + this.groupId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=' + orderBy);
  }

  getCompaniesbyOrder(sortOrder: any) {
    return this.http.get(this.baseUrl + '/GetcompanyList?GroupID=' + this.groupId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + this.pageNo + '&OrderByExpression=' + sortOrder);
  }

  getModuleList() {
    return this.http.get(this.baseUrl + '/DashboardPreferences/ModuleList/' + this.loginId + "/" + this.groupId);
  }

  getInvoiceSummrySmallDetails(compId: any, locId: any, prjctId: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/LMInvoiceSummarySmallWidget/' + this.loginId + '/' + this.groupId + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId);
  }

  getLMinventorySmallDetails(compId: any, locId: any, prjctId: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/LMInventorySummarySmallWidget/' + this.loginId + '/' + this.groupId + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId);
  }

  getLMDueReceiveSmallDetails(compId: any, locId: any, prjctId: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/LMDueReceiveSummarySmallWidget/' + this.loginId + '/' + this.groupId + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId);
  }

  getmoduleSequenceList(moduleId: any) {
    return this.http.get(this.baseUrl + '/DashboardPreferences/ReportListModuleWise/' + this.loginId + '/' + this.groupId + '/' + moduleId);
  }

  getCompanyList() {
    return this.http.get(this.baseUrl + '/Getcompanies?GroupID=' + this.groupId + '&LoginID=' + this.loginId)
  }
  getAllCompanies(modulename: string) {
    return this.http.get(this.baseUrl + '/Company/CompanyAll/' + this.groupId + '/' + this.loginId + '/' + modulename)
  }
  getAllLocationByCompanyId(compId: any) {
    return this.http.get(this.baseUrl + '/Location/LocationAll/' + this.groupId + '/' + this.loginId + '?' + 'CompanyID=' + compId)
  }
  getAllbProjectsByLocationId(locId: any) {
    return this.http.get(this.baseUrl + '/Project/ProjectAll/' + this.groupId + '/' + this.loginId + '/' + locId)
  }
  getCompanyConfigurationDetails(compLocId: any, type: any) {
    return this.http.get(this.baseUrl + '/GetConfigurationDetails?Companylocationid=' + compLocId + '&Type=' + type)
  }
  getSalesSummaryWidget(compId: any, locId: any, prjctId: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/SalesSummary/' + this.loginId + '/' + this.groupId + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId)
  }
  getDueSummaryWidget(compId: any, locId: any, prjctId: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/DueSummary/' + this.loginId + '/' + this.groupId + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId)
  }
  getReceiptSummaryWidget(compId: any, locId: any, prjctId: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/ReceiptSummary/' + this.loginId + '/' + this.groupId + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId)
  }
  getDBsysncWidget(prcessType: any) {
    return this.http.get(this.baseUrl + '/DbSyncDashboard/' + prcessType)
  }

  getDashboardERPCollectionData(compId: any, locId: any, prjctId: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/Collection/' + this.loginId + '/' + this.groupId + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId)
  }

  getDashboardERPGSTRNotify(compId: any, locId: any, prjctId: any, month: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/GSTRNotify/' + this.loginId + '/' + this.groupId + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId + '&Month=' + month)
  }

  getDashboardERPForecast(compId: any, locId: any, prjctId: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/Forecast/' + this.loginId + '/' + this.groupId + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId)
  }

  getDashboardERPDueReceiptProgress(period: any, compId: any, locId: any, prjctId: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/DueReceiptProgress/' + this.loginId + '/' + this.groupId + '/' + period + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId)
  }

  getdashboardERPDueReceiveTrend(period: any, compId: any, locId: any, prjctId: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/DueReceiveTrend/' + this.loginId + '/' + this.groupId + '/' + period + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId)
  }
  // getCompanyGeneralSettings(compLocId) {
  //   return this.http.get(this.baseUrl+'/GetGeneralSetting/?Companylocationid='+compLocId)
  // }

  sendTestEmail(emailAddr: any, subject: any, message: any, compLocId: any) {
    return this.http.post(this.baseUrl + '/Email?Tranid=' + this.loginId + '&Companylocationid=' + compLocId + '&loginID=' + this.loginId + '&ProcessID=15&EmailTo=' + emailAddr + '&Subject=' + subject + '&Message=' + message, {})
  }

  sendTestSms(compLocId: any, mobileNo: any, message: any) {
    return this.http.post(this.baseUrl + '/Sms?Tranid=' + this.loginId + '&Companylocationid=' + compLocId + '&loginID=' + this.loginId + '&ProcessID=15&MobileNo=' + mobileNo + '&Message=' + message, {})
  }

  getGeneralSetting(compLocId: any) {
    return this.http.get(this.baseUrl + '/GetGeneralSettingsConfiguration?Companylocationid=' + compLocId + '&loginID=' + this.loginId)
  }

  getLMcollectionDetails(compId: any, locId: any, prjctId: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/LMCollectionSummary/' + this.loginId + '/' + this.groupId + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId)
  }

  getLMInvoiceDetails(compId: any, locId: any, prjctId: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/LMInvoiceSummary/' + this.loginId + '/' + this.groupId + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId)
  }

  getLMInventoryDetails(compId: any, locId: any, prjctId: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/LMInventoryStatus/' + this.loginId + '/' + this.groupId + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId)
  }

  getLMVertualInventoryDetails(compId: any, locId: any, prjctId: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/LMVirtualInventoryStatus/' + this.loginId + '/' + this.groupId + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId)
  }

  getLMLeaseRentDetails(compId: any, locId: any, prjctId: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/LMLeaseRentRenewal/' + this.loginId + '/' + this.groupId + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId)
  }

  getLMAssetDetails(compId: any, locId: any, prjctId: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/LMAsset/' + this.loginId + '/' + this.groupId + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId)
  }

  getFATemplateWiseDetails(compId: any, locId: any, prjctId: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/FATemplateWiseProfitability/' + this.loginId + '/' + this.groupId + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId)
  }

  getFALocationWiseDetails(compId: any, locId: any, prjctId: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/FALocationWiseProfitability/' + this.loginId + '/' + this.groupId + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId)
  }

  getFAbalancesheet(compId: any, locId: any, prjctId: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/FABalanceSheet/' + this.loginId + '/' + this.groupId + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId)
  }

  getBankBalanceDetails(compId: any, locId: any, prjctId: any) {
    return this.http.get(this.baseUrl + '/DashboardERP/FABankBalanceDetail/' + this.loginId + '/' + this.groupId + '?' + 'CompanyID=' + compId + '&LocationID=' + locId + '&ProjectID=' + prjctId)
  }

}
