import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { LocalStorageService } from 'ngx-webstorage';
@Injectable()

export class TransactionService {


  constructor(
    private config: DataService,
    private http: HttpClient
  ) { }

  loginId = this.config.getLoginID();
  groupId = this.config.getGroupId();
  baseUrl = this.config.getBaseUrl();


  getAllTransaction(companyId: any, locationId: any, projectId: any, buyerId: any, fromdate: Date, todate: Date, pageSize: number, pageNo: number, sortBy: any) {
    let url = this.baseUrl + '/Transaction/Report/' + this.groupId + '/' + this.loginId;
    if (companyId > 0) {
      url += "?CompanyID=" + companyId;
    }
    if (locationId > 0) {
      url += "&LocationID=" + locationId;
    }
    if (projectId > 0) {
      url += "&ProjectID=" + projectId;
    }
    if (buyerId > 0 && projectId > 0) {
      url += "&BuyerID=" + buyerId;
    }
    else if (buyerId > 0) {
      url += "?BuyerID=" + buyerId;

    }
    if (fromdate != undefined && companyId > 0) {
      url += '&FromDate=' + fromdate + '&ToDate=' + todate;
    }
    else if (fromdate != undefined && buyerId > 0) {
      url += '&FromDate=' + fromdate + '&ToDate=' + todate;
    }
    else if (fromdate != undefined) {
      url += '?FromDate=' + fromdate + '&ToDate=' + todate;
    }

    if (fromdate != undefined || companyId > 0 || locationId > 0 || projectId > 0 || buyerId > 0) {
      url += '&PageSize=' + pageSize + '&PageNo=' + pageNo + '&OrderByExpression=' + sortBy;
    }
    else {
      url += '?PageSize=' + pageSize + '&PageNo=' + pageNo + '&OrderByExpression=' + sortBy;

    }

    return this.http.get(url)
  }


}
