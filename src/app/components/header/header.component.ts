import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { LocalStorageService } from 'ngx-webstorage';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../../service/data.service';
import * as $ from 'jquery';
@Component({
  selector: 'pa-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: any;
  winWidth: any;
  disp: boolean = false;
  dropdownVal = "Action";
  disabled = true;
  my_account_url: any;
  firstName: any;
  lastName: any;

  @ViewChild('searchText') searchText: any;
  SearchId: any;
  constructor(private authService: AuthService, private route: Router, private localStorage: LocalStorageService, private renderer: Renderer2, private el: ElementRef, private cookie: CookieService, private dataService: DataService) { }

  ngOnInit() {    
    this.user = this.localStorage.retrieve('role');
    this.SearchId = 1;
    this.winWidth = window.innerWidth;
    if (this.winWidth <= 767) {
      this.renderer.addClass(document.body, 'nav-collapsed');
    }
    /******For remove select2 on back button***/
    let sel2 = document.querySelector('.select2-container');
    if (sel2 != null) {
      sel2.remove()
    }

    if (this.user == "Client Admin") {
      this.my_account_url = '/pinga/client/my-account';
    } else {
      this.my_account_url = '/pinga/buyer/my-account';
    }

    this.dataService.getMyAccountInformation().subscribe(
      (resp: any) => {
        this.firstName = resp[0].firstName;
        this.lastName = resp[0].lastName;
      }
    )

    $('.select2-container').remove();

    this.getSearchBoxValue();
  }

  setValue(val: HTMLElement) {
    let newDropdownVal = val.innerHTML
    this.dropdownVal = newDropdownVal;
    this.disabled = false;
    this.actionToogle = false;
    this.getResult();
    // this.searchText.nativeElement.value='';
  }

  getResult() {
    let criteria = this.dropdownVal;
    let sT: ElementRef = this.searchText;
    let searchText = sT.nativeElement.value;
    searchText = searchText.trim();
    let url = this.route.url;
    this.localStorage.store('fromSearch', 1);
    this.localStorage.store('criteria', criteria);
    this.localStorage.store('searchText', searchText);

    if (searchText != '') {
      switch (criteria) {
        case 'Company Name':
          if (url.indexOf('client/companies') > -1) {
            this.route.navigate(['pinga/client/companies']).then(
              () => {
                this.dataService.getSearchResult(criteria, searchText).subscribe(
                  (resp) => {
                    // this.dataService.searchInputValue.next(searchText);                
                    this.dataService.searchResponse.next(resp);
                  }
                )
              }
            )
          } else {
            this.route.navigate(['pinga/client/companies'])
          }
          break;
        case 'Project Name':
          if (url.indexOf('client/projects') > -1) {
            this.route.navigate(['pinga/client/projects']).then(
              () => {
                this.dataService.getSearchResult(criteria, searchText).subscribe(
                  (resp) => {
                    // this.dataService.searchInputValue.next(searchText);                
                    this.dataService.searchResponse.next(resp);
                  }
                )
              }
            )
          } else {
            this.route.navigate(['pinga/client/projects'])
          }
          break;
        case 'Unit':
          if (url.indexOf('client/units') > -1) {
            this.route.navigate(['pinga/client/units']).then(
              () => {
                this.dataService.getSearchResult(criteria, searchText).subscribe(
                  (resp) => {
                    // this.dataService.searchInputValue.next(searchText);                
                    this.dataService.searchResponse.next(resp);
                  }
                )
              }
            )
          } else {
            this.route.navigate(['pinga/client/units'])
          }
          break;
        case 'Application':
          if (url.indexOf('client/units') > -1) {
            this.route.navigate(['pinga/client/units']).then(
              () => {
                this.dataService.getSearchResult(criteria, searchText).subscribe(
                  (resp) => {
                    // this.dataService.searchInputValue.next(searchText);                
                    this.dataService.searchResponse.next(resp);
                  }
                )
              }
            )
          } else {
            this.route.navigate(['pinga/client/units'])
          }

          break;
        case 'Management Dashboard':            ///new change
          if (url.indexOf('client/managementdashboard') > -1) {
            this.route.navigate(['pinga/client/managementdashboard']).then(
              () => {
                this.dataService.getSearchResult(criteria, searchText).subscribe(
                  (resp) => {
                    // this.dataService.searchInputValue.next(searchText);                
                    this.dataService.searchResponse.next(resp);
                  }
                )
              }
            )
          } else {
            this.route.navigate(['pinga/client/managementdashboard'])
          }

          break;
        case 'Applicant Name':
          if (url.indexOf('client/buyers') > -1) {
            this.route.navigate(['pinga/client/buyers']).then(
              () => {
                this.dataService.getSearchResult(criteria, searchText).subscribe(
                  (resp) => {
                    // this.dataService.searchInputValue.next(searchText);                
                    this.dataService.searchResponse.next(resp);
                  }
                )
              }
            )
          } else {
            this.route.navigate(['pinga/client/buyers'])
          }
          break;
        default:
          break;
      }
    }
  }



  logout(e: any) {
    e.preventDefault();
    let logUserName = this.localStorage.retrieve('userName');
    this.localStorage.clear();
    this.localStorage.store('userName', logUserName);
    this.cookie.deleteAll();
    this.authService.logoutUser();
    this.route.navigate([this.authService.getLoginUrl()]);
  }

  navToogle() {
    this.disp = !this.disp;
    if (this.winWidth > 767) {
      if (this.disp) {
        this.renderer.removeClass(document.body, 'nav-static');
      } else {
        this.renderer.addClass(document.body, 'nav-collapsed');
        this.renderer.addClass(document.body, 'nav-static');
      }
    } else {
      if (this.disp) {
        this.renderer.removeClass(document.body, 'nav-static');
        this.renderer.removeClass(document.body, 'nav-collapsed');
        this.renderer.addClass(document.body, 'showSideBar');

      } else {
        this.renderer.addClass(document.body, 'nav-collapsed');
        this.renderer.removeClass(document.body, 'showSideBar');

      }
    }
  }

  getSearchBoxValue() {

    this.dataService.getSearchId().subscribe(
      (resp) => {

        this.SearchId = resp;

      })
  }

  actionToogle : boolean = false;
  toogleActionDropdown(){
    if(this.actionToogle == false){
      this.actionToogle = true;
    }else{
      this.actionToogle = false;
    }
  }

  accountToogle : boolean = false;
  toogleAccountDropdown(){
    if(this.accountToogle == false){
      this.accountToogle = true;
    }else{
      this.accountToogle = false;
    }
  }

}
