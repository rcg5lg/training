import { Component, OnInit } from '@angular/core';
import { UserManagerService } from '../shared/services/user-manager.service';
import { User } from '../shared/models/user';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  userData: User;
  updateError: string;
  updateCompleted: boolean;

  constructor(private userMgr: UserManagerService) { }

  ngOnInit() {
    this.reset();
    this.userMgr.loggedUser$.subscribe((userData: User) => {
      this.userData = userData;
    });
  }

  reset() {
    this.updateError = '';
    this.updateCompleted = false;
  }

  submitChanges() {
    console.log(this.userData);
    return this.userMgr.updateUser(this.userData)
      .then((userData: User) => {
        this.updateCompleted = true;
        setTimeout(() => {
          this.updateCompleted = false;
        }, 700);

      })
      .catch((err: Error) => {
        this.updateError = err.message;
      });
  }

}
