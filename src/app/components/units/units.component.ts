import { Component, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
// import 'rxjs/add/operator/filter';
// import 'rxjs/add/operator/map'
import { LocalStorageService } from 'ngx-webstorage';
// import { Select2OptionData } from 'ng2-select2'
import { UnitService } from '../../service/common/unit.service';
import { CompanyService } from '../../service/common/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../service/common/project.service';
import * as $ from 'jquery'
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
  selector: 'pa-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {
  state = 'start';
  units: any;
  count: any;
  pageNo: any;
  sortobj: sortobjItem = {
    sortBy: false
  }
  unitNo: boolean = false;
  companyName: boolean = false;
  projectid: boolean = false;
  towerName: boolean = false;
  public companyList: any[] = [];
  public locationList: any[] = [];
  public projectList: any[] = [];
  public unitNoList: any[] = [];
  public selected: any;
  unitList: Array<any> = [];
  cList: Array<any> = [];
  cLocation: Array<any> = [];
  list: any;
  userRole: any;
  selectedDropDown = 'none';
  startValue: any;
  compLocId: any;
  bindCompany = true;
  locId: any;
  projId: any;

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

  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService, private localStorage: LocalStorageService, private unitService: UnitService, private companyService: CompanyService, private activatedRoute: ActivatedRoute, private projectService: ProjectService/**service**/) { }

  ngOnInit() {
    window.onload = () => {
      // this.userRole=this.localStorage.retrieve('role');
      this.resetFromSearch();
    }

    let role = this.localStorage.retrieve('role');
    if (role == 'Client Admin') {
      // this.dropdownInit()
    }

    if(this.companyId == undefined){
      this.companyId = 0;
    }

    this.dataService.searchResponse.subscribe(
      (data) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });        
        this.units = data['records'];
        this.count = data['totalRecords']
      }
    )

    if (this.localStorage.retrieve('fromSearch') == 0) {
      this.unitsInit();
    } else {
      let criteria = this.localStorage.retrieve('criteria');
      let searchText = this.localStorage.retrieve('searchText');
      this.dataService.getSearchResult(criteria, searchText).subscribe(
        (data: any) => {
          const paginationButtons = $('li.pages');

          paginationButtons.each(function() {
            
            if($(this).hasClass('active'))
              $(this).children().first().addClass("focused-pagination-button");
            else
              $(this).children().first().removeClass("focused-pagination-button");
          });          
          this.units = data['records'];
          this.count = data['totalRecords']
        }
      )
      this.unitsInitFromSearch()
    }
  }

  resetFromSearch() {
    this.localStorage.store('fromSearch', 0);
    this.localStorage.store('fromProject', 0);
    this.localStorage.store('fromCompany', 0);
    this.unitsInit();
  }

  public dropdownInit(setDropdownValue: boolean) {
    this.companyService.getCompanyList().subscribe(
      (data) => {
        this.list = data;
        this.list.unshift({ 'key': 0, 'value': 'Company' })

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

    this.unitNoList = [
      {
        id: 0,
        text: 'Unit No'
      }
    ]
  }

  public unitsInit() {
    this.localStorage.store('orderBy', null);
    let fromProject = this.localStorage.retrieve('fromProject');
    let fromCompany = this.localStorage.retrieve('fromCompany');
    /******For Clien Unit page******/
    this.userRole = this.localStorage.retrieve('role');
    /******End cliet unit page******/

    $(".sortable").click((index: any) => {
      $(".ngx_pagination .pagination .page-item:nth-child(1) .page-link").trigger("click");
      $(".sortable").removeClass('activeSort');
      $(this).addClass('activeSort');
      if ($(this).hasClass('ascOrder')) {
        $(this).removeClass('ascOrder').addClass('descOrder');
      } else {
        $(this).removeClass('descOrder').addClass('ascOrder');
      }
    });
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
      this.setInitPageData(1);
      this.dropdownInit(false); //change
    }
    /******For remove select2 on back button ***/
    let sel2 = document.querySelector('.select2-container');
    if (sel2 != null) {
      sel2.remove()
    }

    // this.setInitPageData(1)

  }

  unitsInitFromSearch() {
    this.flag == 'fromSearch'
    this.localStorage.store('orderBy', null);

    /******For Clien Unit page******/
    this.userRole = this.localStorage.retrieve('role');
    /******End cliet unit page******/

    $(".sortable").click((index: any) => {
      $(".ngx_pagination .pagination .page-item:nth-child(1) .page-link").trigger("click");
      $(".sortable").removeClass('activeSort');
      $(this).addClass('activeSort');
      if ($(this).hasClass('ascOrder')) {
        $(this).removeClass('ascOrder').addClass('descOrder');
      } else {
        $(this).removeClass('descOrder').addClass('ascOrder');
      }
    });

    /******For remove select2 on back button ***/
    let sel2 = document.querySelector('.select2-container');
    if (sel2 != null) {
      sel2.remove()
    }

    this.dataService.searchInputValue.subscribe(
      (searchText) => {
        this.searchInputValue = searchText;
      }
    )
  }

  public changed(e: any): void {
    this.selected = e.value;
  }

  sortTableBy(sortBy: any) {
    this.sortobj[sortBy] = !this.sortobj[sortBy];
    var sortOrder = this.sortobj[sortBy] ? 'order by ' + sortBy : 'order by ' + sortBy + ' Desc';
    this.unitService.getUnitbyOrder(sortOrder).subscribe(
      (data: any) => {
        this.localStorage.store('orderBy', sortOrder);
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.units = data['records'];
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

    this.unitNoList = [
      {
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
      base.companyId = "0";
      base.startValue = "0";
    }, 0);
  }



  pageNum: any;
  companyId: any;
  locationId: any;
  projectId: any;
  unitId: any;
  searchInputValue: any;
  flag = 'none';

  setInitPageData(pageNum: number) {
    this.unitService.getUnitsByPageNo(pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.units = data['records'];
        this.count = data['totalRecords']
      },
      (e) => { },
      () => {
        this.state = this.state === 'start' ? 'end' : 'start'
      }
    )
  }

  setPageDataByCompany(companyId: number, pageNum: number) {
    this.unitService.getUnitListByCompanyId(companyId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.units = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.units = [];
        this.count = 0;
      }
    )
  }

  setPageDataByCompanyAndLocation(companyId: number, locationId: number, pageNum: number) {
    this.unitService.getUnitListByCompanyIdAndLocationId(companyId, locationId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.units = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.units = [];
        this.count = 0;
      }
    )
  }

  setPageDataByCompanyAndLocationAndProject(companyId: number, locationId: number, projectId: number, pageNum: number) {
    this.unitService.getUnitListByCompanyIdAndLocationIdAndProjectId(companyId, locationId, projectId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.units = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.units = [];
        this.count = 0;
      }
    )
  }

  setPageDataByCompanyAndLocationAndProjectAndUnit(companyId: number, locationId: number, projectId: number, unitId: number, pageNum: number) {
    this.unitService.getUnitListByCompanyIdAndLocationIdAndProjectIdAndUnitNo(companyId, locationId, projectId, unitId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.units = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.units = [];
        this.count = 0;
      }
    )
  }

  setPageDataByProject(companyId: number, locationId: number, projectId: number, pageNum: number) {
    this.unitService.getUnitListByCompanyIdAndLocationIdAndProjectId(companyId, locationId, projectId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.units = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.units = [];
        this.count = 0;
      }
    )
  }

  setPageDataBySearch(searchInputValue: string, pageNum: number) {
    this.unitService.getUnitListBySearchInputValue(searchInputValue, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.units = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.units = [];
        this.count = 0;
      }
    )
  }

  curentPage : number = 1;
  getPageData(e: any) {
    const pageNo = e.page;
    this.curentPage = pageNo;
    if (this.localStorage.retrieve('fromSearch') == 1) {
      this.setPageDataBySearch(this.localStorage.retrieve('searchText'), pageNo)
    } else {
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
  }

  onCompanySelect(e: any) {
    // let selected  = e.data[0].selected;
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

    // if (this.unitId == 0 && selected == true) {
    if (this.unitId == 0) {
      this.flag = 'company&location&project';
      this.setPageDataByCompanyAndLocationAndProject(this.companyId, this.locationId, this.projectId, 1)
    }

    if (this.companyId > 0 && this.locationId > 0 && this.projectId > 0 && this.unitId > 0) {
      this.flag = 'company&location&project&unit'
      this.setPageDataByCompanyAndLocationAndProjectAndUnit(this.companyId, this.locationId, this.projectId, this.unitId, 1)
    }
  }

  goTo(e : any, unit : any) {
    this.router.navigate(['../unit-detail', unit.buyerID], { relativeTo: this.activatedRoute })
  }

  goToInvoiceList(e : any, unit: any) {
    // e.preventDefault();
    // this.dataService.setCbuyerId(unit.buyerID);
    this.localStorage.store('selectedbuyerID', unit.buyerID);
    this.router.navigate(['../invoice-list', unit.buyerID], {relativeTo: this.route});    
  }

  goToReceiptList(unit: any) {
    this.localStorage.store('selectedbuyerID', unit.buyerID);
    this.router.navigate(['../receipt-list', unit.buyerID], { relativeTo: this.route});
  }


}
