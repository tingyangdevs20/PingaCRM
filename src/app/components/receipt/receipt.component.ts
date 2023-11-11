import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ReceiptService } from '../../service/common/receipt.service';
import { ChequeComponent } from '../print-layout/cheque/cheque.component';
import { CashComponent } from '../print-layout/cash/cash.component';
import { CardComponent } from '../print-layout/card/card.component';
import { OnlineComponent } from '../print-layout/online/online.component';
@Component({
  selector: 'tr.pa-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {
  @Input() receipt: any;

  public modalRef: BsModalRef | undefined;
  constructor(private modalService: BsModalService, private receiptService: ReceiptService) { }

  ngOnInit() {
  }
  openPrintPreview(e: any, receiptNo: any, paymentMode: any, printLayoutNotDefinedTemplate: TemplateRef<any>) {
    e.preventDefault();
    paymentMode = paymentMode.toLowerCase();
    if (paymentMode != "cheque" && paymentMode != "offline rtgs" && paymentMode != "offline neft" && paymentMode != "demand draft"
    && paymentMode != "cash" 
    && paymentMode != "offline credit/debit" && paymentMode != "offline credit/debit card" 
    && paymentMode != "online" && paymentMode != "online payment - ici" 
    && paymentMode != "ol" && paymentMode != "online payment" 
    && paymentMode != "hdfc" && paymentMode != "online payment - hdf") {
      this.modalRef = this.modalService.show(printLayoutNotDefinedTemplate);
    }
    else {
      this.receiptService.getReceiptPrintDetail(receiptNo).subscribe(
        (data) => {
          const initialState = {
            details: data,
          };
          if (paymentMode == "cheque" || paymentMode == "offline rtgs" || paymentMode == "offline neft" || paymentMode == "demand draft") {
            this.modalRef = this.modalService.show(ChequeComponent, { initialState, class: 'reciept-modal' });
          }
          else if (paymentMode == "cash") {
            this.modalRef = this.modalService.show(CashComponent, { initialState, class: 'reciept-modal' });
          }
          else if (paymentMode == "offline credit/debit" || paymentMode == "offline credit/debit card") {
            this.modalRef = this.modalService.show(CardComponent, { initialState, class: 'reciept-modal' });
          }
          else if (paymentMode == "online" || paymentMode == "online payment - ici" 
          || paymentMode == "ol" || paymentMode == "online payment" 
          || paymentMode == "hdfc" || paymentMode == "online payment - hdf") {
            this.modalRef = this.modalService.show(OnlineComponent, { initialState, class: 'reciept-modal' });
          }
        },
        (error) => {

        }
      )
    }
  }
}
