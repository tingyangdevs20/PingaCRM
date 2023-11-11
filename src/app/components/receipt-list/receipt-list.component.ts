import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../service/data.service';
// import { Select2OptionData } from 'ng2-select2';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { UnitService } from '../../service/common/unit.service';
import { ReceiptService } from '../../service/common/receipt.service';
import { NgxDropdownConfig } from 'ngx-select-dropdown';


interface CustomDropdownConfig extends NgxDropdownConfig {
  displayKey: string;
  search: boolean;
  selectAllLabel: string;
}


@Component({
  selector: 'pa-receipt-list',
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.css']
})
export class ReceiptListComponent implements OnInit {
  id: number | undefined;
  receiptList: any;
  unitList: Array<any> = [];
  list: any;
  public unitNoList: Array<any> | undefined;
  public selected: any;
  public startValue: Observable<string> | undefined;

  count: any;
  userRole : any;
  companyId : any;
  flag : any;

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

  constructor(private activatedRoute: ActivatedRoute, private dataService: DataService, private localStorage: LocalStorageService, private unitService: UnitService, private receiptService: ReceiptService) { }

  ngOnInit() {
    this.userRole = this.localStorage.retrieve('role');
    this.activatedRoute.url.subscribe(
      (res: any) => {
        this.id = res[1].path;
      }
    )

    this.receiptService.getReceiptList(this.id).subscribe(
      (data : any) => {
        this.receiptList = data['records'];
        this.count = data['totalRecords'];
      }
    )
    
    this.unitService.getAllUnitsNo().subscribe(
      (data) => {
        this.list = data;
       /*  this.list.unshift({'key':'0','value':'All'}); */
        this.list.filter(
          (item: any) => {
            let obj = {
              id: item.key,
              text: item.value
            }
            this.unitList.push(obj);
          }
        )
       this.unitNoList = this.unitList;
      //  this.startValue = this.localStorage.retrieve('selectedbuyerID')
        // this.startValue = this.unitNoList[0].text;
      }
    )
    
  }

  public changed(e: any): void {
    this.companyId = e.value.id;
    this.selected = e.value;
    if(this.companyId == 0 ) {
      this.flag = 'none';
    } else {
      this.flag = 'company';
      this.receiptService.getReceiptsByBuyerId(this.companyId).subscribe(
        (data: any) => {
          this.receiptList = data['records']
          this.count = data['totalRecords'];
        },
        (error) => {
          if (error.status == '404') {
            this.receiptList = [];
          }
        }
      )
    }
  }

  curentPage : number = 1;  
  getPageData(e: any) {
    const pageNo = e.page;
    this.curentPage = pageNo;
    // if (typeof (e.event.itemsCount) == "object") return;
    if(this.userRole=='Buyer'){
      this.receiptService.getAllReceiptsByPageNo(pageNo).subscribe(
        (data: any) => {
          const paginationButtons = $('li.pages');

          paginationButtons.each(function() {
            
            if($(this).hasClass('active'))
              $(this).children().first().addClass("focused-pagination-button");
            else
              $(this).children().first().removeClass("focused-pagination-button");
      
          });
          this.receiptList = data['records'];
          this.count = data['totalRecords']
        }
      )
    }
    if (<number>this.companyId < 1 && this.flag === 'none') {
      this.setInitPageData(pageNo)
    } else if (<number>this.companyId > 0 && this.flag === 'company') {
      this.setPageDataByCompany(<number>this.companyId, pageNo)
    }
  }

  setInitPageData(pageNum: number) {
    this.receiptService.getAllReceiptsByPageNo(pageNum).subscribe(
      (data: any) => {
        const paginationButtons = $('li.pages');

        paginationButtons.each(function() {
          
          if($(this).hasClass('active'))
          $(this).children().first().addClass("focused-pagination-button");
          else
          $(this).children().first().removeClass("focused-pagination-button");

        });
        this.receiptList = data['records'];
        this.count = data['totalRecords']
      },
      (error)=>{
        this.receiptList=[];
        this.count=0;
      }
    )
  }

  setPageDataByCompany(companyId: number, pageNum: number) {
    this.receiptService.getReceiptsByCompanyId(companyId, pageNum).subscribe(
      (data: any) => {
        this.receiptList = data['records'];
        this.count = data['totalRecords']
      },
      (error)=>{
        this.receiptList=[];
        this.count=0;
      }
    )
  }
    

}
