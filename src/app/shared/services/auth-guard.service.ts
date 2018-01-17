import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UserManagerService } from './user-manager.service';

@Injectable()
export class AuthGuardService {

  constructor(private userMgr: UserManagerService, private router: Router) { }

  canActivate() {
    if (!this.userMgr.hasLoggedUser()) {
      this.router.navigate(['/login']);
    }

    return this.userMgr.hasLoggedUser();
  }
}
