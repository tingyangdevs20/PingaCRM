import {
  Injectable
} from '@angular/core';

import {
  HttpClient, HttpHeaders
} from '@angular/common/http';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/filter';
import { Subject } from 'rxjs';
import {
  LocalStorageService
} from 'ngx-webstorage';
import { Observable, BehaviorSubject } from '../../../node_modules/rxjs';


@Injectable()
export class DataService {
  //  url = 'https://localhost:44308/api'
  //  url2 = 'https://localhost:44308'
  url = 'https://apidev.pingacrm.com/api'
  url2 = 'https://apidev.pingacrm.com/'

  paytmUrl = 'https://securegw-stage.paytm.in/theia/processTransaction';
  paytmDevUrl = 'https://securegw.paytm.in/theia/processTransaction';
  hdfcUrl = 'https://test.payu.in/_payment';
  hdfcDevUrl = 'https://secure.payu.in/_payment';
  projectId = 1;
  loginId: any;
  pageSize = 10;
  pageNo = 1;
  orderByUnit = 'order by unitNo';
  orderByInvoiceDate = 'order by invoiceDate Desc';
  orderByReceiptDate = 'order by receiptDate Desc';
  orderByFirstName = 'order by firstname';
  orderByCompanyName = 'order by companyname';
  orderByProjectName = 'order by projectName';
  orderByBuyerName = 'order by buyerName';
  orderByOrderId = 'order by pl.created_on desc'
  groupId: any;
  LocationId = 1;

  checkStatus = new Subject<boolean>();
  // cBuyerId = new Subject<number>();
  cBuyerId = new BehaviorSubject<number>(0);
  searchResponse = new Subject<any>();
  searchInputValue = new Subject<any>();

  constructor(private http: HttpClient, private localStorage: LocalStorageService) { }

  getBaseUrl() {
    return this.url;
  }

  getBaseUrl2() {
    return this.url2;
  }

  getPageSize() {
    return this.pageSize;
  }

  getBasePageNo() {
    return this.pageNo;
  }

  setLoginID() {
    this.loginId = this.localStorage.retrieve('loginId');
  }

  getLoginID() {
    this.setLoginID()
    return this.loginId;
  }

  retrieveGroupId() {
    let basePath = this.localStorage.retrieve('baseLocation');
    return this.http.get(this.url + '/Groups?url=' + basePath)
  }

  setGroupId() {
    this.groupId = this.localStorage.retrieve('groupId');
  }

  getGroupId() {
    this.setGroupId();
    return this.groupId
  }

  getProjectId() {
    return this.projectId;
  }

  getDefaultOrderByUnit() {
    return this.orderByUnit;
  }

  getDefaultOrderByInvoiceDate() {
    return this.orderByInvoiceDate;
  }

  getDefaultOrderByReceiptDate() {
    return this.orderByReceiptDate;
  }

  getDefaultOrderByCompanyName() {
    return this.orderByCompanyName;
  }

  getDefaultOrderByProjectName() {
    return this.orderByProjectName;
  }

  getDefaultOrderByFirstName() {
    return this.orderByFirstName;
  }

  getDefaultOrderByBuyerName() {
    return this.orderByBuyerName;
  }
  getDefaultOrderByOrderId() {
    return this.orderByOrderId;
  }

  getMenuId(loginid: any) {

    return this.http.get(this.url + '/Menus?LoginID=' + loginid)
  }

  getMenuItems() {

    return this.http.get(this.url + '/Menus?LoginID=' + this.loginId)
  }

  getSearchId() {
    console.log(this.loginId, "this.loginId1")
    return this.http.get(this.url2 + '/EnableSearchBoxForDashboard/' + this.loginId)
  }

  getSearchResult(criteria: any, searchText: any) {
    if (criteria == 'Company Name') {
      return this.http.get(this.url + '/GetcompanyList?GroupID=' + this.getGroupId() + '&LoginID=' + this.getLoginID() + '&SearchText=' + searchText + '&PageSize=' + this.pageSize + '&PageNo=' + this.pageNo)
    }

    else if (criteria == 'Project Name') {
      return this.http.get(this.url + '/ProjectList?GroupId=' + this.getGroupId() + '&SearchText=' + searchText + '&LoginID=' + this.getLoginID() + '&PageSize=' + this.pageSize + '&PageNo=' + this.pageNo)
    }

    else if (criteria == 'Unit') {
      return this.http.get(this.url + '/GetUnitlist?GroupId=' + this.getGroupId() + '&LoginID=' + this.getLoginID() + '&SearchText=' + searchText + '&searchBy=UnitNo&PageSize=' + this.pageSize + '&PageNo=' + this.pageNo)
    }

    else if (criteria == 'Application') {
      return this.http.get(this.url + '/GetUnitlist?GroupId=' + this.getGroupId() + '&LoginID=' + this.getLoginID() + '&SearchText=' + searchText + '&searchBy=AppNo&PageSize=' + this.pageSize + '&PageNo=' + this.pageNo)
    }
    // if (criteria == 'Applicant Name')
    else {
      return this.http.get(this.url + '/GetBuyersDetailList?GroupID=' + this.getGroupId() + '&LoginID=' + this.getLoginID() + '&SearchText=' + searchText + '&PageSize=' + this.pageSize + '&PageNo=' + this.pageNo)
    }
  }

  getMyAccountInformation() {
    this.getLoginID();
    return this.http.get(this.url + '/MyAccount?loginid=' + this.loginId)
  }

  getRoles(id: any) {
    return this.http.get(this.url + '/GetRoles?RoleID=' + id)
  }

  getpaymentDirctionRoles(projectid: any, selectPaymentMode: any) {
    this.getGroupId();
    return this.http.get(this.url + '/GetPaymentGatewayRedirect?GroupID=' + this.groupId + '&projectid=' + projectid + '&paymentgateway=' + selectPaymentMode)
  }

  getBlinkCheckOut(projectid: any) {
    this.getGroupId();
    return this.http.get(this.url + '/GetBlinkCheckout?GroupID=' + this.groupId + '&projectid=' + projectid)
  }

  forgotPassword(groupId: any, userName: string) {
    return this.http.put(this.url2 + '/ForgotPassword/' + groupId + '/' + userName + '', {})
  }

  createPayment(user: any) {
    const formData = new FormData();

    formData.set('GroupId', user.groupID)
    formData.set('MobileNumber', user.mobile)
    formData.set('Email', user.email)
    formData.set('Amount', user.amount)
    formData.set('BuyerId', user.buyerId)
    formData.set('ApploginId', user.loginId)
    formData.set('PayOnline', 'true')
    formData.set('PaymentGateWay', 'PayTm')
    formData.set('ModuleName', 'LM')
    formData.set('CallbackURL', user.callback)
    formData.set('UniquePoint', user.UniquePoint)


    return this.http.post(this.url + '/CreatePayment', formData)
  }

  createBlinkPayment(user: any) {
    const formData = new FormData();

    formData.set('GroupId', user.groupID)
    formData.set('MobileNumber', user.mobile)
    formData.set('Email', user.email)
    formData.set('Amount', user.amount)
    formData.set('BuyerId', user.buyerId)
    formData.set('ApploginId', user.loginId)
    formData.set('PayOnline', 'true')
    formData.set('PaymentGateWay', 'PayTm')
    formData.set('ModuleName', 'LM')
    formData.set('CallbackURL', user.callback)
    formData.set('UniquePoint', user.UniquePoint)


    return this.http.post(this.url + '/CreateBlinkPayment', formData)
  }

  processPayment(user: any) {
    const formData = new FormData();

    formData.set('GroupId', user.groupID)
    formData.set('MobileNumber', user.mobile)
    formData.set('Email', user.email)
    if (user.amount) {
      formData.set('Amount', user.amount)
    }

    formData.set('BuyerId', user.buyerId)
    formData.set('ApploginId', user.loginId)
    formData.set('PayOnline', 'true')
    formData.set('PaymentGateWay', 'PayTm')
    formData.set('ModuleName', 'LM')
    formData.set('CallbackURL', user.callback)
    formData.set('UniquePoint', user.UniquePoint)
    if (user.paymnetmode) {
      formData.set('PaymentMode', user.paymnetmode)
    }
    if (user.bankname) {
      formData.set('BankName', user.bankname)
    }
    if (user.branchname) {
      formData.set('BranchName', user.branchname)
    }
    if (user.instrumentno) {
      formData.set('InstrumentNo', user.instrumentno)
    }
    if (user.instrumentdate) {
      formData.set('InstrumentDate', user.instrumentdate)
    }
    if (user.cardissuer) {
      formData.set('CardIssuer', user.cardissuer)
    }
    if (user.cardtype) {
      formData.set('CardType', user.cardtype)
    }
    if (user.cardnumber) {
      formData.set('CardNo', user.cardnumber)
    }



    return this.http.post(this.url + '/ProcessPayment', formData)
  }


  hdfcCreatePayment(user: any) {
    const formData = new FormData();

    formData.set('GroupId', user.groupID)
    formData.set('MobileNumber', user.mobile)
    formData.set('Email', user.email)
    if (user.amount) {
      formData.set('Amount', user.amount)
    }

    formData.set('BuyerId', user.buyerId)
    formData.set('ApploginId', user.loginId)
    formData.set('PayOnline', 'true')
    formData.set('PaymentGateWay', user.PaymentGateWay)
    formData.set('ModuleName', 'LM')
    formData.set('CallbackURL', user.callback)
    formData.set('UniquePoint', user.UniquePoint)
    if (user.paymnetmode) {
      formData.set('PaymentMode', user.paymnetmode)
    }
    if (user.bankname) {
      formData.set('BankName', user.bankname)
    }
    if (user.branchname) {
      formData.set('BranchName', user.branchname)
    }
    if (user.instrumentno) {
      formData.set('InstrumentNo', user.instrumentno)
    }
    if (user.instrumentdate) {
      formData.set('InstrumentDate', user.instrumentdate)
    }
    if (user.cardissuer) {
      formData.set('CardIssuer', user.cardissuer)
    }
    if (user.cardtype) {
      formData.set('CardType', user.cardtype)
    }
    if (user.cardnumber) {
      formData.set('CardNo', user.cardnumber)
    }



    return this.http.post(this.url + '/CreatePaymentHDFC', formData)
  }

  setChecked(status: any) {
    this.checkStatus.next(status);
  }

  setCbuyerId(id: any) {

    this.cBuyerId.next(id);
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  getLocationList() {
    this.getGroupId();
    this.getLoginID();
    return this.http.get(this.url + '/Location?GroupID=' + this.groupId + '&LoginID=' + this.loginId);
  }

  getLocationListByCompany(id: any) {
    this.getGroupId();
    this.getLoginID();
    return this.http.get(this.url + '/Location?GroupID=' + this.groupId + '&CompanyID=' + id + '&LoginID=' + this.loginId)
  }

  statustList: any = [
    {
      id: 'User Type',
      text: 'User Type'
    },
    {
      id: '0',
      text: 'InActive'
    },
    {
      id: '1',
      text: 'Active'
    }
  ];

  getStatusList() {
    return this.statustList;
  }

  paymentModeList: any = [

    {
      id: 1,
      text: 'Online Payment - Paytm'
    },
    {
      id: 2,
      text: 'Online Payment - HDFC'
    },
    {
      id: 3,
      text: 'Cash'
    },
    {
      id: 4,
      text: 'Cheque'
    },
    {
      id: 5,
      text: 'Demand Draft'
    },
    {
      id: 6,
      text: 'Offline Credit/Debit Card'
    },
    {
      id: 7,
      text: 'Offline RTGS'
    },
    {
      id: 8,
      text: 'Offline NEFT'
    },
    {
      id: 9,
      text: 'Online Payment - PayU'
    }
  ];

  getPaymentModeList() {
    return this.paymentModeList;
  }

  cardTypeList: any = [
    {
      id: 1,
      text: 'Visa'
    },
    {
      id: 2,
      text: 'Master'
    },
    {
      id: 3,
      text: 'Amex'
    },
    {
      id: 4,
      text: 'Rupay'
    },
    {
      id: 5,
      text: 'Discover'
    },
    {
      id: 6,
      text: 'Other'
    }
  ];

  getCardTypesList() {
    return this.cardTypeList;
  }

  activateUser(appLoginId: any) {
    let moduleName = 'CustomerLogin';
    return this.http.put(this.url + '/ActivateUser/' + this.loginId + '?ModuleName=' + moduleName, [appLoginId])
  }

  deactivateUser(appLoginId: any) {
    let moduleName = 'CustomerLogin';
    return this.http.put(this.url + '/DeactivateUser/' + this.loginId + '?ModuleName=' + moduleName, [appLoginId])
  }

  resetPassword(appLoginId: any) {
    return this.http.put(this.url2 + '/ResetPassword/' + this.getGroupId() + '/' + this.getLoginID(), appLoginId)
  }

  changePassword(groupId: any, appLoginId: any, username: any, existingPassword: any, newPassword: any, confirmNewPassword: any, source: any) {
    let ePassword = existingPassword;
    let nPassword = newPassword;
    let cNewPassword = confirmNewPassword
    let gId = groupId
    let src = source;
    let aLoginId = appLoginId
    let usrname = username

    let obj = {
      "groupID": gId,
      "appLoginID": aLoginId,
      "userName": usrname,
      "existingPwd": ePassword,
      "newPwd": nPassword,
      "source": src
    }

    return this.http.put(this.url2 + '/ChangePassword', obj)
  }



  ///////////////////////////////////////
  formatedDate(selecteDate: any) {
    var dd = selecteDate.getDate();
    var mm = selecteDate.getMonth() + 1;
    var yyyy = selecteDate.getFullYear();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return yyyy + '-' + mm + '-' + dd;
  }

  /////////////////////////////////////////////
}
