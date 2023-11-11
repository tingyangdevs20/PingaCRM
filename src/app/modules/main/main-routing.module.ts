import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../service/auth-guard.service';
import { BuyerRoleGuardService } from '../../service/buyer-role-gaurd.service';
import { ClientRoleGuardService } from '../../service/client-role-gaurd.service';
// import { DashboardComponent } from '../../components/dashboard/dashboard.component';

const routes: Routes = [
  {
    'path': '',
    canActivate: [AuthGuardService],
    children: [
      {
        'path': 'buyer',
        canLoad: [BuyerRoleGuardService],
        loadChildren: () => import('../buyer/buyer.module').then(m => m.BuyerModule)
      },
      {
        'path': 'client',
        canLoad: [ClientRoleGuardService],
        loadChildren: () => import('../client/client.module').then(m => m.ClientModule),
      },

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
