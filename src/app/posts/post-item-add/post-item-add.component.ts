import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { PostListItemComponent } from '../post-list-item/post-list-item.component';
import { Post } from '../../shared/models/post';

@Component({
  selector: 'app-post-item-add',
  templateUrl: './post-item-add.component.html',
  styleUrls: ['./post-item-add.component.css']
})
export class PostItemAddComponent implements OnInit {

  @Output() addPost = new EventEmitter<Post>();

  private inAddMode = false;
  private forceFocus = 0;
  private newPostData: Post;

  constructor() {
  }

  ngOnInit() {
    this.newPostData = new Post();
  }

  private closeAddPost() {
    this.changeAddMode(false);
    this.newPostData = new Post();
  }
  private openAddPost() {
    if (this.inAddMode) {
      this.forceFocus++;
    }
    this.changeAddMode(true);
  }

  private changeAddMode(newMode: boolean) {
    console.log('---- change addmode ' + newMode);
    this.inAddMode = newMode;
  }

  private addRecord(postData: Post) {
    this.closeAddPost();

    this.addPost.emit(postData);
  }

}
