import { Component, OnInit, TemplateRef } from '@angular/core';
import { DataService } from '../../service/data.service';
import { LocalStorageService } from 'ngx-webstorage';
// import { Select2OptionData } from 'ng2-select2';
// import { Observable } from 'rxjs';
// import 'rxjs/add/operator/filter';
import { UnitService } from '../../service/common/unit.service';
import { ReceiptService } from '../../service/common/receipt.service';
import { CompanyService } from '../../service/common/company.service';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { ProjectService } from '../../service/common/project.service';
import * as $ from 'jquery';
import { ChequeComponent } from '../print-layout/cheque/cheque.component';
import { CashComponent } from '../print-layout/cash/cash.component';
import { CardComponent } from '../print-layout/card/card.component';
import { OnlineComponent } from '../print-layout/online/online.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxDropdownConfig } from 'ngx-select-dropdown';


interface CustomDropdownConfig extends NgxDropdownConfig {
  displayKey: string;
  search: boolean;
  selectAllLabel: string;
}

interface sortobjItem {
  [key: string]: Boolean;
}

@Component({
  selector: 'pa-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.css']
})
export class ReceiptsComponent implements OnInit {
  receipts: any;
  count: any;
  sortobj: sortobjItem = {
    sortBy: false
  }
  receiptNo:boolean = false;
  receiptDate:boolean = false;
  type:boolean = false;
  paymentMode:boolean = false;
  instrumentNo:boolean = false;
  bank:boolean = false;
  amount:boolean = false;
  status:boolean = false;
  unitList: Array<any> = [];
  list: any;
  cList: Array<any> = [];
  cLocation: Array<any> = [];
  selectedDropDown: any;
  userRole: any;

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

  public unitNoList: any[]=[];
  public unitNoList2: any[]=[];
  public companyList: any[]=[];
  public locationList: any[]=[];
  public projectList: any[]=[];
  public startValue: any;
  public selected: any;
  yes: any;
  locId: any;
  projId: any;
  compLocId: any;
  bindCompany = true;
  public modalRef: BsModalRef | undefined;

  constructor(private modalService: BsModalService, private dataService: DataService, private localStorage: LocalStorageService, private unitService: UnitService, private receiptService: ReceiptService, private activatedRoute: ActivatedRoute, private companyService: CompanyService, private projectService: ProjectService) {
    
  }

  optData:any=[]; 

  ngOnInit() {  
    this.localStorage.clear('orderBy');
    let role = this.localStorage.retrieve('role');

    if(this.locId == undefined){
      this.locId = 0;
    }

    if(this.projId == undefined){
      this.projId = 0;
    }

    if(this.companyId == undefined){
      this.companyId = 0;
    }

    if (role == 'Buyer') {
      this.unitService.getAllUnitsNo().subscribe(
        (data) => {
          this.list = data;
          this.list.unshift({
            'key': '0',
            'value': 'All'
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
          this.setInitPageData(1);
        }
      )
    }

    this.yes = true;
    window.onload = () => {
      this.resetFromSearch();
    }
    
    let userRole = this.localStorage.retrieve('role');
    if(userRole == 'Client Admin') {
      // this.dropdownInit()
    }
    // this.receiptInit();
   
    console.log("asdfsaf");
    this.userRole=this.localStorage.retrieve('role');
  }
  
  resetFromSearch() {
    this.localStorage.store('fromSearch', 0);
    this.localStorage.store('fromProject', 0);
    this.localStorage.store('fromCompany', 0);
    this.receiptInit();
  }

  receiptInit() {
    this.localStorage.store('orderBy', null);
    this.localStorage.store('selectedbuyerID', 0)
    let fromProject = this.localStorage.retrieve('fromProject');
    let fromCompany = this.localStorage.retrieve('fromCompany')
    $(".sortable").click( (index: any) => {
      $(".ngx_pagination .pagination .page-item:nth-child(1) .page-link").trigger("click");
      $(".sortable").removeClass('activeSort');
      $(this).addClass('activeSort');
      if($(this).hasClass('ascOrder')) {
        $(this).removeClass('ascOrder').addClass('descOrder');
      } else {
        $(this).removeClass('descOrder').addClass('ascOrder');
      }
    });

    if(fromCompany == 1) {
      this.activatedRoute.params.subscribe(
        (resp: any) => {
          this.compLocId = resp.complocId;
          this.dropdownInit(true);    //change           
        }
      )
    } else if(fromProject == 1) {
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
      this.setInitPageData(1);
      this.dropdownInit(false); //change
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
          var base= this;
          this.bindCompany = false;
           setTimeout(function() {
            base.bindCompany = true;
            // base.companyList = [];
            base.companyList = base.cList;
            base.companyId = base.compLocId;
    
            var e = {
              data: [{selected: true}],
              value: base.companyId
            }
            base.onCompanySelect(e);
            base.startValue = base.compLocId;
         }, 0);
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

  companyId: number | undefined;
  locationId: number | undefined;
  projectId: number | undefined;
  unitId: number | undefined;
  searchInputValue: string | undefined;
  flag = 'none';

  sortTableBy(sortBy: any) {
    this.sortobj[sortBy] = !this.sortobj[sortBy];
    let sortOrder = this.sortobj[sortBy] ? 'order by ' + sortBy : 'order by ' + sortBy + ' Desc';
    this.receiptService.getReceiptsByOrder(sortOrder).subscribe(
      (data: any) => {
        this.localStorage.store('orderBy', sortOrder)
        this.receipts = data['records']
      }
    )
    this.resetDropdown();
  }

  public resetDropdown()
{
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
  }
]
    this.bindCompany=false;
    var base = this;

  setTimeout(function(){
    base.bindCompany = true;
    // base.companyList = [];
    base.companyList = base.cList;
    base.companyId = 0;
    base.startValue = 0;
  },0);

}



  public changed(e: any): void {    
    this.selected = e.value;

    this.receiptService.getReceiptsByBuyerId(this.selected).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });
        this.receipts = data['records'];
        this.count = data['totalRecords'];
      }
    )

    if(e.value == 0) {
      this.receiptService.getAllReceiptsByPageNo(1).subscribe(
        (data: any) => {
          const paginationButtons = $('li.pages');

          paginationButtons.each(function() {
            
            if($(this).hasClass('active'))
              $(this).children().first().addClass("focused-pagination-button");
            else
              $(this).children().first().removeClass("focused-pagination-button");
      
          });
          this.receipts = data['records'];
          this.count = data['totalRecords'];
          this.localStorage.store('pageNo', 1);
        }
      )
    }     
  }

  setInitPageData(pageNum: number) {
    this.receiptService.getAllReceiptsByPageNo(pageNum).subscribe(
      (data: any) => {
        this.receipts = data['records'];
        this.count = data['totalRecords'];

        setTimeout(() => {
          const paginationButtons = $('li.pages');

          paginationButtons.each(function() {
            
            if($(this).hasClass('active'))
              $(this).children().first().addClass("focused-pagination-button");
            else
              $(this).children().first().removeClass("focused-pagination-button");
  
          });
        }, 1000);
      },
      (error)=>{
        this.receipts=[];
        this.count=0;
      }
    )
  }

  setPageDataByCompany(companyId: number, pageNum: number) {
    this.receiptService.getReceiptsByCompanyId(companyId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });
        this.receipts = data['records'];
        this.count = data['totalRecords']
      },
      (error)=>{
        this.receipts=[];
        this.count=0;
      }
    )
  }

  setPageDataByCompanyAndLocation(companyId: number, locationId: number, pageNum: number) {
    this.receiptService.getReceiptsByCompanyIdAndLocationId(companyId, locationId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });
        this.receipts = data['records'];
        this.count = data['totalRecords']
      },
      (error)=>{
        this.receipts=[];
        this.count=0;
      }
    )
  }

  setPageDataByCompanyAndLocationAndProject(companyId: number, locationId: number, projectId: number, pageNum: number) {
    this.receiptService.getReceiptsByCompanyIdAndLocationIdAndProjectId(companyId, locationId, projectId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });
        this.receipts = data['records'];
        this.count = data['totalRecords']
      },
      (error)=>{
        this.receipts=[];
        this.count=0;
      }
    )
  }

  setPageDataByCompanyAndLocationAndProjectAndUnit(companyId: number, locationId: number, projectId: number, unitId: number, pageNum: number) {
    this.receiptService.getReceiptsByCompanyIdAndLocationIdAndProjectIdAndUnitNo(companyId, locationId, projectId, unitId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });
        this.receipts = data['records'];
        this.count = data['totalRecords']
      },
      (error)=>{
        this.receipts=[];
        this.count=0;
      }
    )
  }
  setPageDataByProject(companyId: number, locationId: number, projectId: number, pageNum: number) {
    this.receiptService.getReceiptsByCompanyIdAndLocationIdAndProjectId(companyId, locationId, projectId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });
        this.receipts = data['records'];
        this.count = data['totalRecords']
      },
      (error)=>{
        this.receipts=[];
        this.count=0;
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

    if ((<any>this.companyId) > 0) {
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
      this.setPageDataByCompany((<number>this.companyId), 1)
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
      this.setPageDataByCompany((<number>this.companyId), 1)
    }

    if (<number>this.companyId > 0 && <number>this.locationId > 0) {
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
      this.setPageDataByCompanyAndLocation(<number>this.companyId, <number>this.locationId, 1)
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
      this.setPageDataByCompanyAndLocation(<number>this.companyId, <number>this.locationId, 1)
    }

    if (<number>this.companyId > 0 && <number>this.locationId > 0 && <number>this.projectId > 0) {
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
      this.setPageDataByCompanyAndLocationAndProject(<number>this.companyId, <number>this.locationId, <number>this.projectId, 1)
    }
  }

  onUnitSelect(e: any) {
    // let selected = e.data[0].selected;
    this.unitId = e.value.id;

    // if (this.unitId == 0 && selected == false) {
    //   this.localStorage.store('selectedbuyerID', 0)
    // }

    // if (this.projectId == 0 && selected == true) {
    if (this.projectId == 0) {
      this.flag = 'company&location&project';
      this.setPageDataByCompanyAndLocationAndProject(<number>this.companyId, <number>this.locationId, <number>this.projectId, 1)
      this.localStorage.store('selectedbuyerID', 0)
    }

    if (<number>this.companyId > 0 && <number>this.locationId > 0 && <number>this.projectId > 0 && <number>this.unitId > 0) {
      this.flag = 'company&location&project&unit'
      this.setPageDataByCompanyAndLocationAndProjectAndUnit(<number>this.companyId, <number>this.locationId, <number>this.projectId, <number>this.unitId, 1)
      this.localStorage.store('selectedbuyerID', e.value)
    }
  }

  curentPage : number = 1;  
  getPageData(e: any) {
    const pageNo = e.page;
    this.curentPage = pageNo;
    // if (typeof (e.event.itemsCount) == "object") return;
    if(this.userRole=='Buyer'){
      this.receiptService.getAllReceiptsByPageNo(pageNo).subscribe(
        (data: any) => {
          const paginationButtons = $('li.pages');

          paginationButtons.each(function() {
            
            if($(this).hasClass('active'))
              $(this).children().first().addClass("focused-pagination-button");
            else
              $(this).children().first().removeClass("focused-pagination-button");
      
          });
          this.receipts = data['records'];
          this.count = data['totalRecords'];
        }
      )
    }
    if (<number>this.companyId < 1 && this.flag === 'none') {
      this.setInitPageData(pageNo)
    } else if (<number>this.companyId > 0 && this.flag === 'company') {
      this.setPageDataByCompany(<number>this.companyId, pageNo)
    } else if (<number>this.companyId > 0 && <number>this.locationId > 0 && this.flag === 'company&location') {
      this.setPageDataByCompanyAndLocation(<number>this.companyId, <number>this.locationId, pageNo)
    } else if (<number>this.companyId > 0 && <number>this.locationId > 0 && <number>this.projectId > 0 && this.flag === 'company&location&project') {
      this.setPageDataByCompanyAndLocationAndProject(<number>this.companyId, <number>this.locationId, <number>this.projectId, pageNo)
    } else if (<number>this.companyId > 0 && <number>this.locationId > 0 && <number>this.projectId > 0 && <number>this.unitId > 0 && this.flag === 'company&location&project&unit') {
      this.setPageDataByCompanyAndLocationAndProjectAndUnit(<number>this.companyId, <number>this.locationId, <number>this.projectId, <number>this.unitId, pageNo)
    }
  }

  onUnitSelect2(e: any) {
    
    this.receiptService.getReceiptsByBuyerId(e.value).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });
        this.receipts = data['records'];
        this.count = data['totalRecords']
      }
    )

  } 

  openPrePrintModal(e : Event, row : any, printLayoutNotDefinedTemplate: TemplateRef<any>){
    e.preventDefault();
    row.paymentMode = row.paymentMode.toLowerCase();
    if (row.paymentMode != "cheque" && row.paymentMode != "offline rtgs" && row.paymentMode != "offline neft" && row.paymentMode != "demand draft"
    && row.paymentMode != "cash" 
    && row.paymentMode != "offline credit/debit" && row.paymentMode != "offline credit/debit card" 
    && row.paymentMode != "online" && row.paymentMode != "online payment - ici" 
    && row.paymentMode != "ol" && row.paymentMode != "online payment" 
    && row.paymentMode != "hdfc" && row.paymentMode != "online payment - hdf") {
      this.modalRef = this.modalService.show(printLayoutNotDefinedTemplate);
    }
    else {
      this.receiptService.getReceiptPrintDetail(row.receiptNo).subscribe(
        (data) => {
          const initialState = {
            details: data,
          };
          if (row.paymentMode == "cheque" || row.paymentMode == "offline rtgs" || row.paymentMode == "offline neft" || row.paymentMode == "demand draft") {
            this.modalRef = this.modalService.show(ChequeComponent, { initialState, class: 'reciept-modal' });
          }
          else if (row.paymentMode == "cash") {
            this.modalRef = this.modalService.show(CashComponent, { initialState, class: 'reciept-modal' });
          }
          else if (row.paymentMode == "offline credit/debit" || row.paymentMode == "offline credit/debit card") {
            this.modalRef = this.modalService.show(CardComponent, { initialState, class: 'reciept-modal' });
          }
          else if (row.paymentMode == "online" || row.paymentMode == "online payment - ici" 
          || row.paymentMode == "ol" || row.paymentMode == "online payment" 
          || row.paymentMode == "hdfc" || row.paymentMode == "online payment - hdf") {
            this.modalRef = this.modalService.show(OnlineComponent, { initialState, class: 'reciept-modal' });
          }
        },
        (error) => {

        }
      )
    }
  }

}
