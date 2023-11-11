import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable()
export class ReceiptService {

  constructor(private localStorage: LocalStorageService, private config: DataService, private http: HttpClient) { }

  loginId = this.config.getLoginID();
  groupId = this.config.getGroupId();
  baseUrl = this.config.getBaseUrl();
  pageSize = this.config.getPageSize();
  pageNo = this.config.getBasePageNo();
  orderByReceiptDate = this.config.getDefaultOrderByReceiptDate();

  getReceiptList(buyerID: any) {
    return this.http.get(this.baseUrl + '/Receipt?GroupId=' + this.groupId + '&LoginID=' + this.loginId + '&UnitId=' + buyerID + '&PageSize=' + this.pageSize + '&PageNo=' + this.pageNo + '&OrderByExpression=' + this.orderByReceiptDate)
  }

  getAllReceipts() {
    return this.http.get(this.baseUrl + '/Receipt?GroupId=' + this.groupId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + this.pageNo + '&OrderByExpression=' + this.orderByReceiptDate)
  }

  getAllReceiptsByPageNo(pg: any) {
    let orderBy = this.localStorage.retrieve('orderBy');

    if (orderBy == null) {
      orderBy = 'order by receiptDate desc'
    }

    return this.http.get(this.baseUrl + '/Receipt?GroupId=' + this.groupId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pg + '&OrderByExpression=' + orderBy)
  }

  getReceiptsByCompanyId(compId: any, pageNum: number) {
    return this.http.get(this.baseUrl + '/Receipt?GroupId=' + this.groupId + '&CompanyId=' + compId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pageNum + '&OrderByExpression=' + this.orderByReceiptDate)
  }

  getReceiptsByCompanyIdAndLocationId(compId: any, locId: any, pageNum: number) {
    return this.http.get(this.baseUrl + '/Receipt?GroupId=' + this.groupId + '&CompanyId=' + compId + '&LocationID=' + locId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pageNum + '&OrderByExpression=' + this.orderByReceiptDate)
  }

  getReceiptsByCompanyIdAndLocationIdAndProjectId(compId: any, locId: any, projId: any, pageNum: number) {
    return this.http.get(this.baseUrl + '/Receipt?GroupId=' + this.groupId + '&CompanyId=' + compId + '&LocationID=' + locId + '&ProjectID=' + projId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + pageNum + '&OrderByExpression=' + this.orderByReceiptDate)
  }

  getReceiptsByCompanyIdAndLocationIdAndProjectIdAndUnitNo(compId: any, locId: any, projId: any, unitNo: number, pageNum: number) {
    return this.http.get(this.baseUrl + '/Receipt?GroupId=' + this.groupId + '&CompanyId=' + compId + '&LocationID=' + locId + '&ProjectID=' + projId + '&LoginID=' + this.loginId + '&UnitId=' + unitNo + '&PageSize=' + this.pageSize + '&PageNo=' + pageNum + '&OrderByExpression=' + this.orderByReceiptDate)
  }

  getReceiptsByOrder(sortOrder: any) {
    return this.http.get(this.baseUrl + '/Receipt?GroupId=' + this.groupId + '&LoginID=' + this.loginId + '&PageSize=' + this.pageSize + '&PageNo=' + this.pageNo + '&OrderByExpression=' + sortOrder)
  }
  getReceiptsByBuyerId(buyerID: any) {
    // return this.http.get(this.baseUrl + '/Receipt?BuyerId=' + buyerID + '&PageSize=' + this.pageSize + '&PageNo=' + this.pageNo + '&OrderByExpression=' + this.orderByReceiptDate)
    return this.http.get(this.baseUrl + '/Receipt?GroupId=' + this.groupId + '&LoginID=' + this.loginId + '&UnitId=' + buyerID + '&PageSize=' + this.pageSize + '&PageNo=' + this.pageNo + '&OrderByExpression=order by receiptNo');
  }
  getReceiptPrintDetail(receiptID: any) {
    return this.http.get(this.baseUrl + '/Receipt/Print/' + receiptID);
  }
}
