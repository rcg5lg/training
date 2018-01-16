import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { User } from '../shared/models/user';

@Component({
  selector: 'app-register',
  templateUrl: '../register/register.component.html',
  styleUrls: ['../register/register.component.css']
})
export class RegisterComponent extends LoginComponent {

  title = 'Please insert details..';

  doTask(): Promise<any> {
    const newaa = new User();
    newaa.token = 'sadsla';
    return this.userMgr.deleteUser(newaa);

    // const userData: User = new User();
    // userData.username = this.username;
    // userData.name = this.username;

    // return this.userMgr.registerUser(userData, this.password);
  }
}
