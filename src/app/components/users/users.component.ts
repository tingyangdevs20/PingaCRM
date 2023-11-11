import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { DataService } from '../../service/data.service';
import { LocalStorageService } from 'ngx-webstorage';
import { UserService } from '../../service/common/user.service';
import { CompanyService } from '../../service/common/company.service';
import { ProjectService } from '../../service/common/project.service';
import { ActivatedRoute, UrlSegment } from '../../../../node_modules/@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
  selector: 'pa-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
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



export class UsersComponent implements OnInit {
  @Output() refreshParent : EventEmitter<any> = new EventEmitter();
  @Output() fadeInState : EventEmitter<any> = new EventEmitter();
  
  selectedDropDown = 'none';
  count: any;
  users: any;
  list: any;
  cList: Array<any> = [];
  cLocation: Array<any> = [];
  compId: any
  compLocId: any;
  locId: any;
  projId: any;
  public startValue: any;
  public startValue2: any;
  public startValue3: any;
  startValue4: any;
  
  sortobj: sortobjItem = {
    sortBy: false
  }

  public modalRef!: BsModalRef;
  
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
  bindCompany = true;

  smsForm: any;
  sendMail: any;
  emailId : any;
  mobilephone : any;
  user : any;
  formEmail: any;
  formSubject: any;
  formMessage: any;
  submitted = false;
  errorResponse: any;
  erStatus = false;
  htmlContent: any;
  mobileNo = '';
  message: any;
  erSmsStatus = false;
  smsSubmitted = false;

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
  
  constructor(private modalService: BsModalService, private dataService: DataService, private localStorage: LocalStorageService, private userService: UserService, private companyService: CompanyService, private projectService: ProjectService, private activatedRoute: ActivatedRoute) { }

  fadeIn() {
    this.bindVar = 'fadeIn'
  }

  fadeOut() {
    this.bindVar = 'fadeOut'
  }

  dispMessage(e: any) {
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
  }


  ngOnInit() {
    this.localStorage.clear('orderBy');
    window.onload = () => {
      this.resetFromSearch();
    }

    if(this.companyId == undefined){
      this.companyId = 0;
    }
    // this.dropdownInit()

    if (this.localStorage.retrieve('fromSearch') == 0) {
      this.usersInit();
    } else {
      this.usersInitOnSearch()
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


  sortTableBy(sortBy: any) {
    this.sortobj[sortBy] = !this.sortobj[sortBy];
    var sortOrder = this.sortobj[sortBy] ? 'order by ' + sortBy : 'order by ' + sortBy + ' Desc';
    this.userService.getUsersByOrder(sortOrder).subscribe(
      (data: any) => {
        this.localStorage.store('orderBy', sortOrder);
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });
        this.users = data['records'];
      }
    )
    this.resetDropdown();
  }

  //Bug Fix - Refresh filters on sort
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


  public dropdownInit(setDropdownValue: boolean) {
    this.companyService.getCompanyList().subscribe(
      (data) => {
        this.list = data;

        this.list.unshift({ 'key': 0, 'value': 'Company' });

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

        //Bug Fix - Drop down filter select value 
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

    this.usersInit();
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



  usersInit() {
    let fromProject = this.localStorage.retrieve('fromProject');
    let fromCompany = this.localStorage.retrieve('fromCompany');

    if (fromCompany == 1) {

      this.activatedRoute.params.subscribe(
        (resp: any) => {
          this.compLocId = resp.complocId;
          this.dropdownInit(true);    //change           
        }
      )
      // var obj:any = {}
      // obj.value = this.compLocId;
      // obj.data = [{selected: true}];
      // this.onCompanySelect(obj);
      // this.setPageDataByCompanyId(this.compLocId, 1)
    } else if (fromProject == 1) {
      this.activatedRoute.params.subscribe(
        (resp: any) => {
          this.compLocId = resp.complocId;
          this.locId = resp.locId;
          this.projId = resp.projId;
          this.dropdownInit(true);   //change        
        }
      )
      this.setPageDataByProject(this.compLocId, this.locId, this.projId, 1)
    } else {
      this.setInitPageData(1);
      this.dropdownInit(false); //change
    }
  }

  usersInitOnSearch() {
    this.dropdownInit(false); //change
  }

  companyId: any;
  locationId: any;
  projectId: any;
  userType: any;
  searchInputValue: any;
  flag = 'none';

  setInitPageData(pageNum: number) {
    this.userService.getUserListByPageNo(pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });        
        this.users = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.users = [];
        this.count = 0;
      }
    )
  }

  setPageDataByCompany(companyId: number, pageNum: number) {
    this.userService.getUserListByCompanyId(companyId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });
        this.users = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.users = [];
        this.count = 0;
      }
    )
  }

  setPageDataByCompanyAndLocation(companyId: number, locationId: number, pageNum: number) {
    this.userService.getUserListByCompanyIdAndLocationId(companyId, locationId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });
        this.users = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.users = [];
        this.count = 0;
      }
    )
  }

  setPageDataByCompanyAndLocationAndProject(companyId: number, locationId: number, projectId: number, pageNum: number) {
    this.userService.getUserListByCompanyIdAndLocationIdAndProjectID(companyId, locationId, projectId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });
        this.users = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.users = [];
        this.count = 0;
      }
    )
  }

  setPageDataByCompanyAndLocationAndProjectAndUser(companyId: number, locationId: number, projectId: number, userType: any, pageNum: number) {
    this.userService.getUserListByCompanyIdAndLocationIdAndProjectIdAndUsertype(companyId, locationId, projectId, userType, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });
        this.users = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.users = [];
        this.count = 0;
      }
    )
  }

  setPageDataByProject(compId: number, locId: number, projId: any, pageNum: number) {
    this.userService.getUserListByCompanyIdAndLocationIdAndProjectID(compId, locId, projId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });
        this.users = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.users = [];
        this.count = 0;
      }
    )
  }

  setPageDataByCompanyId(compId: number, pageNum: number) {
    this.userService.getUserListByCompanyId(compId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
    
        });
        this.users = data['records'];
        this.count = data['totalRecords']
      },
      (error) => {
        this.users = [];
        this.count = 0;
      }
    )
  }

  public changed(e: any): void {
    this.selected = e.value;
  }


  onCompanySelect(e: any) {

    let selected = e.data[0].selected;
    this.companyId = e.value;

    if (this.companyId == 0 && selected == false) {
      return;
    }

    if (this.companyId == 0 && selected == true) {
      this.flag = 'none';
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
    let selected = e.data[0].selected;
    this.locationId = e.value;

    if (this.locationId == 0 && selected == true) {
      this.flag = 'company'
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
      let loginId = this.localStorage.retrieve('loginId');
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
    let selected = e.data[0].selected;
    this.projectId = e.value;

    if (this.projectId == 0 && selected == true) {
      this.flag = 'company&location'
      this.userTypeSelect = [{
        id: 0,
        text: 'User Type'
      }];
      this.setPageDataByCompanyAndLocation(this.companyId, this.locationId, 1)
    }

    if (this.companyId > 0 && this.locationId > 0 && this.projectId > 0) {
      this.flag = 'company&location&project';
      this.userTypeSelect = [];
      this.userTypeSelect = this.dataService.getStatusList();
      this.setPageDataByCompanyAndLocationAndProject(this.companyId, this.locationId, this.projectId, 1)
    }
  }

  onUserTypeSelect(e: any) {
    this.userType = e.value;

    if (this.userType > -1) {
      this.flag = 'company&location&project&user'
      this.setPageDataByCompanyAndLocationAndProjectAndUser(this.companyId, this.locationId, this.projectId, this.userType, 1)
    }

    if (this.userType == 'User Type') {
      this.flag = 'company&location&project';
      this.userTypeSelect = [];
      this.userTypeSelect = this.dataService.getStatusList();
      this.setPageDataByCompanyAndLocationAndProject(this.companyId, this.locationId, this.projectId, 1)
    }
  }

  curentPage : number = 1;
  getPageData(e: any) {
    const pageNo = e.page;
    this.curentPage = pageNo;
    this.localStorage.store('pageNum', pageNo);

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

  onEdit(appLoginID: any) {
    this.userService.getUser(appLoginID).subscribe(
      (data : any) => {
        this.userService.userInfo.next(data)
      }
    )
  }

  openActivateUser(e: any, activateUser: any) {
    e.preventDefault();
    this.modalRef = this.modalService.show(activateUser)
  }

  openDeactivateUser(e: any, deactivateUser: any) {
    e.preventDefault();
    this.modalRef = this.modalService.show(deactivateUser)
  }

  openResetPassword(e: any, resetPassword: any, user : any) {
    this.user = user;
    e.preventDefault();
    this.modalRef = this.modalService.show(resetPassword)
  }

  openSendEmail(e: any, sendEmail: TemplateRef<any>, user : any) {
    e.preventDefault();
    this.user = user;
    this.modalRef = this.modalService.show(sendEmail)
    this.emailId = user.emailid;
  }

  openSendSms(e: any, sendSms: TemplateRef<any>, user : any) {
    e.preventDefault();
    this.user = user;
    this.modalRef = this.modalService.show(sendSms)
    this.mobilephone = user.mobilephone
  }

  sendNewMail(d: any, appLoginId: any) {
    this.formEmail = d.formEmail;
    this.formMessage = d.formMessage;
    this.formSubject = d.formSubject;
    this.submitted = true;

    if (this.sendMail.valid) {
      this.submitted = false;
      this.erStatus = false;

      this.userService.sendManualEmail(this.formEmail, this.formSubject, this.formMessage, appLoginId).subscribe(
        (resp) => {
          if (resp) {
            this.fadeInState.emit({
              successStatus: true,
              successType: 'mailSent'
            })
          }
          this.modalRef?.hide()
          this.sendMail.reset();
          this.user.emailid = this.emailId
        },
        (error) => {
          this.errorResponse = error.error
          this.fadeInState.emit({
            successStatus: false,
            successType: 'mailNotSent',
            errorResponse: this.errorResponse
          })
          this.modalRef?.hide()
          this.sendMail.reset();
          this.user.emailid = this.emailId
        },
        () => {
          this.modalRef?.hide();
          this.sendMail.reset();
          this.user.emailid = this.emailId
        }
      )
    } else {
      this.erStatus = true;
    }
  }

  activate(appLoginId: any) {
    this.dataService.activateUser(appLoginId).subscribe(
      (resp) => {

        if (resp) {
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
        this.errorResponse = error.error
        this.fadeInState.emit({
          successStatus: false,
          successType: 'activate',
          errorResponse: this.errorResponse
        })
      }
    )
  }

  clearEmailContent() {
    this.sendMail.reset()
    this.user.emailid = this.emailId
  }

  resetForm(formName: any) {
    switch (formName) {
      case 'smsForm':
        this.smsForm.reset();
        this.user.mobilephone = this.mobilephone
        this.submitted = false;
        this.erStatus = false;
        break;
      case 'sendMail':
        this.sendMail.reset();
        this.user.emailid = this.emailId
        this.submitted = false;
        this.erStatus = false;
        break;
    }
  }

  sendNewSms(d: any, apploginId: any) {
    this.message = d.message;
    this.mobileNo = d.mobileNo;
    this.smsSubmitted = true;

    if (this.smsForm.valid) {
      this.smsSubmitted = false;
      this.erSmsStatus = false;
      this.userService.sendManualSms(apploginId, this.message, this.mobileNo).subscribe(
        (resp) => {
          if (resp == 0) {
            this.fadeInState.emit({
              successStatus: true,
              successType: 'smsSent'
            })
          }
          this.modalRef?.hide()
          this.smsForm.reset();
          this.user.mobilephone = this.mobilephone
        },
        (error) => {
          this.errorResponse = error.error
          this.fadeInState.emit({
            successStatus: false,
            successType: 'smsNotSent',
            errorResponse: this.errorResponse
          })
          this.modalRef?.hide()
          this.smsForm.reset();
          this.user.mobilephone = this.mobilephone
        },
        () => {
          this.modalRef?.hide()
          this.smsForm.reset();
          this.user.mobilephone = this.mobilephone
        }
      )
    } else {
      this.erSmsStatus = true;
    }
  }

  clearSmsContent() {
    this.smsForm.reset()
    this.user.mobilephone = this.mobilephone
  }

  resetPass(appLoginId: any) {
    this.dataService.resetPassword(appLoginId).subscribe(
      (resp) => {
        if (resp) {
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
        this.errorResponse = error.error
        this.fadeInState.emit({
          successStatus: false,
          successType: 'resetPassEmailNotSent',
          errorResponse: this.errorResponse
        })
      }
    )
  }

  deactivate(appLoginId: any) {
    this.dataService.deactivateUser(appLoginId).subscribe(
      (resp) => {
        if (resp) {
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
        this.errorResponse = error.error
        this.fadeInState.emit({
          successStatus: false,
          successType: 'deactivate',
          errorResponse: this.errorResponse
        })
      }
    )
  }


}


