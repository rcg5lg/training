import { Component, OnInit, Input } from '@angular/core';
import { GroupManagerService } from '../../shared/services/group-manager.service';
import { GroupMember } from '../../shared/models/group-member';
import { Group } from '../../shared/models/group';

@Component({
  selector: 'app-member-overview',
  templateUrl: './member-overview.component.html',
  styleUrls: ['./member-overview.component.css']
})
export class MemberOverviewComponent implements OnInit {

  @Input() groupId: number;

  membersList: GroupMember[] = [];
  groupData: Group;
  errorMessage: string;

  constructor(private groupMgr: GroupManagerService) { }

  ngOnInit() {
    this.refreshMemberList();
  }

  refreshMemberList(): void {
    this.groupMgr.findGroupById(this.groupId)
      .then((groupData: Group) => {
        this.groupData = groupData;

        return this.groupMgr.getGroupMembers(this.groupId)
          .then((membersList: GroupMember[]) => {
            this.membersList = membersList;
          });
      }).catch((err) => {
        alert(err.message);
      });
  }

  addUserAsMember(userId: number): void {
    this.groupMgr.addGroupMember(this.groupId, userId)
      .then((newMember: GroupMember) => {
        this.membersList.push(newMember);
      }).catch((err) => {
        this.errorMessage = 'Could not add group member -- ' + err.message;
      });
  }

  deleteMember(memberId: number): void {
    this.groupMgr.deleteGroupMember(this.groupId, memberId)
      .then((result) => {
        this.membersList = this.membersList.filter((member: GroupMember) => {
          return member.id !== memberId;
        });
      })
      .catch((err) => {
        this.errorMessage = '--- Delete group member ' + err.message;
      });
  }

}
