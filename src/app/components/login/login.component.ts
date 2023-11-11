import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { LocalStorageService } from 'ngx-webstorage';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../../service/data.service';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { errorHandler } from '../../../../node_modules/@angular/platform-browser/src/browser';
// import { HttpErrorResponse } from '../../../../node_modules/@angular/common/http';

interface loginForm {
  username: FormControl<string>;
  password?: FormControl<string>;
}

@Component({
  selector: 'pa-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})

export class LoginComponent {
  menuItems: any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private authService: AuthService, private localStorage: LocalStorageService,
    private cookie: CookieService, private location: Location,
    private dataService: DataService, private formBuilder: FormBuilder) {

  }

  invalidCredentialMsg: any;
  rememberLogin: boolean = false;
  checkedRemember: boolean = false;
  logUserName: any;
  errorMsg: any;



  // Create a form group
  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  });

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(
      (params: any) => {
        if (params.errMgs) {
          this.errorMsg = params.errMgs;
          this.router.navigate(['/login']);
        }

      }
    )

    let url = window.location.host;
    this.localStorage.store('baseLocation', url);

    this.dataService.retrieveGroupId().subscribe(
      (resp) => {
        // this.localStorage.store('groupId', resp[0].groupId);
        this.localStorage.store('groupId', '1435984538');

      }
    )

    this.logUserName = this.localStorage.retrieve('userName');
    if (this.logUserName != '' && this.logUserName != null) {
      this.checkedRemember = true;
      this.rememberLogin = true;
    }

  }

  onFormSubmit() {

    // Get values from form to use
    let uname = this.loginForm.controls.username.value;
    let pass = this.loginForm.controls.password.value;
    // console.log(uname,'uname',pass,'pass')
    this.authService.isUserAuthenticated(uname, pass).subscribe(
      (resp) => {
        if (resp) {

          const helper = new JwtHelperService();
          const decodedToken = helper.decodeToken(resp);
          // Set tokens for logged in user for later use
          this.localStorage.store('token', 'isLoggedIn');
          this.localStorage.store('role', decodedToken.crm_role_name);
          this.localStorage.store('respBody', resp);
          this.localStorage.store('loginId', decodedToken.app_login_id);
          this.localStorage.store('crmRoleId', decodedToken.crm_role_id);
          this.localStorage.store('fromSearch', 0)
          this.getMenus()

          if (this.rememberLogin) {
            this.localStorage.store('userName', uname);
          } else {

            this.localStorage.store('userName', '');
          }

          // get redirect url to application
          // setTimeout(() => {
          //   let url = this.authService.getRedirectUrl();
          //   // Navigate to redirectUrl
          //   this.router.navigate([url]);

          // }, 1000);




        }
      }, error => {
        this.invalidCredentialMsg = error.error;
      }
    )
  }

  rememberMe() {
    this.rememberLogin = !this.rememberLogin;
  }

  getMenus() {
    let loginid = this.localStorage.retrieve('loginId')
    this.dataService.getMenuId(loginid).subscribe(
      (resp) => {
        let role = this.localStorage.retrieve('role');
        this.menuItems = resp;
        this.localStorage.store('menuLinks', this.menuItems)

        if (role == 'Client Admin') {
          if (this.menuItems[0].menuId == 18) {
            this.router.navigate(['/pinga/client/managementdashboard'])
          }
          else {
            this.router.navigate(['/pinga/client/companies'])
          }
        }
        else {
          this.router.navigate(['/pinga/buyer/units'])
        }
      }
    )
    // this.localStorage.clear('menuLinks')
  }

}

