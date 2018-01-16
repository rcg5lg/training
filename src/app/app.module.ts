import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

// directives
import { ConfirmPasswordDirective } from './register/password-confirm.directive';

// components
import { AppRoutingModule } from './app-routing.module';
import { UserDetailsComponent } from './user-details/user-details.component';
import { LogoutComponent } from './logout/logout.component';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { UserWelcomeComponent } from './user-welcome/user-welcome.component';

// services
import { UserManagerService } from './shared/services/user-manager.service';
import { GroupManagerService } from './shared/services/group-manager.service';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    ConfirmPasswordDirective,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    ErrorPageComponent,
    UserWelcomeComponent,
    UserDetailsComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [UserManagerService, GroupManagerService],
  bootstrap: [AppComponent]
})
export class AppModule {
  title = 'Hello ';
}
