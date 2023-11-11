import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe, } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { MainModule } from '../main/main.module';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ClientComponent } from '../../components/client/client.component';
import { CompaniesComponent } from '../../components/companies/companies.component';
// import { NgxPaginationModule } from 'ngx-pagination';
import { ConfigurationComponent } from '../../components/configuration/configuration.component';
import { EmailserverSettingsComponent } from '../../components/emailserver-settings/emailserver-settings.component';
import { SmsSettingsComponent } from '../../components/sms-settings/sms-settings.component';
import { GeneralSettingsComponent } from '../../components/general-settings/general-settings.component';
import { CompanyComponent } from '../../components/company/company.component';
// import { DataTableModule } from 'angular2-datatable';
import { UsersComponent } from '../../components/users/users.component';
import { UserComponent } from '../../components/user/user.component';
import { ProjectsComponent } from '../../components/projects/projects.component';
import { ProjectComponent } from '../../components/project/project.component';
import { ProjectsListComponent } from '../../components/projects-list/projects-list.component';
import { BuyersComponent } from '../../components/buyers/buyers.component';
import { CbuyerComponent } from '../../components/cbuyer/cbuyer.component';
// import { Select2Module } from 'ng2-select2';
import { NewuserComponent } from '../../components/newuser/newuser.component';
import { NgxEditorModule } from 'ngx-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { DropzoneModule, DROPZONE_CONFIG, DropzoneConfigInterface, DropzoneConfig } from 'ngx-dropzone-wrapper';
import { BuyerdetailComponent } from '../../components/buyerdetail/buyerdetail.component';
// import { SelectModule } from 'ng-select';
import { CustomInterceptor } from '../../service/custom-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { LiveTileDirective } from '../../directives/tile.directive';
// import 'metrojs/release/MetroJs.Full/MetroJs';
import { MaterialModule } from '../../../material-module';
import { MillionPipe, INRCurrencyPipe } from '../../components/dashboard/million.pipe';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule, SelectionType  } from '@swimlane/ngx-datatable';
import { SelectDropDownModule } from 'ngx-select-dropdown'

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};

@NgModule({
    declarations: [
        LiveTileDirective, 
        ClientComponent,
         DashboardComponent, ConfigurationComponent, EmailserverSettingsComponent, SmsSettingsComponent, GeneralSettingsComponent, CompanyComponent, UsersComponent, UserComponent, ProjectsComponent, ProjectComponent, ProjectsListComponent, CompaniesComponent, 
        BuyersComponent,
        MillionPipe, CbuyerComponent, NewuserComponent,
        BuyerdetailComponent, 
        INRCurrencyPipe
        ],
    providers: [DatePipe, DecimalPipe,
        {
            provide: DROPZONE_CONFIG,
            useValue: DEFAULT_DROPZONE_CONFIG,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CustomInterceptor,
            multi: true,
        }
    ],
    exports: [
        LiveTileDirective
    ],
    imports: [
        CommonModule,
        ClientRoutingModule,
        // DataTableModule,
        // NgxPaginationModule,
        MainModule,
        // Select2Module,        
        NgxEditorModule,
        FormsModule,
        ReactiveFormsModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),
        DropzoneModule,
        // SelectModule,
        MaterialModule,
        TooltipModule.forRoot(),
        NgbModule,
        MainModule,
        NgxDatatableModule,
        SelectDropDownModule
    ],
    schemas:  [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ClientModule { }
