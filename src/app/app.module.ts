import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RoutingModule } from './routing.module';
// import { PaginationModule } from 'ngx-pagination-bootstrap';
import { AuthService } from './service/auth.service';
import { AuthGuardService } from './service/auth-guard.service';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { BuyerRoleGuardService } from './service/buyer-role-gaurd.service';
import { ClientRoleGuardService } from './service/client-role-gaurd.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LoginGuardService } from './service/login-guard.service';
import { CookieService } from 'ngx-cookie-service';
import { CustomInterceptor } from './service/custom-interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SetPasswordComponent } from './components/set-password/set-password.component';
import { DataService } from './service/data.service';
import { DatePipe } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { NgxUiLoaderModule } from 'ngx-ui-loader';


@NgModule({
  declarations: [
    AppComponent, SetPasswordComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    NgxUiLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    NgxWebstorageModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [AuthService, AuthGuardService, BuyerRoleGuardService, ClientRoleGuardService, LoginGuardService, DatePipe,
    CookieService, DataService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }
