import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';

@Injectable()
export class ConfigurationService {

  constructor(private http: HttpClient, private config: DataService) { }

  baseUrl = this.config.getBaseUrl();

  updateEmailConfig(emailConfig: any) {
    return this.http.post(this.baseUrl + '/Configuration', emailConfig)
  }

  updateSmsConfig(smsConfig: any) {
    return this.http.post(this.baseUrl + '/Configuration', smsConfig)
  }

  updateSettingsConfig(settingConfig: any) {
    return this.http.post(this.baseUrl + '/SaveGeneralSetting', settingConfig)
  }

}
