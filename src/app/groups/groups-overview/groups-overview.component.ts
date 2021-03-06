import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private userMgr: UserManagerService, private groupMgr: GroupManagerService, private router: Router) { }

  ngOnInit() {
    this.groupMgr.groupList$.subscribe(
      (groupList: Group[]) => {
        this.groupList = groupList;
      });

    this.groupMgr.getGroupsForUser(this.userMgr.getLoggedUser()).catch((err) => {
      this.groupList = [];
      this.errorMessage = err.message;
    });

    this.userMgr.getAllUsers()
      .then((userList: User[]) => {
        this.userList = userList;
      })
      .catch((err) => {
        this.userList = [];
        this.errorMessage = err.message;
      });
  }

  reset() {
    this.confirmOperation = false;
    this.errorMessage = '';
  }

  handleDelete(groupId: number) {
    this.reset();

    this.groupMgr.deleteGroup(groupId)
      .then(() => {
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
    this.editWindowData.owner = this.userMgr.getLoggedUser().id;
  }

  editGroup(groupId: number) {
    this.groupMgr.findGroupById(groupId)
      .then((groupItem: Group) => {
        this.editWindowData = groupItem.clone();
      }).catch((err) => {
        alert('Group record not found');
      });
  }

  resolveEdit(groupData: Group) {
    this.editWindowData = null;
    if (groupData !== null) {
      if (!groupData.id) {
        this.groupMgr.addGroup(groupData)
          .catch((err) => {
            this.errorMessage = err.message;
          });
      } else {
        this.groupMgr.editGroup(groupData)
          .catch((err) => {
            this.errorMessage = err.message;
          });
      }
    }
  }

  openRecord(groupId: number) {
    this.router.navigate(['/group', groupId]);
  }
}
