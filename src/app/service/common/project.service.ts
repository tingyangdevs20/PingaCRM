import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { LocalStorageService } from 'ngx-webstorage';
// import { SlimLoadingBarService } from 'ngx-slim-loading-bar';


@Injectable()
export class ProjectService {

  constructor(private localStorage: LocalStorageService, private config: DataService, private http: HttpClient/**service**/) { }

  loginId = this.config.getLoginID();
  baseUrl = this.config.getBaseUrl();
  pageSize = this.config.getPageSize();
  pageNo = this.config.getBasePageNo();
  groupId = this.config.getGroupId();
  orderByProjectName = this.config.getDefaultOrderByProjectName();

  getProjectsList(pg: any) {
    return this.http.get(this.baseUrl + '/ProjectList?GroupId=' + this.groupId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=' + this.orderByProjectName)
  }

  getProjectListByPageNo(pg: any) {
    let orderBy = this.localStorage.retrieve('orderBy');

    if (orderBy == null) {
      orderBy = 'order by projectName'
    }

    return this.http.get(this.baseUrl + '/ProjectList?GroupId=' + this.groupId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=' + this.orderByProjectName)
  }

  getProjectListByCompanyId(compId: any, pg: any) {
    return this.http.get(this.baseUrl + '/ProjectList?GroupId=' + this.groupId + '&CompanyId=' + compId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=' + this.orderByProjectName)
  }

  getProjectListByCompanyIdAndLocationId(compId: any, locId: any, pg: any) {
    return this.http.get(this.baseUrl + '/ProjectList?GroupId=' + this.groupId + '&CompanyId=' + compId + '&LocationId=' + locId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=' + this.orderByProjectName)
  }

  getProjectsByOrder(sortOrder: any) {
    return this.http.get(this.baseUrl + '/ProjectList?GroupId=' + this.groupId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + this.pageNo + '&OrderByExpression=' + sortOrder)
  }

  getProjectListByLocationId(locId: any) {
    return this.http.get(this.baseUrl + '/Projects/' + locId + '/' + this.loginId)
  }

  getAllProjectList() {
    return this.http.get(this.baseUrl + '/ProjectAll/' + this.loginId)
  }

  getDropDownProjectListByCompanyId(compIds: Array<any>) {
    return this.http.post(this.baseUrl + '/GetProjectsByCompanies/' + this.loginId, compIds)
  }

  getProjectListByLocationIdAndLoginId(locId: any, loginId: any) {
    return this.http.get(this.baseUrl + '/Projects/' + locId + '/' + loginId)
  }

  getProjectListBySearchInputValue(searchText: string, pageNum: number) {
    return this.http.get(this.baseUrl + '/ProjectList?GroupId=' + this.groupId + '&SearchText=' + searchText + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pageNum)
  }
}
