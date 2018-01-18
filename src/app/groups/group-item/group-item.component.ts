import { Component, Input, Output, EventEmitter } from '@angular/core';

// models
import { Group } from '../../shared/models/group';
import { GroupMember } from '../../shared/models/group-member';

@Component({
  selector: 'app-group-item',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.css']
})
export class GroupItemComponent {

  @Input() groupData: Group;
  @Output() deleteRecord: EventEmitter<number>;
  @Output() editRecord: EventEmitter<number>;

  expanded = false;
  showAllMembers = false;
  visibleMembersLimit = 2;

  constructor() {
    this.editRecord = new EventEmitter<number>();
    this.deleteRecord = new EventEmitter<number>();
  }

  editGroup($event) {
    this.editRecord.emit(this.groupData.id);
    $event.preventDefault();
  }

  deleteGroup($event) {
    this.deleteRecord.emit(this.groupData.id);
    $event.preventDefault();
  }

  getVisibleMembers(): GroupMember[] {
    if (!this.groupData.members) {
      return [];
    }
    if (this.showAllMembers) {
      return this.groupData.members;
    }
    return this.groupData.members.slice(0, this.visibleMembersLimit);
  }

  updateMembersVisibility() {
    this.showAllMembers = !this.showAllMembers;
  }

}
