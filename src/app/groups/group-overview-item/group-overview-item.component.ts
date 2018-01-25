import { Component, Input, Output, EventEmitter } from '@angular/core';

// models
import { Group } from '../../shared/models/group';
import { GroupMember } from '../../shared/models/group-member';

@Component({
  selector: 'app-group-overview-item',
  templateUrl: './group-overview-item.component.html',
  styleUrls: ['./group-overview-item.component.css']
})
export class GroupOverviewItemComponent {

  @Input() groupData: Group;
  @Output() openRecord: EventEmitter<number>;
  @Output() deleteRecord: EventEmitter<number>;
  @Output() editRecord: EventEmitter<number>;

  expanded = false;
  showAllMembers = false;
  visibleMembersLimit = 2;

  constructor() {
    this.editRecord = new EventEmitter<number>();
    this.deleteRecord = new EventEmitter<number>();
    this.openRecord = new EventEmitter<number>();
  }

  editGroup($event) {
    this.editRecord.emit(this.groupData.id);
    $event.preventDefault();
  }

  deleteGroup($event) {
    this.deleteRecord.emit(this.groupData.id);
    $event.preventDefault();
  }

  openGroup($event) {
    this.openRecord.emit(this.groupData.id);
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
