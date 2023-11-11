import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../service/data.service';
import { LocalStorageService } from '../../../../../node_modules/ngx-webstorage';
declare var $: any;
@Component({
  selector: 'pa-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  workPhone: string | undefined;
  mobilePhone: string | undefined;
  email: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  groupName: string | undefined;

  constructor(private dataService: DataService, private localStorage: LocalStorageService) { }

  ngOnInit() {
    this.workPhone = this.localStorage.retrieve('workphone');
    this.mobilePhone = this.localStorage.retrieve('mobilePhone');
    this.email = this.localStorage.retrieve('email');
    this.dataService.getMyAccountInformation().subscribe(
      (data: any) => {
        this.localStorage.store('appLoginId', data['0'].appLoginId)
        this.localStorage.store('username', data['0'].userName)
        
        this.localStorage.store('workphone', data['0'].workPhone);
        this.localStorage.store('mobilePhone', data['0'].mobilePhone);
        this.localStorage.store('email', data['0'].emailId);
        this.localStorage.store('firstName', data['0'].firstName);
        this.localStorage.store('lastName', data['0'].lastName);
        this.localStorage.store('groupName', data['0'].groupName);

        if (this.workPhone == null || this.mobilePhone == null || this.email == null || this.firstName == null || this.lastName == null || this.groupName == null) {
          this.workPhone = this.localStorage.retrieve('workphone');
          this.mobilePhone = this.localStorage.retrieve('mobilePhone');
          this.email = this.localStorage.retrieve('email');
          this.firstName = this.localStorage.retrieve('firstName');
          this.lastName = this.localStorage.retrieve('lastName');
          this.groupName = this.localStorage.retrieve('groupName');
        }

      }
    )
    
  }

}
