import { Component, OnInit } from '@angular/core';

// services
import { UserManagerService } from '../../shared/services/user-manager.service';
import { GroupManagerService } from '../../shared/services/group-manager.service';

// models
import { Group } from '../../shared/models/group';

@Component({
  selector: 'app-groups-overview',
  templateUrl: './groups-overview.component.html',
  styleUrls: ['./groups-overview.component.css']
})
export class GroupsOverviewComponent implements OnInit {

  private groupList: Group[];
  private confirmOperation = false;
  private errorMessage = '';

  constructor(private userMgr: UserManagerService, private groupMgr: GroupManagerService) { }

  ngOnInit() {
    this.groupMgr.groupList$.subscribe((groupList: Group[]) => {
      this.groupList = groupList;
    });

    this.groupMgr.getGroupsForUser(this.userMgr.getLoggedUser());
  }

  reset() {
    this.confirmOperation = false;
    this.errorMessage = '';
  }

  handleDelete(groupId: number) {
    this.reset();

    this.groupMgr.deleteGroup(groupId)
      .then((result: boolean) => {
        this.confirmOperation = true;
        setTimeout(() => {
          this.confirmOperation = false;
        }, 1000);
      })
      .catch((err) => {
        this.errorMessage = err.message;
      });
  }

  handleEdit(groupId: number) {
    this.reset();

    console.log('=== edit record');
  }

}
