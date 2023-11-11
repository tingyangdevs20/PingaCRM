import { Component, OnInit, DoCheck, TemplateRef, Output, EventEmitter } from '@angular/core';
import { CompanyService } from '../../service/common/company.service';
import { LocalStorageService } from 'ngx-webstorage';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfigurationService } from '../../service/common/configuration.service';
import { FormBuilder, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'pa-sms-settings',
  templateUrl: './sms-settings.component.html',
  styleUrls: ['./sms-settings.component.css']
})
export class SmsSettingsComponent implements OnInit, DoCheck {
  @Output() fadeInState = new EventEmitter();
  @Output() testStatusSms = new EventEmitter();
  companySmsConfig: any;
  notificationConfigurationId: any;
  type: any;
  senderEmailId: any;
  senderName = '';
  smtpServer: any;
  userName: any;
  password: any;
  url = '';
  fromEmail: any;
  isActive: any;
  createdBy: any;
  port: any;
  isSsl: any;
  countryCode = null;
  smsSuccessType = '';
  smsSuccessValue = '';
  smsSuccessCrt = '';
  companyId: any;
  groupId: any;
  serverId: any;
  countryID: any;
  companylocationid: any;

  setActive: any;
  public modalRef: BsModalRef | undefined

  successTypeList: any;
  successTypeSelect: any;
  successTypeStartValue: any;

  successCriteriaList: any;
  successCriteriaSelect: any;
  successCriteriaStartValue: any;

  testSmsForm: any;
  testMobileNo: any;
  testMessage: any;
  submitted = false;
  erStatus = false;

  constructor(private companyService: CompanyService, private localStorage: LocalStorageService, private modalService: BsModalService, private configService: ConfigurationService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.testSmsForm = this.formBuilder.group({
      testSmsMobileNo: ['', Validators.compose([Validators.required])],
      testSmsMessage: ['']
    })

    this.successTypeList = [
      {
        id: 0,
        text: 'Select'
      },
      {
        id: 1,
        text: 'String'
      },
      {
        id: 2,
        text: 'Numeric'
      }
    ]

    this.successCriteriaList = [
      {
        id: 0,
        text: 'Select'
      },
      {
        id: 1,
        text: 'Like'
      },
      {
        id: 2,
        text: '='
      }
    ]

    this.companyService.companySmsConfig.subscribe(
      (data) => {
        this.localStorage.store('companySmsConfig', data);

        this.companySmsConfig = this.localStorage.retrieve('companySmsConfig');
        this.companylocationid = this.localStorage.retrieve('compLocationId');

        this.notificationConfigurationId = this.companySmsConfig[0].notificationConfigurationId;
        this.type = this.companySmsConfig[0].type;
        this.senderEmailId = this.companySmsConfig[0].senderEmailId;
        this.senderName = this.companySmsConfig[0].senderName;
        this.smtpServer = this.companySmsConfig[0].smtpServer;
        this.userName = this.companySmsConfig[0].userName;
        this.password = this.companySmsConfig[0].password;
        this.url = this.companySmsConfig[0].url;
        this.fromEmail = this.companySmsConfig[0].fromEmail;
        this.isActive = this.companySmsConfig[0].isActive;
        this.createdBy = this.companySmsConfig[0].createdBy;
        this.port = this.companySmsConfig[0].port;
        this.isSsl = this.companySmsConfig[0].isSsl;
        this.countryCode = this.companySmsConfig[0].countryCode;
        this.userName = this.companySmsConfig[0].userName
        this.password = this.companySmsConfig[0].password

        if (this.companySmsConfig[0].smsSuccessType == 'String') {
          // this.smsSuccessType = 'String'
          this.successTypeStartValue = 1;
        } else if (this.companySmsConfig[0].smsSuccessType == 'Numeric') {
          // this.smsSuccessType = 'Numeric'
          this.successTypeStartValue = 2;
        }

        this.smsSuccessValue = this.companySmsConfig[0].smsSuccessValue;

        if (this.companySmsConfig[0].smsSuccessCrt == 'Like') {
          this.successCriteriaStartValue = 1;
        } else if (this.companySmsConfig[0].smsSuccessCrt == '=') {
          this.successCriteriaStartValue = 2;
        }

        this.companyId = this.companySmsConfig[0].companyId;
        this.groupId = this.companySmsConfig[0].groupId;
        this.serverId = this.companySmsConfig[0].serverId;
        this.countryID = this.companySmsConfig[0].countryID;
        this.companylocationid = this.companySmsConfig[0].companylocationid;

        // Convert Number to Boolean
        this.setActive = !!this.isActive;

      }
    )
  }

  ngDoCheck() {
    /* if(this.companySmsConfig == null) {
      this.companySmsConfig = this.localStorage.retrieve('companySmsConfig');
      return this.companySmsConfig
    }

    this.notificationConfigurationId = this.companySmsConfig[0].notificationConfigurationId;
    this.type = this.companySmsConfig[0].type;
    this.senderEmailId = this.companySmsConfig[0].senderEmailId;
    this.senderName = this.companySmsConfig[0].senderName;
    this.smtpServer = this.companySmsConfig[0].smtpServer;
    this.userName = this.companySmsConfig[0].userName;
    this.password = this.companySmsConfig[0].password;
    this.url = this.companySmsConfig[0].url;
    this.fromEmail = this.companySmsConfig[0].fromEmail;
    this.isActive = this.companySmsConfig[0].isActive;
    this.createdBy = this.companySmsConfig[0].createdBy;
    this.port = this.companySmsConfig[0].port;
    this.isSsl = this.companySmsConfig[0].isSsl;
    this.countryCode = this.companySmsConfig[0].countryCode;


    if(this.companySmsConfig[0].smsSuccessType == 'String') {
      // this.smsSuccessType = 'String'
      this.successTypeStartValue = 1;
    } else if(this.companySmsConfig[0].smsSuccessType == 'Numeric') {
      // this.smsSuccessType = 'Numeric'
      this.successTypeStartValue = 2;
    }        

    this.smsSuccessValue = this.companySmsConfig[0].smsSuccessValue;

    if(this.companySmsConfig[0].smsSuccessCrt == 'Like') {
      this.successCriteriaStartValue = 1;
    } else if(this.companySmsConfig[0].smsSuccessCrt == '=') {
      this.successCriteriaStartValue = 2;
    }

    this.companyId = this.companySmsConfig[0].companyId;
    this.groupId = this.companySmsConfig[0].groupId;
    this.serverId = this.companySmsConfig[0].serverId;
    this.countryID = this.companySmsConfig[0].countryID;
    this.companylocationid = this.companySmsConfig[0].companylocationid;
    
        
    // Convert Number to Boolean
    this.setActive = !!this.isActive; */
  }

  sslStatus(e: any) {
    this.isSsl = e.target.checked;
    return this.isSsl;
  }

  setActiveStatus(e: any) {
    //Convert Boolean to Number
    this.isActive = +e.target.checked;
    return this.isActive;
  }

  openTestSendSms(e: any, sendTestSms: TemplateRef<any>) {
    e.preventDefault();
    this.modalRef = this.modalService.show(sendTestSms)
  }

  onSuccessTypeSelect(e: any) {
    this.successTypeSelect = e.data[0].text;
  }

  onSuccessCriteriaSelect(e: any) {
    this.successCriteriaSelect = e.data[0].text;
  }

  saveSmsSetting(url: any, senderName: any, countryCode: any, successVal: any, active: boolean, username: string, password: any) {
    let companylocationid = this.localStorage.retrieve('compLocationId');
    let isActive = +active;
    let smsConfig = {
      "notificationConfigurationId": this.notificationConfigurationId,
      "type": "SMS",
      "senderEmailId": this.senderEmailId,
      "senderName": senderName,
      "smtpServer": this.smtpServer,
      "userName": username,
      "password": password,
      "url": url,
      "fromEmail": this.fromEmail,
      "isActive": isActive,
      "createdBy": this.createdBy,
      "port": this.port,
      "countryCode": countryCode,
      "smsSuccessType": this.successTypeSelect,
      "smsSuccessValue": successVal,
      "smsSuccessCrt": this.successCriteriaSelect,
      "companyId": this.companyId,
      "groupId": this.groupId,
      "serverId": this.serverId,
      "countryID": this.countryID,
      "companylocationid": companylocationid
    }



    this.configService.updateSmsConfig(smsConfig).subscribe(
      (val) => {
        if (val == true) {
          this.fadeInState.emit(true)
        }
      },
      (error) => {
        this.fadeInState.emit(false)
      }
    )
  }

  sendTestSMS(data: any) {

    this.submitted = true;
    if (this.testSmsForm.valid) {
      this.submitted = false;
      this.erStatus = false;
      this.companyService.sendTestSms(this.companylocationid, data['testSmsMobileNo'], data['testSmsMessage']).subscribe(
        (resp: any) => {
          if (resp == 0) {
            this.testStatusSms.emit(true)
            if (this.modalRef)
              this.modalRef?.hide()
            this.testSmsForm.reset()
          }
        },
        (error) => {
          this.testStatusSms.emit(false)
          this.testSmsForm.reset()
          if (this.modalRef)
            this.modalRef?.hide();
        },
        () => {
          if (this.modalRef)
            this.modalRef?.hide();
          this.testSmsForm.reset()
        }
      )
    } else {
      this.erStatus = true;
    }
  }

  numberOnly(keyCode: number) {
    return (keyCode == 8 || keyCode == 0 || keyCode == 13) ? null : keyCode >= 48 && keyCode <= 57
  }



}
