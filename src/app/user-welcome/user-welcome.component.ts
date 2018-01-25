import { Component, OnInit } from '@angular/core';

// services
import { UserManagerService } from '../shared/services/user-manager.service';

// models
import { User } from '../shared/models/user';

@Component({
  selector: 'app-user-welcome',
  templateUrl: './user-welcome.component.html',
  styleUrls: ['./user-welcome.component.css'],
})
export class UserWelcomeComponent implements OnInit {

  loggedUser: User;

  constructor(private userMgr: UserManagerService) { }

  ngOnInit() {
    this.loggedUser = null;
    this.userMgr.loggedUser$.subscribe((newUser: User) => {
      this.loggedUser = newUser;
    });
  }
}
