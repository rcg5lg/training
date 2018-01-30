import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Post } from '../../shared/models/post';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {

  @Input() postsList: Post[];
  @Output() updatePost: EventEmitter<Post>;
  @Output() deletePost: EventEmitter<Post>;

  constructor() {
    this.updatePost = new EventEmitter<Post>();
    this.deletePost = new EventEmitter<Post>();
  }

  private updateRecord(updatedPost: Post) {
    this.updatePost.emit(updatedPost);
  }

  private deleteRecord(targetPost: Post) {
    this.deletePost.emit(targetPost);
  }

}
