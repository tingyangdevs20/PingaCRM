import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuyerRoutingModule } from './buyer-routing.module';
// import { MainModule } from '../main/main.module';
// import { SidebarComponent } from '../../components/sidebar/sidebar.component';
// import { HeaderComponent } from '../../components/header/header.component';
import { BuyerComponent } from '../../components/buyer/buyer.component';
// import { UnitsComponent } from '../../components/units/units.component';
// import { InvoicesComponent } from '../../components/invoices/invoices.component';
// import { ReceiptsComponent } from '../../components/receipts/receipts.component';
// import { UnitComponent } from '../../components/unit/unit.component';
// import { InvoiceComponent } from '../../components/invoice/invoice.component';
// import { ReceiptComponent } from '../../components/receipt/receipt.component';
// import { UnitDetailComponent } from '../../components/unit-detail/unit-detail.component';
// import { InvoiceListComponent } from '../../components/invoice-list/invoice-list.component';
// import { ReceiptListComponent } from '../../components/receipt-list/receipt-list.component';
// import { PaginationComponent } from 'ngx-pagination-bootstrap';
import { CustomInterceptor } from '../../service/custom-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MainModule } from "../main/main.module";

@NgModule({
    declarations: [BuyerComponent],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CustomInterceptor,
            multi: true
        }
    ],
    imports: [
        CommonModule,
        BuyerRoutingModule,
        MainModule,
    ]
})
export class BuyerModule { }
