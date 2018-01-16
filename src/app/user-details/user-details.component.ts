import { Component, OnInit } from '@angular/core';
import { UserManagerService } from '../shared/services/user-manager.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  constructor(private userMgr: UserManagerService) { }

  ngOnInit() {
  }

}
