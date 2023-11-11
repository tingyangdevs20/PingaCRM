import { Component, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
// import { PaginationComponent } from 'ngx-pagination-bootstrap';
// import 'rxjs/add/operator/filter';
import { LocalStorageService } from 'ngx-webstorage';
import { CompanyService } from '../../service/common/company.service';
import { ActivatedRoute } from '@angular/router';
import { PaginationConfig } from 'ngx-bootstrap/pagination';
// import { Subject } from 'rxjs';
import { Subscription } from 'rxjs'
import * as $ from 'jquery';

interface sortObjItem{
  [key: string]: Boolean;
}

@Component({
  selector: 'pa-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  companies: any;
  count: any;
  sortobj: sortObjItem = {
    sortBy: false
  };
  companyname: boolean = false;
  address1: boolean = false;
  workphoneno: boolean = false;
  con: any;
  mySub: Subscription | undefined;


  constructor(private dataService: DataService, private localStorage: LocalStorageService, private companyService: CompanyService, private activatedRoute: ActivatedRoute/**service**/) { }

  ngOnInit() {
    this.localStorage.clear('orderBy');
    window.onload = () => {
      this.resetFromSearch();
    }

    this.dataService.searchResponse.subscribe(
      (data) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.companies = this.modifyCompanyData(data['records']);
        // this.companies = data['records'];
        this.count = data['totalRecords']
      }
    )

    if (this.localStorage.retrieve('fromSearch') == 0) {
      this.companiesInit()
    } else {
      let criteria = this.localStorage.retrieve('criteria');
      let searchText = this.localStorage.retrieve('searchText')
      this.dataService.getSearchResult(criteria, searchText).subscribe(
        (data: any) => {
          const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
          this.companies = this.modifyCompanyData(data['records']);
          // this.companies = data['records'];
          this.count = data['totalRecords']
        }
      )
      this.companiesInitFromSearch()
    }

    $(".sortable").click(function (index) {
      $(".ngx_pagination .pagination .page-item:nth-child(1) .page-link").trigger("click");
      $(".sortable").removeClass('activeSort');
      $(this).addClass('activeSort');
      if ($(this).hasClass('ascOrder')) {
        $(this).removeClass('ascOrder').addClass('descOrder');
      } else {
        $(this).removeClass('descOrder').addClass('ascOrder');
      }
    });
  }

  resetFromSearch() {
    this.localStorage.store('fromSearch', 0);
    this.localStorage.store('fromProject', 0);
    this.localStorage.store('fromCompany', 0);
    this.companiesInit();
  }

  companiesInit() {
    this.localStorage.store('orderBy', null);
    this.setInitPageData(1)
  }

  companiesInitFromSearch() {

  }

  companyId: any;
  flag = 'none';

  setInitPageData(pageNum: number) {
    this.companyService.getCompaniesListByPageNo(pageNum).subscribe(
      (data: any) => {
        (data)
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.companies = this.modifyCompanyData(data['records']);
        // this.companies = data['records'];
        console.log(this.companies);
        this.count = data['totalRecords'];
      }
    )
  }

  modifyCompanyData(companyData : Array<any>) : Array<any> {
    var arrTemp : any[] = [];
    companyData.forEach(item => {
      var newItem = {
        companyname : item.companyname,
        registeredaddr : {
          addr1 : item.address1,
          zip : item.zip,
        },
        billingaddr : {
          addr2 : item.address2,
          corpzip : item.corpzip,
        },
        contanctinfo : {
          email : item.emailID,
          phoneno : item.phoneno,
          workphoneno : item.workphoneno
        }
      }
      arrTemp.push(newItem);        
    });
    return arrTemp;
  }

  curentPage : number = 1;
  getPageData(e: any) {
    // if (typeof (e.event.itemsCount) == "object") return;
    (e)
      (this.flag)
    if (e.event.type == 'click' && this.flag === 'none') {
      this.curentPage = e.page;
      this.setInitPageData(e.page)
    }
  }

  sortTableBy(sortBy: any) {
    this.sortobj[sortBy] = !this.sortobj[sortBy];
    var sortOrder = this.sortobj[sortBy] ? 'order by ' + sortBy : 'order by ' + sortBy + ' Desc';
    this.companyService.getCompaniesbyOrder(sortOrder).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.localStorage.store('orderBy', sortOrder);
        // this.companies = data['records'];
        this.companies = this.modifyCompanyData(data['records']);
      }
    )
  }

  getConfigDetails(locId : any) {
    this.localStorage.store('compLocationId', locId);
  }

  redirectToUser(companyname: any) {
    this.localStorage.store('fromCompany', 1);
    this.localStorage.store('companyName', companyname);
  }

  redirectToProject(companyname: any) {
    this.localStorage.store('fromCompany', 1);
    this.localStorage.store('companyName', companyname);
  }

}
                                                                                                                                                                                                                                                                                                   