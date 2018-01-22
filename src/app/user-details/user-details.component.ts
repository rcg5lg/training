import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// services
import { UserManagerService } from '../shared/services/user-manager.service';

// models
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
  deleteError: string;
  deleteCompleted: boolean;

  constructor(private userMgr: UserManagerService, private router: Router) { }

  ngOnInit() {
    this.reset();
    this.userMgr.loggedUser$.subscribe((userData: User) => {
      if (!userData) {
        userData = new User();
      }
      this.userData = userData;
    });
  }

  reset() {
    this.updateError = '';
    this.updateCompleted = false;
    this.deleteError = '';
    this.deleteCompleted = false;
  }

  submitChanges() {
    return this.userMgr.updateUser(this.userData)
      .then(() => {
        this.updateCompleted = true;
        setTimeout(() => {
          this.updateCompleted = false;
        }, 1000);
      })
      .catch((err: Error) => {
        this.updateError = err.message;
      });
  }

  terminateUser() {
    if (confirm('Are you sure you want to delete your user?')) {
      this.userMgr.deleteUser(this.userData)
        .then(() => {
          this.deleteCompleted = true;
          setTimeout(() => {
            this.deleteCompleted = false;
            this.router.navigate(['/register']);
          }, 1000);
        })
        .catch((err: Error) => {
          this.deleteError = err.message;
        });
    }
  }

}
