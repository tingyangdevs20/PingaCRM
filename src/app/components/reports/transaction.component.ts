import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LocalStorageService } from 'ngx-webstorage';
// import 'rxjs/add/operator/map';
import { CompanyService } from '../../service/common/company.service';
import { ProjectService } from '../../service/common/project.service';
import { TransactionService } from '../../service/common/transaction.service';
import { UnitService } from '../../service/common/unit.service';
import { DataService } from '../../service/data.service';
import * as $ from 'jquery';
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
  selector: 'pa-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})

export class TransactionComponent implements OnInit, OnDestroy {
  public companyList: any[] = [];
  public locationList: any[] = [];
  public projectList: any[] = [];
  public unitNoList: any[] = [];
  public unitNoList2: any[] = [];
  public startValue: any;

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

  transaction: any;
  count: any;

  loginUserRole: any;
  list: any;
  companyId: any;
  locationId: any;
  projectId: any;
  unitId: any;
  flag = 'none';
  cList: Array<any> = [];
  bindCompany = true;
  compLocId: any;
  unitList: Array<any> = [];
  cLocation: Array<any> = [];
  currentProjectId: number | undefined;
  isProject: boolean = false;
  unitCheck: any;
  filterData: any;
  fromDate: any;
  toDate: any;
  sortobj: sortobjItem = {
    sortBy: false
  }
  sortOrder: string | undefined;
  pageSize: number | undefined;
  pageNo: number | undefined;


  constructor(private companyService: CompanyService, private transactionservice: TransactionService,
    private ngxService: NgxUiLoaderService, private localStorage: LocalStorageService,
    private unitService: UnitService, private projectService: ProjectService,
    private dataService: DataService
  ) { }
  ngOnInit() {

    this.ngxService.start();
    setTimeout(() => {
      this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
    }, 5000);
    this.sortOrder = this.dataService.getDefaultOrderByOrderId();

    this.pageSize = this.dataService.getPageSize();
    this.pageNo = this.dataService.getBasePageNo();
    this.localStorage.clear('orderBy');
    this.loginUserRole = this.localStorage.retrieve('role');
    if (this.loginUserRole == 'Buyer') {
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
          this.unitNoList2 = this.unitList;

          this.startValue = this.localStorage.retrieve('selectedbuyerID');
        }
      )
    }
    let role = this.localStorage.retrieve('role');
    if (role == 'Client Admin') {
      this.dropdownInit(false)
    }
    this.TransactionInit();
  }

  ngOnDestroy() {
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
          // this.locationList = [];
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

      if (this.filterData != null) {
        this.fromDate = this.dataService.formatedDate(this.filterData[0]);
        this.toDate = this.dataService.formatedDate(this.filterData[1]);
      }
      this.transactionservice.getAllTransaction(this.companyId, this.locationId, this.projectId, this.unitId, this.fromDate, this.toDate, <number>this.pageSize, <number>this.pageNo, this.sortOrder).subscribe(
        (data: any) => {
          data['records'].forEach((item: any) => {
            item.orderid = item.orderID;
            item.transactionid = item.transactionID;
          });
          const paginationButtons = $('li.pages');

          paginationButtons.each(function() {
            
            if($(this).hasClass('active'))
              $(this).children().first().addClass("focused-pagination-button");
            else
              $(this).children().first().removeClass("focused-pagination-button");
          });
        
          this.transaction = data['records'];
          this.count = data['totalRecords']
        },
        (error) => {
          this.transaction = [];
          this.count = 0;
        }
      )
    }
  }

  public TransactionInit() {
    let fromProject = this.localStorage.retrieve('fromProject');
    let fromCompany = this.localStorage.retrieve('fromCompany');
    this.localStorage.store('orderBy', null);
    this.localStorage.store('selectedbuyerID', 0)

    $(".sortable").click(function (index) {
      $(".ngx_pagination .pagination .page-item:nth-child(1) .page-link").trigger("click");
      $(".sortable").removeClass('activeSort');
      $(this).addClass('activeSort');
      if ($(this).hasClass('ascOrder')) {
        $(this).removeClass('ascOrder').addClass('descOrder');
      } else {
        $(this).removeClass('descOrder').addClass('ascOrder');
      }
    });

    //this.dropdownInit(false);
    this.setInitPageData(1);


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
          setTimeout(function () {
            base.bindCompany = true;
            // base.companyList = [];
            base.companyList = base.cList;
            base.companyId = base.compLocId;

            var e = {
              data: [{ selected: true }],
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

    }

    if (this.companyId > 0 && this.locationId > 0) {
      this.flag = 'company&location';
      let loginId = this.localStorage.retrieve('loginId')
      this.projectService.getProjectListByLocationIdAndLoginId(this.locationId, loginId).subscribe(
        (data) => {
          this.list = [];
          this.cLocation = [];
          // this.projectList = [];
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

    }
    if (this.filterData != null) {
      this.fromDate = this.dataService.formatedDate(this.filterData[0]);
      this.toDate = this.dataService.formatedDate(this.filterData[1]);
    }
    this.transactionservice.getAllTransaction(this.companyId, this.locationId, this.projectId, this.unitId, this.fromDate, this.toDate, <number>this.pageSize, <number>this.pageNo, this.sortOrder).subscribe(
      (data: any) => {
        data['records'].forEach((item: any) => {
          item.orderid = item.orderID;
          item.transactionid = item.transactionID;
        });
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.transaction = data['records'];        
        this.count = data['totalRecords']
      },
      (error) => {
        this.transaction = [];
        this.count = 0;
      }
    )
  }

  onProjectSelect(e: any) {

    // let selected = e.data[0].selected;
    this.projectId = e.value.id;



    if (this.companyId > 0 && this.locationId > 0 && this.projectId > 0) {
      this.flag = 'company&location&project';
      this.unitService.getAllUnitsNoByProjectId(this.projectId).subscribe(
        (data) => {
          this.list = [];
          this.cLocation = [];
          this.list = data;
          //this.list.unshift({ 'key': 0, 'value': 'Unit No' })
          this.list.unshift({ 'key': '0', 'value': 'All' });
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


    }
    if (this.filterData != null) {
      this.fromDate = this.dataService.formatedDate(this.filterData[0]);
      this.toDate = this.dataService.formatedDate(this.filterData[1]);
    }
    this.transactionservice.getAllTransaction(this.companyId, this.locationId, this.projectId, this.unitId, this.fromDate, this.toDate, <number>this.pageSize, <any>this.pageNo, this.sortOrder).subscribe(
      (data: any) => {
        data['records'].forEach((item: any) => {
          item.orderid = item.orderID;
          item.transactionid = item.transactionID;
        });
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.transaction = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.transaction = [];
        this.count = 0;
      }
    )
  }
  onUnitSelect2(e: any) {

    // let selected = e.data[0].selected;
    this.unitId = e.value.id;

    if (this.filterData != null) {
      this.fromDate = this.dataService.formatedDate(this.filterData[0]);
      this.toDate = this.dataService.formatedDate(this.filterData[1]);
    }
    this.transactionservice.getAllTransaction(this.companyId, this.locationId, this.projectId, this.unitId, this.fromDate, this.toDate, <number>this.pageSize, <number>this.pageNo, this.sortOrder).subscribe(
      (data: any) => {
        data['records'].forEach((item: any) => {
          item.orderid = item.orderID;
          item.transactionid = item.transactionID;
        });
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.transaction = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.transaction = [];
        this.count = 0;
      }
    )

  }
  getDateRange(value: any): void {
    this.filterData = value;
    let buyerID = this.localStorage.retrieve('selectedbuyerid')
    if (this.filterData != null) {

      this.fromDate = this.dataService.formatedDate(this.filterData[0]);
      this.toDate = this.dataService.formatedDate(this.filterData[1]);

      this.transactionservice.getAllTransaction(this.companyId, this.locationId, this.projectId, this.unitId, this.fromDate, this.toDate, <number>this.pageSize, <number>this.pageNo, this.sortOrder).subscribe(
        (data: any) => {
          data['records'].forEach((item: any) => {
            item.orderid = item.orderID;
            item.transactionid = item.transactionID;
          });
          const paginationButtons = $('li.pages');

          paginationButtons.each(function() {
            
            if($(this).hasClass('active'))
              $(this).children().first().addClass("focused-pagination-button");
            else
              $(this).children().first().removeClass("focused-pagination-button");
          });
          this.transaction = data['records'];
          this.count = data['totalRecords']
        },
        (error) => {
          this.transaction = [];
          this.count = 0;
        }
      )
    }
  }
  sortTableBy(sortBy: any) {

    this.sortobj[sortBy] = !this.sortobj[sortBy];
    let sortOrder = this.sortobj[sortBy] ? 'order by ' + sortBy : 'order by ' + sortBy + ' Desc';
    if (this.filterData != null) {
      this.fromDate = this.dataService.formatedDate(this.filterData[0]);
      this.toDate = this.dataService.formatedDate(this.filterData[1]);
    }
    this.transactionservice.getAllTransaction(this.companyId, this.locationId, this.projectId, this.unitId, this.fromDate, this.toDate, <number>this.pageSize, <number>this.pageNo, sortOrder).subscribe(
      (data: any) => {
        this.localStorage.store('orderBy', sortOrder)
        data['records'].forEach((item: any) => {
          item.orderid = item.orderID;
          item.transactionid = item.transactionID;
        });
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.transaction = data['records'];
      }
    )

    //this.resetDropdown();
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
    }
    ]
    this.bindCompany = false;
    var base = this;

    setTimeout(function () {
      base.bindCompany = true;
      // base.companyList = [];
      base.companyList = base.cList;
      base.companyId = 0;
      base.startValue = "0";
    }, 0);

  }
  setInitPageData(pageNum: number) {

    if (this.filterData != null) {
      this.fromDate = this.dataService.formatedDate(this.filterData[0]);
      this.toDate = this.dataService.formatedDate(this.filterData[1]);
    }
    this.transactionservice.getAllTransaction(this.companyId, this.locationId, this.projectId, this.unitId, this.fromDate, this.toDate, <number>this.pageSize, <number>this.pageNo, this.sortOrder).subscribe(
      (data: any) => {        
        data['records'].forEach((item: any) => {
          item.orderid = item.orderID;
          item.transactionid = item.transactionID;
        });                
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.transaction = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.transaction = [];
        this.count = 0;
      }
    )
  }

  curentPage : number = 1;
  getPageData(e: any) {
    const pageNo = e.page;
    this.curentPage=  pageNo;
    if (this.filterData != null) {
      this.fromDate = this.dataService.formatedDate(this.filterData[0]);
      this.toDate = this.dataService.formatedDate(this.filterData[1]);
    }
    this.transactionservice.getAllTransaction(this.companyId, this.locationId, this.projectId, this.unitId, this.fromDate, this.toDate, <number>this.pageSize, pageNo, this.sortOrder).subscribe(
      (data: any) => {
        data['records'].forEach((item: any) => {
          item.orderid = item.orderID;
          item.transactionid = item.transactionID;
        });        
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.transaction = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.transaction = [];
        this.count = 0;
      }
    )

  }

}
