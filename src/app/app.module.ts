import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdmDashboardComponent } from './adm-dashboard/adm-dashboard.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductListComponent } from './product-list/product-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { OrderListComponent } from './order-list/order-list.component';
import { UserStatusPipe } from './user-status.pipe';
import { SetTimerPipe } from './set-timer.pipe';
import { SetNumPipe } from './set-num.pipe';
import { TimerComponent } from './timer/timer.component';
import { SetDatePipe } from './set-date.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserDashboardComponent,
    AdmDashboardComponent,
    ProductFormComponent,
    ProductListComponent,
    UserListComponent,
    OrderListComponent,
    UserStatusPipe,
    SetTimerPipe,
    SetNumPipe,
    TimerComponent,
    SetDatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
