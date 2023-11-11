import { Component, OnInit, TemplateRef, ViewChild, ElementRef, ApplicationRef, OnDestroy, Inject } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../service/data.service';
import { LocalStorageService } from 'ngx-webstorage';
// import { Select2OptionData } from 'ng2-select2';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location, DatePipe } from '@angular/common'
// import 'rxjs/add/operator/map';
import { UnitService } from '../../service/common/unit.service';
import { InvoiceService } from '../../service/common/invoice.service';
import { CompanyService } from '../../service/common/company.service';
import { DOCUMENT } from '@angular/common'
import { ProjectService } from '../../service/common/project.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
declare global {
  interface Window { Paytm: any; }
}
// import { userInfo } from 'os';

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
  selector: 'pa-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})

export class InvoiceListComponent implements OnInit, OnDestroy {
  @ViewChild('pt') PayTm: ElementRef | undefined;

  configSel : CustomDropdownConfig = {
    // displayFn:(item: any) => { return item.hello.world; } //to support flexible text displaying for each item
    displayKey: "text",
    search: true,
    selectAllLabel: 'Select all',
    height: '',
    placeholder: '',
    customComparator: function (a: any, b: any) : number {
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

  id: any;
  invoiceList: any;
  selectedUnit: any;
  unitList: unitListItem[] = [];
  unitList2: unitListItem[] = [];
  list: any;
  list2: any;
  amt: any;
  invoiceAmt: any;
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
  redirectUrl: any;
  public unitNoList: unitListItem[] = [];
  public unitNoList2: unitListItem[] = [];
  public selected: any;
  public startValue: Observable<string> | undefined;
  public startValue2: Observable<string> | undefined;
  buyerId: any;
  filterData: any | undefined;
  fromDate: any | undefined;
  toDate: any | undefined;
  public modalRef: BsModalRef | undefined;
  paymentMod: any;
  loginUserRole: any;
  RangeDate: String | undefined;
  count: any;
  companyId: any;
  flag: string | undefined;
  paytmURL: any;
  payBtnCheck2: any;
  PrepayMeterCheck: any;
  payAgainstCheck: any;
  meterValue: boolean = false;
  prepayForMeterNo: boolean = false;
  amountCheck: boolean = false;
  unitNumberCheck: any;
  meterList: any;
  MeterUniqList: MeterUniqListItem[] = [];
  meterNoList: any;
  uniqPoint: any;
  amount: string | undefined;
  allProjects: allProjectListItem[] = [];
  allProjectList: allProjectListItem[] = [];
  currentProjectId: any;
  unitCheck: any;
  isPaymentCinfigure: Object | undefined;
  paymentTypes: paymentTypesItem[] = [];
  BankNameList: BankNameList1Item[] = [];
  cardTypes = [];
  isReview: boolean = false;
  isChaque: boolean = false;
  isdemandDreft: boolean = false;
  paymentForm!: FormGroup<any>;
  selectedPaymentMode: any;
  selectPaymentModeId: any;
  isOffline: boolean = false;
  selectedBank: string | undefined;
  selectedCardType: string | undefined;
  BankNameList1: BankNameList1Item[] = [];
  isProject: boolean = false;
  isUnit: boolean = false;
  newDate: any;
  isDisable: boolean = true;
  isBank: boolean = false;
  isInstrumentNo: boolean = false;
  isBranch: boolean = false;
  isPrepay: boolean = false;
  blinkCheckoutFlag: Object | undefined;
  isHdfcFlag: boolean = false;
  isPaytmFlag: boolean = false;
  isNothingpayment: boolean = false;
  isBothpaymentFlag: boolean = false;
  minimumPaymentAmount: number = 0;
  ValidationMsg: string | undefined;

  charge : any;

  constructor(private toastr: ToastrService, private datePipe: DatePipe, private formbuilder: FormBuilder, private modalService: BsModalService, private projectService: ProjectService, private activateRoute: ActivatedRoute, private dataService: DataService, private localStorage: LocalStorageService, private appRef: ApplicationRef, private router: Router, private location: Location, private unitService: UnitService, private invoiceService: InvoiceService, @Inject(DOCUMENT) document: any, private companyService: CompanyService) { }

  ngOnInit() {
    // this.formValidate();
    this.paymentConfigureforList()
    this.paymentTypes = this.dataService.getPaymentModeList();
    this.cardTypes = this.dataService.getCardTypesList()

    // this.paytmURL = this.dataService.paytmUrl;
    this.companyId = 0;
    this.loginUserRole = this.localStorage.retrieve('role');
    if (this.loginUserRole == 'Buyer') {
      this.paymentTypes = [this.paymentTypes[0]];      
    }
    this.redirectUrl = document.location.href;

    this.activateRoute.url.subscribe(
      (res) => {console.log(res[1]);
        this.id = res[1].path
      }
    )

    /****Sort data table arrow style******/
    // $(".sortable").click(function (index) {
    //   $(".ngx_pagination .pagination .page-item:nth-child(1) .page-link").trigger("click");
    //   $(".sortable").removeClass('activeSort');
    //   $(this).addClass('activeSort');
    //   if($(this).hasClass('ascOrder')) {
    //     $(this).removeClass('ascOrder').addClass('descOrder');
    //   } else {
    //     $(this).removeClass('descOrder').addClass('ascOrder');
    //   }
    // });

    this.invoiceService.getInvoiceList(this.id, 1).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });   
        this.invoiceList = data['records'];
        this.localStorage.store('selectedbuyerID', this.id)        
      }      
    )
    this.setInitPageData(this.id, 1);

    this.unitService.getUnit(this.id).subscribe(
      (obj: any) => {
        this.selectedUnit = obj[0].unitNo
      }
    )
    let pageNo = this.localStorage.retrieve('pageNo');
    this.unitService.getUnitsByPageNo(pageNo).subscribe(
      (data: any) => {
        this.unitList = data['records'];
      }
    )

    this.unitService.getAllUnitsNo().subscribe(
      (data) => {
        this.list = data;
        this.list.unshift({ 'key': '0', 'value': 'All' });
        this.list.filter(
          (item: any) => {
            let obj = {
              id: item.key,
              text: item.value
            }
            this.unitList.push(obj);
          }
        )
        this.unitNoList = this.unitList;
        console.log(this.unitNoList);
        this.startValue = this.localStorage.retrieve('selectedbuyerID');
      }
    )

    this.invoiceInit();
  }

  onPaymentSelect(e: any) {
    this.selectedPaymentMode = e.data[0].text;
    localStorage.setItem('selectPayment', e.data[0].text);
    console.log(e.data[0].text, localStorage.getItem('selectPayment'))
    this.setValidations();
    this.selectPaymentModeId = e.value;
    if (e.value == '4' || e.value == '5' || e.value == '7' || e.value == '8') {
      // this.isProject = false;
      // this.isUnit = false;
      // this.amountCheck = false;
      this.isChaque = true;
      this.isdemandDreft = true;
      this.isOffline = false;

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
    else if (e.value == '6') {
      this.isOffline = true;
      this.isChaque = false;
      this.isdemandDreft = false;
      // this.isProject = true;
      // this.isUnit = true;
      // if (this.paymentForm.get('amount').value) {
      //   this.amountCheck = true;
      // } else {
      //   this.amountCheck = false;
      // }
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
    console.log(e.data[0], "asd")
    if (e.data[0].id > '0') {
      this.selectedBank = e.data[0].text;
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

  reviewForm(validation: any) {
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
        this.isBank = false;
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

  paymentConfigureforList() {
    this.invoiceService.paymentGatewayConfig().subscribe(
      (data) => {

        this.payBtnCheck2 = data
      })
  }


  public invoiceInit() {
    this.redirectUrl = document.location.href;
    this.localStorage.store('orderBy', null);
    /****Sort data table arrow style******/
    $('.sortable').click((index: any) => {
      $('.ngx_pagination .pagination .page-item:nth-child(1) .page-link').trigger('click');
      $('.sortable').removeClass('activeSort');
      $(this).addClass('activeSort');
      if ($(this).hasClass('ascOrder')) {
        $(this).removeClass('ascOrder').addClass('descOrder');
      } else {
        $(this).removeClass('descOrder').addClass('ascOrder');
      }
    });
    // this.setInitPageData(this.id);
  }

  sortTableBy(sortBy: any) {
    this.sortobj[sortBy] = !this.sortobj[sortBy];
    let sortOrder = this.sortobj[sortBy] ? 'order by ' + sortBy : 'order by ' + sortBy + ' Desc';
    this.invoiceService.getInvoicebyOrder(sortOrder).subscribe(
      (data: any) => {
        this.localStorage.store('orderBy', sortOrder)
        this.unitList = data['records']
      }
    )
  }

  openCharge(viewCharge: TemplateRef<any>, e: any) {
    e.preventDefault();
    this.modalRef = this.modalService.show(viewCharge);
  }

  openPay(payNow: TemplateRef<any>, e: any) {
    //this.selectPaymentModeId = '1';
    this.selectedCardType = 'Visa';
    //this.selectedPaymentMode = 'Online Payment - Paytm';
    this.isdemandDreft = false;
    this.isChaque = false;
    this.isOffline = false;
    // this.cardTypes = [];
    this.isReview = false;
    this.BankNameList = [];
    this.paymentForm = this.formbuilder.group({
      branchname: new FormControl(''),
      instrumentno: new FormControl(''),
      instrumentdate: new FormControl(''),
      cardissuer: new FormControl(''),
      cardnumber: new FormControl(''),
    });
    this.ValidationMsg = "";
    e.preventDefault();
    this.modalRef = this.modalService.show(payNow);
  }

  onPayNow() {
    if (this.loginUserRole !== 'Buyer') {
      this.paymentTypes = []
    }
    this.unitList = []
    this.allProjects = []
    this.allProjectList = []
    this.unitList2 = [];
    this.unitNoList2 = [];
    this.paymentMod = null;

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

  onProjectSelect2(e: any) {
    debugger
    this.currentProjectId = null;
    if (e.value.id > 0) {
      this.isProject = true;
      this.onSelectProjectPaymentConfigure(e.value.id);
      this.OnlinePaymentType(e.value.id);
      this.currentProjectId = e.value.id;
    }
    else {
      this.unitCheck = e.value.id
      this.isProject = false;
      this.setValidations();
    }
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
      //   // get object count
      //   setTimeout(() => {

      //     if (Object.keys(resp).length === 0){
      //       this.loginUserRole = this.localStorage.retrieve('role');
      //       if (this.loginUserRole == 'Buyer') {
      //         this.isHdfcFlag = false;
      //         this.isPaytmFlag = false;
      //         this.isBothpaymentFlag = false;
      //         this.paymentTypes = []
      //       } else {
      //         console.log('nothind',Object.keys(resp).length)
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
      //           },
      //           {
      //             id: 7,
      //             text: 'Offline RTGS'
      //           },
      //           {
      //             id: 8,
      //             text: 'Offline NEFT'
      //           }

      //         ];
      //       }

      //     } else if (resp[0].key === 'PayTm' && Object.keys(resp).length === 1) {
      //       this.loginUserRole = this.localStorage.retrieve('role');
      //       if (this.loginUserRole == 'Buyer') {
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
      //           if (this.paymentTypes[i].id === 2)
      //           {
      //             const index = this.paymentTypes.indexOf(this.paymentTypes[i]);
      //             this.paymentTypes.splice(index, 1);
      //           }
      //         }
      //       }

      //   } else if (resp[0].key === 'HDFC' && Object.keys(resp).length === 1) {
      //     this.loginUserRole = this.localStorage.retrieve('role');
      //     if (this.loginUserRole == 'Buyer') {
      //       this.isHdfcFlag = true;
      //       this.isPaytmFlag = false;
      //       this.isBothpaymentFlag = false;
      //       this.isNothingpayment = false;
      //       this.paymentTypes = this.dataService.getPaymentModeList();
      //       this.paymentTypes = [this.paymentTypes[1]];
      //     } else {
      //       this.isHdfcFlag = true;
      //       this.isPaytmFlag = false;
      //       this.isBothpaymentFlag = false;
      //       this.isNothingpayment = false;
      //       this.paymentTypes = this.dataService.getPaymentModeList();
      //       for (let i = 0; i < this.paymentTypes.length; i++) {
      //         if (this.paymentTypes[i].id === 1)
      //         {
      //           const index = this.paymentTypes.indexOf(this.paymentTypes[i]);
      //           this.paymentTypes.splice(index, 1);
      //         }
      //       }
      //     }
      //   } else if (Object.keys(resp).length === 2) {
      //     this.loginUserRole = this.localStorage.retrieve('role');
      //     if (this.loginUserRole == 'Buyer') {
      //       this.paymentTypes = this.dataService.getPaymentModeList();
      //       this.isHdfcFlag = false;
      //       this.isPaytmFlag = false;
      //       this.isNothingpayment = false;
      //       this.isBothpaymentFlag = true;
      //       this.paymentTypes = [

      //         {
      //           id: 1,
      //           text: 'Online Payment - Paytm'
      //         },
      //         {
      //           id: 2,
      //           text: 'Online Payment - HDFC'
      //         },
      //         {
      //           id: 9,
      //           text: 'Online Payment - PayU'
      //         },
      //       ];
      //     } else {
      //       // this.paymentTypes = this.dataService.getPaymentModeList();
      //       this.paymentTypes = [

      //         {
      //           id: 1,
      //           text: 'Online Payment - Paytm'
      //         },
      //         {
      //           id: 2,
      //           text: 'Online Payment - HDFC'
      //         },
      //         {
      //           id: 3,
      //           text: 'Cash'
      //         },
      //         {
      //           id: 4,
      //           text: 'Cheque'
      //         },
      //         {
      //           id: 5,
      //           text: 'Demand Draft'
      //         },
      //         {
      //           id: 6,
      //           text: 'Offline Credit/Debit Card'
      //         },
      //         {
      //           id: 7,
      //           text: 'Offline RTGS'
      //         },
      //         {
      //           id: 8,
      //           text: 'Offline NEFT'
      //         },
      //         {
      //           id: 9,
      //           text: 'Online Payment - PayU'
      //         },
      //       ];
      //       this.isHdfcFlag = false;
      //       this.isPaytmFlag = false;
      //       this.isNothingpayment = false;
      //       this.isBothpaymentFlag = true;
      //     }
      //   }
      // }, 1000);
      //   console.log(this.paymentTypes, "this.paymentTypes")
    });
  }

  onSelectProjectPaymentConfigure(projectid: any) {
    this.invoiceService.onSelectPrjctpaymentGatewayConfig(projectid).subscribe(
      (data) => {
        this.unitList2 = [];
        this.unitNoList2 = [];
        this.isPaymentCinfigure = data
        this.unitCheck = data

        if (this.isPaymentCinfigure == 1) {
          this.unitService.getAllUnitsNoByProjectId(projectid).subscribe(
            (data) => {
              this.list2 = data;
              this.list2.unshift(
                {
                  'key': '0',
                  'value': 'Select Unit'
                });
              this.list2.filter(
                (item: any) => {
                  let obj = {
                    id: item.key,
                    text: item.value
                  }
                  this.unitList2.push(obj)
                }
              )
              if (this.unitList2.length === 2) {
                this.unitList2.splice(0, 1);
                this.unitNoList2 = this.unitList2;
              } else {
                this.unitNoList2 = this.unitList2;
              }
              this.startValue2 = this.localStorage.retrieve('selectedbuyerID');
            }
          )
        }
      })
  }

  // getAllUnitNoFromAllInvoices() {

  //   this.unitService.getAllUnitsNo().subscribe(
  //     (data) => {
  //       console.log("3")
  //       this.list2 = data;
  //       this.list2.unshift(
  //         {
  //           'key':'0',
  //         'value':'Select Unit'
  //       });
  //       this.list2.filter(
  //         (item) => {
  //           let obj = {
  //             id: item.key,
  //             text: item.value
  //           }
  //           this.unitList2.push(obj)
  //         }
  //       )
  //       this.unitNoList2 = this.unitList2
  //       this.startValue2 = this.localStorage.retrieve('selectedbuyerID');
  //     }
  //   )
  // }

  resetAmount() {
    this.invoiceAmt = ''
  }

  resetDate() {
    this.RangeDate = ' ';
  }

  onSelect(evt: any) {
    let val = evt.target.value;
    this.selectedUnit = val;

    let rec = this.unitList.filter(
      (record: any) => {
        return record.unitNo == val;
      }
    )

    let selectedBuyerId = rec[0]['buyerID'];

    this.invoiceService.getInvoiceList(selectedBuyerId, 1).subscribe(
      (data: any) => {

        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });   
        this.invoiceList = data['records'];
      }
    )
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
          this.invoiceList = data['records'];
        },
        (error) => {
          if (error.status == 404) {
            this.invoiceList = [];
          }
        }
      )
    }
  }

  onUnitSelect(e: any) {

    this.resetDate();
    let SplitPath: any;
    SplitPath = window.location.pathname;
    SplitPath = SplitPath.split('/');
    SplitPath.pop();
    SplitPath.shift();
    SplitPath = SplitPath.join('/');

    this.location.replaceState(SplitPath + '/' + e.value.id)

    if (e.value.id == '0') {
      let buyerID = this.localStorage.retrieve('selectedbuyerID');

      this.invoiceService.getInvoiceList(buyerID, 1).subscribe(
        (data: any) => {
          const paginationButtons = $('li.pages');

          paginationButtons.each(function() {
            
            if($(this).hasClass('active'))
              $(this).children().first().addClass("focused-pagination-button");
            else
              $(this).children().first().removeClass("focused-pagination-button");
          });   
          this.invoiceList = data['records'];
          this.localStorage.store('selectedbuyerID', buyerID)
        }
      )
    }

    if (e.value.id > 0) {
      this.invoiceService.getInvoiceList(e.value.id, 1).subscribe(
        (data: any) => {
          const paginationButtons = $('li.pages');

          paginationButtons.each(function() {
            
            if($(this).hasClass('active'))
              $(this).children().first().addClass("focused-pagination-button");
            else
              $(this).children().first().removeClass("focused-pagination-button");
          });   
          this.invoiceList = data['records'];
          this.localStorage.store('selectedbuyerID', e.value.id)
        }, (error) => {
          if (error.status == '404') {
            this.invoiceList = [];
          }
        }
      )
      this.setInitPageData(e.value.id, 1);
    }

    // window.location.reload();
    // this.activateRoute.url.subscribe(
    //   (res) => {
    //     this.id = res[1].path
    //   }
    // )

    // this.setInitPageData(this.id);
  }

  onUnitSelect2(e: any) {
    this.MeterUniqList = [];
    this.meterNoList = '';
    this.unitNumberCheck = '';
    this.prepayForMeterNo = false
    this.unitNumberCheck = '';
    this.paymentMod = null;
    this.localStorage.store('selectedbuyerID', e.value)
    if (e.value > 0) {
      this.isUnit = true;
      this.setValidations();
      this.unitNumberCheck = e.value

      this.invoiceService.meterUniquePoints(e.value).subscribe(
        (resp: any) => {
          this.meterList = resp;
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
          this.MeterUniqList = [];
          this.startValue = this.localStorage.retrieve('selectedbuyerID');
        })

      this.invoiceService.getBuyerGeneralSettings(e.value).subscribe(
        (data: any) => {
          this.minimumPaymentAmount = data['minimum_payment_amount'];
          this.paymentMod = data['enable_prepay_payment'];
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

  CloseModal() {

    if (this.modalRef)
      this.modalRef?.hide();
    this.resetAmount();
    this.PrepayMeterCheck = 1
    this.amount = ''



  }

  getPrepayforlist(e: any) {
    this.isPrepay = false;
    this.setValidations();
    this.prepayForMeterNo = true
    if (e.target.checked) {
      this.PrepayMeterCheck = 2
      this.payAgainstCheck = false
      this.meterValue = false;

    }
  }
  getPaymentAgainstforlist(e: any) {
    this.payAgainstCheck = e.target.checked;
    if (e.target.checked) {
      this.isPrepay = true;
      this.setValidations();
      this.prepayForMeterNo = false;
      this.PrepayMeterCheck = 1;
      this.meterValue = true;
    }
  }

  onMeterSelect(e: any) {
    this.localStorage.store('meterUniqPoint', e.value)

    if (e.value) {
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

  curentPage : number = 1;
  getPageData(e: any) {
    let buyerID = this.localStorage.retrieve('selectedbuyerid');
    // For Buyer Role Pagination
    if (this.count > 0 && typeof this.companyId === 'undefined') {
      this.companyId = 0;
    }
    
    if (this.companyId < 1 || this.flag === 'none') {
      // this.setInitPageData(e.value);
      this.setInitPageData(buyerID, e.page);
    }
  }

  setInitPageData(id: any, pageNum: number) {
    this.invoiceService.getInvoiceList(id, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });   
        this.invoiceList = data['records'];
        this.count = data['totalRecords'];
      },
      (error) => {
        this.invoiceList = [];
        this.count = 0;
      }
    )
  }


  /******End Search utility*********/

  // paymentForm = new FormGroup({
  //   amount: new FormControl()
  // })

  formValidate() {
    this.paymentForm = this.formbuilder.group({
      bankname: ['', Validators.required],
      branchname: ['', [Validators.required, Validators.maxLength(100)]],
      instrumentno: ['', [Validators.required, Validators.maxLength(20)]],
      instrumentdate: ['', Validators.required],
      cardissuer: ['', [Validators.required, Validators.maxLength(100)]],
      cardnumber: ['', [Validators.required, Validators.maxLength(4)]],
      amount: ['', Validators]
    })
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
  udf_1: any
  udf_2: any;
  udf_3: any;
  udf_4: any;
  udf_5: any;
  hdfc_key: any;

  paymentRedirection(paymnetmodeVal: any) {
    if (paymnetmodeVal < '2' || paymnetmodeVal === 'Online Payment - Paytm') {
      this.getBlinkCheckOutflag();
    }
    if (this.currentProjectId === undefined || this.currentProjectId === null) {
      this.currentProjectId = this.localStorage.retrieve('projectid')
    }
    this.paytmURL = '';
    if (localStorage.getItem('selectPayment') === 'Online Payment - Paytm') {
      localStorage.setItem('selectPayment', 'payTm');
    } else if (localStorage.getItem('selectPayment') === 'Online Payment - HDFC') {
      localStorage.setItem('selectPayment', 'HDFC');
    }
    else if (localStorage.getItem('selectPayment') === 'Online Payment - PayU') {
      localStorage.setItem('selectPayment', 'PayU');
    }
    console.log(localStorage.getItem('selectPayment'), "dsddd")
    this.dataService.getpaymentDirctionRoles(this.currentProjectId, localStorage.getItem('selectPayment')).subscribe(
      (data) => {
        const ispaymentConfic = data;
        if (ispaymentConfic === 1) {
          if (paymnetmodeVal == '2' || paymnetmodeVal == '9'
            || paymnetmodeVal == 'Online Payment - HDFC' || paymnetmodeVal == 'Online Payment - PayU') {
            this.paytmURL = this.dataService.hdfcUrl;
          } else {
            this.paytmURL = this.dataService.paytmUrl;
          }
          console.log(this.paytmURL, '1')
        } else {
          if (paymnetmodeVal == '2' || paymnetmodeVal == '9'
            || paymnetmodeVal == 'Online Payment - HDFC' || paymnetmodeVal == 'Online Payment - PayU') {
            this.paytmURL = this.dataService.hdfcDevUrl;
          } else {
            this.paytmURL = this.dataService.paytmDevUrl;
          }
        }
      });
  }

  getBlinkCheckOutflag() {
    if (this.currentProjectId === undefined || this.currentProjectId === null) {
      this.currentProjectId = this.localStorage.retrieve('projectid')
    }
    this.dataService.getBlinkCheckOut(this.currentProjectId).subscribe(
      (data) => {
        this.blinkCheckoutFlag = data;
      });
  }

  onPaymentSubmit() {
    debugger
    this.paymentRedirection(this.selectPaymentModeId);
    console.log(this.selectPaymentModeId, "this.selectPaymentModeId")
    let amt = (<any>this.paymentForm).get('amount')?.value;
    localStorage.setItem('amnt', amt)
    let buyerID = this.localStorage.retrieve('selectedbuyerID');
    if (this.prepayForMeterNo) {
      this.uniqPoint = this.localStorage.retrieve('meterUniqPoint');
      this.localStorage.clear('meterUniqPoint');
    }
    else {
      this.uniqPoint = null
    }
    if (amt > 0) {
      if (this.selectPaymentModeId < '2') {
        this.dataService.getMyAccountInformation().subscribe(
          (data: any) => {
            let usr = {
              groupID: data["0"].groupId,
              mobile: data["0"].mobilePhone,
              email: data["0"].emailId,
              buyerId: buyerID,
              loginId: data["0"].appLoginId,
              amount: amt,
              callback: this.redirectUrl,
              UniquePoint: this.uniqPoint


            }
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
                this.dataService.createBlinkPayment(usr).subscribe(
                  (data: any) => {
                    this.paytmDialog(data.merchantParams);
                    // this.toastr.success('Payment processed successfully.The updated status will be shown after the payment reconciliation process is complete.', ''
                    // , {
                    //   disableTimeOut: true
                    // });
                    //   this.mid = data['merchantParams'].MID;
                    //   this.channel_id = data['merchantParams'].CHANNEL_ID;
                    //   this.industry_type_id = data['merchantParams'].INDUSTRY_TYPE_ID
                    //   this.website = data['merchantParams'].WEBSITE;
                    //   this.callback_url = data['merchantParams'].CALLBACK_URL;
                    //   this.cust_id = data['merchantParams'].CUST_ID;
                    //   this.order_id = data['merchantParams'].ORDER_ID;
                    //   this.txn_amount = data['merchantParams'].TXN_AMOUNT;
                    //   this.checksum = data['merchantParams'].CHECKSUMHASH;
                    //   this.mobileNo = data['merchantParams'].MOBILE_NO;
                    //   this.emailAdd = data['merchantParams'].EMAIL;

                    //   this.appRef.tick();

                    //   this.localStorage.store('callback', this.callback_url)
                    // },
                    // (err) => {
                    //   this.toastr.error('Payment Processing Failed. Please try again later.', ''
                    //   , {
                    //     disableTimeOut: true
                    //   });
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
      if (this.selectPaymentModeId > '1') {
        if (this.selectPaymentModeId != '6') {
          this.selectedCardType = '';
        }
        if ((<any>this.paymentForm).get('instrumentdate')?.value) {
          const currentDate = new Date((<any>this.paymentForm).get('instrumentdate')?.value).toString();
          this.newDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
        } else {
          this.newDate = '';
        }
        if (localStorage.getItem('selectPayment') === 'Online Payment - Paytm') {
          localStorage.setItem('selectPayment', 'payTm');
        } else if (localStorage.getItem('selectPayment') === 'Online Payment - HDFC') {
          localStorage.setItem('selectPayment', 'HDFC');
        }
        else if (localStorage.getItem('selectPayment') === 'Online Payment - PayU') {
          localStorage.setItem('selectPayment', 'PayU');
        }
        console.log(localStorage.getItem('selectPayment'), "dsddd11", this.amt, 'ammmmmnt')
        this.dataService.getMyAccountInformation().subscribe(
          (data: any) => {
            let usr = {
              groupID: data["0"].groupId,
              mobile: data["0"].mobilePhone,
              email: data["0"].emailId,
              buyerId: buyerID,
              loginId: data["0"].appLoginId,
              amount: localStorage.getItem('amnt'),
              callback: this.redirectUrl,
              UniquePoint: this.uniqPoint,
              paymnetmode: localStorage.getItem('selectPayment'),
              PaymentGateWay: localStorage.getItem('selectPayment'),
              bankname: this.selectedBank,
              branchname: (<any>this.paymentForm).get('branchname')?.value,
              instrumentno: (<any>this.paymentForm).get('instrumentno')?.value,
              instrumentdate: this.newDate,
              cardissuer: (<any>this.paymentForm).get('cardissuer')?.value,
              cardtype: this.selectedCardType,
              cardnumber: (<any>this.paymentForm).get('cardnumber')?.value

            }

            if (this.selectPaymentModeId !== '2') {
              if (this.selectPaymentModeId !== '9') {
                this.dataService.processPayment(usr).subscribe(
                  (data: any) => {
                    if (data.item1 == true) {
                      this.toastr.success(data.item2, ''
                        , {
                          disableTimeOut: true
                        });
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
                      this.toastr.success(data.item2, ''
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
            if (this.selectPaymentModeId === '2' || this.selectPaymentModeId === '9') {
              this.dataService.hdfcCreatePayment(usr).subscribe(
                (data: any) => {
                  // if (data.item1 == true) {
                  // this.toastr.success(data.item2, ''
                  // , {
                  //   disableTimeOut: true
                  // });
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
                  // }
                  // else {
                  //   this.toastr.success(data.item2, ''
                  //   , {
                  //     disableTimeOut: true
                  //   });
                  // }
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
        )
      }
    }
  }

  onPaymentSubmitFromChild(usr: any) {
    debugger;
    localStorage.setItem('selectPayment', usr.paymnetmode);
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
          this.dataService.createBlinkPayment(usr).subscribe(
            (data: any) => {
              localStorage.setItem('amnt', usr.amount)
              this.paytmDialog(data.merchantParams);
              // this.toastr.success('Payment processed successfully.The updated status will be shown after the payment reconciliation process is complete.', ''
              // , {
              //   disableTimeOut: true
              // });
              //   this.mid = data['merchantParams'].MID;
              //   this.channel_id = data['merchantParams'].CHANNEL_ID;
              //   this.industry_type_id = data['merchantParams'].INDUSTRY_TYPE_ID
              //   this.website = data['merchantParams'].WEBSITE;
              //   this.callback_url = data['merchantParams'].CALLBACK_URL;
              //   this.cust_id = data['merchantParams'].CUST_ID;
              //   this.order_id = data['merchantParams'].ORDER_ID;
              //   this.txn_amount = data['merchantParams'].TXN_AMOUNT;
              //   this.checksum = data['merchantParams'].CHECKSUMHASH;
              //   this.mobileNo = data['merchantParams'].MOBILE_NO;
              //   this.emailAdd = data['merchantParams'].EMAIL;

              //   this.appRef.tick();

              //   this.localStorage.store('callback', this.callback_url)
              // },
              // (err) => {
              //   this.toastr.error('Payment Processing Failed. Please try again later.', ''
              //   , {
              //     disableTimeOut: true
              //   });
            },
            // () => {
            //   let form: HTMLFormElement = <HTMLFormElement>document.getElementById('paytmform');
            //   form.submit();
            // }
          )
        }
      }, 1000);
    }

    if (usr.paymnetmode != 'Online Payment - Paytm') {
      if (usr.paymnetmode !== 'Online Payment - HDFC') {
        if (usr.paymnetmode !== 'Online Payment - PayU') {
          this.dataService.processPayment(usr).subscribe(
            (data: any) => {
              if (data.item1 == true) {
                this.toastr.success(data.item2, ''
                  , {
                    disableTimeOut: true
                  });
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
      if (usr.paymnetmode === 'Online Payment - HDFC' || usr.paymnetmode === 'Online Payment - PayU') {
        console.log(usr.paymnetmode, '1')
        this.selectedPaymentMode = usr.paymnetmode;
        this.dataService.hdfcCreatePayment(usr).subscribe(
          (data: any) => {
            // if (data.item1 == true){
            // this.toastr.success(data.item2, ''
            // , {
            //   disableTimeOut: true
            // });
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
            this.hdfc_email = data['merchantParams'].email;

            this.appRef.tick();

            this.localStorage.store('callback', this.callback_url)
            // } else {
            //   this.toastr.error(data.item2, ''
            //   , {
            //     disableTimeOut: true
            //   });
            // }
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

  }

  paytmDialog(paytmObj: any) {

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


  ngOnDestroy() {
    this.unitService.getAllUnitsNo()
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
