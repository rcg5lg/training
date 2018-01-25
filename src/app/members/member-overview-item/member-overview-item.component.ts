import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GroupMember } from '../../shared/models/group-member';

@Component({
  selector: 'app-member-overview-item',
  templateUrl: './member-overview-item.component.html',
  styleUrls: ['./member-overview-item.component.css']
})
export class MemberOverviewItemComponent {

  @Input() isOwner: boolean;
  @Input() itemData: GroupMember;
  @Output() deleteItem: EventEmitter<number>;

  constructor() {
    this.deleteItem = new EventEmitter();
  }

  deleteHandler(): void {
    if (this.isOwner) {
      alert('Group owners can not be deleted');
      return;
    }
    this.deleteItem.emit(this.itemData.id);
  }

}
