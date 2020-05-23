import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginBoardComponent } from './login-board/login-board.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { BuzzComponent } from './buzz/buzz.component';
import { HomeComponent } from './home/home.component';
import { ComplaintsComponent } from './complaints/complaints.component';


const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'auth', children: [
      { path: '', component: AuthCallbackComponent },
      { path: 'login', component: LoginBoardComponent }
    ]
  },
  { path: 'home', redirectTo: '/home/buzz', pathMatch: "full"},
  {
    path: 'home', component: HomeComponent, children: [
      { path: 'buzz', component: BuzzComponent },
      { path: 'complaints', component: ComplaintsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
