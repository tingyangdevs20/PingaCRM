import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CompanyService } from '../../service/common/company.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ConfigurationService } from '../../service/common/configuration.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'pa-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.css']
})
export class GeneralSettingsComponent implements OnInit {
  @Output() fadeInState = new EventEmitter()
  editvalue: boolean = false;
  prepayPayment: any;
  autoEmail: any;
  autoSms: any;
  setActive: any;
  setEmailActive: any;
  setSmsActive: any;
  setRad: any;
  opt1 = false;
  opt2 = false;
  opt3 = false;
  generalSettingForm: FormGroup<any> | undefined;
  config: Object = {
    addRemoveLinks: true
  };
  data: any;
  // entityDetails: string[];
  respData: any;
  meterCheckValue: any;
  EnablePrepayCheckValue: boolean = false;
  projectId: any;
  editvalue1: boolean = false;
  editvalue2: boolean = false;
  enablePrepayAgainstCheck: boolean = false;
  trxt2Value: any;
  editvalue3: any;
  AllData: any;
  projectName: any;
  Id: any;
  Index: any;
  IndexA: any;
  meterCheckIndex: any;
  projactname: any;
  projectname: any;
  rdioCheck1: any;
  rdioCheck2: any;
  projectGeneralSettings = [];
  Configured: any;
  EnablePrepayPayment: any;
  url1: any;
  url3: any;
  url2: any;
  Columnvalue: any;
  text1Check: boolean = false;
  text2Check: boolean = false;
  text2: any;
  text1: any;
  resp1Data: any;
  setSmsCheck: any;
  setEmailCheck: any;
  indexCheck1: boolean = false;
  firstCheckData = [];
  checkData: any;
  rowIndex = [];
  // editvalue: any;
  constructor(private companyService: CompanyService, private localStorage: LocalStorageService,
    private configService: ConfigurationService, private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.generalSettingForm = this.formBuilder.group({
      chackbox: ['', [Validators.required]],
      chackbox2: ['', [Validators.required]],
      url1: ['', [Validators.required]],
      url2: ['', [Validators.required]],
      url3: ['', [Validators.required]],
      rdo1: ['', [Validators.required]],
      rdo2: ['', [Validators.required]]

    });


    this.companyService.companyGenSettings.subscribe(
      (data) => {
        this.localStorage.store('companyGenSetting', data)
        let companyGenSettings = this.localStorage.retrieve('companyGenSetting');

        this.respData = companyGenSettings.entity2;
        this.resp1Data = companyGenSettings.entity1;
        for (let i = 0; i < this.resp1Data.length; i++) {
          this.setSmsCheck = this.resp1Data[i].send_auto_sms;
          this.setEmailCheck = this.resp1Data[i].send_auto_email;
        }


        this.prepayPayment = companyGenSettings[0].enablePrepayPayment;
        this.autoEmail = companyGenSettings[0].send_auto_email;
        this.autoSms = companyGenSettings[0].send_auto_sms;
        // console.log("prepayPayment",this.prepayPayment);

        if (this.prepayPayment == 0) {
          this.setActive = false;
          this.setRad = true;
        }

        if (this.prepayPayment > 0) {
          this.setActive = true;
          this.setRad = false;
        }

        if (this.prepayPayment == 1) {
          this.opt1 = true;
        }

        if (this.prepayPayment == 2) {
          this.opt2 = true;
        }

        if (this.prepayPayment == 3) {
          this.opt3 = true;
        }

        this.setEmailActive = !!this.autoEmail;
        this.setSmsActive = !!this.autoSms;
      }
    )
  }

  setOptOne(e: any, index: any) {

    this.rdioCheck1 = index
    this.editvalue = true;
    // this.EnablePrepayPayment = 1
    // this.localStorage.store('prepayPaymentCheck',this.EnablePrepayPayment);
    this.opt1 = true;
    this.opt2 = false;
  }

  setOptTwo(e: any, index: any) {
    this.rdioCheck2 = index
    if (e.target.checked) {
      // this.EnablePrepayPayment = 2
      // this.localStorage.store('prepayPaymentCheck',this.EnablePrepayPayment);
      this.opt2 = true;
      this.opt1 = false;
    }

  }

  meterRechargeCheck(e: any, i: any) {
    if (this.respData[i].url_auto_recharge != null) {
      this.text2Check = false;
    }
    else {
      this.meterCheckIndex = i;
      this.text2Check = e.target.checked;
    }
  }
  enablePaymentcheck(e: any, i: any) {

    if (this.respData[i].url_recharge_code != null) {

      this.text1Check = false;

    }
    else {
      this.textValue1(e)
      this.text1Check = e.target.checked;
      this.indexCheck1 = i

    }
  }


  onPrepayPayment(index: any, e: any, id: any, column: any) {
    this.EnablePrepayCheckValue = e.target.checked
    this.Index = index

    let objIndex = this.respData.findIndex(((obj: any) => obj.projectID == id));

    switch (column) {
      case "configured":
        if (e.target.checked) {
          this.respData[objIndex].configured = 1
        } else {
          this.respData[objIndex].configured = 0
        }

        break;
      case "ismeteronline":
        if (e.target.checked) {
          this.respData[objIndex].isMeterOnline = 1
        } else {
          this.respData[objIndex].isMeterOnline = 0
        }
        break;
      case "radio1":
        if (e.target.checked) {
          this.respData[objIndex].enablePrepayPayment = 1
        }
        else {
          this.respData[objIndex].enablePrepayPayment = 2
        }
        break;
      case "radio2":
        if (e.target.checked) {
          this.respData[objIndex].enablePrepayPayment = 2
        }
        else {
          this.respData[objIndex].enablePrepayPayment = 2
        }
        break;
      case "text1":
        this.respData[objIndex].url_recharge_code = e.target.value
        break;
      case "text2":
        this.respData[objIndex].url_auto_recharge = e.target.value
        break;
      case "text3":
        this.respData[objIndex].url_check_status = e.target.value
        break;
    }
  }

  setEmail(e: any) {
    this.autoEmail = +e.target.checked;
  }

  setSms(e: any) {
    this.autoSms = +e.target.checked;
  }

  saveGenSetting(opt1: any, opt2: any, autoEmail: any, autoSms: any) {
    let companylocationid = this.localStorage.retrieve('compLocationId');


    if (opt1) {
      this.prepayPayment = 1
    }

    if (opt2) {
      this.prepayPayment = 2
    }


    let genSettings = {
      "companylocationid": companylocationid,
      "enable_prepay_payment": this.prepayPayment,
      "send_auto_email": this.autoEmail,
      "send_auto_sms": this.autoSms,
      "created_by": "Admin",

      "projectGeneralSettings": this.respData
    }

    this.configService.updateSettingsConfig(genSettings).subscribe(
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

  textValue1(value: any) {
    this.text1 = value
    this.editvalue1 = value

    this.text1Check = false

    if (this.text1 == '') {
      this.text1Check = true
    }
    else {
      this.text1Check = false
    }
  }

  textValue2(value: any) {

    this.editvalue2 = value
    this.text2 = value

    this.text2Check = false

    if (this.text2 == '') {
      this.text2Check = true
    }
    else {
      this.text2Check = false
    }
  }

  textValue3(value: any) {

    this.editvalue3 = value

  }

}