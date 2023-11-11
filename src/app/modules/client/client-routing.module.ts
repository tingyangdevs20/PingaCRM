import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from '../../components/client/client.component';
import { CompaniesComponent } from '../../components/companies/companies.component';
import { UsersComponent } from '../../components/users/users.component';
import { ProjectsComponent } from '../../components/projects/projects.component';
import { UnitsComponent } from '../../components/units/units.component';
import { UnitDetailComponent } from '../../components/unit-detail/unit-detail.component';
import { InvoiceListComponent } from '../../components/invoice-list/invoice-list.component';
import { ReceiptListComponent } from '../../components/receipt-list/receipt-list.component';
import { InvoicesComponent } from '../../components/invoices/invoices.component';
import { ReceiptsComponent } from '../../components/receipts/receipts.component';
import { BuyersComponent } from '../../components/buyers/buyers.component';
import { ConfigurationComponent } from '../../components/configuration/configuration.component';
import { NewuserComponent } from '../../components/newuser/newuser.component';
import { BuyerdetailComponent } from '../../components/buyerdetail/buyerdetail.component';
import { MyAccountComponent } from '../../components/my-account/my-account.component';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { TransactionComponent } from '../../components/reports/transaction.component';

const routes: Routes = [
  {
    'path': '',
    redirectTo: '/pinga/client/companies',
    pathMatch: 'full'
  },
  {
    'path': 'managementdashboard',
    component: ClientComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      }
    ]
  },
  {
    'path': 'companies',
    component: ClientComponent,
    children: [
      {
        path: '',
        component: CompaniesComponent
      }
    ]
  },
  {
    path: 'projects',
    component: ClientComponent,
    children: [
      {
        path: '',
        component: ProjectsComponent
      }
    ]
  },
  {
    path: 'users',
    component: ClientComponent,
    children: [
      {
        path: '',
        component: UsersComponent
      }
    ]
  },
  {
    path: 'buyers',
    component: ClientComponent,
    children: [
      {
        path: '',
        component: BuyersComponent
      },
      {
        path: 'buyer/buyer-detail',
        component: BuyerdetailComponent
      },
      {
        path: 'unit-detail/:id',
        component: UnitDetailComponent
      }
    ]
  },
  {
    path: 'units',
    component: ClientComponent,
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
    component: ClientComponent,
    children: [
      {
        path: '',
        component: InvoicesComponent
      }
    ]
  },
  {
    path: 'receipts',
    component: ClientComponent,
    children: [
      {
        path: '',
        component: ReceiptsComponent
      }
    ]
  },
  {
    path: 'companies/company/config',
    component: ClientComponent,
    children: [
      {
        path: '',
        component: ConfigurationComponent
      }
    ]
  },
  {
    path: 'companies/company/users/:complocId',
    component: ClientComponent,
    children: [
      {
        path: '',
        component: UsersComponent
      }
    ]
  },
  {
    path: 'companies/company/projects/:complocId',
    component: ClientComponent,
    children: [
      {
        path: '',
        component: ProjectsComponent
      }
    ]
  },
  {
    path: 'projects/project/users/:complocId/:locId/:projId',
    component: ClientComponent,
    children: [
      {
        path: '',
        component: UsersComponent
      }
    ]
  },
  {
    path: 'users/user/new-user',
    component: ClientComponent,
    children: [
      {
        path: '',
        component: NewuserComponent
      }
    ]
  },
  {
    path: 'users/user/edit',
    component: ClientComponent,
    children: [
      {
        path: '',
        component: NewuserComponent
      }
    ]
  },
  {
    path: 'my-account',
    component: ClientComponent,
    children: [
      {
        path: '',
        component: MyAccountComponent
      }
    ]
  },
  {
    path: 'transaction',
    component: ClientComponent,
    children: [
      {
        path: '',
        component: TransactionComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]
})
export class ClientRoutingModule {static routes = routes; }
