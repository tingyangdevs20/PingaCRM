import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../../components/login/login.component';
import { ForgetPasswordComponent } from '../../components/forget-password/forget-password.component';
import { LoginGuardService } from '../../service/login-guard.service';

const loginRoutes: Routes = [
    { 'path': '', component: LoginComponent, canActivate: [LoginGuardService] },
    { 'path': 'forget-password', component: ForgetPasswordComponent }
]

@NgModule({
    imports: [
        RouterModule.forChild(loginRoutes)
    ],
    exports: [RouterModule]
})

export class AuthRoutingModule { }