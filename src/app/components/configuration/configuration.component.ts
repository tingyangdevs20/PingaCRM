import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../service/common/company.service';
import { LocalStorageService } from 'ngx-webstorage';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'pa-setup-alert',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'],
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
export class ConfigurationComponent implements OnInit {
  compLocationId: any;
  bindVar = 'fadeOut';
  emailStatus: any;
  smsStatus: any;
  genStatus: any;
  testSmsStatus: any;
  testEmailStatus: any
  classStatus: any
  respData: any;
  resp1Data: any;
  setSmsCheck: any;
  setEmailCheck: any;
  constructor(private companyService: CompanyService, private localStorage: LocalStorageService) { }

  fadeIn() {
    this.bindVar = 'fadeIn'
  }

  fadeOut() {
    this.bindVar = 'fadeOut'
  }

  emailSettings(e: any) {
    if (e == true) {
      this.emailStatus = 'success'
      this.classStatus = 'success'
      this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
    } else {
      this.emailStatus = 'fail'
      this.classStatus = 'fail'
      this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
    }
  }

  smsSettings(e: any) {
    (e)
    if (e == true) {
      this.smsStatus = 'success'
      this.classStatus = 'success'
      this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
    } else {
      this.smsStatus = 'fail'
      this.classStatus = 'fail'
      this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
    }
  }

  testSms(e: any) {
    if (e == true) {
      this.testSmsStatus = 'success'
      this.classStatus = 'success'
      this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
    } else {
      this.testSmsStatus = 'fail'
      this.classStatus = 'fail'
      this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
    }
  }

  testEmail(e: any) {
    if (e == true) {
      this.testEmailStatus = 'success'
      this.classStatus = 'success'
      this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
    } else {
      this.testEmailStatus = 'fail'
      this.classStatus = 'fail'
      this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
    }
  }

  genSettings(e: any) {
    if (e == true) {
      this.genStatus = 'success'
      this.classStatus = 'success'
      this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
    } else {
      this.genStatus = 'fail'
      this.classStatus = 'fail'
      this.bindVar == 'fadeOut' ? this.fadeIn() : this.fadeOut()
    }
  }

  animEnd(e: any) {
    this.emailStatus = '';
    this.smsStatus = '';
    this.genStatus = '';
    this.testSmsStatus = '';
    this.testEmailStatus = '';
    this.classStatus = ''
  }

  ngOnInit() {
    this.compLocationId = this.localStorage.retrieve('compLocationId');

    this.companyService.getCompanyConfigurationDetails(this.compLocationId, 'EMAIL').subscribe(
      (data) => {
        (data);
        this.companyService.setCompanyEmailConfig(data);
      }
    )
  }


  onEmailTab(e: any) {
    this.companyService.getCompanyConfigurationDetails(this.compLocationId, 'EMAIL').subscribe(
      (data) => {
        (data);
        this.companyService.setCompanyEmailConfig(data);
      }
    )
  }

  onSmsTab(e: any) {
    this.companyService.getCompanyConfigurationDetails(this.compLocationId, 'SMS').subscribe(
      (data) => {
        (data);
        this.companyService.setCompanySmsConfig(data);
      }
    )
  }

  onSettingsTab(e: any) {
    let companylocationid = this.localStorage.retrieve('compLocationId');
    this.companyService.getGeneralSetting(companylocationid).subscribe(
      (data) => {
        (data);
        this.companyService.setGeneralSettingsConfig(data);
      })
  }
}
