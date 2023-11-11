import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
// import { Select2OptionData } from 'ng2-select2';
import { FormBuilder, FormGroup, FormControl, Validators, NgForm } from '@angular/forms'
import { DataService } from '../../service/data.service';
import { LocalStorageService } from 'ngx-webstorage';
// import 'rxjs/add/operator/filter';
import { CompanyService } from '../../service/common/company.service';
import { ProjectService } from '../../service/common/project.service';
// import { IOption } from 'ng-select';
import { UserService } from '../../service/common/user.service';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'pa-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.css'],
  animations: [
    trigger('animateOnAction', [
      transition('fadeOut<=>fadeIn', [
        animate(1500, style({opacity: 1})),
        animate(3000, style({opacity: 1})),
        animate(100, style({opacity: 0}))
      ])
    ])
  ]
})
export class NewuserComponent implements OnInit {
  list: any;
  cList: Array<any> = [];
  public roleList: any;
  //public companyList: Array<selectOptionData>;
  public companyList: any;
  public projectList: any | undefined;
  newUser!: FormGroup<any>;
  updateUserForm: any;
  fName = '';
  mName = '';
  lName = '';
  email = '';
  workPhone = '';
  mobNumber = '';
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  options: any;
  compId: Array<any> = [];
  newUserRole: any;
  newUserRoleName: string | undefined;
  pageName: any;
  editUser: boolean = false;
  createUser: boolean = false;
  submitted = false;
  erStatus = false;
  allCompanyListOnEditUser: Array<any> | undefined;
  allProjectListOnEditUser: Array<any> | undefined;
  bindVar = 'fadeOut';
  userCreated: any;
  userUpdated: any;
  @ViewChild('companySelect') companySelect: any;
  @ViewChild('projectSelect') projectSelect: any;

  classStatus: any;

 /* allCompanyList: Array<IOption> = [{
    "value": "1",
    "label": "ASIAN CONSTRUCTION PVT LTD"
  }]

  allProjectList: Array<IOption> = [{
    "value": "0",
    "label": "Aech"
  },
  {
    "value": "1",
    "label": "Art3mis"
  },
  {
    "value": "2",
    "label": "Daito"
  }]*/

  projectDropdownList: Array<string> | undefined;
  companyDropdownList: Array<string> | undefined;
  startValue: any;
  projectDropdownListOnCreateUser: Array<any> = [];

  failureResponse: any;

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private localStorage: LocalStorageService, private companyService: CompanyService, private projectService: ProjectService, private userService: UserService, private router: Router) { }

  fadeIn() {
    this.bindVar = 'fadeIn'
  }
  
  fadeOut() {
    this.bindVar = 'fadeOut'
  }

  animEnd() {
    if(this.userCreated == 'success' || this.userUpdated == 'success') {
      this.companyList=[];
      this.projectList=[];
      (<any>this.newUser).reset();
      this.router.navigate(['pinga/client/users']);
    } else {
      this.userCreated = ''
    }   
  }

  ngOnInit() {
    let url = this.router.url;
    if (url.lastIndexOf('edit') == -1) {
      this.createUser = true;
      this.pageName = "Create New";
    } else {
      this.editUser = true;
      this.pageName = "Edit";

      this.userService.userInfo.subscribe(
        (data) => {
          this.localStorage.store('nameUser', data[0].userName)
          this.localStorage.store('appLoginID', data[0].appLoginId)
          this.localStorage.store('userRoleId', data[0].roleId)

          this.fName = data[0].firstName;
          this.mName = data[0].middleName;
          this.lName = data[0].lastName;
          this.email = data[0].emailId;
          this.workPhone = data[0].workPhone;
          this.mobNumber = data[0].mobilePhone;
          this.startValue = this.localStorage.retrieve('userRoleId')
          this.allCompanyListOnEditUser = data[0].companyDetails;
          this.companyDropdownList = data[0].companyIds
          this.allProjectListOnEditUser = data[0].projectDetails;
          this.projectDropdownList = data[0].projectIds
  
          this.updateUserForm = this.formBuilder.group({
            fName: new FormControl(this.fName, Validators.required),
            mName: new FormControl(this.mName),
            lName: new FormControl(this.lName, Validators.required),
            email: new FormControl(this.email, [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]),
            workPhone: new FormControl(this.workPhone, Validators.compose([Validators.required, Validators.minLength(6)])),
            mobNumber: new FormControl(this.mobNumber, Validators.compose([Validators.required, Validators.minLength(10), Validators.minLength(10)])),
            companyDropdownList: new FormControl(this.companyDropdownList),
            projectDropdownList: new FormControl(this.projectDropdownList)
          })
  
        }
      )
    } 
    
    this.updateUserForm = this.formBuilder.group({
      fName: new FormControl('', Validators.required),
      mName: new FormControl(''),
      lName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]),
      workPhone: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      mobNumber: new FormControl('', Validators.compose([Validators.required, Validators.minLength(10), Validators.minLength(10)])),
      companyDropdownList: new FormControl(),
      projectDropdownList: new FormControl()
    })

    
    this.newUser = this.formBuilder.group({
      fName: new FormControl('', Validators.required),
      mName: new FormControl(''),
      lName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]),
      workPhone: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      mobNumber: new FormControl('', Validators.compose([Validators.required, Validators.minLength(10), Validators.minLength(10)])),
      companyDropdownList: new FormControl(),
      projectDropdownList: new FormControl()
    })

    this.options = {
      multiple: true,
      placeholder: 'Select',
      debug: true
    }

    let roleId = this.localStorage.retrieve('crmRoleId');

    this.dataService.getRoles(roleId).subscribe(
      (data) => {
        this.list = [];
        this.cList = [];
        this.list = data;
        this.list.unshift({ 'key': 0, 'value': 'Role' })
        this.list.filter(
          (item: any) => {
            let obj = {
              id: item.key,
              text: item.value
            }
            this.cList.push(obj)
          }
        )
        this.roleList = this.cList;
      }
    )

    this.companyService.getCompanyList().subscribe(
      (data) => {

        this.list = [];
        this.cList = [];
        this.list = data;
        //this.list.unshift({'label': 0, 'value': 'Select'})
        this.list.filter(
          (item: any) => {
            let obj = {
              value: item.key,
              label: item.value
            }
            this.cList.push(obj);
          }
        )
        this.companyList = this.cList;
      }
    )
  } 

  alphabetOnly(keyCode: number) {
    return (keyCode > 64 && keyCode < 91) || (keyCode > 96 && keyCode < 123);
  }

  numberOnly(keyCode: number) {
    return (keyCode == 8 || keyCode == 0 || keyCode == 13) ? null : keyCode >= 48 && keyCode <= 57
  }

  onProjectSelect(e: any) {
    this.projectDropdownListOnCreateUser.push(e.value)
  }

  onProjectDeselect(e: any) {
    let index = this.projectDropdownListOnCreateUser.indexOf(e.value)
    this.projectDropdownListOnCreateUser.splice(index, 1);
  }

  getRole(e: any) {
    this.localStorage.store('userRoleId', e.value)
  }

  addNewUser(data: any) {
    let loginId = this.localStorage.retrieve('loginid');
    let roleId = this.localStorage.retrieve('userRoleId')
    let user = {
      "appLoginId": 0,
      "groupId": this.dataService.getGroupId(),
      "isActive": 0,
      "firstName": data.fName,
      "middleName": data.mName,
      "lastName": data.lName,
      "emailId": data.email,
      "workPhone": data.workPhone,
      "mobilePhone": data.mobNumber,
      "userType": "External",
      "roleId": roleId,
      "projectIds": this.projectDropdownListOnCreateUser,
      "loggedInUserID": loginId,
      "moduleName": "CustomerLogin"
    }

    this.submitted = true;
    if ((<any>this.newUser).valid) {
      this.submitted = false;
      this.erStatus = false;
      this.userService.createNewUser(user).subscribe(
        (resp) => {
          if (resp == true) {           
            this.userCreated = 'success'
            this.classStatus = 'success'
            this.bindVar == 'fadeOut'?this.fadeIn():this.fadeOut()           
          }
        },
        (error) => {
          this.failureResponse = error.error
          this.userCreated = 'fail'
          this.classStatus = 'fail'
          this.bindVar == 'fadeOut'?this.fadeIn():this.fadeOut()
        }
      )
    } else {
      this.erStatus = true;
    }
  }  

  onSelectedCompany(e: any) {
    this.compId = [];
    this.compId.push(e.value);
  }

  updateUser(data: any) {
    let loginId = this.localStorage.retrieve('loginid');
    let username = this.localStorage.retrieve('nameUser');
    let appLoginId = this.localStorage.retrieve('appLoginID');
    let roleId = this.localStorage.retrieve('userRoleId')
    let groupId = this.dataService.getGroupId()
    
    let updatedUser = {
      "appLoginId": appLoginId,
      "groupId": groupId,
      "userName": username,
      "isActive": 0,
      "firstName": data.fName,
      "middleName": data.mName,
      "lastName": data.lName,
      "emailId": data.email,
      "workPhone": data.workPhone,
      "mobilePhone": data.mobNumber,
      "userType": "External",
      "roleId": roleId,
      "projectIds": data.projectDropdownList,
      "loggedInUserID": loginId,
      "moduleName": "CustomerLogin"
    }

    this.userService.updateUser(updatedUser).subscribe(
      (resp) => {
        if (resp == true) {           
          this.userUpdated = 'success'
          this.classStatus = 'success'
          this.bindVar == 'fadeOut'?this.fadeIn():this.fadeOut();            
          (<any>this.newUser).reset();
        }      
      },
      (error) => {
        
        this.failureResponse = error.error
        this.userUpdated = 'fail'
        this.classStatus = 'fail'
        this.bindVar == 'fadeOut'?this.fadeIn():this.fadeOut()
      },
    )
  }

  onClosedCompany(e: any) {
    this.projectService.getDropDownProjectListByCompanyId(this.compId).subscribe(
      (data) => {
        this.list = [];
        this.cList = [];
        this.list = data;
        //this.list.unshift({'label': 0, 'value': 'Select'})
        this.list.filter(
          (item: any) => {
            let obj = {
              value: item.key,
              label: item.value
            }
            this.cList.push(obj);
          }
        )
        this.projectList = this.cList;
      }
    )
  }

  onDeselectCompany(e: any) {
    let index = this.compId.indexOf(e.value)
    this.compId.splice(index, 1);

    this.projectService.getDropDownProjectListByCompanyId(this.compId).subscribe(
      (data) => {
        this.list = [];
        this.cList = [];
        this.list = data;
        //this.list.unshift({'label': 0, 'value': 'Select'})
        this.list.filter(
          (item: any) => {
            let obj = {
              value: item.key,
              label: item.value
            }
            this.cList.push(obj);
          }
        )
        this.projectList = this.cList;
      }
    )
  }


}
