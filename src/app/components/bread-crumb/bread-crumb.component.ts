import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

interface BreadcrumbItem {
  label: string;
  url: string;
}
@Component({
  selector: 'pa-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent implements OnInit {
  user_role: any;
  bread: any;
  urls: any;
  slug = 3;
  slug2 = 4;
  slug3 = 5;
  baseUrl: any;
  bashBoardUrl = "";
  breadCrumb: BreadcrumbItem[] = [];
  menulinkData: any;
  menuitemId: any;

  constructor(private localStorage: LocalStorageService) { }

  ngOnInit() {

    this.menulinkData = this.localStorage.retrieve('menuLinks')
    this.menuitemId = this.menulinkData[0].menuId
    // if (window.location.origin != 'http://localhost:4200') {
    //   this.slug = 4;
    //   this.slug2 = 5;
    //   this.slug3 = 6;
    // }
    this.user_role = this.localStorage.retrieve('role');
    if (this.user_role == "Client Admin") {
      if (this.menuitemId == 18) {
        this.bashBoardUrl = '/pinga/client/managementdashboard';
        this.baseUrl = '/pinga/client/';
      }
      else {
        this.bashBoardUrl = '/pinga/client/companies';
        this.baseUrl = '/pinga/client/';
      }

    } else {
      this.bashBoardUrl = '/pinga/buyer/units';
      this.baseUrl = '/pinga/buyer/';
    }

    this.bread = window.location.pathname;
    this.urls = this.bread.split('/');
    this.bread = this.urls[this.slug];

    switch (this.bread) {
      case 'companies':
        this.breadCrumb.push({ label: 'Companies', url: '#' });
        if (this.urls[this.slug3] == 'config') {
          this.breadCrumb[0]['url'] = this.baseUrl + 'companies';
          this.breadCrumb.push({ label: 'Configuration', url: '#' });
        }
        if (this.urls[this.slug3] == 'users') {
          this.breadCrumb[0]['url'] = this.baseUrl + 'companies';
          this.breadCrumb.push({ label: 'Users', url: '#' });
        }
        break;
      case 'projects':
        this.breadCrumb.push({ label: 'Projects', url: '#' });
        if (this.urls[this.slug3] == 'users') {
          this.breadCrumb[0]['url'] = this.baseUrl + 'projects';
          this.breadCrumb.push({ label: 'Users', url: '#' });
        }
        break;
      case 'managementdashboard':
        this.breadCrumb.push({ label: 'Management Dashboard', url: '#' });   //////new change
        if (this.urls[this.slug3] == 'users') {
          this.breadCrumb[0]['url'] = this.baseUrl + 'managementdashboard';
          this.breadCrumb.push({ label: 'Users', url: '#' });
        }
        break;
      case 'users':
        this.breadCrumb.push({ label: 'Users', url: '#' });
        if (this.urls[this.slug3] == 'edit') {
          this.breadCrumb[0]['url'] = this.baseUrl + 'users';
          this.breadCrumb.push({ label: 'Edit Users', url: '#' });
        }
        if (this.urls[this.slug3] == 'new-user') {
          this.breadCrumb[0]['url'] = this.baseUrl + 'users';
          this.breadCrumb.push({ label: 'Create New User', url: '#' });
        }
        break;
      case 'buyers':
        this.breadCrumb.push({ label: 'Buyers', url: '#' });
        if (this.urls[this.slug3] == 'buyer-detail') {
          this.breadCrumb[0]['url'] = this.baseUrl + 'buyers';
          this.breadCrumb.push({ label: 'Buyer Detail', url: '#' });
        }
        break;
      case 'units':
        this.breadCrumb.push({ label: 'units', url: '#' });
        if (this.urls[this.slug2] == 'invoice-list') {
          this.breadCrumb[0]['url'] = this.baseUrl + 'units';
          this.breadCrumb.push({ label: 'Invoice List', url: '#' });
          this.breadCrumb.push({ label: this.urls[this.slug3], url: '#' });
        }
        if (this.urls[this.slug2] == 'receipt-list') {
          this.breadCrumb[0]['url'] = this.baseUrl + 'units';
          this.breadCrumb.push({ label: 'Receipt List', url: '#' });
          this.breadCrumb.push({ label: this.urls[this.slug3], url: '#' });
        }
        if (this.urls[this.slug2] == 'unit-detail') {
          this.breadCrumb[0]['url'] = this.baseUrl + 'units';
          this.breadCrumb.push({ label: 'Unit Detail', url: '#' });
          this.breadCrumb.push({ label: this.urls[this.slug3], url: '#' });
        }
        break;
      case 'invoices':
        this.breadCrumb.push({ label: 'Invoices', url: '#' });
        break;
      case 'receipts':
        this.breadCrumb.push({ label: 'Receipts', url: '#' });
        break;
      case 'my-account':
        this.breadCrumb.push({ label: 'Profile', url: '#' });
        break;
    }
  }
}
