import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginBoardComponent } from './components/login-board/login-board.component';
import { LoaderComponent } from './components/loader/loader.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { HomeComponent } from './components/home/home.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { BuzzComponent } from './components/buzz/buzz.component';
import { BuzzPostComponent } from './components/buzz-post/buzz-post.component';
import { AddZeroPipe } from './pipes/addzero.pipe';
import { MsToDurationPipe } from './pipes/ms-to-duration.pipe';
import { ComplaintsComponent } from './components/complaints/complaints.component';
import { ResolveBoardComponent } from './components/resolve-board/resolve-board.component';
import { AboutComponent } from './components/about/about.component';
import { HelpComponent } from './components/help/help.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { RequestHeaderService } from './services/interceptor.service';
import { NotfoundComponent } from './components/notfound/notfound.component';

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
    AboutComponent,
    HelpComponent,
    CarouselComponent,
    NotfoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    InfiniteScrollModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: RequestHeaderService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
