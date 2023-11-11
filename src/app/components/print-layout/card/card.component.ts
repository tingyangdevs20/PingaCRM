import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'pa-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
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
