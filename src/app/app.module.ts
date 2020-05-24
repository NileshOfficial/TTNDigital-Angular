import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginBoardComponent } from './login-board/login-board.component';
import { LoaderComponent } from './loader/loader.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { HomeComponent } from './home/home.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { BuzzComponent } from './buzz/buzz.component';
import { BuzzPostComponent } from './buzz-post/buzz-post.component';
import { AddZeroPipe } from './pipes/addzero.pipe';
import { MsToDurationPipe } from './pipes/ms-to-duration.pipe';
import { ComplaintsComponent } from './complaints/complaints.component';
import { ResolveBoardComponent } from './resolve-board/resolve-board.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginBoardComponent,
    LoaderComponent,
    AuthCallbackComponent,
    HomeComponent,
    DropdownComponent,
    BuzzComponent,
    BuzzPostComponent,
    AddZeroPipe,
    MsToDurationPipe,
    ComplaintsComponent,
    ResolveBoardComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
