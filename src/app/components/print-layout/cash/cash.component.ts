import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'pa-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.css']
})
export class CashComponent implements OnInit {
  details: any;
  bsModalRef: BsModalRef | undefined;
  constructor() { }

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
