import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { LocalStorageService } from 'ngx-webstorage';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'pa-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  constructor(private authService: AuthService, private route: Router, private localStorage: LocalStorageService, private renderer: Renderer2, private dataService: DataService
    , private router: Router) {

  }

  userType: string | undefined;
  menuItems: any;
  menuLink: any;
  menuIcon = ["fa fa-institution", "fa fa-building", "glyphicon glyphicon-user", "fa fa-group", "fa fa-home", "fa fa-file-text", "fa fa-credit-card"];
  menuIcon1 = ["fa fa-dashboard"]
  menuTranIcon = ["fa fa-outdent"]
  loginUserType: string | undefined;
  my_account_url: any;

  firstName: string | undefined;
  lastName: string | undefined;

  ngOnInit() {
    let data = this.localStorage.retrieve('menuLinks');

    if (data == null) {
      this.dataService.getMenuItems().subscribe(
        (resp) => {
          this.localStorage.store('menuLinks', resp)
          this.menuItems = resp;
        }
      )
    } else {
      this.menuItems = data;
    }


    if (this.localStorage.retrieve('role') == "Client Admin") {
      this.loginUserType = 'client';
      this.my_account_url = '/pinga/client/my-account';
    } else {
      this.loginUserType = 'buyer';
      this.my_account_url = '/pinga/buyer/my-account';
    }

    this.dataService.getMyAccountInformation().subscribe(
      (resp: any) => {
        this.firstName = resp[0].firstName
        this.lastName = resp[0].lastName
      }
    )
  }

  gotoDashboard() {
    if (this.menuItems[0].menuId === 18) {
      this.router.navigate(['/pinga/client/managementdashboard']);
    } else {
      this.router.navigate(['/pinga/client/companies']);
    }
  }

  onClick() {
    this.localStorage.store('fromSearch', 0)
    this.localStorage.store('fromProject', 0)
    this.localStorage.store('fromCompany', 0)
  }

  logout(e: any) {
    e.preventDefault();
    let logUserName = this.localStorage.retrieve('userName');
    this.localStorage.clear();
    this.localStorage.store('userName', logUserName);
    this.authService.logoutUser();
    this.route.navigate([this.authService.getLoginUrl()]);
  }

  navExpend() {
    this.renderer.removeClass(document.body, 'nav-collapsed');
  }
  navCollaps() {
    this.renderer.addClass(document.body, 'nav-collapsed');
  }

}
