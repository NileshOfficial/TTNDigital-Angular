import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginBoardComponent } from './login-board/login-board.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { BuzzComponent } from './buzz/buzz.component';
import { HomeComponent } from './home/home.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { ResolveBoardComponent } from './resolve-board/resolve-board.component';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { LoginCheckPointService } from './services/login-check-point.service';
import { LoginCheckOnTokenRequestService } from './services/login-check-on-token-request.service';
import { CheckAdminStatusService } from './services/checkAdminStatus.service';
import { NotfoundComponent } from './notfound/notfound.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'auth', children: [
      { path: '', canActivate: [LoginCheckOnTokenRequestService], component: AuthCallbackComponent },
      { path: 'login', component: LoginBoardComponent }
    ]
  },
  { path: 'home', redirectTo: '/home/buzz', pathMatch: "full" },
  {
    path: 'home', canActivate: [LoginCheckPointService], component: HomeComponent, children: [
      { path: 'buzz', component: BuzzComponent },
      { path: 'complaints', component: ComplaintsComponent },
      { path: 'resolve', canActivate: [CheckAdminStatusService], component: ResolveBoardComponent },
      { path: 'about', component: AboutComponent },
      { path: 'help', component: HelpComponent },
      { path: 'notfound', component: NotfoundComponent },
      { path: '**', redirectTo: '/home/notfound' }
    ]
  },
  // { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/home/notfound' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
