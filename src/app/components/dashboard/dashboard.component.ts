import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
// import 'rxjs/add/operator/filter';
// import 'rxjs/add/operator/map'
// import { LocalStorageService } from 'ngx-webstorage';
// import { Select2OptionData } from 'ng2-select2';
import * as c3 from 'c3';
import { DataService } from '../../service/data.service';
// import { SlimLoadingBarService } from 'ngx-slim-loading-bar';
import { CompanyService } from '../../service/common/company.service';
// import { stratify, active, axisBottom } from 'd3';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
// import { getMonth } from 'ngx-bootstrap/chronos';
declare var $: any;

interface locationListItem {
  id: number;
  text: string;
}
interface cLocationItem {
  id: number;
  text: string;
}
interface projectListItem {
  id: number;
  text: string;
}
interface unitNoListItem {
  id: number;
  text: string;
}

interface monthsItem {
  key: string;
  value: string;
}
interface cListItem {
  id: number;
  text: string;
}
interface companyListItem {
  id: number;
  text: string;
}
interface cProjectItem {
  id: number;
  text: string;
}
interface ModuleListItem {
  value: string;
  key: number;
}
interface monthListItem { }
interface nextMonthListItem { }
interface last6MonthsListItem { }
interface dueReceiveTrendDataItem {
  value: string;
  minmumvalue: string;
  maximumvalue: string;
  averagevalue: string;
  nintypercentile: string;
  period: string;
}
interface progressCollectionDataItem {
  value: string;
  cummulative_net_due: string;
  cummulative_due: string;
  cummulative_receive: string;
  period: string;
}
interface salesSummaryDataEntity1Item {
  value: string;
  direct_sale: string;
  broker_sale: string;
  other_sale: string;
  unsold: string;
  project_name_erp: string;
}
interface salesSummaryDataEntity2Item {
  total_units: string;
  sale_forthemonth: string;
  yesterday_sale: string;
  today_sale: string;
  broker_sale: string;
  other_sale: string;
  direct_sale: string;
}

interface CustomDropdownConfig extends NgxDropdownConfig {
  displayKey: string;
  search: boolean;
  selectAllLabel: string;
}

@Component({
  selector: 'pa-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.min.css'],
  animations: [
    trigger('slideShow', [
      state('active', style({
        transform: 'translate(0%, -100%) translateZ(0px)'
      })),
      state('inactive', style({
        transform: 'translate(0%, 0%) translateZ(0px)'
      })),
      transition('active <=> inactive', animate('750ms ease'))
    ])
  ]

})
export class DashboardComponent implements OnInit {
  list: any;
  cList: cListItem[] = [];
  companyList: companyListItem[] = [];
  bindCompany: any;
  companyId: any;
  startValue: any;
  compLocId: any;
  locationList: locationListItem[] = [];
  projectList: projectListItem[] = [];
  unitNoList: unitNoListItem[] = [];
  cLocation: cLocationItem[] = [];
  flag: any;
  count: number = 0;
  projectId: any;
  locationId: any;
  bindLocation: any;
  locProjectId: any;
  LocationId: any;
  cProject: cProjectItem[] = [];
  monthDue: any;
  dueSummaryData: any;
  yesterdayDue: any;
  totalDue: any;
  receiptSummaryData: any;
  totalReceipt: any;
  monthReceived: any;
  yesterdayReceived: any;
  salesSummaryData: {
    entity1: salesSummaryDataEntity1Item[],
    entity2: salesSummaryDataEntity2Item[]
  };
  Entity2: any;
  totalSale: any;
  monthSale: any;
  yesterdaySale: any;
  processType: any;
  syncDate: any;
  syncDay: any;
  syncTime: any;
  syncDBData: any;
  SalessummaryEntity1 = [];
  Entity1 = [];
  SalesEntity1Data: Array<any> = []
  directSale: Array<any> = [];
  brokerSale: Array<any> = [];
  otherSale: Array<any> = [];
  unSold: Array<any> = [];
  salesChartData = [];
  // salesChartData1: (string | number)[];
  // salesChartData2: (string | number)[];
  // salesChartData3: (string | number)[];
  // salesChartDat4: (string | number)[];
  data1: any;
  data2: any;
  data3: any;
  data4: any;
  salesAllChartdata: any;
  Data4: any;
  Data1: any;
  Data2: any;
  Data3: any;
  projectNames: Array<any> = [];
  chart1VCalue: boolean = false;
  $el: any
  todaySale: any;
  collectiontableData: any;
  gstNotifyData: any;
  forcastData: any;
  period: any;
  progressCollectionData: progressCollectionDataItem[] = [];
  dueReceiveTrendData: dueReceiveTrendDataItem[] = [];
  todayReceived: any;
  todayDue: any;
  duePeriod: any = '6M';
  receivePeriod: any = '1y';
  netDueReceipt: any;
  commulativeDueReceipt: any;
  netDue: Array<any> = [];
  commulativeDue: Array<any> = [];
  commulativeReceivedDue: Array<any> = [];
  columnValue: any;
  salesChartVCalue: boolean = false;
  progressDueChartValue: boolean = false;
  receivingTrendValue: boolean = false;
  minTrendData: Array<any> = [];
  maxTrendData: Array<any> = [];
  avrgTrendData: Array<any> = [];
  nightyPercentileTrendData: Array<any> = [];
  durationTrendData: Array<any> = [];
  periodsDueReceiptData = ['6M', '1y', '2y', '3y', '5y', 'Max'];
  periodsTrendReceiptData = ['1y', '2y', '3y', '4y', '5y', 'Max'];
  duePeriodeSelectValue: any;
  trendDuration: any;
  trendNewDate: any;
  error: any;
  durationReceivedDue: Array<any> = [];
  receviedDuration: any;
  receivedNewDate: any;
  selected = new FormControl(0);
  tabActive: any;
  countValue: any;
  statusErrorChart: any
  totalSaleDue: any;
  monthList: monthListItem[] = [];
  last6MonthsList: last6MonthsListItem[] = [];
  selectMonth: any;
  monthNumber: any;
  monthDue_Value: any;
  totalDue_Value: any;
  yesterdayDue_Value: any;
  todayDue_Value: any;
  totalSaleDue_Value: any;
  todayReceived_value: any;
  yesterdayReceived_Value: any;
  monthReceived_value: any;
  totalReceipt_Value: any;
  months: monthsItem[] = [];
  brokerSmallSale: any;
  directSmallSale: any;
  otherSmallSale: any;
  saleTillDate: any;
  next3MonthsList: any;
  nextMonthList: nextMonthListItem[] = [];
  @ViewChild('selectdp') selectdp: ElementRef | undefined;
  datalist = [];
  ModuleList: ModuleListItem[] = [];
  cModule : Array<any> = [];
  selectModel: string = '';
  Total: any;
  Totalunits: any;
  totalInvSale: any;
  VacentVal: any;
  OccupieVal: any;
  companyRentedVal: any;
  compnayOwenedVal: any;
  LMcollectionData: any;
  LMInvoiceData: any;
  LMInventoryData: any;
  LMVertualInventoryData : Array<any> = [];
  LMLeaseRentData : Array<any> = [];
  invoiceGenerate: any;
  invoiceNotGenerate: any;
  invoiceToBeGenerate: any;
  LMAssetData : Array<any> = [];
  FATemplateWiseData : Array<any> = [];
  FALocationWiseData : Array<any> = [];
  collectionMonth: any;
  dueForMonth: any;
  dueTillMonth: any;
  NetDue: any;
  currentDate: any;
  firstDay: any;
  lastDate: any;
  fiscalyear: any;
  balanceSheetData: any;
  bankBalanceDetails: any;

  config : CustomDropdownConfig = {
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

  constructor(private dataService: DataService,
    private companyService: CompanyService,
    private datePipe: DatePipe,
    private router: Router, el: ElementRef
  ) {
    this.salesSummaryData = {
      entity1: [{
        value: '',
        direct_sale: '',
        broker_sale: '',
        other_sale: '',
        unsold: '',
        project_name_erp: '',
      }],
      entity2: [{
        total_units: '',
        sale_forthemonth: '',
        yesterday_sale: '',
        today_sale: '',
        broker_sale: '',
        other_sale: '',
        direct_sale: '',
      }]
    }
  }

  public activeSlide1 = 'active';
  public activeSlide2 = 'inactive';

  toggleSlide() {
    this.activeSlide1 = this.activeSlide1 === 'active' ? 'inactive' : 'active';
    this.activeSlide2 = this.activeSlide2 === 'active' ? 'inactive' : 'active';
  }
  setupAnimationLoop() {
    setInterval(() => {
      this.toggleSlide();
    }, 3000); // Change slide every 3 seconds (adjust as needed)
  }


  ngOnInit() {
    this.companyList = [
      {
        id: 0,
        text: 'All Companies'
      }
    ]
    
    this.setupAnimationLoop();
    
    var date = new Date();
    this.monthNumber = date.getMonth() + 1;
    this.dataService.setLoginID();
    this.moduleList();


    this.getCurrentDate();
    this.dbSyncWidget();
  }

  getCurrentDate() {
    this.currentDate = new Date();
    this.firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    // lest date of previous month
    let makeDate = new Date(this.currentDate);
    makeDate.setMonth(makeDate.getMonth() - 1);
    this.lastDate = new Date(makeDate.getFullYear(), makeDate.getMonth() + 1, 0);

    // financial year ....
    this.fiscalyear = "";
    let financialYear = "";
    if ((this.currentDate.getMonth() + 1) <= 3) {
      financialYear = ((this.currentDate.getFullYear() - 1) + "-" + this.currentDate.getFullYear()).toString();
    } else {
      financialYear = (this.currentDate.getFullYear() + "-" + (this.currentDate.getFullYear() + 1)).toString();
    }
    let finalYear = financialYear.split('-')[0].toString();
    this.fiscalyear = '04/01/' + finalYear;
  }

  FAbalancesheet() {
    if (this.companyId == 0 || this.companyId == undefined) {
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
    }
    this.balanceSheetData = [];
    this.companyService.getFAbalancesheet(this.companyId, this.LocationId, this.projectId).subscribe(
      (resp: any) => {
        this.balanceSheetData = resp;
      });
  }

  BankBalanceDetails() {
    if (this.companyId == 0 || this.companyId == undefined) {
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
    }
    this.bankBalanceDetails = [];
    this.companyService.getBankBalanceDetails(this.companyId, this.LocationId, this.projectId).subscribe(
      (resp: any) => {
        this.bankBalanceDetails = resp;
      });
  }

  FATemplateWiseDetails() {
    if (this.companyId == 0 || this.companyId == undefined) {
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
    }
    this.FATemplateWiseData = [];
    this.companyService.getFATemplateWiseDetails(this.companyId, this.LocationId, this.projectId).subscribe(
      (resp: any) => {
        this.FATemplateWiseData = resp;
      });
  }
  FALocationWiseDetails() {
    if (this.companyId == 0 || this.companyId == undefined) {
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
    }
    this.FALocationWiseData = [];
    this.companyService.getFALocationWiseDetails(this.companyId, this.LocationId, this.projectId).subscribe(
      (resp: any) => {
        this.FALocationWiseData = resp;
      });
  }

  LMVertualInventoryDetails() {
    if (this.companyId == 0 || this.companyId == undefined) {
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
    }
    this.LMVertualInventoryData = [];
    this.companyService.getLMVertualInventoryDetails(this.companyId, this.LocationId, this.projectId).subscribe(
      (resp: any) => {
        this.LMVertualInventoryData = resp;
      });
  }

  LMLeaseRentDetails() {
    if (this.companyId == 0 || this.companyId == undefined) {
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
    }
    this.LMLeaseRentData = [];
    this.companyService.getLMLeaseRentDetails(this.companyId, this.LocationId, this.projectId).subscribe(
      (resp: any) => {
        this.LMLeaseRentData = resp;
      });
  }

  LMAssetDetails() {
    if (this.companyId == 0 || this.companyId == undefined) {
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
    }
    this.LMAssetData = [];
    this.companyService.getLMAssetDetails(this.companyId, this.LocationId, this.projectId).subscribe(
      (resp: any) => {
        this.LMAssetData = resp;
      });
  }

  LMcollectionDetails() {
    if (this.companyId == 0 || this.companyId == undefined) {
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
    }
    this.LMcollectionData = [];
    this.companyService.getLMcollectionDetails(this.companyId, this.LocationId, this.projectId).subscribe(
      (resp: any) => {
        this.LMcollectionData = resp;
      });
  }

  LMInvoiceDetails() {
    if (this.companyId == 0 || this.companyId == undefined) {
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
    }
    this.LMInvoiceData = [];
    this.companyService.getLMInvoiceDetails(this.companyId, this.LocationId, this.projectId).subscribe(
      (resp) => {
        this.LMInvoiceData = resp;
      });
  }

  LMInventoryDetails() {
    if (this.companyId == 0 || this.companyId == undefined) {
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
    }
    this.LMInventoryData = [];
    this.companyService.getLMInventoryDetails(this.companyId, this.LocationId, this.projectId).subscribe(
      (resp) => {
        this.LMInventoryData = resp;
      });
  }

  invoiceSummrySmallWidget() {
    if (this.companyId == 0 || this.companyId == undefined) {
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
    }
    this.invoiceGenerate = '';
    this.invoiceNotGenerate = '';
    this.invoiceToBeGenerate = '';
    this.companyService.getInvoiceSummrySmallDetails(this.companyId, this.LocationId, this.projectId).subscribe(
      (resp: any) => {
        for (let i = 0; i < resp.length; i++) {
          this.invoiceGenerate = resp[i].invoiceGenerated;
          this.invoiceNotGenerate = resp[i].invoiceNotGenerated;
          this.invoiceToBeGenerate = resp[i].invoiceToBeGenerated;
        }
      }
    )
  }

  inventorySummrySmallWidget() {
    if (this.companyId == 0 || this.companyId == undefined) {
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
    }
    this.totalInvSale = '';
    this.Totalunits = '';
    this.compnayOwenedVal = '';
    this.companyRentedVal = '';
    this.OccupieVal = '';
    this.VacentVal = '';
    this.companyService.getLMinventorySmallDetails(this.companyId, this.LocationId, this.projectId).subscribe(
      (resp: any) => {
        // const inventoryData = resp;
        for (let i = 0; i < resp.length; i++) {
          this.totalInvSale = resp[i].totalsale;
          this.Totalunits = resp[i].totalunit;
          this.compnayOwenedVal = resp[i].companyowned;
          this.companyRentedVal = resp[i].companyrented;
          this.OccupieVal = resp[i].occupied;
          this.VacentVal = resp[i].vacant;
        }
      }
    )
  }

  dueReceiveSmallWidget() {
    if (this.companyId == 0 || this.companyId == undefined) {
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
    }
    this.collectionMonth = '';
    this.dueForMonth = '';
    this.dueTillMonth = '';
    this.NetDue = '';
    this.companyService.getLMDueReceiveSmallDetails(this.companyId, this.LocationId, this.projectId).subscribe(
      (resp: any) => {
        for (let i = 0; i < resp.length; i++) {
          this.collectionMonth = resp[i].collectionForMonth;
          this.dueForMonth = resp[i].dueForMonth;
          this.dueTillMonth = resp[i].dueTillLatsMonth;
          this.NetDue = resp[i].netDue;
        }
        if (this.NetDue != undefined) {
          if (this.NetDue == 0) {
            this.NetDue = this.NetDue;
          }


          else {
            var price = Math.floor(this.NetDue);
            var price_str = new String(price);
            var price_length = price_str.length;
            var price_split = price_str.split('');
            var word = '';
            var digit = '';
            switch (price_length) {
              case 3:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Hundred';
                break;
              case 4:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'K';
                break;
              case 5:
                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'K';
                break;
              case 6:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Lk.';
                break;
              case 7:
                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'Lk.';
                break;
              case 8:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Cr.';
                break;
              case 9:

                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'Cr.';
                break;
              case 10:
                digit = price_split[0] + price_split[1] + price_split[2] + '.' + price_split[3] + price_split[4];
                word = 'Cr.';
                break;
              case 11:
                digit = price_split[0] + price_split[1] + price_split[2] + price_split[3] + '.' + price_split[4] + price_split[5];
                word = 'Cr.';
                break;
            }
            this.NetDue = digit + ' ' + word;


          }
        }

        if (this.dueTillMonth != undefined) {
          if (this.dueTillMonth == 0) {
            this.dueTillMonth = this.dueTillMonth;
          }

          else {
            var price = Math.floor(this.dueTillMonth);
            var price_str = new String(price);
            var price_length = price_str.length;
            var price_split = price_str.split('');
            var word = '';
            var digit = '';
            switch (price_length) {
              case 3:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Hundred';
                break;
              case 4:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'K';
                break;
              case 5:
                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'K';
                break;
              case 6:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Lk.';
                break;
              case 7:
                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'Lk.';
                break;
              case 8:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Cr.';
                break;
              case 9:

                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'Cr.';
                break;
              case 10:
                digit = price_split[0] + price_split[1] + price_split[2] + '.' + price_split[3] + price_split[4];
                word = 'Cr.';
                break;
              case 11:
                digit = price_split[0] + price_split[1] + price_split[2] + price_split[3] + '.' + price_split[4] + price_split[5];
                word = 'Cr.';
                break;
            }
            this.dueTillMonth = digit + ' ' + word;


          }
        }

        if (this.dueForMonth != undefined) {
          if (this.dueForMonth == 0) {
            this.dueForMonth = this.dueForMonth;
          }

          else {
            var price = Math.floor(this.dueForMonth);
            var price_str = new String(price);
            var price_length = price_str.length;
            var price_split = price_str.split('');
            var word = '';
            var digit = '';
            switch (price_length) {
              case 3:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Hundred';
                break;
              case 4:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'K';
                break;
              case 5:
                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'K';
                break;
              case 6:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Lk.';
                break;
              case 7:
                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'Lk.';
                break;
              case 8:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Cr.';
                break;
              case 9:

                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'Cr.';
                break;
              case 10:
                digit = price_split[0] + price_split[1] + price_split[2] + '.' + price_split[3] + price_split[4];
                word = 'Cr.';
                break;
              case 11:
                digit = price_split[0] + price_split[1] + price_split[2] + price_split[3] + '.' + price_split[4] + price_split[5];
                word = 'Cr.';
                break;
            }
            this.dueForMonth = digit + ' ' + word;


          }
        }


        if (this.collectionMonth != undefined) {
          if (this.collectionMonth == 0) {
            this.collectionMonth = this.collectionMonth;
          }

          else {
            var price = Math.floor(this.collectionMonth);
            var price_str = new String(price);
            var price_length = price_str.length;
            var price_split = price_str.split('');
            var word = '';
            var digit = '';
            switch (price_length) {
              case 3:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Hundred';
                break;
              case 4:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'K';
                break;
              case 5:
                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'K';
                break;
              case 6:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Lk.';
                break;
              case 7:
                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'Lk.';
                break;
              case 8:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Cr.';
                break;
              case 9:

                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'Cr.';
                break;
              case 10:
                digit = price_split[0] + price_split[1] + price_split[2] + '.' + price_split[3] + price_split[4];
                word = 'Cr.';
                break;
              case 11:
                digit = price_split[0] + price_split[1] + price_split[2] + price_split[3] + '.' + price_split[4] + price_split[5];
                word = 'Cr.';
                break;
            }
            this.collectionMonth = digit + ' ' + word;


          }
        }
      });
  }


  moduleList() {
    this.companyService.getModuleList().subscribe(
      (resp: any) => {
        this.ModuleList = resp;
        // this.list.filter(
        //   (mod) => {
        //     let obj = {
        //       id: mod.key,
        //       text: mod.value
        //     }
        //     this.cModule.push(obj);
        //   }
        // )
        // this.ModuleList = this.cModule; 
        this.selectModel = this.ModuleList[0].value;
        this.companyDropdownInit();

      }
    )
  }

  SelectModel(e: any) {
    for (let k = 0; k < Object.keys(this.ModuleList).length; k++) {
      if (this.ModuleList[k].key === parseInt(e.target.value)) {
        this.selectModel = this.ModuleList[k].value;
        break;
      }
    }


    this.companyDropdownInit();
    this.moduleSequenceList();
    if (this.selectModel === 'REMS' || this.selectModel === '1') {
      this.SalesSummaryWidget();
      this.DueSummaryWidget();
      this.ReceiptSummaryWidget();
      this.SalesSummaryTableData();
      this.dashboardERPCollection();
      this.dashboardERPDueReceiveTrend();
      this.dashboardERPForecast();
      this.dashboardERPDueReceiptProgress();
      this.dashboardERPGSTRNotify();
    }
    if (this.selectModel === '2' || this.selectModel === 'LM') {
      this.LMcollectionDetails();
      this.LMInvoiceDetails();
      this.LMInventoryDetails();
      this.LMVertualInventoryDetails();
      this.LMLeaseRentDetails();
      this.LMAssetDetails();
      this.invoiceSummrySmallWidget();
      this.inventorySummrySmallWidget();
      this.dueReceiveSmallWidget();
    } else if (this.selectModel === '4' || this.selectModel === 'FA') {
      this.FATemplateWiseDetails();
      this.FALocationWiseDetails();
      this.FAbalancesheet();
      this.BankBalanceDetails();
    }

  }

  moduleSequenceList() {
    this.companyService.getmoduleSequenceList(this.selectModel).subscribe(
      (resp: any) => {
      });
  }

  companyDropdownInit() {
    this.directSale = [];
    this.brokerSale = [];
    this.otherSale = [];
    this.unSold = [];
    this.projectNames = [];
    // this.salesSummaryData = []
    this.companyService.getAllCompanies(this.selectModel).subscribe(
      (data) => {
        this.cList = [];
        this.list = data;
        this.list.unshift({ 'key': 0, 'value': 'All Companies' })
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
        var e = {
          data: [{ selected: true }],
          value: this.companyId
        }
        this.onCompanySelect(e);
        this.startValue = this.compLocId;
      }
    )
    this.locationList = [
      {
        id: 0,
        text: 'All Locations'
      }
    ]
    this.projectList = [
      {
        id: 0,
        text: 'All Projects'
      }
    ]
  }

  onCompanySelect(e: any) {
    this.directSale = [];
    this.brokerSale = [];
    this.otherSale = [];
    this.unSold = [];
    this.projectNames = [];
    // this.salesSummaryData = []
    let selected = e.data[0].selected;
    this.companyId = e.value;

    if (this.companyId == 0 && selected == false) {
      return;
    }
    if (this.companyId == 0 && selected == true) {
      this.flag = 'none';

      this.locationList = [{
        id: 0,
        text: 'All Locations'
      },
      ];
      this.projectList = [{
        id: 0,
        text: 'All Projects'
      },]

    }


    if (this.companyId > 0) {
      this.flag = 'company';
      this.companyService.getAllLocationByCompanyId(this.companyId).subscribe(
        (alllocationdata) => {
          this.list = [];
          // this.cLocation = [];
          // this.locationList = [];
          this.list = alllocationdata;
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
          var e = {
            data: [{ selected: true }],
            value: this.LocationId
          }
          this.onLocationSelect(e);
          this.startValue = this.locProjectId;
        }
      )
    }
    if (this.companyId == undefined) {
      this.companyId = 0;
    }
    if (this.LocationId == undefined) {
      this.LocationId = 0;
    }
    if (this.projectId == undefined) {
      this.projectId = 0;
    }
    if (this.companyId >= 0 && this.LocationId == 0 && this.projectId == 0) {
      this.LocationId = 0;
      this.projectId = 0;
      if (this.selectModel === 'REMS' || this.selectModel === '1') {
        this.SalesSummaryWidget();
        this.DueSummaryWidget();
        this.ReceiptSummaryWidget();
        this.SalesSummaryTableData();
        this.dashboardERPCollection();
        this.dashboardERPDueReceiveTrend();
        this.dashboardERPForecast();
        this.dashboardERPDueReceiptProgress()
        this.dashboardERPGSTRNotify();
      }


      // LM table data
      if (this.selectModel === '2' || this.selectModel === 'LM') {
        this.invoiceSummrySmallWidget();
        this.inventorySummrySmallWidget();
        this.dueReceiveSmallWidget();
        this.LMcollectionDetails();
        this.LMInvoiceDetails();
        this.LMInventoryDetails();
        this.LMVertualInventoryDetails();
        this.LMLeaseRentDetails();
        this.LMAssetDetails();

      }


      // FA table data
      if (this.selectModel === '4' || this.selectModel === 'FA') {
        this.FATemplateWiseDetails();
        this.FALocationWiseDetails();
        this.FAbalancesheet();
        this.BankBalanceDetails();
      }
    }

    if (this.companyId >= 0 && this.LocationId > 0 && this.projectId > 0) {
      this.LocationId = 0;
      this.projectId = 0;
      if (this.selectModel === 'REMS' || this.selectModel === '1') {
        this.SalesSummaryWidget();
        this.DueSummaryWidget();
        this.ReceiptSummaryWidget();
        this.SalesSummaryTableData();
        this.dashboardERPCollection();
        this.dashboardERPDueReceiveTrend();
        this.dashboardERPForecast();
        this.dashboardERPDueReceiptProgress();
        this.dashboardERPGSTRNotify();
      }


      // LM table data
      if (this.selectModel === '2' || this.selectModel === 'LM') {
        this.invoiceSummrySmallWidget();
        this.inventorySummrySmallWidget();
        this.dueReceiveSmallWidget();
        this.LMcollectionDetails();
        this.LMInvoiceDetails();
        this.LMInventoryDetails();
        this.LMVertualInventoryDetails();
        this.LMLeaseRentDetails();
        this.LMAssetDetails();
      }


      // FA table data
      if (this.selectModel === '4' || this.selectModel === 'FA') {
        this.FATemplateWiseDetails();
        this.FALocationWiseDetails();
        this.FAbalancesheet();
        this.BankBalanceDetails();
      }
    }
  }



  onLocationSelect(e: any) {
    this.directSale = [];
    this.brokerSale = [];
    this.otherSale = [];
    this.unSold = [];
    this.projectNames = [];
    // this.salesSummaryData = []

    let selected = e.data[0].selected;
    this.LocationId = e.value;

    if (this.LocationId == 0 && selected == false) {
      return;
    }
    if (this.LocationId == 0 && selected == true) {
      this.flag = 'none';
      this.projectList = [{
        id: 0,
        text: 'Projects'
      }];
    }
    if (this.LocationId > 0) {
      this.flag = 'location';

      this.companyService.getAllbProjectsByLocationId(this.LocationId).subscribe(
        (data) => {

          this.list = [];
          this.cProject = [];
          this.projectList = [];
          this.list = data;
          this.list.unshift({ 'key': 0, 'value': 'Projects' })
          this.list.filter(
            (prjct: any) => {
              let obj = {
                id: prjct.key,
                text: prjct.value
              }
              this.cProject.push(obj)
            }
          )
          this.projectList = this.cProject
          var e = {
            data: [{ selected: true }],
            value: this.projectId
          }
          this.onProjectSelect(e);
          this.startValue = this.locProjectId;
        }
      )
    }

    if (this.companyId > 0 && this.LocationId > 0 && this.projectId == 0) {
      this.projectId = 0
      if (this.selectModel === 'REMS' || this.selectModel === '1') {
        this.SalesSummaryWidget();
        this.DueSummaryWidget();
        this.ReceiptSummaryWidget();
        this.SalesSummaryTableData()
        this.dashboardERPCollection();
        this.dashboardERPDueReceiveTrend();
        this.dashboardERPForecast();
        this.dashboardERPDueReceiptProgress();
        this.dashboardERPGSTRNotify();
      }


      // LM table data
      if (this.selectModel === '2' || this.selectModel === 'LM') {
        this.invoiceSummrySmallWidget();
        this.inventorySummrySmallWidget();
        this.dueReceiveSmallWidget();
        this.LMcollectionDetails();
        this.LMInvoiceDetails();
        this.LMInventoryDetails();
        this.LMVertualInventoryDetails();
        this.LMLeaseRentDetails();
        this.LMAssetDetails();
      }


      // FA table data
      if (this.selectModel === '4' || this.selectModel === 'FA') {
        this.FATemplateWiseDetails();
        this.FALocationWiseDetails();
        this.FAbalancesheet();
        this.BankBalanceDetails();
      }
    }
    // else if (this.companyId > 0 && this.LocationId > 0 && this.projectId == 0) {
    //   console.log(this.companyId , this.LocationId ,this.projectId,"call4")

    //   this.projectId = 0
    //   if (this.selectModel === 'REMS' || this.selectModel === '1') {
    //     this.SalesSummaryWidget();
    //     this.DueSummaryWidget();
    //     this.ReceiptSummaryWidget();
    //     this.SalesSummaryTableData();
    //     this.dashboardERPCollection();
    //     this.dashboardERPDueReceiveTrend();
    //     this.dashboardERPForecast();
    //     this.dashboardERPDueReceiptProgress();
    //     this.dashboardERPGSTRNotify();
    //   }


    //   // LM table data
    //   if (this.selectModel === '2') {
    //     this.invoiceSummrySmallWidget();
    //     this.inventorySummrySmallWidget();
    //     this.dueReceiveSmallWidget();
    //     this.LMcollectionDetails();
    //     this.LMInvoiceDetails();
    //     this.LMInventoryDetails();
    //     this.LMVertualInventoryDetails();
    //     this.LMLeaseRentDetails();
    //     this.LMAssetDetails();
    //   }


    //   // FA table data
    //   if (this.selectModel === '4') {
    //     this.FATemplateWiseDetails();
    //     this.FALocationWiseDetails();
    //     this.FAbalancesheet();
    //     this.BankBalanceDetails();
    //   }
    // }

  }

  onProjectSelect(e: any) {

    this.directSale = [];
    this.brokerSale = [];
    this.otherSale = [];
    this.unSold = [];
    this.projectNames = [];
    // this.salesSummaryData = []


    let selected = e.data[0].selected;
    this.projectId = e.value;
    if (this.companyId > 0 && this.LocationId > 0 && this.projectId > 0) {

      if (this.selectModel === 'REMS' || this.selectModel === '1') {
        this.SalesSummaryWidget();
        this.DueSummaryWidget();
        this.ReceiptSummaryWidget();
        this.SalesSummaryTableData()
        this.dashboardERPCollection();
        this.dashboardERPDueReceiveTrend();
        this.dashboardERPForecast();
        this.dashboardERPDueReceiptProgress()
        this.dashboardERPGSTRNotify();
      }


      // LM table data
      if (this.selectModel === '2' || this.selectModel === 'LM') {
        this.invoiceSummrySmallWidget();
        this.inventorySummrySmallWidget();
        this.dueReceiveSmallWidget();
        this.LMcollectionDetails();
        this.LMInvoiceDetails();
        this.LMInventoryDetails();
        this.LMVertualInventoryDetails();
        this.LMLeaseRentDetails();
        this.LMAssetDetails();
      }


      // FA table data
      if (this.selectModel === '4' || this.selectModel === 'FA') {
        this.FATemplateWiseDetails();
        this.FALocationWiseDetails();
        this.FAbalancesheet();
        this.BankBalanceDetails();
      }
    }

    // else if (this.companyId > 0 && this.LocationId > 0 && this.projectId == 0) {
    //   console.log(this.companyId , this.LocationId ,this.projectId,"call5")

    //   if (this.selectModel === 'REMS' || this.selectModel === '1') {
    //     this.SalesSummaryWidget();
    //     this.DueSummaryWidget();
    //     this.ReceiptSummaryWidget();
    //     this.SalesSummaryTableData();
    //     this.dashboardERPCollection();
    //     this.dashboardERPDueReceiveTrend();
    //     this.dashboardERPForecast();
    //     this.dashboardERPDueReceiptProgress();
    //     this.dashboardERPGSTRNotify();
    //   }


    //   if (this.selectModel === '2') {
    //     this.invoiceSummrySmallWidget();
    //     this.inventorySummrySmallWidget();
    //     this.dueReceiveSmallWidget();
    //     this.LMcollectionDetails();
    //     this.LMInvoiceDetails();
    //     this.LMInventoryDetails();
    //     this.LMVertualInventoryDetails();
    //     this.LMLeaseRentDetails();
    //     this.LMAssetDetails();
    //   }


    //   if (this.selectModel === '4') {
    //     this.FATemplateWiseDetails();
    //     this.FALocationWiseDetails();
    //     this.FAbalancesheet();
    //     this.BankBalanceDetails();
    //   }
    // }
  }

  dbSyncWidget()  /////small widget
  {
    this.processType = 'Stagedb to Productiondb';
    this.companyService.getDBsysncWidget(this.processType).subscribe(
      (resp) => {
        this.syncDBData = resp
        this.syncDate = this.syncDBData.dbSyncStartDate
        this.syncDay = this.syncDBData.dbSyncDay
        this.syncTime = this.syncDBData.dbSyncTime
      },
      (error) => {
        this.syncDBData = []
        this.syncDate = {}
        this.syncDay = ''
        this.syncTime = ''
      }

    )
  }

  SalesSummaryWidget()    /////small widget
  {
    // this.salesSummaryData = []
    this.totalSale = ''
    this.monthSale = ''
    this.yesterdaySale = ''
    this.todaySale = ''
    this.brokerSmallSale = ''
    this.directSmallSale = ''
    this.otherSmallSale = ''
    this.saleTillDate = ''

    if (this.companyId == undefined || this.companyId == 0) {
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
    }

    this.companyService.getSalesSummaryWidget(this.companyId, this.LocationId, this.projectId).subscribe(
      (resp: any) => {
        this.salesSummaryData = resp

        for (let i = 0; i < this.salesSummaryData.entity2.length; i++) {
          this.Entity2 = this.salesSummaryData.entity2[i].total_units
          this.totalSale = this.salesSummaryData.entity2[i].total_units
          this.monthSale = this.salesSummaryData.entity2[i].sale_forthemonth
          this.yesterdaySale = this.salesSummaryData.entity2[i].yesterday_sale
          this.todaySale = this.salesSummaryData.entity2[i].today_sale
          this.brokerSmallSale = this.salesSummaryData.entity2[i].broker_sale
          this.directSmallSale = this.salesSummaryData.entity2[i].direct_sale
          this.otherSmallSale = this.salesSummaryData.entity2[i].other_sale
          this.saleTillDate = this.brokerSmallSale + this.directSmallSale + this.otherSmallSale
        }
      },
      (error) => {
        // this.salesSummaryData = []
        this.totalSale = ''
        this.monthSale = ''
        this.yesterdaySale = ''
        this.todaySale = ''
        this.brokerSmallSale = ''
        this.directSmallSale = ''
        this.otherSmallSale = ''
        this.saleTillDate = ''
      }
    )
  }


  DueSummaryWidget()   /////small widget
  {
    this.monthDue = ''
    this.totalDue = ''
    this.yesterdayDue = ''
    this.todayDue = ''
    this.totalSaleDue = ''

    if (this.companyId == undefined || this.companyId == 0) {
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
    }

    this.companyService.getDueSummaryWidget(this.companyId, this.LocationId, this.projectId).subscribe(
      (resp) => {
        this.dueSummaryData = resp

        for (let i = 0; i < this.dueSummaryData.length; i++) {
          this.monthDue_Value = this.dueSummaryData[i].month_due
          this.totalDue_Value = this.dueSummaryData[i].total_due
          this.yesterdayDue_Value = this.dueSummaryData[i].yesterday_due
          this.todayDue_Value = this.dueSummaryData[i].today_due
          this.totalSaleDue_Value = this.dueSummaryData[i].total_sale


          if (this.monthDue_Value != undefined) {

            if (this.monthDue_Value == 0) {
              this.monthDue = this.monthDue_Value;
            }

            else {
              var price = Math.floor(this.monthDue_Value);
              var price_str = new String(price);
              var price_length = price_str.length;
              var price_split = price_str.split('');
              var word = '';
              var digit = '';
              switch (price_length) {
                case 3:
                  digit = price_split[0] + '.' + price_split[1] + price_split[2];
                  word = 'Hundred';
                  break;
                case 4:
                  digit = price_split[0] + '.' + price_split[1] + price_split[2];
                  word = 'K';
                  break;
                case 5:
                  digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                  word = 'K';
                  break;
                case 6:
                  digit = price_split[0] + '.' + price_split[1] + price_split[2];
                  word = 'Lk.';
                  break;
                case 7:
                  digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                  word = 'Lk.';
                  break;
                case 8:
                  digit = price_split[0] + '.' + price_split[1] + price_split[2];
                  word = 'Cr.';
                  break;
                case 9:

                  digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                  word = 'Cr.';
                  break;
                case 10:
                  digit = price_split[0] + price_split[1] + price_split[2] + '.' + price_split[3] + price_split[4];
                  word = 'Cr.';
                  break;
                case 11:
                  digit = price_split[0] + price_split[1] + price_split[2] + price_split[3] + '.' + price_split[4] + price_split[5];
                  word = 'Cr.';
                  break;
              }
              this.monthDue = digit + ' ' + word;
              // return value;
            }
          }

          if (this.totalDue_Value != undefined) {

            if (this.totalDue_Value == 0) {
              this.totalDue = this.totalDue_Value;
            }

            else {
              var price = Math.floor(this.totalDue_Value);
              var price_str = new String(price);
              var price_length = price_str.length;
              var price_split = price_str.split('');
              var word = '';
              var digit = '';
              switch (price_length) {
                case 3:
                  digit = price_split[0] + '.' + price_split[1] + price_split[2];
                  word = 'Hundred';
                  break;
                case 4:
                  digit = price_split[0] + '.' + price_split[1] + price_split[2];
                  word = 'K';
                  break;
                case 5:
                  digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                  word = 'K';
                  break;
                case 6:
                  digit = price_split[0] + '.' + price_split[1] + price_split[2];
                  word = 'Lk.';
                  break;
                case 7:
                  digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                  word = 'Lk.';
                  break;
                case 8:
                  digit = price_split[0] + '.' + price_split[1] + price_split[2];
                  word = 'Cr.';
                  break;
                case 9:

                  digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                  word = 'Cr.';
                  break;
                case 10:
                  digit = price_split[0] + price_split[1] + price_split[2] + '.' + price_split[3] + price_split[4];
                  word = 'Cr.';
                  break;
                case 11:
                  digit = price_split[0] + price_split[1] + price_split[2] + price_split[3] + '.' + price_split[4] + price_split[5];
                  word = 'Cr.';
                  break;
              }
              this.totalDue = digit + ' ' + word;
            }
          }

          if (this.yesterdayDue_Value != undefined) {

            if (this.yesterdayDue_Value == 0) {
              this.yesterdayDue = this.yesterdayDue_Value;
            }

            else {
              var price = Math.floor(this.yesterdayDue_Value);
              var price_str = new String(price);
              var price_length = price_str.length;
              var price_split = price_str.split('');
              var word = '';
              var digit = '';
              switch (price_length) {
                case 3:
                  digit = price_split[0] + '.' + price_split[1] + price_split[2];
                  word = 'Hundred';
                  break;
                case 4:
                  digit = price_split[0] + '.' + price_split[1] + price_split[2];
                  word = 'K';
                  break;
                case 5:
                  digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                  word = 'K';
                  break;
                case 6:
                  digit = price_split[0] + '.' + price_split[1] + price_split[2];
                  word = 'Lk.';
                  break;
                case 7:
                  digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                  word = 'Lk.';
                  break;
                case 8:
                  digit = price_split[0] + '.' + price_split[1] + price_split[2];
                  word = 'Cr.';
                  break;
                case 9:

                  digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                  word = 'Cr.';
                  break;
                case 10:
                  digit = price_split[0] + price_split[1] + price_split[2] + '.' + price_split[3] + price_split[4];
                  word = 'Cr.';
                  break;
                case 11:
                  digit = price_split[0] + price_split[1] + price_split[2] + price_split[3] + '.' + price_split[4] + price_split[5];
                  word = 'Cr.';
                  break;
              }
              this.yesterdayDue = digit + ' ' + word;

            }
          }

          if (this.todayDue_Value != undefined) {

            if (this.todayDue_Value == 0) {
              this.todayDue = this.todayDue_Value;
            }

            else {
              var price = Math.floor(this.todayDue_Value);
              var price_str = new String(price);
              var price_length = price_str.length;
              var price_split = price_str.split('');
              var word = '';
              var digit = '';
              switch (price_length) {
                case 3:
                  digit = price_split[0] + '.' + price_split[1] + price_split[2];
                  word = 'Hundred';
                  break;
                case 4:
                  digit = price_split[0] + '.' + price_split[1] + price_split[2];
                  word = 'K';
                  break;
                case 5:
                  digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                  word = 'K';
                  break;
                case 6:
                  digit = price_split[0] + '.' + price_split[1] + price_split[2];
                  word = 'Lk.';
                  break;
                case 7:
                  digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                  word = 'Lk.';
                  break;
                case 8:
                  digit = price_split[0] + '.' + price_split[1] + price_split[2];
                  word = 'Cr.';
                  break;
                case 9:

                  digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                  word = 'Cr.';
                  break;
                case 10:
                  digit = price_split[0] + price_split[1] + price_split[2] + '.' + price_split[3] + price_split[4];
                  word = 'Cr.';
                  break;
                case 11:
                  digit = price_split[0] + price_split[1] + price_split[2] + price_split[3] + '.' + price_split[4] + price_split[5];
                  word = 'Cr.';
                  break;
              }
              this.todayDue = digit + ' ' + word;

            }
          }

          if (this.totalSaleDue_Value != undefined) {

            if (this.totalSaleDue_Value == 0) {
              this.totalSaleDue = this.totalSaleDue_Value;
            }

            else {
              var price = Math.floor(this.totalSaleDue_Value);
              var price_str = new String(price);
              var price_length = price_str.length;
              var price_split = price_str.split('');
              var word = '';
              var digit = '';
              switch (price_length) {
                case 3:
                  digit = price_split[0] + '.' + price_split[1] + price_split[2];
                  word = 'Hundred';
                  break;
                case 4:
                  digit = price_split[0] + '.' + price_split[1] + price_split[2];
                  word = 'K';
                  break;
                case 5:
                  digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                  word = 'K';
                  break;
                case 6:
                  digit = price_split[0] + '.' + price_split[1] + price_split[2];
                  word = 'Lk.';
                  break;
                case 7:
                  digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                  word = 'Lk.';
                  break;
                case 8:
                  digit = price_split[0] + '.' + price_split[1] + price_split[2];
                  word = 'Cr.';
                  break;
                case 9:

                  digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                  word = 'Cr.';
                  break;
                case 10:
                  digit = price_split[0] + price_split[1] + price_split[2] + '.' + price_split[3] + price_split[4];
                  word = 'Cr.';
                  break;
                case 11:
                  digit = price_split[0] + price_split[1] + price_split[2] + price_split[3] + '.' + price_split[4] + price_split[5];
                  word = 'Cr.';
                  break;
              }
              this.totalSaleDue = digit + ' ' + word;


            }
          }
        }
      },
      (error) => {
        this.monthDue = ''
        this.totalDue = ''
        this.yesterdayDue = ''
        this.todayDue = ''
        this.totalSaleDue = ''
      }
    )
  }

  ReceiptSummaryWidget()    /////small widget
  {
    this.totalReceipt = ''
    this.monthReceived = ''
    this.yesterdayReceived = ''
    this.todayReceived = ''

    if (this.companyId == undefined || this.companyId == 0) {
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
    }
    this.companyService.getReceiptSummaryWidget(this.companyId, this.LocationId, this.projectId).subscribe(
      (resp) => {
        this.receiptSummaryData = resp;
        for (let i = 0; i < this.receiptSummaryData.length; i++) {
          this.totalReceipt_Value = this.receiptSummaryData[i].total_receipt;
          this.monthReceived_value = this.receiptSummaryData[i].month_receipt;
          this.yesterdayReceived_Value = this.receiptSummaryData[i].yesterday_receipt;
          this.todayReceived_value = this.receiptSummaryData[i].today_receipt;
        }


        if (this.totalReceipt_Value != undefined) {

          if (this.totalReceipt_Value == 0) {
            this.totalReceipt = this.totalReceipt_Value;
          }

          else {
            var price = Math.floor(this.totalReceipt_Value);
            var price_str = new String(price);
            var price_length = price_str.length;
            var price_split = price_str.split('');
            var word = '';
            var digit = '';
            switch (price_length) {
              case 3:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Hundred';
                break;
              case 4:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'K';
                break;
              case 5:
                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'K';
                break;
              case 6:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Lk.';
                break;
              case 7:
                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'Lk.';
                break;
              case 8:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Cr.';
                break;
              case 9:

                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'Cr.';
                break;
              case 10:
                digit = price_split[0] + price_split[1] + price_split[2] + '.' + price_split[3] + price_split[4];
                word = 'Cr.';
                break;
              case 11:
                digit = price_split[0] + price_split[1] + price_split[2] + price_split[3] + '.' + price_split[4] + price_split[5];
                word = 'Cr.';
                break;
            }
            this.totalReceipt = digit + ' ' + word;


          }
        }


        ///////////



        if (this.monthReceived_value != undefined) {

          if (this.monthReceived_value == 0) {
            this.monthReceived = this.monthReceived_value;
          }

          else {
            var price = Math.floor(this.monthReceived_value);
            var price_str = new String(price);
            var price_length = price_str.length;
            var price_split = price_str.split('');
            var word = '';
            var digit = '';
            switch (price_length) {
              case 3:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Hundred';
                break;
              case 4:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'K';
                break;
              case 5:
                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'K';
                break;
              case 6:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Lk.';
                break;
              case 7:
                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'Lk.';
                break;
              case 8:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Cr.';
                break;
              case 9:

                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'Cr.';
                break;
              case 10:
                digit = price_split[0] + price_split[1] + price_split[2] + '.' + price_split[3] + price_split[4];
                word = 'Cr.';
                break;
              case 11:
                digit = price_split[0] + price_split[1] + price_split[2] + price_split[3] + '.' + price_split[4] + price_split[5];
                word = 'Cr.';
                break;
            }
            this.monthReceived = digit + ' ' + word;


          }
        }


        ///////
        if (this.yesterdayReceived_Value != undefined) {

          if (this.yesterdayReceived_Value == 0) {
            this.yesterdayReceived = this.yesterdayReceived_Value;
          }

          else {
            var price = Math.floor(this.yesterdayReceived_Value);
            var price_str = new String(price);
            var price_length = price_str.length;
            var price_split = price_str.split('');
            var word = '';
            var digit = '';
            switch (price_length) {
              case 3:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Hundred';
                break;
              case 4:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'K';
                break;
              case 5:
                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'K';
                break;
              case 6:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Lk.';
                break;
              case 7:
                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'Lk.';
                break;
              case 8:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Cr.';
                break;
              case 9:

                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'Cr.';
                break;
              case 10:
                digit = price_split[0] + price_split[1] + price_split[2] + '.' + price_split[3] + price_split[4];
                word = 'Cr.';
                break;
              case 11:
                digit = price_split[0] + price_split[1] + price_split[2] + price_split[3] + '.' + price_split[4] + price_split[5];
                word = 'Cr.';
                break;
            }
            this.yesterdayReceived = digit + ' ' + word;


          }
        }


        ///////

        if (this.todayReceived_value != undefined) {

          if (this.todayReceived_value == 0) {
            this.todayReceived = this.todayReceived_value;
          }

          else {
            var price = Math.floor(this.todayReceived_value);
            var price_str = new String(price);
            var price_length = price_str.length;
            var price_split = price_str.split('');
            var word = '';
            var digit = '';
            switch (price_length) {
              case 3:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Hundred';
                break;
              case 4:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'K';
                break;
              case 5:
                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'K';
                break;
              case 6:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Lk.';
                break;
              case 7:
                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'Lk.';
                break;
              case 8:
                digit = price_split[0] + '.' + price_split[1] + price_split[2];
                word = 'Cr.';
                break;
              case 9:

                digit = price_split[0] + price_split[1] + '.' + price_split[2] + price_split[3];
                word = 'Cr.';
                break;
              case 10:
                digit = price_split[0] + price_split[1] + price_split[2] + '.' + price_split[3] + price_split[4];
                word = 'Cr.';
                break;
              case 11:
                digit = price_split[0] + price_split[1] + price_split[2] + price_split[3] + '.' + price_split[4] + price_split[5];
                word = 'Cr.';
                break;
            }
            this.todayReceived = digit + ' ' + word;


          }
        }
      },
      (error) => {
        this.receiptSummaryData = [];
        this.totalReceipt = '';
        this.monthReceived = '';
        this.yesterdayReceived = '';
        this.todayReceived = '';
      }
    )
  }

  SalesSummaryTableData()   /////Sales Table widget
  {
    this.SalesEntity1Data = [];
    // this.salesSummaryData = [];
    this.directSale = [];
    this.brokerSale = [];
    this.otherSale = [];
    this.unSold = [];
    this.projectNames = [];

    if (this.companyId == undefined || this.companyId == 0) {
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
      this.SalesEntity1Data = [];
      // this.salesSummaryData = [];
      this.directSale = [];
      this.brokerSale = [];
      this.otherSale = [];
      this.unSold = [];
      this.projectNames = [];
    }

    this.companyService.getSalesSummaryWidget(this.companyId, this.LocationId, this.projectId).subscribe(
      (resp: any) => {
        this.SalesEntity1Data = [];
        // this.salesSummaryData = [];
        this.directSale = [];
        this.brokerSale = [];
        this.otherSale = [];
        this.unSold = [];
        this.projectNames = [];

        this.count = 0;
        this.salesSummaryData = resp;
        this.directSale.push(this.salesSummaryData.entity1[0].value = 'DirectSale')
        this.brokerSale.push(this.salesSummaryData.entity1[0].value = 'BrokerSale')
        this.otherSale.push(this.salesSummaryData.entity1[0].value = 'OtherSale')
        this.unSold.push(this.salesSummaryData.entity1[0].value = 'Unsold')
        this.projectNames.push(this.salesSummaryData.entity1[0].value = 'x')
        for (let i = 0; i < this.salesSummaryData.entity1.length; i++) {
          this.count++
          this.SalesEntity1Data.push(this.salesSummaryData.entity1[i]);
          this.directSale.push(this.salesSummaryData.entity1[i].direct_sale)
          this.brokerSale.push(this.salesSummaryData.entity1[i].broker_sale)
          this.otherSale.push(this.salesSummaryData.entity1[i].other_sale)
          this.unSold.push(this.salesSummaryData.entity1[i].unsold)
          this.projectNames.push(this.salesSummaryData.entity1[i].project_name_erp)
        }
        if (this.count < 6) {
          this.countValue = 1
        }
        else {
          this.countValue = 0
        }
        ///////Sales Chart widget


        var chart = c3.generate({
          bindto: '#chart',
          data: {
            x: 'x',
            columns: <any>[
              this.projectNames,
              this.directSale,
              this.brokerSale,
              this.otherSale,
              this.unSold],
            type: 'bar',
            groups: [
              ['DirectSale', 'BrokerSale']
            ],
            colors: {
              'DirectSale': '#0c8c2a',
              'BrokerSale': '#2667b7',
              'OtherSale': '#87611c',
              'Unsold': '#bc291c',
            },
            // selection: {
            //   draggable: true
            // }
          },
          axis: {
            x: {
              type: 'category',
              //categories: this.projectNames,
              show: false,
              tick: {
                // show:false,
                //rotate: 0,
                //count: 1,
                //format: function (x) { return ''; }
              },
              height: 40,


            },

          },
          padding: {
            right: 20,
            bottom: 20
          },
          zoom: {
            enabled: true
          },
          size: {
            //width: 2000,
            //  height:300
          },

          grid: {
            y: {
              lines: [{ value: 0 }]
            }
          }
        });

        setTimeout(function () {
          chart.groups([['DirectSale', 'BrokerSale', 'OtherSale']])
        }, 1000);

        setTimeout(() => {
          chart.load({
            columns: <any>[this.unSold],
          });
        }, 1500);

        setTimeout(function () {
          chart.groups([['DirectSale', 'BrokerSale', 'OtherSale', 'Unsold']])
        }, 2000);

      },

      (error) => {
        var chart = c3.generate({
          bindto: '#chart',
          data: {
            x: 'x',
            columns: [

            ],
            type: 'spline',
            groups: [
              ['DirectSale', 'BrokerSale']
            ],
            colors: {
              'DirectSale': '#0c8c2a',
              'BrokerSale': '#2667b7',
              'OtherSale': '#87611c',
              'Unsold': '#bc291c',
            },

            // selection: {
            //   draggable: true
            // }

          },

          axis: {
            x: {
              type: 'category',
              categories: [],
              tick: {
                centered: false,
              },
            },
          },
          zoom: {
            enabled: true
          },
          size: {
            // width: 2000,
            //  height:300
          },
          bar: {
            width: {
              ratio: 1
              // this makes bar width 50% of length between ticks
            }
          },
          grid: {
            y: {
              lines: [{ value: 0 }]
            }
          }
        });

        setTimeout(function () {
          chart.groups([['DirectSale', 'BrokerSale', 'OtherSale']])
        }, 1000);

        setTimeout(function () {
          chart.load({
            columns: [],
          });
        }, 1500);

        setTimeout(function () {
          chart.groups([['DirectSale', 'BrokerSale', 'OtherSale', 'Unsold']])
        }, 2000);
      }

    )
  }


  salesChart() /////for switch on salesChart
  {
    this.salesChartVCalue = false;

    this.SalesSummaryTableData();
  }

  salesTable() /////for switch on salesTable
  {
    this.salesChartVCalue = true;
    this.SalesSummaryTableData();
  }


  dashboardERPCollection()    /////project by due table widget
  {
    this.collectiontableData = []
    if (this.companyId == undefined || this.companyId == 0) {
      this.collectiontableData = []
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
    }

    this.companyService.getDashboardERPCollectionData(this.companyId, this.LocationId, this.projectId).subscribe(
      (resp) => {

        this.collectiontableData = resp
      })
  }


  dashboardERPDueReceiptProgress() ///////Receipt progress table widget
  {
    this.progressCollectionData = []
    this.netDue = []
    this.commulativeDue = []
    this.commulativeReceivedDue = []
    this.durationReceivedDue = []
    if (this.companyId == undefined || this.companyId == 0) {
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
      this.progressCollectionData = []
      this.netDue = []
      this.commulativeDue = []
      this.commulativeReceivedDue = []
      this.durationReceivedDue = []

    }
    this.duePeriodeSelectValue = this.duePeriod
    this.companyService.getDashboardERPDueReceiptProgress(this.duePeriod, this.companyId, this.LocationId, this.projectId).subscribe(
      (resp: any) => {
        this.progressCollectionData = []
        this.netDue = []
        this.commulativeDue = []
        this.commulativeReceivedDue = []
        this.durationReceivedDue = []
        this.progressCollectionData = resp
        this.netDue.push(this.progressCollectionData[0].value = 'Net Due');
        this.commulativeDue.push(this.progressCollectionData[0].value = "Cumulative Due");
        this.commulativeReceivedDue.push(this.progressCollectionData[0].value = "Cummulative Received");
        this.durationReceivedDue.push(this.progressCollectionData[0].value = "x");
        for (let i = 0; i < this.progressCollectionData.length; i++) {
          this.netDue.push(this.progressCollectionData[i].cummulative_net_due);
          this.commulativeDue.push(this.progressCollectionData[i].cummulative_due);
          this.commulativeReceivedDue.push(this.progressCollectionData[i].cummulative_receive);
          //this.receviedDuration = this.progressCollectionData[i].period
          //this.receivedNewDate = this.datePipe.transform(this.receviedDuration, 'yyyy-MM-dd');
          this.durationReceivedDue.push(this.progressCollectionData[i].period);

        }

        /////////Receipt progress chart widget

        var chart1 = c3.generate({
          bindto: '#chart1',
          data: {
            x: 'x',
            columns: <any>[
              this.durationReceivedDue,
              this.netDue,
              this.commulativeDue,
              this.commulativeReceivedDue
            ],
            //type: 'spline',
            colors: {
              'Cummulative Received': '#0c8c2a',
              'Net Due': '#ff8800',
              'Cumulative Due': '#bc291c',

            },
          },
          zoom: {
            enabled: true
          },
          axis: {
            x: {
              type: 'category',
              tick: {
                count: 4,
                multiline: false
                // format: '%b-%Y'
              }
            }
          },
          padding: {
            right: 20
          }
        });
        setTimeout(() => {
          chart1.load({
            columns: <any>[
              this.netDue
            ]
          });
        }, 1000);
        setTimeout(() => {
          chart1.load({
            columns: <any>[
              this.commulativeReceivedDue
            ]
          });
        }, 1500);
        setTimeout(function () {
          chart1.unload({
            ids: 'commulativeDue'
          });
        }, 2000);
      },


      //////ig got error


      (error) => {
        var chart1 = c3.generate({
          bindto: '#chart1',
          data: {
            x: 'x',
            columns: [

            ],
            type: 'spline',
            colors: {
              'Cummulative Received': '#0c8c2a',
              'Net Due': '#ff8800',
              'Cumulative Due': '#bc291c',

            },
          },
          zoom: {
            enabled: true
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                format: '%b-%Y'
              }
            }
          }
        });
        setTimeout(function () {
          chart1.load({
            columns: [

            ]
          });
        }, 1000);
        setTimeout(function () {
          chart1.load({
            columns: [

            ]
          });
        }, 1500);
        setTimeout(function () {
          chart1.unload({
            ids: 'commulativeDue'
          });
        }, 2000);
      }

    )
  }



  periodeValueforProgressDue(periodeV: any)  ////period dynamic value for receipt progress widget
  {
    this.duePeriod = periodeV;
    this.tabActive = 1
    this.dashboardERPDueReceiptProgress()
  }


  duesProgressChart()  ////switch for receipt progress chart
  {
    this.progressDueChartValue = false
    this.dashboardERPDueReceiptProgress();
  }


  duesProgressTable()   ////switch for receipt progress table
  {
    this.progressDueChartValue = true
  }


  dashboardERPDueReceiveTrend()  ///Receiving trend Table widget
  {
    this.dueReceiveTrendData = []
    this.minTrendData = []
    this.maxTrendData = []
    this.avrgTrendData = []
    this.nightyPercentileTrendData = []

    if (this.companyId == undefined || this.companyId == 0) {
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
      this.dueReceiveTrendData = []
      this.minTrendData = []
      this.maxTrendData = []
      this.avrgTrendData = []
      this.nightyPercentileTrendData = []
    }
    this.duePeriodeSelectValue = this.receivePeriod
    this.companyService.getdashboardERPDueReceiveTrend(this.receivePeriod, this.companyId, this.LocationId, this.projectId).subscribe(
      (resp: any) => {
        this.dueReceiveTrendData = []
        this.minTrendData = []
        this.maxTrendData = []
        this.avrgTrendData = []
        this.nightyPercentileTrendData = []
        this.durationTrendData = []

        this.dueReceiveTrendData = resp
        this.minTrendData.push(this.dueReceiveTrendData[0].value = "Min")
        this.maxTrendData.push(this.dueReceiveTrendData[0].value = "Max")
        this.avrgTrendData.push(this.dueReceiveTrendData[0].value = "Average")
        this.nightyPercentileTrendData.push(this.dueReceiveTrendData[0].value = "90 Percentile")
        this.durationTrendData.push(this.dueReceiveTrendData[0].value = "x")
        for (let i = 0; i < this.dueReceiveTrendData.length; i++) {
          this.minTrendData.push(this.dueReceiveTrendData[i].minmumvalue)
          this.maxTrendData.push(this.dueReceiveTrendData[i].maximumvalue)
          this.avrgTrendData.push(this.dueReceiveTrendData[i].averagevalue)
          this.nightyPercentileTrendData.push(this.dueReceiveTrendData[i].nintypercentile)
          //this.trendDuration = this.dueReceiveTrendData[i].period
          //this.trendNewDate = this.datePipe.transform(this.trendDuration, 'yyyy-MM-dd');
          this.durationTrendData.push(this.dueReceiveTrendData[i].period)
        }
        ///////Receiving Trend Chart widget

        var chart2 = c3.generate({
          bindto: '#chart2',
          data: {
            x: 'x',
            columns: <any>[
              this.durationTrendData,
              this.minTrendData,
              this.maxTrendData,
              this.avrgTrendData,
              this.nightyPercentileTrendData
            ],
            // type: 'spline',
          },
          zoom: {
            enabled: true
          },
          axis: {
            x: {
              type: 'category',
              tick: {
                count: 3,
                multiline: false
                //format: '%b-%Y'
              }
            }
          },
          padding: {
            right: 20
          }
        });
        setTimeout(() => {
          chart2.load({
            columns: <any>[
              this.minTrendData
            ]
          });
        }, 1000);
        setTimeout(() => {
          chart2.load({
            columns: <any>[
              this.avrgTrendData
            ]
          });
        }, 1500);
        setTimeout(function () {
          chart2.unload({
            ids: 'data2'
          });
        }, 2000);
      },

      (error) => {
        var chart2 = c3.generate({
          bindto: '#chart2',
          data: {
            x: 'x',
            columns: [

            ],
            // type: 'spline',
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {

                format: '%b-%Y'
              }
            }
          }
        });
        setTimeout(function () {
          chart2.load({
            columns: [
              // this.minTrendData
            ]
          });
        }, 1000);
        setTimeout(function () {
          chart2.load({
            columns: [
              // this.avrgTrendData
            ]
          });
        }, 1500);
        setTimeout(function () {
          chart2.unload({
            ids: 'data2'
          });
        }, 2000);
      }

    )
  }

  periodeValueforReceiveTrend(periodeV: any) ////period dynamic value for receipt progress widget
  {
    this.dueReceiveTrendData = []
    this.minTrendData = []
    this.maxTrendData = []
    this.avrgTrendData = []
    this.nightyPercentileTrendData = []
    this.receivePeriod = periodeV;
    this.dashboardERPDueReceiveTrend()
  }

  receivingTrendTable() ////switch for receiving trend Table
  {
    this.receivingTrendValue = true
  }

  receivingTrendChart()   ////switch for receiving trend Chart
  {
    this.receivingTrendValue = false
    this.dashboardERPDueReceiveTrend()
  }

  dashboardERPGSTRNotify()  ///notify table widget
  {
    this.gstNotifyData = []
    if (this.companyId == undefined || this.companyId == 0) {
      this.gstNotifyData = []
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
    }
    this.companyService.getDashboardERPGSTRNotify(this.companyId, this.LocationId, this.projectId, this.monthNumber).subscribe(
      (resp) => {

        this.gstNotifyData = resp

      })
    this.getLast6Month()
  }

  getLast6Month() {
    this.last6MonthsList = []
    this.monthList = []
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var today = new Date();
    var d;
    var month;

    for (var i = 5; i >= 0; i -= 1) {
      d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      month = monthNames[d.getMonth()];
      this.monthList.push(month)
    }
    this.last6MonthsList = this.monthList.reverse()

  }

  onMonthSelect(e: any) {
    this.selectMonth = e.target.value

    this.months = [{ key: "1", value: "January" }, { key: "2", value: "February" }, { key: "3", value: "March" }, { key: "4", value: "April" },
    { key: "5", value: "May" }, { key: "6", value: "June" }, { key: "7", value: "July" }, { key: "8", value: "August" }, { key: "9", value: "September" }
      , { key: "10", value: "October" }, { key: "11", value: "November" }, { key: "12", value: "December" }]

    for (let i = 0; i < this.months.length; i++) {
      if (this.months[i].value == this.selectMonth) {
        this.monthNumber = this.months[i].key;
        break;
      }
    }

    this.dashboardERPGSTRNotify()

  }


  dashboardERPForecast()  ////forecast table widget
  {
    this.nextMonthList = []
    this.next3MonthsList = []

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var today = new Date();
    var d;
    var month;
    for (var i = 2; i >= 0; i -= 1) {
      d = new Date(today.getFullYear(), today.getMonth() + i, 1);
      month = monthNames[d.getMonth()];
      this.nextMonthList.push(month)

    }
    this.next3MonthsList = this.nextMonthList.reverse();


    this.forcastData = []
    if (this.companyId == undefined || this.companyId == 0) {
      this.companyId = 0;
      this.LocationId = 0;
      this.projectId = 0;
      this.forcastData = []
    }
    this.companyService.getDashboardERPForecast(this.companyId, this.LocationId, this.projectId).subscribe(
      (resp) => {

        this.forcastData = resp
      })
  }

  getNumericValue(val: string): number {
    return parseFloat(val);
  }


}
