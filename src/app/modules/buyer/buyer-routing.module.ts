import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuyerComponent } from '../../components/buyer/buyer.component';
import { UnitsComponent } from '../../components/units/units.component';
import { InvoicesComponent } from '../../components/invoices/invoices.component';
import { ReceiptsComponent } from '../../components/receipts/receipts.component';
import { UnitDetailComponent } from '../../components/unit-detail/unit-detail.component';
import { InvoiceListComponent } from '../../components/invoice-list/invoice-list.component';
import { ReceiptListComponent } from '../../components/receipt-list/receipt-list.component';
import { MyAccountComponent } from '../../components/my-account/my-account.component';
import { TransactionComponent } from '../../components/reports/transaction.component';

const routes: Routes = [
  {
    'path': '',
    redirectTo: '/pinga/buyer/units',
    pathMatch: 'full'
  },
  {
    'path': 'units',
    component: BuyerComponent,
    children: [
      {
        path: '',
        component: UnitsComponent
      },
      {
        path: 'unit-detail/:id',
        component: UnitDetailComponent
      },
      {
        path: 'invoice-list/:id',
        component: InvoiceListComponent
      },
      {
        path: 'receipt-list/:id',
        component: ReceiptListComponent
      },
    ]
  },
  {
    path: 'invoices',
    component: BuyerComponent,
    children: [
      {
        path: '',
        component: InvoicesComponent
      },
    ]
  },
  {
    path: 'receipts',
    component: BuyerComponent,
    children: [
      {
        path: '',
        component: ReceiptsComponent
      },
    ]
  },
  {
    path: 'transaction',
    component: BuyerComponent,
    children: [
      {
        path: '',
        component: TransactionComponent
      },
    ]
  },
  {
    'path': 'my-account',
    component: BuyerComponent,
    children: [
      {
        path: '',
        component: MyAccountComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyerRoutingModule { }
