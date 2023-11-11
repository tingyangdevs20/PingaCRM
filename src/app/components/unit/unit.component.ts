import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../service/data.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'tr.pa-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {
  @Input() unit: any;
  userRole: any;
  constructor(private router: Router, private route: ActivatedRoute,private dataService: DataService, private localStorage: LocalStorageService) { }

  ngOnInit() {
    this.userRole=this.localStorage.retrieve('role');
  }

  goTo(unit: any) {

    this.router.navigate(['../unit-detail', unit.buyerID], {relativeTo: this.route})
  }
  
  goToInvoiceList(unit: any) {
    this.localStorage.store('selectedbuyerID', unit.buyerID);
    this.router.navigate(['../invoice-list', unit.buyerID], {relativeTo: this.route});    
  }

  goToReceiptList(unit: any) {
    this.localStorage.store('selectedbuyerID', unit.buyerID);
    this.router.navigate(['../receipt-list', unit.buyerID], { relativeTo: this.route});
  }

  
}
