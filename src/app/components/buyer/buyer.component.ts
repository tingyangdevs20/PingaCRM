import { Component, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
// import { SlimLoadingBarService } from "ngx-slim-loading-bar"

@Component({
  selector: 'pa-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.css']
})
export class BuyerComponent implements OnInit {

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.setLoginID()
  }

}
