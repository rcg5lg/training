import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// models
import { Post } from '../models/post';
import { User } from '../models/user';

@Injectable()
export class PostManagerService {

  private APIUrl = 'http://localhost:81/api/';
  private postList: Post[];
  public postList$: BehaviorSubject<Post[]>;


  constructor(private http: HttpClient) {
    this.postList$ = new BehaviorSubject<Post[]>(this.postList);
  }

  private updatePostList(newpostList: Post[]): void {
    this.postList = newpostList;
    this.postList$.next(this.postList);
  }

  public getPostsForGroup(groupId: number): Promise<Post[]> {
    if (!groupId) {
      return Promise.reject(new Error('No group provided'));
    }

    const getPostsForGroupUrl = this.APIUrl + 'group/' + groupId + '/posts';

    return this.http.get(getPostsForGroupUrl).toPromise()
      .then((response) => {
        if (response['success'] === false) {
          throw Error('Invalid group data');
        }

        const rawPostsList = response['items'];
        const postsList = rawPostsList.map((rawPost: Object) => {
          return new Post(rawPost);
        });

        this.updatePostList(postsList);
        return postsList;
      });
  }

  public updatePost(updatedPost: Post, targetUser: User): Promise<Post[]> {
    if (!updatedPost) {
      return Promise.reject(new Error('No post provided'));
    }

    const updatePostUrl = this.APIUrl + 'post/' + updatedPost.id;
    const requestData = {
      'message': updatedPost.message,
      'changedByUserId': targetUser.id
    };

    return this.http.put(updatePostUrl, requestData).toPromise()
      .then((response) => {
        if (response['success'] === false) {
          throw Error('Invalid post data');
        }

        const newPost: Post = new Post(response['post']);
        const index = this.postList.findIndex((currentPost) => {
          return currentPost.id === newPost.id;
        });
        this.postList[index] = newPost;

        this.updatePostList(this.postList);
        return this.postList;
      });
  }

  public deletePost(targetPost: Post): Promise<boolean> {
    if (!targetPost) {
      return Promise.reject(new Error('No post provided'));
    }

    const deletePostUrl = this.APIUrl + 'post/' + targetPost.id;

    return this.http.delete(deletePostUrl).toPromise()
      .then((response) => {
        if (response['success'] === false) {
          throw Error('Invalid post data');
        }

        const updatedPostList: Post[] = this.postList.filter((currentPost) => {
          return currentPost.id !== targetPost.id;
        });

        this.updatePostList(updatedPostList);
        return true;
      });
  }

  public addPost(postData: Post, targetUser: User): Promise<boolean> {
    if (!postData) {
      return Promise.reject(new Error('No post provided'));
    }

    const addPostUrl = this.APIUrl + 'post/';
    const requestData = {
      'message': postData.message,
      'createdByUserId': postData.id
    };

    return this.http.post(addPostUrl, requestData).toPromise()
      .then((response) => {
        if (response['success'] === false) {
          throw Error('Invalid post data');
        }

        const newPost: Post = new Post(response['post']);
        this.postList.push(newPost);

        this.updatePostList(this.postList);
        return true;
      });
  }
}
