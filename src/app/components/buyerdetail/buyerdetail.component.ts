import { Component, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
import { LocalStorageService } from 'ngx-webstorage';
import { BuyerService } from '../../service/common/buyer.service';


@Component({
  selector: 'pa-buyerdetail',
  templateUrl: './buyerdetail.component.html',
  styleUrls: ['./buyerdetail.component.css']
})
export class BuyerdetailComponent implements OnInit {
  buyerId: any;
  buyer = {
    "buyerId": null,
    "buyerName": "",
    "unitNo": "",
    "mailingAddress": "",
    "city": "",
    "state": "",
    "country": "",
    "zip": null,
    "emaiID": "",
    "phoneNo": "",
    "mobileNo": "",
    "companyName": "",
    "projectName": "",
    "towerName": "",
    "application": "",
    "buyerRole": "",
    "bookingdate": "",
    "area": null,
    "rate": null,
    "basicSalePrice": "",
    "buyerUnits": <any>[{
    }
    ]
  }

  constructor(private dataService: DataService, private localStorage: LocalStorageService, private buyerService: BuyerService/**service**/) { }

  ngOnInit() {
    this.dataService.cBuyerId.subscribe(
      (id) => {
        (id)
        this.localStorage.store('buyerId', id)
      }
    )

    let buyerID = this.localStorage.retrieve('buyerId');

    this.buyerService.getBuyerDetails(buyerID).subscribe(
      (resp: any) => {
        if (resp)
          this.buyer = resp[0];
      }
    )
  }


}
