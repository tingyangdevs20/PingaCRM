import { Component, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
// import {SlimLoadingBarService} from "ngx-slim-loading-bar"

@Component({
  selector: 'pa-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  posts:any

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.setLoginID();
   }

}
