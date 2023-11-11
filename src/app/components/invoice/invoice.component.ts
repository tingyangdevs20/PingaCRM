import { Component, OnInit, Input, TemplateRef, ApplicationRef, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { Select2OptionData } from 'ng2-select2';
import { DataService } from '../../service/data.service';
import { LocalStorageService } from 'ngx-webstorage';
import { InvoiceService } from '../../service/common/invoice.service';
import { UnitService } from '../../service/common/unit.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ProjectService } from '../../service/common/project.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
// import { Key } from 'selenium-webdriver';

interface BankNameList1Item {
  id: number;
  text: string;
}
interface paymentTypesItem {
  id: number;
  text: string;
}
interface unitListItem {
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

@Component({
  selector: 'tr.pa-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  @Input() invoice: any;
  @Output() sendUserInfo = new EventEmitter();
  // charge = {
  //   chargeName: null,
  //   due: null,
  //   tax: null,
  //   netDue: null,
  //   reciveAmount: null
  // };
  list: any;
  unitList: unitListItem[] = [];
  MeterUniqList: MeterUniqListItem[] = [];
  public modalRef: BsModalRef | undefined;
  public unitNoList: any;
  startValue: any;
  invoiceAmt = '';
  loginUserRole: any;
  redirectUrl: any;
  payBtnCheck1: any;
  meterNoList: any;
  paymentCheck: any;
  PrepayMeterCheck: boolean = false;
  buyerId: any;
  meterList: any;
  meterValue: boolean = false;
  uniqPoint: any;
  meterEnableCheck: any;
  payAgainstCheck: any;
  paymentMod: any;
  amountCheck1: boolean = false;
  amountValue: any;
  amt: any;
  amount: any;
  charge: any;
  allProjectList: allProjectListItem[] = [];
  allProjects: allProjectListItem[] = [];
  isPaymentCinfigure: any;
  startValue1: any;
  unitCheck: any;
  paymentTypes: paymentTypesItem[] = [];
  BankNameList: BankNameList1Item[] = [];
  cardTypes = [];
  isBankDropdown: boolean = false;
  isReview: boolean = false;
  isdemandDreft: boolean = false;
  isChaque: boolean = false;
  paymentPopupForm!: FormGroup<any>;
  selectedPaymentMode: any;
  selectPaymentModeId: any;
  isOffline: boolean = false;
  selectedBank: any;
  selectedCardType: any;
  BankNameList1: BankNameList1Item[] = [];
  isProject: boolean = false;
  isUnit: boolean = false;
  newDate: any;
  isDisable: boolean = true;
  isBank: boolean = false;
  isInstrumentNo: boolean = false;
  isBranch: boolean = false;
  amountCheck: boolean = false;
  isPrepay: boolean = false;
  isHdfcFlag: boolean = false;
  isPaytmFlag: boolean = false;
  isNothingpayment: boolean = false;
  isBothpaymentFlag: boolean = false;
  minimumPaymentAmount: number = 0;
  ValidationMsg: any;
  constructor(private toastr: ToastrService, private datePipe: DatePipe, private formbuilder: FormBuilder, private modalService: BsModalService, private projectService: ProjectService, private dataService: DataService, private localStorage: LocalStorageService, private unitService: UnitService, private invoiceService: InvoiceService, private appRef: ApplicationRef) {

  }

  ngOnInit() {

    this.formValidate();
    this.paymentTypes = this.dataService.getPaymentModeList();
    this.cardTypes = this.dataService.getCardTypesList();
    this.payBtnCheck1 = this.localStorage.retrieve('paymentGatewayCheck')
    this.loginUserRole = this.localStorage.retrieve('role');
    if (this.loginUserRole == 'Buyer') {
      this.paymentTypes = [this.paymentTypes[0]];
    }



    this.redirectUrl = document.location.href;

  }

  onPaymentSelect(e: any) {
    debugger;
    this.selectedPaymentMode = e.data[0].text;
    this.setValidations();
    this.selectPaymentModeId = e.value;
    if (e.value == '4' || e.value == '5' || e.value == '7' || e.value == '8') {
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
    console.log(this.isProject, this.isUnit, this.amountCheck, this.isPrepay, "valSaaa", this.selectedPaymentMode)
    if (this.selectedPaymentMode == 'Online Payment - PayU' || this.selectedPaymentMode == 'Online Payment - Paytm' || this.selectedPaymentMode == 'Online Payment - HDFC' || this.selectedPaymentMode == 'Cash') {
      this.isBank = false;
      if (this.isProject && this.isUnit && this.amountCheck && this.isPrepay) {
        console.log('111', this.isProject && this.isUnit && this.amountCheck && this.isPrepay)
        this.isDisable = false;
      } else {
        console.log('222', this.isProject && this.isUnit && this.amountCheck && this.isPrepay)
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

  public openCharge(viewCharge: TemplateRef<any>, e: any) {
    e.preventDefault();
    this.modalRef = this.modalService.show(viewCharge);
  }

  openPay(payNow: TemplateRef<any>, e: any) {

    this.selectedCardType = 'Visa';
    // this.selectedPaymentMode = 'Online Payment - Paytm';
    this.isdemandDreft = false;
    this.isDisable = true;
    this.isChaque = false;
    // this.cardTypes = [];
    this.isReview = false;
    this.isOffline = false;
    this.BankNameList = [];
    this.paymentPopupForm = this.formbuilder.group({
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

  public showCharge() {
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


  onMeterSelect(e: any) {
    this.localStorage.store('meterUniqPoint', e.value)
    if (e.value) {
      this.isPrepay = true;
      this.setValidations();
      this.meterValue = true;
    }
    else {
      this.isPrepay = false;
      this.setValidations();
      this.meterValue = false;
    }
    // this.meterEnableCheck = e.target.checked;
    // this.localStorage.store('meterUniqPoint',this.meterValue)
  }

  onProjectSelect2(e: any) {
    if (e.value > 0) {
      console.log(e.value, "e.value")
      this.isProject = true;
      this.setValidations();
      this.onSelectProjectPaymentConfigure(e.value);
      this.OnlinePaymentType(e.value);
      this.localStorage.store('projectid', e.value);
    } else {
      this.isProject = false;
      this.setValidations();
    }
  }

  OnlinePaymentType(projectid: any) {
    debugger
    this.invoiceService.getOnlinepaymenttype(projectid).subscribe((resp: any) => {
      if (this.loginUserRole == 'Buyer') {
        this.isHdfcFlag = false;
        this.isPaytmFlag = false;
        this.isBothpaymentFlag = false;
        this.paymentTypes = [];
        for (let k = 0; k < Object.keys(resp).length; k++) {
          if (resp[k].key === "PayTm" || resp[k].key === "Paytm") {
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

      // console.log("respqw11", resp, Object.keys(resp).length);
      // // get object count
      // setTimeout(() => {

      //   if (Object.keys(resp).length === 0) {
      //     this.loginUserRole = this.localStorage.retrieve('role');
      //     if (this.loginUserRole == 'Buyer') {
      //       this.isHdfcFlag = false;
      //       this.isPaytmFlag = false;
      //       this.isBothpaymentFlag = false;
      //       this.paymentTypes = [];
      //     } else {
      //       console.log('nothind', Object.keys(resp).length)
      //       this.isHdfcFlag = false;
      //       this.isPaytmFlag = false;
      //       this.isBothpaymentFlag = false;
      //       this.paymentTypes = [
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
      //         }
      //       ];
      //     }

      //   } else if (resp[0].key === 'PayTm' && Object.keys(resp).length === 1) {
      //     console.log('PayTm')
      //     this.loginUserRole = this.localStorage.retrieve('role');
      //     if (this.loginUserRole == 'Buyer') {
      //       this.isPaytmFlag = true;
      //       this.isHdfcFlag = false;
      //       this.isBothpaymentFlag = false;
      //       this.isNothingpayment = false;
      //       this.paymentTypes = this.dataService.getPaymentModeList();
      //       this.paymentTypes = [this.paymentTypes[0]];
      //     } else {
      //       this.isPaytmFlag = true;
      //       this.isHdfcFlag = false;
      //       this.isBothpaymentFlag = false;
      //       this.isNothingpayment = false;
      //       this.paymentTypes = [];
      //       this.paymentTypes = this.dataService.getPaymentModeList();
      //       // for (let i = 0; i < this.paymentTypes.length; i++) {
      //       //   if (this.paymentTypes[i].id === 2) {
      //       //     const index = this.paymentTypes.indexOf(this.paymentTypes[i]);
      //       //     this.paymentTypes.splice(index, 1);
      //       //   }
      //       // }
      //       this.paymentTypes = [
      //         {
      //           id: 1,
      //           text: 'Online Payment - Paytm'
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
      //         }
      //       ];
      //     }
      //   } else if (resp[0].key === 'HDFC' && Object.keys(resp).length === 1) {
      //     this.loginUserRole = this.localStorage.retrieve('role');
      //     console.log('HDFC')
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
      //       this.paymentTypes = [];
      //       // this.paymentTypes = this.dataService.getPaymentModeList();
      //       this.paymentTypes = [
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

      //       ];
      //       // for (let i = 0; i < this.paymentTypes.length; i++) {
      //       //   if (this.paymentTypes[i].id === 1) {
      //       //     const index = this.paymentTypes.indexOf(this.paymentTypes[i]);
      //       //     this.paymentTypes.splice(index, 1);
      //       //   }
      //       // }
      //     }
      //   } else if (Object.keys(resp).length === 2) {
      //     console.log('both')
      //     this.loginUserRole = this.localStorage.retrieve('role');
      //     if (this.loginUserRole == 'Buyer') {
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
      // console.log(this.paymentTypes, "this.paymentTypes")
    });
  }

  onSelectProjectPaymentConfigure(projectid: any) {
    this.unitNoList = []
    this.unitList = []
    this.invoiceService.onSelectPrjctpaymentGatewayConfig(projectid).subscribe(
      (data) => {
        this.isPaymentCinfigure = data
        if (this.isPaymentCinfigure === 1) {
          this.unitCheck = 1;
          let buyerID = this.invoice['buyerID']
          this.localStorage.store('selectedbuyerID', buyerID)
          this.unitService.getAllUnitsNoByProjectId(projectid).subscribe(
            (data) => {
              this.list = data;
              this.list.filter(
                (item: any) => {
                  let obj = {
                    id: item.key,
                    text: item.value
                  }
                  this.unitList.push(obj)
                }
              )
              this.unitNoList = this.unitList
              this.startValue = buyerID
            }
          )
        }
      })
  }

  getPaymentAgainst(e: any) {
    debugger
    this.payAgainstCheck = e.target.checked;
    if (e.target.checked) {
      this.isPrepay = true;
      this.setValidations();
      this.PrepayMeterCheck = false;
      this.meterValue = true;
      //this.opt1 = true;
      // this.opt2 = false;
    }
  }
  getPrepay(e: any) {
    debugger
    this.isPrepay = false;
    this.setValidations();
    if (e.target.checked) {
      this.PrepayMeterCheck = e.target.checked
      this.meterValue = false;
      //this.opt1 = true;
      // this.opt2 = false;
    }
  }

  onPayNow() {
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
        let projectID = this.invoice['projectId'];
        this.startValue1 = projectID;

      }
    )


  }

  // paymentPopupForm = new FormGroup({
  //   amount: new FormControl()


  // })
  formValidate() {
    this.paymentPopupForm = this.formbuilder.group({
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

  paymentPopup() {
    debugger;
    this.amt = (<any>this.paymentPopupForm).get('amount').value;
    let buyerID = this.localStorage.retrieve('selectedbuyerID')

    if (this.PrepayMeterCheck) {
      this.uniqPoint = this.localStorage.retrieve('meterUniqPoint');
      this.localStorage.clear('meterUniqPoint');
    }
    else {
      this.uniqPoint = null
    }

    if (this.amt > 0) {
      if (this.selectPaymentModeId < '2') {
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
              paymnetmode: this.selectedPaymentMode,
              UniquePoint: this.uniqPoint
            }


            this.sendUserInfo.emit(usr)
            //  this.dataService.createPayment(usr).subscribe(
            //   (data) => {

            //     this.mid = data['merchantParams'].MID;
            //     this.channel_id = data['merchantParams'].CHANNEL_ID;
            //     this.industry_type_id = data['merchantParams'].INDUSTRY_TYPE_ID
            //     this.website = data['merchantParams'].WEBSITE;
            //     this.callback_url = data['merchantParams'].CALLBACK_URL;
            //     this.cust_id = data['merchantParams'].CUST_ID;
            //     this.order_id = data['merchantParams'].ORDER_ID;
            //     this.txn_amount = data['merchantParams'].TXN_AMOUNT;
            //     this.checksum = data['merchantParams'].CHECKSUMHASH;
            //     this.mobileNo = data['merchantParams'].MOBILE_NO;
            //     this.emailAdd = data['merchantParams'].EMAIL;

            //     this.appRef.tick();

            //     this.localStorage.store('callback', this.callback_url)
            //   },
            //   (err) => {
            //   },
            //   () => {
            //     let form: HTMLFormElement = <HTMLFormElement>document.getElementById('paytmform1');
            //     form.submit();
            //   }
            // )
          }
        )
      }
      if (this.selectPaymentModeId > '1') {
        if (this.selectPaymentModeId != '6') {
          this.selectedCardType = '';
        }
        if ((<any>this.paymentPopupForm).get('instrumentdate').value) {
          const currentDate = new Date((<any>this.paymentPopupForm).get('instrumentdate').value).toString();
          this.newDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
        } else {
          this.newDate = '';
        }

        //select payment
        if (this.selectedPaymentMode === 'Online Payment - Paytm') {
          this.selectedPaymentMode = 'Online Payment - Paytm';
          localStorage.setItem('paymentGetwayVal', 'Paytm')
        } else if (this.selectedPaymentMode === 'Online Payment - HDFC') {
          this.selectedPaymentMode = 'Online Payment - HDFC';
          localStorage.setItem('paymentGetwayVal', 'HDFC');
        }
        else if (this.selectedPaymentMode === 'Online Payment - PayU') {
          this.selectedPaymentMode = 'Online Payment - PayU';
          localStorage.setItem('paymentGetwayVal', 'PayU');
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
              paymnetmode: this.selectedPaymentMode,
              PaymentGateWay: localStorage.getItem('paymentGetwayVal'),
              bankname: this.selectedBank,
              branchname: (<any>this.paymentPopupForm).get('branchname').value,
              instrumentno: (<any>this.paymentPopupForm).get('instrumentno').value,
              instrumentdate: this.newDate,
              cardissuer: (<any>this.paymentPopupForm).get('cardissuer').value,
              cardtype: this.selectedCardType,
              cardnumber: (<any>this.paymentPopupForm).get('cardnumber').value
            }


            this.sendUserInfo.emit(usr)
          }
        )
      }
    }

  }

  CloseModal() {
    if (this.modalRef)
      this.modalRef?.hide();
    this.amount = '';
    //this.paymentMod= ''
    this.PrepayMeterCheck = false

  }

  onUnitSelectfromPayNow(e: any) {
    //this.PrepayMeterCheck = false
    this.MeterUniqList = [];
    this.meterNoList = '';
    this.localStorage.store('selectedbuyerID', e.value)
    if (e.value > 0) {
      this.isUnit = true;
      this.setValidations();
      this.invoiceService.meterUniquePoints(e.value).subscribe(
        (resp) => {
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
            this.PrepayMeterCheck = false
          }


        }
      )
    } else {
      // this.paymentMod=0;
      this.isUnit = true;
      this.setValidations();
      this.PrepayMeterCheck = false
    }
  }
  unitValue2(e: any) {
    if (e.target.value) {
      this.amountCheck1 = e.target.value
      this.amountCheck = true;

      this.setValidations();
    } else {
      this.amountCheck1 = false
      this.setValidations();
    }

  }

  downloadInvoice(invoice: any, e: any) {
    e.preventDefault();
    let loginId = this.localStorage.retrieve('loginId');
    this.invoiceService.getInvoiceDownloadLink(invoice.installID,
      invoice.groupID, invoice.serverID, invoice.moduleName, loginId).subscribe((response: any) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      });
  }

}
