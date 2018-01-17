import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { LogoutComponent } from './logout/logout.component';

// services
import { AuthGuardService } from './shared/services/auth-guard.service';
import { UserManagerService } from './shared/services/user-manager.service';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  {
    path: 'user-details', component: UserDetailsComponent,
    canActivate: [AuthGuardService]
  },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [UserManagerService, AuthGuardService],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
