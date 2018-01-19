import { Component, OnInit } from '@angular/core';

// services
import { UserManagerService } from '../../shared/services/user-manager.service';
import { GroupManagerService } from '../../shared/services/group-manager.service';

// models
import { Group } from '../../shared/models/group';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-groups-overview',
  templateUrl: './groups-overview.component.html',
  styleUrls: ['./groups-overview.component.css']
})
export class GroupsOverviewComponent implements OnInit {

  private groupList: Group[];
  private userList: User[];

  private confirmOperation = false;
  private errorMessage = '';

  private editWindowData: Group = null;

  constructor(private userMgr: UserManagerService, private groupMgr: GroupManagerService) { }

  ngOnInit() {
    this.groupMgr.groupList$.subscribe((groupList: Group[]) => {
      this.groupList = groupList;
    });

    this.groupMgr.getGroupsForUser(this.userMgr.getLoggedUser());
    this.userMgr.getAllUsers().then((userList: User[]) => {
      this.userList = userList;
    });
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
  }

  showEdit() {
    return this.editWindowData !== null;
  }

  getEditData() {
    return this.editWindowData;
  }

  addGroup() {
    this.editWindowData = new Group();
    this.editWindowData.owner = this.userMgr.getLoggedUser().name;
  }

  editGroup(groupId: number) {
    this.groupMgr.findGroupById(groupId).then((groupItem: Group) => {
      this.editWindowData = this.groupMgr.cloneGroup(groupItem);
    }).catch((err) => {
      alert('Group record not found');
    });
  }

  resolveEdit(groupData: Group) {
    this.editWindowData = null;
    if (groupData !== null) {
      if (!groupData.id) {
        this.groupMgr.addGroup(groupData);
      } else {
        this.groupMgr.editGroup(groupData);
      }
    }
  }
}
