import { Component, OnInit, Input } from '@angular/core';
import { CompanyService } from '../../service/common/company.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'tr.pa-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  @Input() company: any;
  constructor(private localStorage: LocalStorageService, private companyService: CompanyService) { }

  ngOnInit() {
  }

  getConfigDetails(locId: any) {
    this.localStorage.store('compLocationId', locId);
  }

  redirectToUser() {
    this.localStorage.store('fromCompany', 1);
    this.localStorage.store('companyName', this.company.companyname);
  }

  redirectToProject() {
    this.localStorage.store('fromCompany', 1);
    this.localStorage.store('companyName', this.company.companyname);
  }

}
