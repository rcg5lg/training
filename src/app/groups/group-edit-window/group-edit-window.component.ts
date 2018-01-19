import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Group } from '../../shared/models/group';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-group-edit-window',
  templateUrl: './group-edit-window.component.html',
  styleUrls: ['./group-edit-window.component.css']
})
export class GroupEditWindowComponent {

  @Input() groupData: Group;
  @Input() userList: User[];
  @Output() closeWindow = new EventEmitter<Group>();

  constructor() { }

  getTitle() {
    if (this.groupData.id) {
      return 'Edit group';
    }
    return 'Add group';
  }

  handleClose(shouldSave) {
    let emitData: Group = null;
    if (shouldSave) {
      emitData = this.groupData;
    }

    this.closeWindow.emit(emitData);
  }

}
