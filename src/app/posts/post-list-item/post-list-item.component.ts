import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from '../../shared/models/post';

@Component({
  selector: 'app-post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrls: ['./post-list-item.component.css']
})
export class PostListItemComponent implements OnInit {

  @Input() postData: Post;
  @Output() updateRecord: EventEmitter<Post>;
  @Output() deleteRecord: EventEmitter<Post>;

  private displayData: Post;
  private inEditMode: boolean;

  constructor() {
    this.updateRecord = new EventEmitter<Post>();
    this.deleteRecord = new EventEmitter<Post>();
  }

  ngOnInit() {
    this.reset();
  }

  private reset() {
    this.changeEditMode(false);
    this.displayData = this.postData.clone();
  }

  private resetChanges(form) {
    if (form.dirty && confirm('Are you sure you want to cancel this edit ?\nYou will lose all changes')) {
      form.reset();
      this.reset();
    }
  }

  private editPost() {
    this.changeEditMode(true);
  }

  private changeEditMode(newMode: boolean) {
    this.inEditMode = newMode;
  }

  private saveChanges(form) {
    if (form.dirty) {
      this.updateRecord.emit(this.displayData);
      this.changeEditMode(false);
    }
  }

  private deletePost() {
    this.deleteRecord.emit(this.postData);
  }

}
