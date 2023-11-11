import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable()
export class UnitService {

  constructor(private localStorage: LocalStorageService, private config: DataService, private http: HttpClient) { }

  loginId = this.config.getLoginID();
  baseUrl = this.config.getBaseUrl();
  groupId = this.config.getGroupId();
  pageSize = this.config.getPageSize();
  pageNo = this.config.getBasePageNo();
  orderByUnit = this.config.getDefaultOrderByUnit();
  projectId = this.config.getProjectId();

  getUnits() {
    return this.http.get(this.baseUrl + '/GetUnitlist?GroupId=' + this.groupId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + this.pageNo + '&OrderByExpression=' + this.orderByUnit)

  }

  getUnitsByPageNo(pg: any) {
    let orderBy = this.localStorage.retrieve('orderBy');
    if (orderBy == null) {
      orderBy = 'order by unitNo'
    }

    return this.http.get(this.baseUrl + '/GetUnitlist?GroupId=' + this.groupId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=' + orderBy)
  }

  getUnit(buyerID: any) {
    return this.http.get(this.baseUrl + '/GetUnit?BuyerId=' + buyerID)
  }

  getUnitbyOrder(sortOrder: any) {
    return this.http.get(this.baseUrl + '/GetUnitlist?GroupId=' + this.groupId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + this.pageNo + '&OrderByExpression=' + sortOrder)
  }

  getAllUnitsNo() {
    return this.http.get(this.baseUrl + '/GetUnits?LoginID=' + this.loginId)
  }

  getAllUnitsNoByProjectId(projId: any) {
    return this.http.get(this.baseUrl + '/GetUnits?ProjectID=' + projId + '&LoginID=' + this.loginId)
  }

  getUnitListByCompanyId(compId: any, pg: any) {
    return this.http.get(this.baseUrl + '/GetUnitlist?GroupId=' + this.groupId + '&CompanyId=' + compId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=' + this.orderByUnit)
  }

  getUnitListByCompanyIdAndLocationId(compId: any, locId: any, pg: any) {
    return this.http.get(this.baseUrl + '/GetUnitlist?GroupId=' + this.groupId + '&CompanyId=' + compId + '&LocationID=' + locId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=' + this.orderByUnit)
  }

  getUnitListByCompanyIdAndLocationIdAndProjectId(compId: any, locId: any, projId: any, pg: any) {
    return this.http.get(this.baseUrl + '/GetUnitlist?GroupId=' + this.groupId + '&CompanyId=' + compId + '&LocationID=' + locId + '&ProjectID=' + projId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=' + this.orderByUnit)
  }

  getUnitListByCompanyIdAndLocationIdAndProjectIdAndUnitNo(compId: any, locId: any, projId: any, unitNo: number, pg: any) {
    return this.http.get(this.baseUrl + '/GetUnitlist?GroupId=' + this.groupId + '&CompanyId=' + compId + '&LocationID=' + locId + '&ProjectID=' + projId + '&UnitID=' + unitNo + '&LoginID=' + this.loginId + '&PageSize=' + pg + '&PageNo=' + this.pageNo + '&OrderByExpression=' + this.orderByUnit)
  }

  getUnitListBySearchInputValue(searchText: string, pagenum: number) {
    return this.http.get(this.baseUrl + '/GetUnitlist?GroupId=' + this.groupId + '&LoginID=' + this.loginId + '&SearchText=' + searchText + '&searchBy=UnitNo&PageSize=' + this.pageSize + '&PageNo=' + pagenum + '&OrderByExpression=order%20by%20unitNo')
  }
}
