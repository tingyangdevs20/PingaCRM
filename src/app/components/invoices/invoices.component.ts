import {
  Component,
  OnInit,
  TemplateRef,
  ApplicationRef,
  Inject,
  ɵConsole,
  ViewChild,
  Input
} from '@angular/core';
import { DataService } from '../../service/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';
// import { Select2OptionData } from 'ng2-select2';
import { InvoiceService } from '../../service/common/invoice.service';
import { UnitService } from '../../service/common/unit.service';
import { CompanyService } from '../../service/common/company.service';
import { ProjectService } from '../../service/common/project.service';
import { DOCUMENT, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { InvoiceComponent } from '../invoice/invoice.component';
// import { SlimLoadingBarService } from 'ngx-slim-loading-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
// import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { NgxDropdownConfig } from 'ngx-select-dropdown';

declare global {
  interface Window { Paytm: any; }
}

interface unitListItem {
  [x: string]: any;
  id: number;
  text: string;
}
interface BankNameList1Item {
  id: number;
  text: string;
}
interface sortobjItem {
  [key: string]: Boolean;

}
interface paymentTypesItem {
  id: number;
  text: string;
}
interface cListItem {
  id: number;
  text: string;
}
interface cLocationItem {
  id: number;
  text: string;
}
interface allProjectListItem {
  id: number;
  text: string;
}
interface MeterUniqListItem {
  id: number;
  text: string;
}

interface CustomDropdownConfig extends NgxDropdownConfig {
  displayKey: string;
  search: boolean;
  selectAllLabel: string;
}

@Component({
  selector: 'pa-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})



export class InvoicesComponent implements OnInit {
  
  @ViewChild('payNow') public templateref: TemplateRef<any> | undefined;
  @Input() invoice: any;
  invoices: any;
  allUnitNo: any;
  count: any;
  sortobj: sortobjItem = {
    sortBy: false
  }
  invoiceNo: boolean = false;
  invoiceDate: boolean = false;
  installDate: boolean = false;
  due: boolean = false;
  tax: boolean = false;
  netDue: boolean = false;
  recivedAmount: boolean = false;
  status: boolean = false;
  unitList: unitListItem[] = [];
  MeterUniqList: MeterUniqListItem[] = [];
  list: any;
  cList: cListItem[] = [];
  cLocation: cLocationItem[] = [];
  prepayPayment: any;
  paymentAgainstBill: any;
  startValue1: any;

  configSel : CustomDropdownConfig = {
    // displayFn:(item: any) => { return item.hello.world; } //to support flexible text displaying for each item
    displayKey: "text",
    search: true,
    selectAllLabel: 'Select all',
    height: '',
    placeholder: '',
    customComparator: function (a: any, b: any): number {
      return 0;
    },
    limitTo: 0,
    moreText: '',
    noResultsFound: '',
    searchPlaceholder: '',
    searchOnKey: '',
    clearOnSelection: false,
    inputDirection: ''
  }

  public meterNoList: any[] = [];
  public unitNoList: any[] = [];
  public unitNoList2: any[] = [];
  public unitNoList3: any[] = [];
  public companyList: any[] = [];
  public locationList: any[] = [];
  public projectList: any[] = [];
  public startValue: any;
  public allProjects: allProjectListItem[] = [];
  public selected: any;
  buyerId: any;
  filterData: any;
  fromDate: any;
  toDate: any;
  selectedDropDown: any;
  public modalRef: BsModalRef | undefined;
  invoiceAmt: any;
  redirectUrl: any;
  yes: any;
  enablePrepay: any;
  paymentMod: any;
  loginUserRole: any;
  locId: any;
  projId: any;
  compLocId: any;
  bindCompany = true;
  paytmURL: any;
  payBtnCheck: any;
  rd1value: any;
  paymentCheck: any;
  PaymentAgainstCheck: number | undefined;
  PrepayMeterCheck: number | undefined;
  buyerIdforMeter: any;
  meterList: any;
  meterValue: boolean = false;
  uniqPoint: any;
  meterEnableCheck: boolean = false;
  payAgainstCheck: any;
  prepayForMeterNo: boolean = false;
  amountCheck: boolean = false;
  unitNumberCheck: any;
  amntValue: any;
  amt: any;
  amtValue: any;
  amount: string = "";
  allProjectList: allProjectListItem[] = [];
  isPaymentCinfigure: any;
  unitCheck: any;
  currentProjectId: number | undefined;
  paymentTypes: paymentTypesItem[] = [];
  BankNameList: BankNameList1Item[] = [];
  cardTypes : Array<any> = [];
  charge: any;
  isChaque: boolean = false;
  isdemandDreft: boolean = false;
  isReview: boolean = false;
  paymentForm!: FormGroup<any>;
  isOffline: boolean = false;
  selectPaymentModeId: number | undefined;
  selectedPaymentMode: string | undefined;
  selectedBank: any;
  selectedCardType: string | undefined;
  BankNameList1: BankNameList1Item[] = [];
  isProject: boolean = false;
  isUnit: boolean = false;
  bindVar = 'fadeOut';
  emailStatus: any;
  classStatus: string | undefined;
  newDate: any;
  isDisable: boolean = true;
  isBank: boolean = false;
  isInstrumentNo: boolean = false;
  isBranch: boolean = false;
  isPrepay: boolean = false;
  blinkCheckoutFlag: number | undefined;
  isPaytmFlag: boolean = false;
  isHdfcFlag: boolean = false;
  isBothpaymentFlag: boolean = false;
  isNothingpayment: boolean = false;
  installId: number | undefined;
  minimumPaymentAmount: number = 0;
  ValidationMsg: string | undefined;


  constructor(private toastr: ToastrService, private ngxService: NgxUiLoaderService, private datePipe: DatePipe, private formbuilder: FormBuilder, private dataService: DataService, private modalService: BsModalService, private localStorage: LocalStorageService, private unitService: UnitService, private invoiceService: InvoiceService, private companyService: CompanyService, private projectService: ProjectService, private activatedRoute: ActivatedRoute, private appRef: ApplicationRef, private router: Router, @Inject(DOCUMENT) document: any) {

  }

  ngOnInit() {
    // this.paytmURL = this.dataService.paytmUrl;
    this.ngxService.start();
    setTimeout(() => {
      this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
    }, 5000);
    this.formValidate();

    this.cardTypes = this.dataService.getCardTypesList();
    this.localStorage.clear('orderBy');
    this.loginUserRole = this.localStorage.retrieve('role');
    if (this.loginUserRole == 'Buyer') {
      debugger
      this.paymentTypes = []
      this.paymentTypes = this.dataService.getPaymentModeList();
      this.paymentTypes = [this.paymentTypes[0]];
      this.unitService.getAllUnitsNo().subscribe(
        (data) => {
          this.list = data;
          this.list.unshift({
            'key': '0',
            'value': 'Select Unit'
          });
          this.list.filter(
            (item: any) => {
              let obj = {
                id: item.key,
                text: item.value
              }
              this.unitList.push(obj);
            }

          )

          this.unitNoList2 = this.unitList;
          this.startValue = this.localStorage.retrieve('selectedbuyerID');
        }
      )

    }

    this.yes = true;
    window.onload = () => {
      this.resetFromSearch();
    }

    let role = this.localStorage.retrieve('role');
    if (role == 'Client Admin') {
      // this.dropdownInit()
    }

    this.invoiceInit();
    //this.getMetersValues()  
    if (this.loginUserRole == 'Buyer') {

      this.activatedRoute.queryParams.subscribe(params => {
        let p = params['Payment'];
        if (p == 'Q') {
          this.amountCheck = true;
          this.amount = params['Amount'];
          this.openPay(<any>this.templateref);
        }
      });
    }
  }

  onPaymentSelect(e: any) {
    debugger
    this.selectedPaymentMode = e.value.text;
    localStorage.setItem('selectPaymentMode', e.value.text)
    this.setValidations();
    this.selectPaymentModeId = e.value.id;    
    if (e.value.id == '4' || e.value.id == '5' || e.value.id == '7' || e.value.id == '8') {
      // this.isProject = false;
      // this.isUnit = false;
      // this.amountCheck = false;
      this.isChaque = true;
      this.isdemandDreft = true;
      this.isOffline = false;
      // this.banklistName();
      this.BankNameList = [];
      this.invoiceService.getBankNameList().subscribe((resp) => {
        this.list = resp;
        this.list.unshift({
          'key': '0',
          'value': 'Select BankName'
        });
        this.list.filter(
          (item: any) => {
            let obj = {
              id: item.key,
              text: item.value
            }
            this.BankNameList1.push(obj);
          }

        )
        this.BankNameList = this.BankNameList1;
      })
    }
    else if (e.value.id == '6') {
      // this.isProject = true;
      // this.isUnit = true;
      // this.amountCheck = true;
      this.isOffline = true;
      this.isChaque = false;
      this.isdemandDreft = false;
      if ((<any>this.paymentForm).get('amount').value) {
        this.amountCheck = true;
      } else {
        this.amountCheck = false;
      }
    }
    else {
      this.isChaque = false;
      this.isdemandDreft = false;
      this.isOffline = false;
    }
  }

  setBranchName(e: any) {
    if (e.target.value) {
      this.isBranch = true;
      this.setValidations();
    } else {
      this.isBranch = false;
      this.setValidations();
    }
  }

  setInstrumentNo(e: any) {
    if (e.target.value) {
      this.isInstrumentNo = true;
      this.setValidations();
    } else {
      this.isInstrumentNo = false;
      this.setValidations();
    }
  }

  onBankSelect(e: any) {    
    if (e.value.id > '0') {
      this.selectedBank = e.value.text;
      this.isBank = true;
      this.setValidations();
    } else {
      this.isBank = false;
      this.setValidations();
    }
  }

  onCardTypeSelect(e: any) {
    this.selectedCardType = e.data[0].text;
  }

  reviewForm() {
    let amnt = Number(this.amount);
    if (this.minimumPaymentAmount > 0 && amnt < this.minimumPaymentAmount) {
      this.ValidationMsg = "The minimum payment amount is " + this.minimumPaymentAmount;
      return false;
    }
    if (amnt <= 0) {
      this.ValidationMsg = "Please enter an amount greater than 0";
      return false;
    }
    this.ValidationMsg = "";
    this.isReview = true;
    return undefined;
  }

  previousForm() {
    this.isReview = false;
  }

  setValidations() {
    console.log(this.isProject, this.isUnit, this.amountCheck, "val")
    if (this.selectedPaymentMode == 'Online Payment - PayU' || this.selectedPaymentMode == 'Online Payment - Paytm' || this.selectedPaymentMode == 'Online Payment - HDFC' || this.selectedPaymentMode == 'Cash') {
      if (this.isProject && this.isUnit && this.amountCheck && this.isPrepay) {
        this.isDisable = false;
      } else {
        this.isDisable = true;
      }
    } else if (this.selectedPaymentMode == 'Cheque' || this.selectedPaymentMode == 'Demand Draft'
      || this.selectedPaymentMode == 'Offline RTGS' || this.selectedPaymentMode == 'Offline NEFT') {
      if (this.isProject && this.isUnit && this.amountCheck && this.isBank && this.isInstrumentNo && this.isBranch && this.isPrepay) {
        this.isDisable = false;
      } else {
        this.isDisable = true;
      }
    } else if (this.selectedPaymentMode == 'Offline Credit/Debit Card') {
      if (this.isProject && this.isUnit && this.amountCheck && this.isPrepay) {
        this.isDisable = false;
      } else {
        this.isDisable = true;
      }
    }
  }

  // banklistName() {
  //   this.invoiceService.getBankNameList().subscribe((resp) => {
  //     this.list = resp;
  //     this.list.unshift({
  //       'key': '0',
  //       'value': 'Select BankName'
  //     });
  //     this.list.filter(
  //       (item) => {
  //         let obj = {
  //           id: item.key,
  //           text: item.value
  //         }
  //         this.BankNameList.push(obj);
  //       }

  //     )
  //     this.BankNameList = this.BankNameList;
  //   })
  // }

  paymentConfigure() {
    this.invoiceService.paymentGatewayConfig().subscribe(
      (data) => {
        this.payBtnCheck = data
        this.localStorage.store('paymentGatewayCheck', this.payBtnCheck);
      })
  }

  onSelectProjectPaymentConfigure(projectid: any) {
    this.invoiceService.onSelectPrjctpaymentGatewayConfig(projectid).subscribe(
      (data) => {
        this.unitList = []
        this.isPaymentCinfigure = data
        this.unitCheck = data
        this.paymentMod = null

        if (this.isPaymentCinfigure == 1) {

          this.unitService.getAllUnitsNoByProjectId(projectid).subscribe(
            (data) => {
              this.list = data;
              this.list.unshift({
                'key': '0',
                'value': 'Select One'
              });
              this.list.filter(
                (item: any) => {
                  let obj = {
                    id: item.key,
                    text: item.value
                  }
                  this.unitList.push(obj);
                }
              )


              if (this.unitList.length === 2) {
                this.unitList.splice(0, 1);
                this.unitNoList2 = this.unitList;
              } else {
                this.unitNoList2 = this.unitList;
              }
              this.startValue = this.localStorage.retrieve('selectedbuyerID');
            }

          );
        }
      })
  }

  OnlinePaymentType(projectid: any) {
    this.invoiceService.getOnlinepaymenttype(projectid).subscribe((resp: any) => {

      if (this.loginUserRole == 'Buyer') {
        this.isHdfcFlag = false;
        this.isPaytmFlag = false;
        this.isBothpaymentFlag = false;
        this.paymentTypes = [];
        for (let k = 0; k < Object.keys(resp).length; k++) {
          if (resp[k].key === "Paytm" || resp[k].key === "PayTm") {
            let obj = {
              id: 1,
              text: 'Online Payment - Paytm'
            }
            this.paymentTypes.push(obj);
          }
          if (resp[k].key === "HDFC") {
            let obj = {
              id: 2,
              text: 'Online Payment - HDFC'
            }
            this.paymentTypes.push(obj);
          }
          if (resp[k].key === "PayU") {
            let obj = {
              id: 9,
              text: 'Online Payment - PayU'
            }
            this.paymentTypes.push(obj);
          }
        };
      } else {
        this.paymentTypes = [
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
          }
        ];
        for (let k = 0; k < Object.keys(resp).length; k++) {
          if (resp[k].key === "Paytm" || resp[k].key === "PayTm") {
            let obj = {
              id: 1,
              text: 'Online Payment - Paytm'
            }
            this.paymentTypes.push(obj);
          }
          if (resp[k].key === "HDFC") {
            let obj = {
              id: 2,
              text: 'Online Payment - HDFC'
            }
            this.paymentTypes.push(obj);
          }
          if (resp[k].key === "PayU") {
            let obj = {
              id: 9,
              text: 'Online Payment - PayU'
            }
            this.paymentTypes.push(obj);
          }
        };
      }

      this.selectPaymentModeId = this.paymentTypes[0].id;
      this.selectedPaymentMode = this.paymentTypes[0].text;
      //   console.log("respqw11", resp, Object.keys(resp).length);
      //   // get object count
      //   setTimeout(() => {
      //     if (Object.keys(resp).length === 0) {
      //       this.loginUserRole = this.localStorage.retrieve('role');
      //       if (this.loginUserRole == 'Buyer') {
      //         this.isHdfcFlag = false;
      //         this.isPaytmFlag = false;
      //         this.isBothpaymentFlag = false;
      //         this.paymentTypes = [];
      //       } else {
      //         this.isHdfcFlag = false;
      //         this.isPaytmFlag = false;
      //         this.isBothpaymentFlag = false;
      //         this.paymentTypes = [
      //           {
      //             id: 3,
      //             text: 'Cash'
      //           },
      //           {
      //             id: 4,
      //             text: 'Cheque'
      //           },
      //           {
      //             id: 5,
      //             text: 'Demand Draft'
      //           },
      //           {
      //             id: 6,
      //             text: 'Offline Credit/Debit Card'
      //           }
      //         ];
      //       }

      //     } else if (resp[0].key === 'PayTm' && Object.keys(resp).length === 1) {
      //       console.log('paytm')
      //       this.loginUserRole = this.localStorage.retrieve('role');
      //       if (this.loginUserRole == 'Buyer') {
      //         console.log('patmbuyer')
      //         this.isPaytmFlag = true;
      //         this.isHdfcFlag = false;
      //         this.isBothpaymentFlag = false;
      //         this.isNothingpayment = false;
      //         this.paymentTypes = this.dataService.getPaymentModeList();
      //         this.paymentTypes = [this.paymentTypes[0]];
      //       } else {
      //         this.isPaytmFlag = true;
      //         this.isHdfcFlag = false;
      //         this.isBothpaymentFlag = false;
      //         this.isNothingpayment = false;
      //         this.paymentTypes = this.dataService.getPaymentModeList();
      //         for (let i = 0; i < this.paymentTypes.length; i++) {
      //           if (this.paymentTypes[i].id === 2) {
      //             const index = this.paymentTypes.indexOf(this.paymentTypes[i]);
      //             this.paymentTypes.splice(index, 1);
      //           }
      //         }
      //       }
      //     } else if (resp[0].key === 'HDFC' || resp[0].key === 'PayU' && Object.keys(resp).length === 1) {
      //       console.log(resp[0].key)
      //       this.loginUserRole = this.localStorage.retrieve('role');
      //       if (this.loginUserRole == 'Buyer') {
      //         this.paymentTypes = this.dataService.getPaymentModeList();
      //         this.paymentTypes = [this.paymentTypes[1]];
      //         this.isHdfcFlag = true;
      //         this.isPaytmFlag = false;
      //         this.isBothpaymentFlag = false;
      //         this.isNothingpayment = false;
      //       } else {
      //         this.isHdfcFlag = true;
      //         this.isPaytmFlag = false;
      //         this.isBothpaymentFlag = false;
      //         this.isNothingpayment = false;
      //         this.paymentTypes = this.dataService.getPaymentModeList();
      //         for (let i = 0; i < this.paymentTypes.length; i++) {
      //           if (this.paymentTypes[i].id === 1) {
      //             const index = this.paymentTypes.indexOf(this.paymentTypes[i]);
      //             this.paymentTypes.splice(index, 1);
      //           }
      //         }
      //       }
      //     } else if (Object.keys(resp).length === 2) {
      //       this.loginUserRole = this.localStorage.retrieve('role');
      //       if (this.loginUserRole == 'Buyer') {
      //         this.isHdfcFlag = false;
      //         this.isPaytmFlag = false;
      //         this.isNothingpayment = false;
      //         this.isBothpaymentFlag = true;
      //         this.paymentTypes = [

      //           {
      //             id: 1,
      //             text: 'Online Payment - Paytm'
      //           },
      //           {
      //             id: 2,
      //             text: 'Online Payment - HDFC'
      //           },
      //           {
      //             id: 9,
      //             text: 'Online Payment - PayU'
      //           },
      //         ];
      //       } else {
      //         console.log('both')
      //         this.paymentTypes = [

      //           {
      //             id: 1,
      //             text: 'Online Payment - Paytm'
      //           },
      //           {
      //             id: 2,
      //             text: 'Online Payment - HDFC'
      //           },
      //           {
      //             id: 3,
      //             text: 'Cash'
      //           },
      //           {
      //             id: 4,
      //             text: 'Cheque'
      //           },
      //           {
      //             id: 5,
      //             text: 'Demand Draft'
      //           },
      //           {
      //             id: 6,
      //             text: 'Offline Credit/Debit Card'
      //           },
      //           {
      //             id: 7,
      //             text: 'Offline RTGS'
      //           },
      //           {
      //             id: 8,
      //             text: 'Offline NEFT'
      //           },
      //           {
      //             id: 9,
      //             text: 'Online Payment - PayU'
      //           },
      //         ];
      //         console.log(this.paymentTypes, '2', this.dataService.getPaymentModeList())
      //         this.isHdfcFlag = false;
      //         this.isPaytmFlag = false;
      //         this.isNothingpayment = false;
      //         this.isBothpaymentFlag = true;
      //       }
      //     }

      //   }, 1000);
    });
  }

  onProjectSelect2(e: any) {
    this.unitNoList2 = []
    this.unitList = []
    this.currentProjectId = undefined;
    if (e.value.id > 0) {
      this.isProject = true;
      this.setValidations();
      if (this.loginUserRole !== 'Buyer') {
        this.paymentTypes = [];
      }
      this.OnlinePaymentType(e.value.id);
      this.onSelectProjectPaymentConfigure(e.value.id);
      this.currentProjectId = e.value.id;
    }
    else {
      this.unitCheck = e.value.id;
      this.isProject = false;
      this.setValidations();
    }

  }

  resetFromSearch() {
    this.localStorage.store('fromSearch', 0);
    this.localStorage.store('fromProject', 0);
    this.localStorage.store('fromCompany', 0);
    this.invoiceInit();
  }

  public invoiceInit() {
    this.redirectUrl = document.location.href;
    let fromProject = this.localStorage.retrieve('fromProject');
    let fromCompany = this.localStorage.retrieve('fromCompany');
    this.localStorage.store('orderBy', null);
    this.localStorage.store('selectedbuyerID', 0)

    // $(".sortable").click((index: any) => {
    //   $(".ngx_pagination .pagination .page-item:nth-child(1) .page-link").trigger("click");
    //   $(".sortable").removeClass('activeSort');
    //   $(this).addClass('activeSort');
    //   if ($(this).hasClass('ascOrder')) {
    //     $(this).removeClass('ascOrder').addClass('descOrder');
    //   } else {
    //     $(this).removeClass('descOrder').addClass('ascOrder');
    //   }
    // });

    if (fromCompany == 1) {

      this.activatedRoute.params.subscribe(
        (resp: any) => {
          this.compLocId = resp.complocId;
          this.dropdownInit(true);    //change
        }
      )
    } else if (fromProject == 1) {
      this.activatedRoute.params.subscribe(
        (resp: any) => {
          this.compLocId = resp.complocId;
          this.locId = resp.locId;
          this.projId = resp.projId;
          this.dropdownInit(true);
        }
      )
      this.setPageDataByProject(this.compLocId, this.locId, this.projId, 1)
    } else {
      this.dropdownInit(false);
      this.setInitPageData(1);
      //change
    }

    // this.setInitPageData(1)
  }

  public dropdownInit(setDropdownValue: boolean) {
    this.companyService.getCompanyList().subscribe(
      (data) => {
        this.list = data;
        this.list.unshift({
          'key': 0,
          'value': 'Company'
        })

        this.list.filter(
          (comp: any) => {
            let obj = {
              id: comp.key,
              text: comp.value
            }
            this.cList.push(obj);
          }
        )
        this.companyList = this.cList;
        if (setDropdownValue) {
          var base = this;
          this.bindCompany = false;
          base.bindCompany = true;
          base.companyList = [];
          base.companyList = base.cList;
          base.companyId = base.compLocId;

          var e = {
            data: [{ selected: true }],
            value: base.companyId
          }
          base.onCompanySelect(e);
          base.startValue = base.compLocId;
        }
      }
    )

    this.locationList = [{
      id: 0,
      text: 'Locations'
    }]

    this.projectList = [{
      id: 0,
      text: 'Projects'
    }]

    this.unitNoList = [{
      id: 0,
      text: 'Unit No'
    }]
  }

  companyId: any;
  locationId: any;
  projectId: any;
  unitId: any;
  searchInputValue: any;
  flag = 'none';

  setInitPageData(pageNum: number) {
    this.invoiceService.getAllInvoicesByPageNo(pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });        
        this.invoices = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.invoices = [];
        this.count = 0;
      }
    )


  }

  setPageDataByCompany(companyId: number, pageNum: number) {
    this.invoiceService.getInvoicesByCompanyId(companyId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });
        this.invoices = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.invoices = [];
        this.count = 0;
      }
    )
  }

  setPageDataByCompanyAndLocation(companyId: number, locationId: number, pageNum: number) {
    this.invoiceService.getInvoicesByCompanyIdAndLocationId(companyId, locationId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });
        this.invoices = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.invoices = [];
        this.count = 0;
      }
    )
  }

  setPageDataByCompanyAndLocationAndProject(companyId: number, locationId: number, projectId: number, pageNum: number) {
    this.invoiceService.getInvoicesByCompanyIdAndLocationIdAndProjectId(companyId, locationId, projectId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });
        this.invoices = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.invoices = [];
        this.count = 0;
      }
    )
  }

  setPageDataByCompanyAndLocationAndProjectAndUnit(companyId: number, locationId: number, projectId: number, unitId: any, pageNum: number) {
    this.invoiceService.getInvoicesByCompanyIdAndLocationIdAndProjectIdAndUnitNo(companyId, locationId, projectId, unitId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });
        this.invoices = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.invoices = [];
        this.count = 0;
      }
    )
  }

  setPageDataByProject(companyId: number, locationId: number, projectId: number, pageNum: number) {
    this.invoiceService.getInvoicesByCompanyIdAndLocationIdAndProjectId(companyId, locationId, projectId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });
        this.invoices = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.invoices = [];
        this.count = 0;
      }
    )
  }

  onCompanySelect(e: any) {
    // let selected = e.data[0].selected;
    this.companyId = e.value.id;

    // if (this.companyId == 0 && selected == false) {
    //   return;
    // }

    // if (this.companyId == 0 && selected == true) {
    if (this.companyId == 0) {
      this.flag = 'none';
      this.locationList = [{
        id: 0,
        text: 'Location'
      }];
      this.projectList = [{
        id: 0,
        text: 'Projects'
      }];
      this.unitNoList = [{
        id: 0,
        text: 'Unit No'
      }];
      this.setInitPageData(1);
    }

    if (this.companyId > 0) {
      this.flag = 'company';
      this.dataService.getLocationListByCompany(this.companyId).subscribe(
        (data) => {
          this.list = [];
          this.cLocation = [];
          this.locationList = [];
          this.list = data;
          this.list.unshift({ 'key': 0, 'value': 'Locations' })
          this.list.filter(
            (loc: any) => {
              let obj = {
                id: loc.key,
                text: loc.value
              }
              this.cLocation.push(obj)
            }
          )
          this.locationList = this.cLocation
        }
      )
      this.setPageDataByCompany(this.companyId, 1)
    }
  }

  onLocationSelect(e: any) {
    // let selected = e.data[0].selected;
    this.locationId = e.value.id;

    // if (this.locationId == 0 && selected == true) {
    if (this.locationId == 0) {
      this.flag = 'company'
      this.projectList = [{
        id: 0,
        text: 'Projects'
      }];
      this.unitNoList = [{
        id: 0,
        text: 'Unit No'
      }];
      this.setPageDataByCompany(this.companyId, 1)
    }

    if (this.companyId > 0 && this.locationId > 0) {
      this.flag = 'company&location';
      let loginId = this.localStorage.retrieve('loginId')
      this.projectService.getProjectListByLocationIdAndLoginId(this.locationId, loginId).subscribe(
        (data) => {
          this.list = [];
          this.cLocation = [];
          this.projectList = [];
          this.list = data;
          this.list.unshift({ 'key': 0, 'value': 'Projects' })
          this.list.filter(
            (loc: any) => {
              let obj = {
                id: loc.key,
                text: loc.value
              }
              this.cLocation.push(obj)
            }
          )
          this.projectList = this.cLocation
        }
      )
      this.setPageDataByCompanyAndLocation(this.companyId, this.locationId, 1)
    }
  }

  onProjectSelect(e: any) {
    // let selected = e.data[0].selected;
    this.projectId = e.value.id;

    // if (this.projectId == 0 && selected == true) {
    if (this.projectId == 0) {
      this.flag = 'company&location'
      this.unitNoList = [{
        id: 0,
        text: 'Unit No'
      }];
      this.setPageDataByCompanyAndLocation(this.companyId, this.locationId, 1)
    }

    if (this.companyId > 0 && this.locationId > 0 && this.projectId > 0) {
      this.flag = 'company&location&project';
      this.unitService.getAllUnitsNoByProjectId(this.projectId).subscribe(
        (data) => {
          this.list = [];
          this.cLocation = [];
          this.list = data;
          this.list.unshift({ 'key': 0, 'value': 'Unit No' })
          this.list.filter(
            (loc: any) => {
              let obj = {
                id: loc.key,
                text: loc.value
              }
              this.cLocation.push(obj)
            }
          )
          this.unitNoList = this.cLocation
        }
      )
      this.setPageDataByCompanyAndLocationAndProject(this.companyId, this.locationId, this.projectId, 1)
    }
  }

  onUnitSelect(e: any) {
    // let selected = e.data[0].selected;
    this.unitId = e.value.id;

    if (this.unitId == 0) {
      this.localStorage.store('selectedbuyerID', 0)
    }

    if (this.unitId == 0) {
      this.flag = 'company&location&project';
      this.setPageDataByCompanyAndLocationAndProject(this.companyId, this.locationId, this.projectId, 1)
      this.localStorage.store('selectedbuyerID', 0)
    }

    if (this.companyId > 0 && this.locationId > 0 && this.projectId > 0 && this.unitId > 0) {
      this.flag = 'company&location&project&unit'
      this.setPageDataByCompanyAndLocationAndProjectAndUnit(this.companyId, this.locationId, this.projectId, this.unitId, 1)
      this.localStorage.store('selectedbuyerID', e.value)
    }
  }

  curentPage : number = 1;
  getPageData(e: any) {
    const pageNo = e.page;
    this.curentPage = pageNo;
    // For Buyer Role Pagination
    if (this.count > 0 && typeof this.companyId == 'undefined') {
      this.companyId = 0;
    }
    
    // if (typeof (e.event.itemsCount) == "object") return;
    if (this.companyId < 1 && this.flag === 'none') {
      this.setInitPageData(pageNo)
    } else if (this.companyId > 0 && this.flag === 'company') {
      this.setPageDataByCompany(this.companyId, pageNo)
    } else if (this.companyId > 0 && this.locationId > 0 && this.flag === 'company&location') {
      this.setPageDataByCompanyAndLocation(this.companyId, this.locationId, pageNo)
    } else if (this.companyId > 0 && this.locationId > 0 && this.projectId > 0 && this.flag === 'company&location&project') {
      this.setPageDataByCompanyAndLocationAndProject(this.companyId, this.locationId, this.projectId, pageNo)
    } else if (this.companyId > 0 && this.locationId > 0 && this.projectId > 0 && this.unitId > 0 && this.flag === 'company&location&project&unit') {
      this.setPageDataByCompanyAndLocationAndProjectAndUnit(this.companyId, this.locationId, this.projectId, this.unitId, pageNo)
    }
  }

  openPay(payNow: TemplateRef<any>) {
    if (this.loginUserRole !== 'Buyer') {
      this.paymentTypes = [];
    }
    //  this.selectPaymentModeId = '1';
    this.selectedCardType = 'Visa';
    //this.selectedPaymentMode = 'Online Payment - Paytm';
    this.isPaymentCinfigure = null;
    this.unitList = []
    this.allProjects = []
    this.allProjectList = []
    this.isOffline = false;
    this.isdemandDreft = false;
    this.isChaque = false;
    // this.cardTypes = [];
    this.isReview = false;
    this.BankNameList = [];
    if(this.paymentForm != undefined){
      this.paymentForm.controls['branchname'].setValue('');
      this.paymentForm.controls['instrumentno'].setValue('');
      this.paymentForm.controls['instrumentdate'].setValue('');
      this.paymentForm.controls['cardissuer'].setValue('');
      this.paymentForm.controls['cardnumber'].setValue('');
    }    
    // this.paymentForm = new FormGroup({
    //   branchname: new FormControl(''),
    //   instrumentno: new FormControl(''),
    //   instrumentdate: new FormControl(''),
    //   cardissuer: new FormControl(''),
    //   cardnumber: new FormControl(''),
    // });
    this.ValidationMsg = "";
    this.modalRef = this.modalService.show(payNow);

    this.projectService.getAllProjectList().subscribe(
      (data) => {
        this.list = data;

        this.list.unshift({
          'key': '0',
          'value': 'Select One'
        });
        this.list.filter(
          (item: any) => {
            let obj = {
              id: item.key,
              text: item.value
            }
            this.allProjectList.push(obj);
          }

        )
        if (this.allProjectList.length === 2) {
          this.allProjectList.splice(0, 1);
          this.allProjects = this.allProjectList;
        } else {
          this.allProjects = this.allProjectList;
        }

      }
    )
  }


  CloseModal() {

    if (this.modalRef)
      this.modalRef?.hide();
    this.resetAmount();
    this.paymentMod = 3
    this.PrepayMeterCheck = 1
    this.amount = ''

  }

  sortTableBy(sortBy: any) {
    this.sortobj[sortBy] = !this.sortobj[sortBy];
    let sortOrder = this.sortobj[sortBy] ? 'order by ' + sortBy : 'order by ' + sortBy + ' Desc';
    this.invoiceService.getInvoicebyOrder(sortOrder).subscribe(
      (data: any) => {
        this.localStorage.store('orderBy', sortOrder)
        this.invoices = data['records']
      }
    )
    this.resetDropdown();
  }

  public resetDropdown() {
    this.locationList = [
      {
        id: 0,
        text: 'Locations'
      }
    ]

    this.projectList = [
      {
        id: 0,
        text: 'Projects'
      }
    ]

    this.unitNoList = [{
      id: 0,
      text: 'Unit No'
    }];
    this.bindCompany = false;
    var base = this;

    setTimeout(function () {
      base.bindCompany = true;
      base.companyList = [];
      base.companyList = base.cList;
      base.companyId = "0";
      base.startValue = "0";
    }, 0);

  }



  /******Start Search utility*********/
  getDateRange(value: any): void {
    this.filterData = value;
    let buyerID = this.localStorage.retrieve('selectedbuyerid')

    if (this.filterData != null) {
      this.fromDate = this.dataService.formatedDate(this.filterData[0]);
      this.toDate = this.dataService.formatedDate(this.filterData[1]);

      this.invoiceService.searchInvoice(buyerID, this.fromDate, this.toDate).subscribe(
        (data: any) => {
          const paginationButtons = $('li.pages');

          paginationButtons.each(function() {
            
            if($(this).hasClass('active'))
              $(this).children().first().addClass("focused-pagination-button");
            else
              $(this).children().first().removeClass("focused-pagination-button");
      
          });
          this.invoices = data['records'];
        },
        (error) => {
          if (error.status == 404) {
            this.invoices = [];
          }
        }
      )
    }
  }

  onUnitSelect2(e: any) {
    if (e.value > 0) {
      this.invoiceService.getBuyerGeneralSettings(e.value).subscribe(
        (data: any) => {
          this.minimumPaymentAmount = data['minimum_payment_amount'];
          this.paymentMod = data['enable_prepay_payment'];;
        }
      )
    } else {
      //this.paymentMod=0;
    }

    if (e.value != 0) {
      this.yes = false;
      this.invoiceService.getBuyerGeneralSettings(e.value).subscribe(
        (data: any) => {
          this.minimumPaymentAmount = data.minimum_payment_amount;
          this.enablePrepay = data.enable_prepay_payment;
          if (this.enablePrepay == 1) {
            this.prepayPayment = true
          } else if (this.enablePrepay == 2) {
            this.paymentAgainstBill = true
          }
        }
      )

      this.invoiceService.getInvoiceList(e.value, 1).subscribe(
        (data: any) => {
          const paginationButtons = $('li.pages');

          paginationButtons.each(function() {
            
            if($(this).hasClass('active'))
              $(this).children().first().addClass("focused-pagination-button");
            else
              $(this).children().first().removeClass("focused-pagination-button");
      
          });
          this.invoices = data['records'];
          this.count = data['totalRecords'];
          this.localStorage.store('selectedbuyerID', e.value)
        },
        (error) => {
          if (error.status == '404') {
            this.invoices = [];
            this.count = 0
          }
        }
      )
      this.startValue = this.localStorage.retrieve('selectedbuyerID')
    }

    if (e.value == 0) {
      this.yes = true;
      this.invoiceService.getAllInvoicesByPageNo(1).subscribe(
        (data: any) => {
          const paginationButtons = $('li.pages');

          paginationButtons.each(function() {
            
            if($(this).hasClass('active'))
              $(this).children().first().addClass("focused-pagination-button");
            else
              $(this).children().first().removeClass("focused-pagination-button");
      
          });
          this.invoices = data['records'];
          this.count = data['totalRecords'];
          this.localStorage.store('pageNo', 1);
        }
      )
      this.startValue = this.localStorage.retrieve('selectedbuyerID')
    }
  }

  rdValue(e: any) {
    this.rd1value = e.value

  }
  onMeterSelect(e: any) {

    this.localStorage.store('meterUniqPoint', e.target.value)

    if (e.target.value) {
      this.meterValue = true;
      this.isPrepay = true;
      this.setValidations();
    }
    else {
      this.isPrepay = false;
      this.setValidations();
      this.meterValue = false;
    }
    // this.meterEnableCheck = e.target.checked;

  }
  onUnitSelect3(e: any) {
    this.localStorage.store('BuyerId', e.value.id)
    this.prepayForMeterNo = false
    this.MeterUniqList = [];
    // this.meterNoList = [];
    this.unitNumberCheck = '';

    if (this.loginUserRole == "Client Admin") {
      if (e.value > 0) {
        this.isUnit = true;
        this.setValidations();
        this.unitNumberCheck = e.value.id

        this.invoiceService.meterUniquePoints(e.value.id).subscribe(
          (resp: any) => {
            this.meterList = resp;
            this.meterList.unshift({ 'key': 0, 'value': 'Meter No.' })
            this.meterList.filter(
              (item: any) => {
                let obj = {
                  id: item.key,
                  text: item.value
                }
                this.MeterUniqList.push(obj);
              }

            )

            this.meterNoList = this.MeterUniqList;

            this.startValue = this.localStorage.retrieve('selectedbuyerID');
          })

        this.invoiceService.getBuyerGeneralSettings(e.value.id).subscribe(
          (data: any) => {
            this.paymentMod = data.enable_prepay_payment;

            if (this.paymentMod == 0) {
              this.PrepayMeterCheck = 1
            }
          }
        )
      } else {
        this.isUnit = false;
        this.setValidations();
        this.PrepayMeterCheck = 1
        this.paymentMod = 3
      }
    } else {
      this.loginUserRole == 'Buyer';
    }

    if (this.loginUserRole == "Buyer") {
      if (e.value.id > 0) {
        this.isUnit = true;
        this.unitNumberCheck = e.value.id

        this.invoiceService.meterUniquePoints(e.value.id).subscribe(
          (resp: any) => {
            this.meterList = resp;
            this.meterList.unshift({ 'key': 0, 'value': 'Meter No.' })
            this.meterList.filter(
              (item: any) => {
                let obj = {
                  id: item.key,
                  text: item.value
                }
                this.MeterUniqList.push(obj);
              }

            )

            this.meterNoList = this.MeterUniqList;

            this.startValue = this.localStorage.retrieve('selectedbuyerID');
          })
        this.invoiceService.getBuyerGeneralSettings(e.value.id).subscribe(
          (data: any) => {
            this.paymentMod = data['enable_prepay_payment'];
            if (this.paymentMod == 0) {
              this.PrepayMeterCheck = 1
            }
          }
        )
      } else {
        this.PrepayMeterCheck = 1
        this.paymentMod = 3
      }
    }

    if (e.value.id != 0) {
      this.yes = false;
      this.invoiceService.getBuyerGeneralSettings(e.value.id).subscribe(
        (data: any) => {
          this.enablePrepay = data.enable_prepay_payment;
          if (this.enablePrepay == 1) {
            this.prepayPayment = true
          } else if (this.enablePrepay == 2) {
            this.paymentAgainstBill = true
          }
        }
      )
      this.startValue = this.localStorage.retrieve('selectedbuyerID')
    }
  }

  // paymentForm = new FormGroup({

  //   amount: new FormControl()

  // })

  formValidate() {
    this.paymentForm = this.formbuilder.group(
    {
      paymnetmode: new FormControl(''),
      bankname: new FormControl('', Validators.required),
      branchname: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      instrumentno: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      instrumentdate: new FormControl('', Validators.required),
      cardissuer: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      cardnumber: new FormControl('', [Validators.required, Validators.maxLength(4)]),
      cardtype: new FormControl(''),
      amount: new FormControl(''),
    },
    {
      validators: [
        
      ],
    });
  }

  mid: any;
  channel_id: any;
  industry_type_id: any;
  website: any;
  callback_url: any;
  cust_id: any;
  order_id: any;
  txn_amount: any;
  checksum: any;
  mobileNo: any;
  emailAdd: any;
  first_name: any;
  c_url: any;
  f_url: any;
  hav_val: any;
  product_info: any;
  hdfc_amount: any
  hdfc_email: any
  s_url: any;
  txnid: any;
  udf_1: any;
  udf_2: any;
  udf_3: any;
  udf_4: any;
  udf_5: any;
  hdfc_key: any;

  getBlinkCheckOutflag() {
    if (this.currentProjectId === undefined) {
      this.currentProjectId = this.localStorage.retrieve('projectid')
    }
    this.dataService.getBlinkCheckOut(this.currentProjectId).subscribe(
      (data) => {
        if (data == 1) {
          this.blinkCheckoutFlag = 1;
        } else if (data == 0) {
          this.blinkCheckoutFlag = 0;
        }
        console.log(data, 'binkcheck1122')

      });
  }

  paymentRedirection(paymentModeCheck: any) {
    if ((<any>this.selectPaymentModeId) < 2 || paymentModeCheck === 'Online Payment - Paytm') {
      this.getBlinkCheckOutflag();
    }
    if (this.currentProjectId === undefined) {
      this.currentProjectId = this.localStorage.retrieve('projectid')
    }
    this.paytmURL = '';
    if (localStorage.getItem('selectPaymentMode') === 'Online Payment - Paytm') {
      localStorage.setItem('selectPaymentMode', 'payTm');
    } else if (localStorage.getItem('selectPaymentMode') === 'Online Payment - HDFC') {
      localStorage.setItem('selectPaymentMode', 'HDFC');
    }
    else if (localStorage.getItem('selectPaymentMode') === 'Online Payment - PayU') {
      localStorage.setItem('selectPaymentMode', 'PayU');
    }
    this.dataService.getpaymentDirctionRoles(this.currentProjectId, localStorage.getItem('selectPaymentMode')).subscribe(
      (data) => {
        const ispaymentConfic = data;
        if (ispaymentConfic === 1) {
          if (paymentModeCheck == '2' || paymentModeCheck == '9'
            || paymentModeCheck == 'Online Payment - HDFC' || paymentModeCheck == 'Online Payment - PayU') {
            this.paytmURL = this.dataService.hdfcUrl;
          } else {
            this.paytmURL = this.dataService.paytmUrl;
          }
          console.log(this.paytmURL, '1')
        } else {
          if (paymentModeCheck == '2' || paymentModeCheck == '9'
            || paymentModeCheck == 'Online Payment - HDFC' || paymentModeCheck == 'Online Payment - PayU') {
            this.paytmURL = this.dataService.hdfcDevUrl;
          } else {
            this.paytmURL = this.dataService.paytmDevUrl;
          }
        }
      });
  }

  fadeIn() {
    this.bindVar = 'fadeIn';
  }

  fadeOut() {
    this.bindVar = 'fadeOut';

  }

  onPaymentSubmit() {
    debugger
    this.paymentRedirection(this.selectPaymentModeId);

    this.amt = (<any>this.paymentForm).get('amount').value;
    localStorage.setItem('amnt', this.amt)
    let buyerID = this.localStorage.retrieve('BuyerId')


    if (this.prepayForMeterNo) {
      this.uniqPoint = this.localStorage.retrieve('meterUniqPoint');
      this.localStorage.clear('meterUniqPoint');
    }
    else {
      this.uniqPoint = null
    }

    if (this.amt > 0) {
      if ((<any>this.selectPaymentModeId) < 2) {

        this.dataService.getMyAccountInformation().subscribe(
          (data: any) => {

            let usr = {
              groupID: data["0"].groupId,
              mobile: data["0"].mobilePhone,
              email: data["0"].emailId,
              buyerId: buyerID,
              loginId: data["0"].appLoginId,
              amount: this.amt,
              callback: this.redirectUrl,
              UniquePoint: this.uniqPoint

            }

            console.log(data, "Noblink1", this.blinkCheckoutFlag)
            setTimeout(() => {
              if (this.blinkCheckoutFlag === 0) {
                this.dataService.createPayment(usr).subscribe(
                  (data: any) => {
                    console.log(data, "Noblink")
                    // this.toastr.success('Payment processed successfully.The updated status will be shown after the payment reconciliation process is complete.', ''
                    //   , {
                    //     disableTimeOut: true
                    //   });

                    this.mid = data['merchantParams'].MID;
                    this.channel_id = data['merchantParams'].CHANNEL_ID;
                    this.industry_type_id = data['merchantParams'].INDUSTRY_TYPE_ID
                    this.website = data['merchantParams'].WEBSITE;
                    this.callback_url = data['merchantParams'].CALLBACK_URL;
                    this.cust_id = data['merchantParams'].CUST_ID;
                    this.order_id = data['merchantParams'].ORDER_ID;
                    this.txn_amount = data['merchantParams'].TXN_AMOUNT;
                    this.checksum = data['merchantParams'].CHECKSUMHASH;
                    this.mobileNo = data['merchantParams'].MOBILE_NO;
                    this.emailAdd = data['merchantParams'].EMAIL;

                    this.appRef.tick();

                    this.localStorage.store('callback', this.callback_url)
                  },
                  (err) => {

                    this.toastr.error('Payment Processing Failed. Please try again later.', ''
                      , {
                        disableTimeOut: true
                      });
                  },
                  () => {
                    let form: HTMLFormElement = <HTMLFormElement>document.getElementById('paytmform');
                    form.submit();
                  }
                )

              }

              else if (this.blinkCheckoutFlag === 1) {
                console.log(this.paytmURL, '2')
                this.dataService.createBlinkPayment(usr).subscribe(
                  (data: any) => {
                    this.paytmDialog(data.merchantParams);
                    console.log(data, "blink11")
                    // this.mid = data['merchantParams'].MID;
                    // this.channel_id = data['merchantParams'].CHANNEL_ID;
                    // this.industry_type_id = data['merchantParams'].INDUSTRY_TYPE_ID
                    // this.website = data['merchantParams'].WEBSITE;
                    // this.callback_url = data['merchantParams'].CALLBACK_URL;
                    // this.cust_id = data['merchantParams'].CUST_ID;
                    // this.order_id = data['merchantParams'].ORDER_ID;
                    // this.txn_amount = data['merchantParams'].TXN_AMOUNT;
                    // this.checksum = data['merchantParams'].CHECKSUMHASH;
                    // this.mobileNo = data['merchantParams'].MOBILE_NO;
                    // this.emailAdd = data['merchantParams'].EMAIL;

                    // this.appRef.tick();

                    // this.localStorage.store('callback', this.callback_url)
                  },
                  (err) => {

                    this.toastr.error('Payment Processing Failed. Please try again later.', ''
                      , {
                        disableTimeOut: true
                      });
                  },
                  // () => {
                  //   let form: HTMLFormElement = <HTMLFormElement>document.getElementById('paytmform');
                  //   form.submit();
                  // }
                )

              }
            }, 1000);
          }
        )
      }
      if (<any>this.selectPaymentModeId > 1) {
        if (this.selectPaymentModeId != 6) {
          this.selectedCardType = '';
        }
        if ((<any>this.paymentForm).get('instrumentdate').value) {
          const currentDate = new Date((<any>this.paymentForm).get('instrumentdate').value).toString();
          this.newDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
        } else {
          this.newDate = '';
        }

        if (localStorage.getItem('selectPaymentMode') === 'Online Payment - Paytm') {
          localStorage.setItem('selectPaymentMode', 'payTm');
        } else if (localStorage.getItem('selectPaymentMode') === 'Online Payment - HDFC') {
          localStorage.setItem('selectPaymentMode', 'HDFC');
        }
        else if (localStorage.getItem('selectPaymentMode') === 'Online Payment - PayU') {
          localStorage.setItem('selectPaymentMode', 'PayU');
        }

        this.dataService.getMyAccountInformation().subscribe(
          (data: any) => {
            let usr = {
              groupID: data["0"].groupId,
              mobile: data["0"].mobilePhone,
              email: data["0"].emailId,
              buyerId: buyerID,
              loginId: data["0"].appLoginId,
              amount: this.amt,
              callback: this.redirectUrl,
              UniquePoint: this.uniqPoint,
              paymnetmode: localStorage.getItem('selectPaymentMode'),
              PaymentGateWay: localStorage.getItem('selectPaymentMode'),
              bankname: this.selectedBank,
              branchname: (<any>this.paymentForm).get('branchname').value,
              instrumentno: (<any>this.paymentForm).get('instrumentno').value,
              instrumentdate: this.newDate,
              cardissuer: (<any>this.paymentForm).get('cardissuer').value,
              cardtype: this.selectedCardType,
              cardnumber: (<any>this.paymentForm).get('cardnumber').value

            }
            if (this.selectPaymentModeId !== 2) {
              if (this.selectPaymentModeId !== 9) {
                this.dataService.processPayment(usr).subscribe(
                  (data: any) => {
                    if (data.item1 == true) {
                      // this.toastr.success(data.item2, ''
                      //   , {
                      //     disableTimeOut: true
                      //   });
                      this.mid = data['merchantParams'].MID;
                      this.channel_id = data['merchantParams'].CHANNEL_ID;
                      this.industry_type_id = data['merchantParams'].INDUSTRY_TYPE_ID
                      this.website = data['merchantParams'].WEBSITE;
                      this.callback_url = data['merchantParams'].CALLBACK_URL;
                      this.cust_id = data['merchantParams'].CUST_ID;
                      this.order_id = data['merchantParams'].ORDER_ID;
                      this.txn_amount = data['merchantParams'].TXN_AMOUNT;
                      this.checksum = data['merchantParams'].CHECKSUMHASH;
                      this.mobileNo = data['merchantParams'].MOBILE_NO;
                      this.emailAdd = data['merchantParams'].EMAIL;

                      this.appRef.tick();

                      this.localStorage.store('callback', this.callback_url)
                    } else {
                      this.toastr.error(data.item2, ''
                        , {
                          disableTimeOut: true
                        });
                    }
                  },
                  (err) => {
                    this.toastr.error('Payment Processing Failed. Please try again later.', ''
                      , {
                        disableTimeOut: true
                      });
                  },
                  () => {
                    let form: HTMLFormElement = <HTMLFormElement>document.getElementById('paytmform');
                    form.submit();
                  }
                )
              }
            }
            if (this.selectPaymentModeId === 2 || this.selectPaymentModeId === 9) {
              this.dataService.hdfcCreatePayment(usr).subscribe(
                (data: any) => {
                  // this.toastr.success(data.item2, ''
                  //   , {
                  //     disableTimeOut: true
                  //   });
                  this.first_name = data['merchantParams'].firstname;
                  this.c_url = data['merchantParams'].curl;
                  this.f_url = data['merchantParams'].furl;
                  this.hav_val = data['merchantParams'].hash;
                  this.product_info = data['merchantParams'].productinfo;
                  this.s_url = data['merchantParams'].surl;
                  this.txnid = data['merchantParams'].txnid;
                  this.hdfc_amount = data['merchantParams'].amount;
                  this.hdfc_key = data.merchantKey;
                  this.udf_2 = data['merchantParams'].udf2;
                  this.udf_3 = data['merchantParams'].udf3;
                  this.udf_4 = data['merchantParams'].udf4;
                  this.udf_5 = data['merchantParams'].udf5;
                  this.mobileNo = data['merchantParams'].phone;
                  this.hdfc_email = data['merchantParams'].email;

                  this.appRef.tick();

                  this.localStorage.store('callback', this.callback_url)

                },
                (err) => {

                  // this.toastr.error('Payment Processing Failed. Please try again later.', ''
                  //   , {
                  //     disableTimeOut: true
                  //   });
                  this.toastr.error('Payment Processing Failed. Please try again later')
                },
                () => {
                  let form: HTMLFormElement = <HTMLFormElement>document.getElementById('paytmform');
                  form.submit();
                }
              )
            }



          }
        )
      }
    }

  }

  setDate(e: any) {
    console.log(e, "eee")
  }

  onPaymentSubmitFromChild(usr: any) {
    localStorage.setItem('selectPaymentMode', usr.paymnetmode);
    this.paymentRedirection(usr.paymnetmode);

    if (usr.paymnetmode == 'Online Payment - Paytm') {
      setTimeout(() => {

        if (this.blinkCheckoutFlag == 0) {
          this.dataService.createPayment(usr).subscribe(
            (data: any) => {
              // this.toastr.success('Payment processed successfully.The updated status will be shown after the payment reconciliation process is complete.', ''
              // , {
              //   disableTimeOut: true
              // });
              this.mid = data['merchantParams'].MID;
              this.channel_id = data['merchantParams'].CHANNEL_ID;
              this.industry_type_id = data['merchantParams'].INDUSTRY_TYPE_ID
              this.website = data['merchantParams'].WEBSITE;
              this.callback_url = data['merchantParams'].CALLBACK_URL;
              this.cust_id = data['merchantParams'].CUST_ID;
              this.order_id = data['merchantParams'].ORDER_ID;
              this.txn_amount = data['merchantParams'].TXN_AMOUNT;
              this.checksum = data['merchantParams'].CHECKSUMHASH;
              this.mobileNo = data['merchantParams'].MOBILE_NO;
              this.emailAdd = data['merchantParams'].EMAIL;

              this.appRef.tick();

              this.localStorage.store('callback', this.callback_url)
            },
            (err) => {

              this.toastr.error('Payment Processing Failed. Please try again later.', ''
                , {
                  disableTimeOut: true
                });
            },
            () => {
              let form: HTMLFormElement = <HTMLFormElement>document.getElementById('paytmform');
              form.submit();
            }
          )
        }
        else if (this.blinkCheckoutFlag == 1) {
          localStorage.setItem('amnt', usr.amount)
          this.dataService.createBlinkPayment(usr).subscribe(
            (data: any) => {
              this.paytmDialog(data.merchantParams);
              // this.toastr.success('Payment processed successfully.The updated status will be shown after the payment reconciliation process is complete.', ''
              // , {
              //   disableTimeOut: true
              // });
              // this.mid = data['merchantParams'].MID;
              // this.channel_id = data['merchantParams'].CHANNEL_ID;
              // this.industry_type_id = data['merchantParams'].INDUSTRY_TYPE_ID
              // this.website = data['merchantParams'].WEBSITE;
              // this.callback_url = data['merchantParams'].CALLBACK_URL;
              // this.cust_id = data['merchantParams'].CUST_ID;
              // this.order_id = data['merchantParams'].ORDER_ID;
              // this.txn_amount = data['merchantParams'].TXN_AMOUNT;
              // this.checksum = data['merchantParams'].CHECKSUMHASH;
              // this.mobileNo = data['merchantParams'].MOBILE_NO;
              // this.emailAdd = data['merchantParams'].EMAIL;

              // this.appRef.tick();

              // this.localStorage.store('callback', this.callback_url)
            },
            (err) => {


              this.toastr.error('Payment Processing Failed. Please try again later.', ''
                , {
                  disableTimeOut: true
                });
            },
            // () => {
            //   let form: HTMLFormElement = <HTMLFormElement>document.getElementById('paytmform');
            //   form.submit();
            // }
          )
        }

      }, 1000);
    }

    if (usr.paymnetmode !== 'Online Payment - Paytm') {

      if (usr.paymnetmode !== 'Online Payment - HDFC') {
        if (usr.paymnetmode !== 'Online Payment - PayU') {
          this.dataService.processPayment(usr).subscribe(
            (data: any) => {
              if (data.item1 == true) {
                // this.toastr.success(data.item2, ''
                //   , {
                //     disableTimeOut: true
                //   });
                this.emailStatus = 'success'
                this.classStatus = 'success'
                this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
                this.mid = data['merchantParams'].MID;
                this.channel_id = data['merchantParams'].CHANNEL_ID;
                this.industry_type_id = data['merchantParams'].INDUSTRY_TYPE_ID
                this.website = data['merchantParams'].WEBSITE;
                this.callback_url = data['merchantParams'].CALLBACK_URL;
                this.cust_id = data['merchantParams'].CUST_ID;
                this.order_id = data['merchantParams'].ORDER_ID;
                this.txn_amount = data['merchantParams'].TXN_AMOUNT;
                this.checksum = data['merchantParams'].CHECKSUMHASH;
                this.mobileNo = data['merchantParams'].MOBILE_NO;
                this.emailAdd = data['merchantParams'].EMAIL;

                this.appRef.tick();

                this.localStorage.store('callback', this.callback_url)
              } else {
                this.toastr.error(data.item2, ''
                  , {
                    disableTimeOut: true
                  });
              }
            },
            (err) => {

              this.toastr.error('Payment Processing Failed. Please try again later.', ''
                , {
                  disableTimeOut: true
                });
            },
            () => {
              console.log('ui')
              let form: HTMLFormElement = <HTMLFormElement>document.getElementById('paytmform');
              form.submit();
            }
          )
        }
      }

      if (usr.paymnetmode === 'Online Payment - HDFC' || usr.paymnetmode === 'Online Payment - PayU') {
        this.selectedPaymentMode = usr.paymnetmode;
        this.dataService.hdfcCreatePayment(usr).subscribe(
          (data: any) => {
            // if (data.item1 == true) {
            //   this.toastr.success(data.item2, ''
            //     , {
            //       disableTimeOut: true
            //     });
            // this.emailStatus = 'success'
            // this.classStatus = 'success'
            this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
            this.first_name = data['merchantParams'].firstname;
            this.c_url = data['merchantParams'].curl;
            this.f_url = data['merchantParams'].furl;
            this.hav_val = data['merchantParams'].hash;
            this.product_info = data['merchantParams'].productinfo;
            this.s_url = data['merchantParams'].surl;
            this.txnid = data['merchantParams'].txnid;
            this.hdfc_amount = data['merchantParams'].amount;
            this.hdfc_key = data.merchantKey;
            this.udf_2 = data['merchantParams'].udf2;
            this.udf_3 = data['merchantParams'].udf3;
            this.udf_4 = data['merchantParams'].udf4;
            this.udf_5 = data['merchantParams'].udf5;
            this.mobileNo = data['merchantParams'].phone;
            this.hdfc_email = data['merchantParams'].email;

            this.appRef.tick();

            this.localStorage.store('callback', this.callback_url)
            // } else {
            //   this.toastr.error(data.item2, ''
            //     , {
            //       disableTimeOut: true
            //     });
            // }
          },
          (err) => {
            this.toastr.error('Payment Processing Failed. Please try again later.', ''
              , {
                disableTimeOut: true
              });
          },
          () => {
            console.log('ui')
            let form: HTMLFormElement = <HTMLFormElement>document.getElementById('paytmform');
            form.submit();
          }
        );
      }
    }

  }

  paytmDialog(paytmObj: any) {
    // this._loadingBar.start();
    console.log('11url1')
    const url = this.paytmURL.split('/theia')[0];
    console.log(url, 'url')
    const script = document.createElement('script');
    script.src = url + '/merchantpgpui/checkoutjs/merchants/' + paytmObj.MID + '.js';
    script.onload = () => onScriptLoad();
    script.id = 'paytm';
    document.head.appendChild(script);

    function onScriptLoad() {
      const config = {
        root: '',
        flow: 'DEFAULT',
        data: {
          orderId: paytmObj.ORDER_ID,
          token: paytmObj.TOKEN,
          tokenType: 'TXN_TOKEN',
          amount: localStorage.getItem('amnt')
        },
        handler: {
          notifyMerchant(eventName: any, data: any) {
            console.log('notifyMerchant handler function called');
            console.log('eventName => ', eventName);
            console.log('data => ', data);
          }
        }
      };
      console.log(config, "this.amt")

      if (window.Paytm && window.Paytm.CheckoutJS) {
        window.Paytm.CheckoutJS.onLoad(function excecuteAfterCompleteLoad() {
          // initialze configuration using init method
          window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
            // after successfully updating configuration, invoke JS Checkout
            window.Paytm.CheckoutJS.invoke();
          }).catch(function onError(error: any) {
            console.log('error => ', error);
          });
        });
      }
    }
  }





  resetAmount() {
    this.invoiceAmt = '';

  }


  getPaymentAgainst(e: any) {
    this.payAgainstCheck = e.target.checked;
    if (e.target.checked) {
      this.isPrepay = true;
      this.setValidations();
      this.uniqPoint = '';
      this.prepayForMeterNo = false;
      this.PrepayMeterCheck = 1;
      this.meterValue = true;
    }
  }
  getPrepay(e: any) {
    console.log(e);
    this.isPrepay = true;
    this.setValidations();
    this.prepayForMeterNo = true;
    if (e.target.checked) {
      this.PrepayMeterCheck = 2
      this.payAgainstCheck = false
      this.meterValue = false;
    }

  }

  unitValue(e: any) {
    if (e.target.value) {
      this.amountCheck = e.target.value

      this.amountCheck = true;

      this.setValidations();
    } else {
      this.amountCheck = false
      this.setValidations();
    }



  }

  onPayNow(row : any) {
    debugger;
    this.paymentMod = '';
    this.allProjects = [];
    this.allProjectList = [];
    this.startValue1 = 0;
    this.projectService.getAllProjectList().subscribe(
      (data) => {
        this.list = data;
        this.list.unshift({
          'key': '0',
          'value': 'Select One'
        });
        this.list.filter(
          (item: any) => {
            let obj = {
              id: item.key,
              text: item.value
            }
            this.allProjectList.push(obj);
          }
        )
        this.allProjects = this.allProjectList;
        let projectID = row.projectId;
        this.startValue1 = projectID;

      }
    )
  }

  openCharge(viewCharge: TemplateRef<any>, e: any) {
    e.preventDefault();
    this.modalRef = this.modalService.show(viewCharge);
  }

  showCharge1() {
    debugger
    let groupId = this.invoice.groupID;
    let serverId = this.invoice.serverID;
    let moduleNm = this.invoice.moduleName;
    let installId = this.invoice.installID;

    this.invoiceService.getBuyerInvoiceCharge(groupId, serverId, moduleNm, installId).subscribe(
      (data) => {
        this.charge = data;
      }
    )
  }

  showCharge(row : any) {
    let groupId = row.groupID;
    let serverId = row.serverID;
    let moduleNm = row.moduleName;
    let installId = row.installID;

    this.invoiceService.getBuyerInvoiceCharge(groupId, serverId, moduleNm, installId).subscribe(
      (data) => {
        this.charge = data;
      }
    )
  }

}
