import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { DataService } from '../../service/data.service';
import { LocalStorageService } from 'ngx-webstorage';
// import { Select2OptionData } from 'ng2-select2';
import { BuyerService } from '../../service/common/buyer.service';
import { CompanyService } from '../../service/common/company.service';
import { ProjectService } from '../../service/common/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
// import { Select2Module } from 'ng2-select2';
// import { PaginationModule } from 'ngx-pagination-bootstrap';
import * as $ from 'jquery';
import { SelectionType } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxDropdownConfig } from 'ngx-select-dropdown';

interface clistItem {
  id: string;
  text: string;
}

interface cLocationItem {
  id: string;
  text: string;
}

interface arr1Item {
  id: string;
}

interface sortObjItem {
  [key: string]: Boolean;
}

interface CustomDropdownConfig extends NgxDropdownConfig {
  displayKey: string;
  search: boolean;
  selectAllLabel: string;
}

@Component({
  selector: 'pa-buyers',
  templateUrl: './buyers.component.html',
  styleUrls: ['./buyers.component.css'],
  animations: [
    trigger('animateOnAction', [
      transition('fadeOut<=>fadeIn', [
        animate(1500, style({ opacity: 1 })),
        animate(3000, style({ opacity: 1 })),
        animate(100, style({ opacity: 0 }))
      ])
    ])
  ]
})

export class BuyersComponent implements OnInit {  
  @Output() refreshParent = new EventEmitter();
  @Output() fadeInState = new EventEmitter();
  
  selectedDropDown = 'none';
  count: any;
  cBuyers: any;
  sortobj: sortObjItem = { sortBy: false };
  checked: boolean = false;
  list: any;
  cList: clistItem[] = [];
  cLocation: cLocationItem[] = [];
  public companyList: any[] = [];
  public locationList: any[] = [];
  public projectList: any[] = [];
  public userTypeSelect: any;
  public selected: any;

  bindVar = 'fadeOut';
  activateStatus: any;
  deactivateStatus: any;
  mailSent: any;
  smsSent: any;
  resetPassEmailSent: any;
  classStatus: any;
  failureResponse: any;
  arr1: arr1Item[] = [];
  activateSelectedEmailSent: any;
  bulkEmailSent: any;
  compLocId: any;
  bindCompany = true;
  startValue: any;
  locId: any;
  projId: any;
  message : any;
  selectionType: Object | undefined;

  isDropDownShow : boolean = false;
  cbuyer : any;
  htmlContent : any;

  editorConfig = {
    "editable": true,
    "spellcheck": true,
    "height": "auto",
    "minHeight": "500",
    "width": "auto",
    "minWidth": "0",
    "enableToolbar": true,
    "showToolbar": true,
    "placeholder": "Enter text here...",
    "toolbar": [
        ["bold", "italic", "underline"],
        ["fontName", "fontSize", "color"],
        ["undo", "redo"],
        ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"]
    ]
  }

  public modalRef: BsModalRef | undefined

  config : CustomDropdownConfig = {
    // displayFn:(item: any) => { return item.hello.world; } //to support flexible text displaying for each item
    displayKey: "text",
    search: true,
    selectAllLabel: 'Select all',
    height: '',
    placeholder: '',
    customComparator: function (a: any, b: any): number {
      return 0;
      // throw new Error('Function not implemented.');
    },
    limitTo: 0,
    moreText: '',
    noResultsFound: '',
    searchPlaceholder: '',
    searchOnKey: '',
    clearOnSelection: false,
    inputDirection: ''
  }
  errorResponse: any;
  sendMail: any;
  emailId: any;
  smsForm: any;
  mobilePhone: any;
  submitted: boolean = false;
  erStatus: boolean = false;
  formEmail: any;
  formMessage: any;
  formSubject: any;
  
  constructor(private modalService: BsModalService, private router: Router, private dataService: DataService, private localStorage: LocalStorageService, private buyerService: BuyerService, private companyService: CompanyService, private activatedRoute: ActivatedRoute, private projectService: ProjectService/**service**/) { }

  fadeIn() {
    this.bindVar = 'fadeIn'
  }

  fadeOut() {
    this.bindVar = 'fadeOut'
  }

  dispMessage(e: any) {
    (e);
    if (e.successStatus == true) {
      switch (e.successType) {
        case "activate":
          this.activateStatus = 'success'
          this.classStatus = 'success'
          this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
          break;
        case "deactivate":
          this.deactivateStatus = 'success'
          this.classStatus = 'success'
          this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
          break;
        case "mailSent":
          this.mailSent = 'success'
          this.classStatus = 'success'
          this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
          break;
        case "smsSent":
          this.smsSent = 'success'
          this.classStatus = 'success'
          this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
          break;
        case "resetPassEmailSent":
          this.resetPassEmailSent = 'success'
          this.classStatus = 'success'
          this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
          break;
        default:
          break;
      }
    }

    if (e.successStatus == false) {
      switch (e.successType) {
        case "activate":
          this.activateStatus = 'fail'
          this.classStatus = 'fail'
          this.failureResponse = e.errorResponse
          this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
          break;
        case "deactivate":
          this.deactivateStatus = 'fail'
          this.classStatus = 'fail'
          this.failureResponse = e.errorResponse
          this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
          break;
        case "mailNotSent":
          this.mailSent = 'fail'
          this.classStatus = 'fail'
          this.failureResponse = e.errorResponse
          this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
          break;
        case "smsNotSent":
          this.smsSent = 'fail'
          this.classStatus = 'fail'
          this.failureResponse = e.errorResponse
          this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
          break;
        case "resetPassEmailNotSent":
          this.resetPassEmailSent = 'fail'
          this.classStatus = 'fail'
          this.failureResponse = e.errorResponse
          this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
          break;
        default:
          break;
      }
    }
  }

  animEnd() {
    this.activateStatus = ''
    this.deactivateStatus = ''
    this.mailSent = ''
    this.smsSent = ''
    this.resetPassEmailSent = ''
    this.classStatus = ''
    this.activateSelectedEmailSent = ''
    this.bulkEmailSent = ''
  }

  ngOnInit() {
    this.selectionType = SelectionType;
    this.localStorage.clear('orderBy');
    window.onload = () => {
      this.resetFromSearch();
    }

    // this.dropdownInit()
    
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
        this.cBuyers = data['records'];
        this.count = data['totalRecords']
      }
    )

    if (this.localStorage.retrieve('fromSearch') == 0) {
      ('from init')
      this.buyersInit();
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
          this.cBuyers = data['records'];
          this.count = data['totalRecords']
        }
      )
      this.buyerInitFromSearch()
    }

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
  }

  onRefreshParent(e: any) {
    if (e.response == true) {
      if (e.pageNum > 0) {
        if ((this.companyId == undefined || this.companyId == 0) && this.locationId == undefined && this.projectId == undefined && this.userType == undefined) {
          this.setInitPageData(e.pageNum)
        } else if ((this.locationId == undefined || this.locationId == 0) && this.projectId == undefined && this.userType == undefined) {
          this.setPageDataByCompany(this.companyId, e.pageNum)
        } else if ((this.projectId == undefined || this.projectId == 0) && this.userType == undefined) {
          this.setPageDataByCompanyAndLocation(this.companyId, this.locationId, e.pageNum)
        } else if (this.userType == undefined || this.userType == 'User Type') {
          this.setPageDataByCompanyAndLocationAndProject(this.companyId, this.locationId, this.projectId, e.pageNum)
        } else {
          this.setPageDataByCompanyAndLocationAndProjectAndUser(this.companyId, this.locationId, this.projectId, this.userType, e.pageNum)
        }
      } else {
        this.setPageDataByCompanyAndLocationAndProjectAndUser(this.companyId, this.locationId, this.projectId, this.userType, 1)
      }
    }
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

    this.userTypeSelect = [
      {
        id: 0,
        text: 'User Type'
      }
    ]
  }

  resetFromSearch() {
    this.localStorage.store('fromSearch', 0);
    this.localStorage.store('fromProject', 0);
    this.localStorage.store('fromCompany', 0);
    this.buyersInit();
  }

  buyersInit() {
    let fromProject = this.localStorage.retrieve('fromProject');
    let fromCompany = this.localStorage.retrieve('fromCompany');
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
    // this.setInitPageData(1)
  }

  buyerInitFromSearch() {
    this.dropdownInit(false);
    this.dataService.searchInputValue.subscribe(
      (searchText) => {
        (searchText)
        this.searchInputValue = searchText;
      }
    )
  }

  companyId: any;
  locationId: any;
  projectId: any;
  userType: any;
  searchInputValue: any;
  flag = 'none';

  setInitPageData(pageNum: number) {
    this.buyerService.getBuyersListByPageNo(pageNum).subscribe(
      (data: any) => {
        (data);
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });  
        this.cBuyers = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.cBuyers = [];
        this.count = 0;
      }
    )
  }

  setPageDataByCompany(companyId: any, pageNum: number) {
    this.buyerService.getBuyerListByCompanyId(companyId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });  
        this.cBuyers = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.cBuyers = [];
        this.count = 0;
      }
    )
  }

  setPageDataByCompanyAndLocation(companyId: any, locationId: any, pageNum: number) {
    this.buyerService.getBuyerListByCompanyIdAndLocationId(companyId, locationId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });  
        this.cBuyers = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.cBuyers = [];
        this.count = 0;
      }
    )
  }

  setPageDataByCompanyAndLocationAndProject(companyId: any, locationId: any, projectId: any, pageNum: number) {
    this.buyerService.getBuyerListByCompanyIdAndLocationIdAndProjectId(companyId, locationId, projectId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });  
        this.cBuyers = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.cBuyers = [];
        this.count = 0;
      }
    )
  }

  setPageDataByCompanyAndLocationAndProjectAndUser(companyId: any, locationId: any, projectId: any, userType: any, pageNum: number) {
    this.buyerService.getBuyerListByCompanyIdAndLocationIdAndProjectIdAndUsertype(companyId, locationId, projectId, userType, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });  
        this.cBuyers = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.cBuyers = [];
        this.count = 0;
      }
    )
  }

  setPageDataByProject(companyId: any, locationId: any, projectId: any, pageNum: number) {
    this.buyerService.getBuyerListByCompanyIdAndLocationIdAndProjectId(companyId, locationId, projectId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });  
        this.cBuyers = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.cBuyers = [];
        this.count = 0;
      }
    )
  }

  setPageDataBySearch(searchInputValue: any, pageNum: number) {
    this.buyerService.getBuyerListBySearchInputValue(searchInputValue, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });  
        this.cBuyers = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.cBuyers = [];
        this.count = 0;
      }
    )
  }

  public changed(e: any): void {
    this.selected = e.value;
  }

  sortTableBy(sortBy: any) {
    this.sortobj[sortBy] = !this.sortobj[sortBy];
    var sortOrder = this.sortobj[sortBy] ? 'order by ' + sortBy : 'order by ' + sortBy + ' Desc';
    this.buyerService.getBuyersByOrder(sortOrder).subscribe(
      (data: any) => {
        this.localStorage.store('orderBy', sortOrder);
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });  
        this.cBuyers = data['records'];
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

    this.userTypeSelect = [
      {
        id: 0,
        text: 'User Type'
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

  setAllChecked(e: any) {
    this.dataService.setChecked(e.target.checked);
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
      this.localStorage.store('fromSearch', 0)
      this.locationList = [{
        id: 0,
        text: 'Location'
      }];
      this.projectList = [{
        id: 0,
        text: 'Projects'
      }];
      this.userTypeSelect = [{
        id: 0,
        text: 'User Type'
      }];
      this.setInitPageData(1);
    }

    if (this.companyId > 0) {
      this.flag = 'company';
      this.localStorage.store('fromSearch', 0)
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
      this.localStorage.store('fromSearch', 0)
      this.projectList = [{
        id: 0,
        text: 'Projects'
      }];
      this.userTypeSelect = [{
        id: 0,
        text: 'User Type'
      }];
      this.setPageDataByCompany(this.companyId, 1)
    }

    if (this.companyId > 0 && this.locationId > 0) {
      this.flag = 'company&location';
      this.localStorage.store('fromSearch', 0)
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

    if (this.projectId == 0) {
      this.flag = 'company&location'
      this.localStorage.store('fromSearch', 0)
      this.userTypeSelect = [{
        id: 0,
        text: 'User Type'
      }];
      this.setPageDataByCompanyAndLocation(this.companyId, this.locationId, 1)
    }

    if (this.companyId > 0 && this.locationId > 0 && this.projectId > 0) {
      this.flag = 'company&location&project';
      this.localStorage.store('fromSearch', 0)
      this.userTypeSelect = [];
      this.userTypeSelect = this.dataService.getStatusList();
      this.setPageDataByCompanyAndLocationAndProject(this.companyId, this.locationId, this.projectId, 1)
    }
  }

  onUserTypeSelect(e: any) {
    this.userType = e.value.id;
    (this.userType)

    if (this.userType > -1) {
      this.flag = 'company&location&project&user'
      this.localStorage.store('fromSearch', 0)
      this.setPageDataByCompanyAndLocationAndProjectAndUser(this.companyId, this.locationId, this.projectId, this.userType, 1)
    }

    if (this.userType == 'User Type') {
      this.flag = 'company&location&project';
      this.localStorage.store('fromSearch', 0)
      this.userTypeSelect = [];
      this.userTypeSelect = this.dataService.getStatusList();
      this.setPageDataByCompanyAndLocationAndProject(this.companyId, this.locationId, this.projectId, 1)
    }
  }

  curentPage : number = 1;
  getPageData(e: any) {console.log(e);
    const pageNo = e.page;
    this.curentPage = pageNo;
    this.localStorage.store('pageNum', pageNo)
    //(e)
    //(this.flag) // NEED TO CHECK THIS FIX OF PAGINATION
    if (this.localStorage.retrieve('fromSearch') == 1) {
      this.setPageDataBySearch(this.searchInputValue, pageNo)
    } else {
      if (this.companyId < 1 && this.flag === 'none') {
        this.setInitPageData(pageNo)
      } else if (this.companyId > 0 && this.flag === 'company') {
        this.setPageDataByCompany(this.companyId, pageNo)
      } else if (this.companyId > 0 && this.locationId > 0 && this.flag === 'company&location') {
        this.setPageDataByCompanyAndLocation(this.companyId, this.locationId, pageNo)
      } else if (this.companyId > 0 && this.locationId > 0 && this.projectId > 0 && this.flag === 'company&location&project') {
        this.setPageDataByCompanyAndLocationAndProject(this.companyId, this.locationId, this.projectId, pageNo)
      } else if (this.companyId > 0 && this.locationId > 0 && this.projectId > 0 && this.userType > -1 && this.flag === 'company&location&project&user') {
        this.setPageDataByCompanyAndLocationAndProjectAndUser(this.companyId, this.locationId, this.projectId, this.userType, pageNo)
      }
    }

    this.checked = false;
    this.dataService.setChecked(false);
  }

  sendToAllInactiveBuyers(e: any) {
    e.preventDefault();
    this.buyerService.sendToInactiveBuyers().subscribe(
      (resp) => {
        ("Success status: " + resp);
        if (resp == true) {
          this.bulkEmailSent = 'success';
          this.classStatus = 'success';
          this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
        }
      },
      (error) => {
        this.bulkEmailSent = 'fail';
        this.classStatus = 'fail';
        this.failureResponse = error.error
        this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
      }
    )
  }

  sendToSelectedBuyers(e: any) {
    e.preventDefault();
    this.buyerService.sendActivateEmailToSelectedBuyers(this.arr1).subscribe(
      (resp) => {
        if (resp == true) {
          this.activateSelectedEmailSent = 'success'
          this.classStatus = 'success'
          this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
        }
      },
      (error) => {
        (error);
        this.activateSelectedEmailSent = 'fail'
        this.classStatus = 'fail'
        this.failureResponse = error.error
        this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
      }
    )
  }


  getAllChecked(e: any) {
    if (e.status == true) {
      this.arr1.push(e.id)
    } else {
      let i = this.arr1.indexOf(e.id)
      this.arr1.splice(i, 1)
    }
    (this.arr1);
  }

  sendBuyerID(e : any, buyerId : any) {
    e.preventDefault();
    this.dataService.setCbuyerId(buyerId);
  }

  goTo(unit : any, e : any) {
    this.router.navigate(['../unit-detail', unit.buyerId], { relativeTo: this.activatedRoute })
  }

  openActivateUser(e: any, activateUser: any, buyer : any) {
    this.cbuyer = buyer;
    e.preventDefault();
    this.modalRef = this.modalService.show(activateUser)
  }

  activate(appLoginId : any) {
    this.dataService.activateUser(appLoginId).subscribe(
      (resp) => {
        ('Success status :' + resp)
        if (resp == true) {
          let pn = this.localStorage.retrieve('pageNum')
          this.refreshParent.emit({
            response: resp,
            pageNum: pn
          });
          this.fadeInState.emit({
            successStatus: true,
            successType: 'activate'
          })
        }
      },
      (error) => {
        (error)
        this.errorResponse = error.error
        this.fadeInState.emit({
          successStatus: false,
          successType: 'activate',
          errorResponse: this.errorResponse
        })
      }
    )
  }

  openDeactivateUser(e : any, deactivateUser : any, buyer : any) {
    this.cbuyer = buyer;
    e.preventDefault();
    this.modalRef = this.modalService.show(deactivateUser)
  }

  deactivate(appLoginId : any) {
    this.dataService.deactivateUser(appLoginId).subscribe(
      (resp) => {
        ('Success status :' + resp)
        if (resp == true) {
          let pn = this.localStorage.retrieve('pageNum')
          this.refreshParent.emit({
            response: resp,
            pageNum: pn
          });
          this.fadeInState.emit({
            successStatus: true,
            successType: 'deactivate'
          })
        }
      },
      (error) => {
        (error)
        this.errorResponse = error.error
        this.fadeInState.emit({
          successStatus: false,
          successType: 'deactivate',
          errorResponse: this.errorResponse
        })
      }
    )
  }

  openResetPassword(e : any, resetPassword : any, buyer  :any) {
    this.cbuyer = buyer;
    e.preventDefault();
    this.modalRef = this.modalService.show(resetPassword)
  }

  resetPass(appLoginId : any) {
    this.dataService.resetPassword(appLoginId).subscribe(
      (resp) => {
        ('Success status :' + resp)
        if (resp == true) {
          this.dispMessage({
            successStatus: true,
            successType: 'resetPassEmailSent'
          });
          this.fadeInState.emit({
            successStatus: true,
            successType: 'resetPassEmailSent'
          })
        }
      },
      (error) => {
        (error)
        this.errorResponse = error.error
        this.fadeInState.emit({
          successStatus: false,
          successType: 'resetPassEmailNotSent',
          errorResponse: this.errorResponse
        })
       }
      ),
      () => {
        if(this.modalRef != null){
          this.modalRef?.hide();
        }        
      }
  }

  openSendEmail(e : any, sendEmail: TemplateRef<any>, buyer : any) {
    this.cbuyer = buyer;    
    e.preventDefault();
    this.modalRef = this.modalService.show(sendEmail)
    this.sendMail.reset();
    this.emailId = this.cbuyer.emaiID
  }

  resetForm(formName : any) {
    switch (formName) {
      case 'smsForm':
        this.smsForm.reset();
        this.cbuyer.mobileNo = this.mobilePhone
        this.submitted = false;
        this.erStatus = false;
        break;
      case 'sendMail':
        this.sendMail.reset();
        this.cbuyer.emaiID = this.emailId
        this.submitted = false;
        this.erStatus = false;
        break;
    }
  }

  clearEmailContent() {
    this.sendMail.reset()
    this.cbuyer.emaiID = this.emailId
  }

  sendNewMail(d : any, apploginId : any) {
    this.formEmail = d.formEmail;
    this.formMessage = d.formMessage;
    this.formSubject = d.formSubject;
    this.submitted = true;
    if (this.sendMail.valid) {
      this.submitted = false;
      this.erStatus = false;
      this.buyerService.sendManualEmailFromBuyer(this.formEmail, this.formSubject, this.formMessage, apploginId).subscribe(
        (resp) => {
          ('Status success: ' + resp)
          if (resp == true) {
            this.fadeInState.emit({
              successStatus: true,
              successType: 'mailSent'
            })
          }
          if(this.modalRef != null){
            this.modalRef?.hide();
          }          
          this.sendMail.reset();
          this.cbuyer.emaiID = this.emailId
        },
        (error) => {
          (error)
          this.errorResponse = error.error
          this.fadeInState.emit({
            successStatus: false,
            successType: 'mailNotSent',
            errorResponse: this.errorResponse
          })
          if(this.modalRef != null){
            this.modalRef?.hide();
          }     
          this.sendMail.reset();
          this.cbuyer.emaiID = this.emailId
        }
      )
    } else {
      this.erStatus = true;
    }
  }

  clearSmsContent() {
    this.smsForm.reset()
    this.cbuyer.mobileNo = this.mobilePhone
  }

  toogleDropDown() {
    if(this.isDropDownShow == true){
      this.isDropDownShow = false;
    }else{
      this.isDropDownShow = true;
    }
    
  }

  openSendSms(e : any, sendSms: TemplateRef<any>, buyer : any) {
    this.cbuyer = buyer;
    e.preventDefault();
    this.modalRef = this.modalService.show(sendSms)
    this.mobilePhone = this.cbuyer.mobileNo
  }

  mobileNo = '';
  smsSubmitted = false;
  erSmsStatus = false

  sendNewSms(d : any, apploginId : any) {
    this.message = d.message;
    this.mobileNo = d.mobileNo;
    (d)
    this.smsSubmitted = true;

    if (this.smsForm.valid) {
      this.smsSubmitted = false;
      this.erSmsStatus = false;
      this.buyerService.sendManualSms(this.message, this.mobileNo, apploginId).subscribe(
        (resp) => {
          ("Success status: " + resp);
          if (resp == true) {
            this.fadeInState.emit({
              successStatus: true,
              successType: 'smsSent'
            })
          }
          this.modalRef?.hide();
          this.smsForm.reset();
          this.cbuyer.mobileNo = this.mobilePhone
        },
        (error) => {
          (error)
          this.errorResponse = error.error
          this.fadeInState.emit({
            successStatus: false,
            successType: 'smsNotSent',
            errorResponse: this.errorResponse
          })
          this.modalRef?.hide();
          this.smsForm.reset();
          this.cbuyer.mobileNo = this.mobilePhone
        }
      )
    } else {
      this.erSmsStatus = true;
    }
  }



}

