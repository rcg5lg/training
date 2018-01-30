import { Component, OnInit, Input } from '@angular/core';

import { PostManagerService } from '../../shared/services/post-manager.service';
import { UserManagerService } from '../../shared/services/user-manager.service';

import { Post } from '../../shared/models/post';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-post-overview',
  templateUrl: './post-overview.component.html',
  styleUrls: ['./post-overview.component.css']
})
export class PostOverviewComponent implements OnInit {

  @Input() groupId: number;

  postsList: Post[] = [];

  constructor(private userMgr: UserManagerService, private postMgr: PostManagerService) {
  }

  ngOnInit() {
    this.postMgr.postList$.subscribe((newList: Post[]) => {
      this.postsList = newList;
    });
    this.postMgr.getPostsForGroup(this.groupId)
      .catch((err) => {
        alert(err.message);
      });
  }

  private updatePost(updatedPost: Post) {
    const targetUser: User = this.userMgr.getLoggedUser();
    this.postMgr.updatePost(updatedPost, targetUser)
      .then(() => {
      }).catch(() => {
        alert('--- edit error');
      });
  }

  private deletePost(targetPost: Post) {
    this.postMgr.deletePost(targetPost)
      .then(() => {

      }).catch(() => {
        alert('--- delet error');
      });
  }

  private addPost(postData: Post) {
    const targetUser: User = this.userMgr.getLoggedUser();
    this.postMgr.addPost(postData, targetUser)
      .then(() => {
      }).catch(() => {
        alert('--- edit error');
      });
  }

}
