import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { Post } from '../../shared/models/post';

@Component({
  selector: 'app-post-item-add-form',
  templateUrl: './app-post-item-add-form.component.html',
  styleUrls: ['./app-post-item-add-form.component.css']
})
export class PostItemAddFormComponent {

  @ViewChild('messageTf') messageTf: ElementRef;

  @Input() postData: Post;
  @Input() set forceFocus(value: number) {
    this.messageTf.nativeElement.focus();
  }
  @Output() addRecord: EventEmitter<Post>;
  @Output() cancelAddRecord: EventEmitter<boolean>;

  private inEditMode: boolean;

  constructor() {
    this.addRecord = new EventEmitter<Post>();
    this.cancelAddRecord = new EventEmitter<boolean>();
  }

  private cancelChanges(form) {
    if (!form.dirty) {
      this.cancelAddRecord.emit(true);
      return;
    }
    if (confirm('Are you sure you want to cancel this edit ?\nYou will lose all changes')) {
      this.cancelAddRecord.emit(true);
    }
  }

  private saveChanges(form) {
    if (form.dirty) {
      this.addRecord.emit(this.postData);
      return;
    }
    alert('No post data to save');
  }

}
