import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginBoardComponent } from './components/login-board/login-board.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { BuzzComponent } from './components/buzz/buzz.component';
import { HomeComponent } from './components/home/home.component';
import { ComplaintsComponent } from './components/complaints/complaints.component';
import { ResolveBoardComponent } from './components/resolve-board/resolve-board.component';
import { AboutComponent } from './components/about/about.component';
import { HelpComponent } from './components/help/help.component';
import * as guards from './services/routeGuards';
import { NotfoundComponent } from './components/generic/notfound/notfound.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'auth', children: [
      { path: '', canActivate: [guards.GrantCodeCheckGuard], component: AuthCallbackComponent },
      { path: 'login', component: LoginBoardComponent }
    ]
  },
  { path: 'home', redirectTo: '/home/buzz', pathMatch: "full" },
  {
    path: 'home', canActivate: [guards.DirectRouteAccessGuard], component: HomeComponent, children: [
      { path: 'buzz', component: BuzzComponent },
      { path: 'complaints', component: ComplaintsComponent },
      { path: 'resolve', canActivate: [guards.CheckAdminStatusGuard], component: ResolveBoardComponent },
      { path: 'about', component: AboutComponent },
      { path: 'help', component: HelpComponent },
      { path: 'notfound', component: NotfoundComponent },
      { path: '**', redirectTo: '/home/notfound' }
    ]
  },
  { path: '**', redirectTo: '/home/notfound' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
