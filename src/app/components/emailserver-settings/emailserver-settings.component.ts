import {
  Component,
  OnInit,
  DoCheck,
  TemplateRef,
  EventEmitter,
  Output
} from '@angular/core';
import {
  LocalStorageService
} from 'ngx-webstorage';
import {
  CompanyService
} from '../../service/common/company.service';
import {
  BsModalRef,
  BsModalService
} from 'ngx-bootstrap/modal';
import {
  ConfigurationService
} from '../../service/common/configuration.service';
import {
  Validators,
  FormControl,
  FormBuilder
} from '../../../../node_modules/@angular/forms';

@Component({
  selector: 'pa-emailserver-settings',
  templateUrl: './emailserver-settings.component.html',
  styleUrls: ['./emailserver-settings.component.css']
})
export class EmailserverSettingsComponent implements OnInit, DoCheck {
  @Output() fadeInState = new EventEmitter();
  @Output() testStatusEmail = new EventEmitter();

  companyEmailConfig: any;
  notificationConfigurationId: any;
  type: any;
  senderEmailId = '';
  senderName: any;
  smtpServer = '';
  userName: any;
  password = '';
  url: any;
  fromEmail: any;
  isActive: any;
  createdBy: any;
  port = '';
  isSsl: any;
  countryCode: any;
  smsSuccessType: any;
  smsSuccessValue: any;
  smsSuccessCrt: any;
  companyId: any;
  groupId: any;
  serverId: any;
  countryID: any;
  companylocationid: any;
  testForm: any;
  emailID: any;
  subject: any;
  message: any;
  /* smtpPort;
  sEmail;
  sPassword;
  sName;
  sslCheck;
  isActive; */
  setActive: any;
  submitted = false;
  erStatus = false;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  public modalRef: BsModalRef | undefined;

  constructor(private localStorage: LocalStorageService, private companyService: CompanyService, private modalService: BsModalService, private configService: ConfigurationService, private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.companyService.companyEmailConfig.subscribe(
      (data) => {
        this.localStorage.store('companyEmailConfig', data);

        this.companyEmailConfig = this.localStorage.retrieve('companyEmailConfig');
        this.companylocationid = this.localStorage.retrieve('compLocationId');

        this.notificationConfigurationId = this.companyEmailConfig[0].notificationConfigurationId;
        this.type = this.companyEmailConfig[0].type;
        this.senderEmailId = this.companyEmailConfig[0].senderEmailId;
        this.senderName = this.companyEmailConfig[0].senderName;
        this.smtpServer = this.companyEmailConfig[0].smtpServer;
        this.userName = this.companyEmailConfig[0].userName;
        this.password = this.companyEmailConfig[0].password;
        this.url = this.companyEmailConfig[0].url;
        this.fromEmail = this.companyEmailConfig[0].fromEmail;
        this.isActive = this.companyEmailConfig[0].isActive;
        this.createdBy = this.companyEmailConfig[0].createdBy;
        this.port = this.companyEmailConfig[0].port;
        this.isSsl = this.companyEmailConfig[0].isSsl;
        this.countryCode = this.companyEmailConfig[0].countryCode;
        this.smsSuccessType = this.companyEmailConfig[0].smsSuccessType;
        this.smsSuccessValue = this.companyEmailConfig[0].smsSuccessValue;
        this.smsSuccessCrt = this.companyEmailConfig[0].smsSuccessCrt;
        this.companyId = this.companyEmailConfig[0].companyId;
        this.groupId = this.companyEmailConfig[0].groupId;
        this.serverId = this.companyEmailConfig[0].serverId;
        this.countryID = this.companyEmailConfig[0].countryID;
        this.companylocationid = this.companyEmailConfig[0].companylocationid;


        // Convert Number to Boolean
        this.setActive = !!this.isActive;
      }
    )

    this.testForm = this.formBuilder.group({
      emailID: ['', [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]],
      subject: ['', Validators.required],
      message: new FormControl()
    })
  }

  ngDoCheck() {
    if (this.companyEmailConfig == null) {
      this.companyEmailConfig = this.localStorage.retrieve('companyEmailConfig');
      return this.companyEmailConfig;
    }

    this.notificationConfigurationId = this.companyEmailConfig[0].notificationConfigurationId;
    this.type = this.companyEmailConfig[0].type;
    this.senderEmailId = this.companyEmailConfig[0].senderEmailId;
    this.senderName = this.companyEmailConfig[0].senderName;
    this.smtpServer = this.companyEmailConfig[0].smtpServer;
    this.userName = this.companyEmailConfig[0].userName;
    this.password = this.companyEmailConfig[0].password;
    this.url = this.companyEmailConfig[0].url;
    this.fromEmail = this.companyEmailConfig[0].fromEmail;
    this.isActive = this.companyEmailConfig[0].isActive;
    this.createdBy = this.companyEmailConfig[0].createdBy;
    this.port = this.companyEmailConfig[0].port;
    this.isSsl = this.companyEmailConfig[0].isSsl;
    this.countryCode = this.companyEmailConfig[0].countryCode;
    this.smsSuccessType = this.companyEmailConfig[0].smsSuccessType;
    this.smsSuccessValue = this.companyEmailConfig[0].smsSuccessValue;
    this.smsSuccessCrt = this.companyEmailConfig[0].smsSuccessCrt;
    this.companyId = this.companyEmailConfig[0].companyId;
    this.groupId = this.companyEmailConfig[0].groupId;
    this.serverId = this.companyEmailConfig[0].serverId;
    this.countryID = this.companyEmailConfig[0].countryID;
    this.companylocationid = this.companyEmailConfig[0].companylocationid;

    // Convert Number to Boolean
    this.setActive = !!this.isActive;
  }

  setActiveStatus(e: any) {
    //Convert Boolean to Number
    this.isActive = +e.target.checked;
    return this.isActive;
  }

  mySslStatus(e: any) {
    this.isSsl = e.target.checked;
    return this.isSsl;
  }

  openTestSendEmail(e: any, sendTestEmail: TemplateRef<any>) {
    e.preventDefault();
    this.modalRef = this.modalService.show(sendTestEmail)
  }

  saveEmailSettings(smtp: any, port: any, sEmail: any, pass: any, sender: any, ssl: any, active: any) {

    let companylocationid = this.localStorage.retrieve('compLocationId');
    let isActive = +active;
    let emailConfig = {
      "notificationConfigurationId": this.notificationConfigurationId,
      "type": "EMAIL",
      "senderEmailId": sEmail,
      "senderName": sender,
      "smtpServer": smtp,
      "userName": this.userName,
      "password": pass,
      "url": this.url,
      "fromEmail": this.fromEmail,
      "isActive": isActive,
      "createdBy": this.createdBy,
      "port": port,
      "isSsl": ssl,
      "countryCode": this.countryCode,
      "smsSuccessType": this.smsSuccessType,
      "smsSuccessValue": this.smsSuccessValue,
      "smsSuccessCrt": this.smsSuccessCrt,
      "companyId": this.companyId,
      "groupId": this.groupId,
      "serverId": this.serverId,
      "countryID": this.countryID,
      "companylocationid": companylocationid
    }
    debugger
    this.configService.updateEmailConfig(emailConfig).subscribe(
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

  sendtestEmail(data: any) {
    this.emailID = data.emailID;
    this.subject = data.subject;
    this.message = data.message;
    let companylocationid = this.localStorage.retrieve('compLocationId');
    this.submitted = true;
    if (this.testForm.valid) {
      this.submitted = false;
      this.erStatus = false;
      this.companyService.sendTestEmail(this.emailID, this.subject, this.message, companylocationid).subscribe(
        (resp) => {
          if (resp) {
            this.testStatusEmail.emit(true)
            if (this.modalRef)
              this.modalRef?.hide();
            this.testForm.reset();
          }
        },
        (error) => {
          if (error) {
            this.testStatusEmail.emit(false)
            if (this.modalRef)
              this.modalRef?.hide();
            this.testForm.reset();
          }
        },
        () => {
          if (this.modalRef)
            this.modalRef?.hide();
          this.testForm.reset();
        }
      )
    } else {
      this.erStatus = true;
    }
  }

}
