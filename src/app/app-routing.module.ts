import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginBoardComponent } from './login-board/login-board.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';


const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'auth', children: [
      { path: '', component: AuthCallbackComponent },
      { path: 'login', component: LoginBoardComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
