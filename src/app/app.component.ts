import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { DataService } from './service/data.service';
import { LocalStorageService } from 'ngx-webstorage';
import { Location } from '@angular/common'

@Component({
  selector: 'pa-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DataService]
})
export class AppComponent implements OnInit {
  constructor(private localStorage: LocalStorageService, private router: Router, private location: Location) {

  }

  ngOnInit() {
    let role = this.localStorage.retrieve('role');
    // console.log(role);
    // console.log(this.location.path());
    let path = this.location.path();

    if (path == '/pinga' || path == '/pinga/') {
      if (role == 'Client Admin') {
        this.router.navigate(['/pinga/client/companies'])
      } else if (role == 'Buyer') {
        this.router.navigate(['/pinga/buyer/units'])
      }
    }
  }
}
