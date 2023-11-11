import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { UnitsComponent } from '../../components/units/units.component';
import { ReceiptsComponent } from '../../components/receipts/receipts.component';
import { InvoicesComponent } from '../../components/invoices/invoices.component';
import { UnitComponent } from '../../components/unit/unit.component';
import { DataService } from '../../service/data.service';
// import { DataTableModule } from 'angular2-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { InvoiceComponent } from '../../components/invoice/invoice.component';
import { ReceiptComponent } from '../../components/receipt/receipt.component';
import { UnitDetailComponent } from '../../components/unit-detail/unit-detail.component';
import { InvoiceListComponent } from '../../components/invoice-list/invoice-list.component';
import { ReceiptListComponent } from '../../components/receipt-list/receipt-list.component';
import { PingaComponent } from '../../components/pinga/pinga.component';
// import { Select2Module } from 'ng2-select2';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadCrumbComponent } from '../../components/bread-crumb/bread-crumb.component';
import { UnitService } from '../../service/common/unit.service';
import { InvoiceService } from '../../service/common/invoice.service';
import { ReceiptService } from '../../service/common/receipt.service';
import { CompanyService } from '../../service/common/company.service';
import { ProjectService } from '../../service/common/project.service';
import { UserService } from '../../service/common/user.service';
import { BuyerService } from '../../service/common/buyer.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
// import { SlimLoadingBarModule } from 'ngx-slim-loading-bar';
import { LoaderInterceptor } from "../../interceptors/loader-interceptor";
import { ConfigurationService } from '../../service/common/configuration.service';
import { MyAccountComponent } from '../../components/my-account/my-account.component';
import { MyProfileComponent } from '../../components/my-account/my-profile/my-profile.component';
import { ResetPasswordComponent } from '../../components/my-account/reset-password/reset-password.component';
import { ChequeComponent } from '../../components/print-layout/cheque/cheque.component';
import { CashComponent } from '../../components/print-layout/cash/cash.component';
import { CardComponent } from '../../components/print-layout/card/card.component';
import { TransactionComponent } from '../../components/reports/transaction.component';
import { TransactionService } from '../../service/common/transaction.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { SelectDropDownModule } from 'ngx-select-dropdown'

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,    
    PaginationModule,
    BsDatepickerModule.forRoot(),    
    TabsModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,    
    NgxDatatableModule,
    NgSelect2Module,
    NgxPaginationModule,
    SelectDropDownModule,
    ModalModule.forRoot()
    // SlimLoadingBarModule,
    // Select2Module,
    // DataTableModule,
  ],
  declarations: [
    PingaComponent, 
    HeaderComponent,
    SidebarComponent,
    UnitsComponent, 
    ReceiptsComponent, 
    InvoicesComponent, 
    UnitComponent, 
    InvoiceComponent, 
    ReceiptComponent, 
    UnitDetailComponent, 
    InvoiceListComponent, 
    ReceiptListComponent, 
    BreadCrumbComponent, 
    MyAccountComponent, 
    MyProfileComponent, 
    ResetPasswordComponent, 
    ChequeComponent, 
    CashComponent, 
    CardComponent,
    TransactionComponent
  ],
  exports: [HeaderComponent, SidebarComponent,UnitsComponent, ReceiptsComponent, InvoicesComponent, UnitComponent, InvoiceComponent, ReceiptComponent, UnitDetailComponent, InvoiceListComponent, ReceiptListComponent, PingaComponent, TabsModule, BreadCrumbComponent, MyAccountComponent, MyProfileComponent, ResetPasswordComponent, TransactionComponent ],//  SlimLoadingBarModule, 
  providers: [
    DataService,
    UnitService,
    InvoiceService,
    ReceiptService,
    CompanyService,
    ProjectService,
    UserService,
    BuyerService,
    TransactionService,
    DatePipe,
    ConfigurationService,    
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
    // BsModalRef
  ],
})
export class MainModule { }
