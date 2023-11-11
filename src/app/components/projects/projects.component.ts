import { Component, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
import { LocalStorageService } from 'ngx-webstorage';
// import 'rxjs/add/operator/filter';
// import { Select2OptionData } from 'ng2-select2';
import { ProjectService } from '../../service/common/project.service';
import { CompanyService } from '../../service/common/company.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { NgxDropdownConfig } from 'ngx-select-dropdown';


interface CustomDropdownConfig extends NgxDropdownConfig {
  displayKey: string;
  search: boolean;
  selectAllLabel: string;
}

interface sortobjItem {
  [key: string]: Boolean;
}

@Component({
  selector: 'pa-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  selectedDropdown = 'none';
  selected: any;
  projects: any;
  count: any;
  sortobj: sortobjItem = {
    sortBy: false
  }
  list: any;
  cList: Array<any> = [];
  cLocation: Array<any> = [];
  startValue: any;
  urlIndex: any;
  compLocId: any;
  companyList: any[] = [];
  locationList: any[] = [];
  bindCompany = true;

  config : CustomDropdownConfig = {
    // displayFn:(item: any) => { return item.hello.world; } //to support flexible text displaying for each item
    displayKey: "text",
    search: true,
    selectAllLabel: 'Select all',
    height: '',
    placeholder: '',
    customComparator: function (a: any, b: any): number {
      return 0;
    },
    limitTo: 0,
    moreText: '',
    noResultsFound: '',
    searchPlaceholder: '',
    searchOnKey: '',
    clearOnSelection: false,
    inputDirection: ''
  }


  constructor(private dataService: DataService, private localStorage: LocalStorageService, private projectService: ProjectService, private companyService: CompanyService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.localStorage.clear('orderBy');
    window.onload = () => {
      this.resetFromSearch();
    }

    // this.dropdownInit();

    if(this.companyId == undefined){
      this.companyId = 0;
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
        this.projects = data['records'];
        this.count = data['totalRecords']        
      }
    )

    if(this.localStorage.retrieve('fromSearch') == 0) {
      this.projectsInit();
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
          this.projects = data['records'];
          this.count = data['totalRecords']          
        }
      )
      this.projectsInitFromSearch()
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
    this.projectsInit();
  }

  public dropdownInit(setDropdownValue:boolean) {
    this.companyService.getCompanyList().subscribe(
      (data) => {   
       this.list = data;
       this.list.unshift({'key': 0, 'value': 'Company'});

      //  let companyName = this.localStorage.retrieve('companyName');
      //   if (companyName!=null) {
      //     this.list.unshift({'key': 0, 'value': companyName})
      //     this.localStorage.clear('companyName');
      //   } else{
      //     this.list.unshift({'key': 0, 'value': 'Company'})
      //   }
       
       this.list.filter(
         (comp: any) => {
           let obj = {
             id: comp.key,
             text: comp.value
           }
           this.cList.push(obj);
         }
       )
       this.companyList = this.cList;

       //Bug Fix - Drop down filter select value 
        if(setDropdownValue){
          var base= this;
          this.bindCompany = false;
          setTimeout(function(){
            base.bindCompany = true;
            base.companyList=[];
            base.companyList=base.cList;
            base.companyId=base.compLocId;

            var e ={
              data:[{selected:true}],
              value:base.companyId
            }
            base.onCompanySelect(e);
            base.startValue=base.compLocId;
        },0);
        }
      }
    )

    this.locationList = [
      {
        id: 0,
        text: 'Locations'
      }
    ]
  }

  projectsInit() {
    let fromCompany = this.localStorage.retrieve('fromCompany')
    if(fromCompany == 1) {
      this.activatedRoute.params.subscribe(
        (resp: any) => {
          this.compLocId = resp.complocId;
          this.dropdownInit(true);    //change  
        }
      )
      // this.setPageDataByCompanyLocationId(this.compLocId, 1)
    } else {
      this.setInitPageData(1);
      this.dropdownInit(false); //change
    }    
  }

  projectsInitFromSearch() {
    this.dropdownInit(false); //change
    
    this.activatedRoute.params.subscribe(
      (resp: any) => {
        this.compLocId = resp.complocId;
      }
    )

    this.dataService.searchInputValue.subscribe(
      (searchText) => {     
        this.searchInputValue = searchText;
      }
    )
  }
  
  public changed(e: any): void {
    this.selected = e.value;
  }  

  sortTableBy(sortBy: any) {
    this.sortobj[sortBy] = !this.sortobj[sortBy];
    var sortOrder = this.sortobj[sortBy] ? 'order by ' + sortBy : 'order by ' + sortBy + ' Desc';
    this.projectService.getProjectsByOrder(sortOrder).subscribe(
      (data: any) => {
        this.localStorage.store('orderBy', sortOrder);
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.projects = data['records'];
      }
    )
    this.resetDropdown();
  }

  //Bug Fix - Refresh filters on sort
public resetDropdown()
{
  this.locationList = [
    {
      id: 0,
      text: 'Locations'
    }
  ]
    this.bindCompany=false;
    var base = this;

  setTimeout(function(){
    base.bindCompany = true;
    // base.companyList = [];
    base.companyList = base.cList;
    base.companyId = "0";
    base.startValue = "0";
  },0);

}

  companyId: any;
  locationId: any;
  searchInputValue: any;
  flag = 'none';

  setInitPageData(pageNum: number) {
    this.projectService.getProjectListByPageNo(pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        console.log(data['records']);
        this.projects = data['records'];
        this.count = data['totalRecords']
      },
      (error)=>{
        this.projects=[];
        this.count=0;
      }
    )
  }

  setPageDataByCompany(companyId: number, pageNum: number) {
    this.projectService.getProjectListByCompanyId(companyId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.projects = data['records'];
        this.count = data['totalRecords']
      },
      (error)=>{
        this.projects=[];
        this.count=0;
      }
    )
  }

  setPageDataByCompanyAndLocation(companyId: any, locationId: any, pageNum: any) {
    this.projectService.getProjectListByCompanyIdAndLocationId(companyId, locationId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.projects = data['records'];
        this.count = data['totalRecords']
      },
      (error)=>{
        this.projects=[];
        this.count=0;
      }
    )
  }

  setPageDataByCompanyLocationId(compLocId: number, pageNum: number) {
    this.projectService.getProjectListByCompanyId(compLocId, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.projects = data['records'];
        this.count = data['totalRecords']
      },
      (error)=>{
        this.projects=[];
        this.count=0;
      }
    )
  }

  setPageDataBySearch(searchInputValue: string, pageNum: number) {
    this.projectService.getProjectListBySearchInputValue(searchInputValue, pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
            $(this).children().first().addClass("focused-pagination-button");
          else
            $(this).children().first().removeClass("focused-pagination-button");
        });
        this.projects = data['records'];
        this.count = data['totalRecords']
      },
      (error)=>{
        this.projects=[];
        this.count=0;
      }
    )
  }

  onCompanySelect(e: any) {    
    let selected = e.data[0].selected;
    this.companyId = e.value;

    if(this.companyId == 0 && selected == false) {
      return;
    }

    if(this.companyId == 0 && selected == true) {
      this.flag = 'none';
      this.locationList = [{
        id: 0,
        text: 'Location'
      }];
      this.setInitPageData(1);
    }

    if(this.companyId > 0) {
      this.flag = 'company';
      this.dataService.getLocationListByCompany(this.companyId).subscribe(
        (data) => {
          this.list = [];
          this.cLocation = [];
          this.locationList = [];          
          this.list = data;
          this.list.unshift({'key': 0, 'value': 'Locations'}) 
          this.list.filter(
            (loc: any) => {
              let obj = {
                id: loc.key,
                text: loc.value
              }
              this.cLocation.push(obj)
            }
          )
          this.locationList = this.cLocation
        }
      )
      this.setPageDataByCompany(this.companyId, 1)
    }

  }

  onLocationSelect(e: any) {   
    let selected = e.data[0].selected;
    this.locationId = e.value;    

    if(this.locationId == 0 && selected == true) {
      this.flag = 'company'
      
      this.setPageDataByCompany(this.companyId, 1)
    }

    if(this.companyId > 0 && this.locationId > 0) {
      this.flag = 'company&location';
      
      this.setPageDataByCompanyAndLocation(this.companyId, this.locationId, 1)
    }
  }

  curentPage : number = 1;
  getPageData(e: any) {
    const pageNo = e.page;
    this.curentPage = pageNo;
    if(this.localStorage.retrieve('fromSearch') == 1) {
      this.setPageDataBySearch(this.searchInputValue, pageNo)
    } else {
      if(this.companyId < 1 && this.flag === 'none') {
        this.setInitPageData(pageNo)
      } else if(this.companyId > 0 && this.flag === 'company') {
        this.setPageDataByCompany(this.companyId, pageNo)
      } else if(this.companyId > 0 && this.locationId > 0 && this.flag === 'company&location') {
        this.setPageDataByCompanyAndLocation(this.companyId, this.locationId, pageNo)
      }
    } 
  }

  redirectToUser() {
    this.localStorage.store('fromProject', 1);
  }
}
