import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'pa-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.css']
})
export class OnlineComponent implements OnInit {
  details: any;
  bsModalRef: BsModalRef | undefined;

  constructor() { 
    this.details.transactionDate = new Date();
  }

  ngOnInit() {
  }

  PrintReciept()
  {
    let printData = (<any>document.getElementById('reciept')).cloneNode(true);
    let printReceipt = (<any>document.getElementById('printReciept')).appendChild(printData);
    let parentElem = printData.parentElement;
    window.print();
    parentElem.removeChild(printData);
  }
}
