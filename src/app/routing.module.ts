import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetPasswordComponent } from './components/set-password/set-password.component';
import { MyResolver } from './resolve/resolver';

const appRoutes: Routes = [
    { 'path': '', redirectTo: '/login', pathMatch: 'full' },
    { 'path': 'login', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
    { 'path': 'pinga', loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule) },
    {
        'path': 'set-password', component: SetPasswordComponent,
        resolve: {
            data: MyResolver
        }
    },
    { 'path': '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule],
    providers: [MyResolver]
})

export class RoutingModule { }
