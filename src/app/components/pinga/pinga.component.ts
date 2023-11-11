import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'pa-pinga',
  templateUrl: './pinga.component.html',
  styleUrls: ['./pinga.component.css']
})
export class PingaComponent implements OnInit {

  constructor(private localStorage: LocalStorageService) { }


  ngOnInit() {     
    
  } 

}
