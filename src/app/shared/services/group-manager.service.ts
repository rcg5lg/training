import 'rxjs/add/observable/of';
import { Injectable, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// models
import { User } from '../models/user';
import { Group } from '../models/group';

@Injectable()
export class GroupManagerService {

  private groupList: Group[];
  public groupList$: BehaviorSubject<Group[]>;

  private APIUrl = 'http://localhost:81/api/';

  constructor(private http: HttpClient) {
    this.groupList = [];
    this.groupList$ = new BehaviorSubject<Group[]>(this.groupList);
  }

  updateGroupList(newGroupList: Group[]) {
    this.groupList = newGroupList;
    this.groupList$.next(this.groupList);
  }

  getGroupsForUser(userData: User): Promise<any> {
    if (!userData) {
      return Promise.reject(new Error('No credentials provided'));
    }

    const getUserGroupUrl = this.APIUrl + 'groups/' + userData.token;

    return this.http.get(getUserGroupUrl).toPromise()
      .then((response) => {
        if (response['success'] === false) {
          throw Error('Invalid user');
        }

        const rawGroupList: Group[] = response['items'];
        const groupList = rawGroupList.map((rawGroup) => {
          const groupItem = rawGroup as Group;
          return groupItem;
        });

        this.updateGroupList(groupList);
        return true;
      });
  }

  deleteGroup(groupId: number): Promise<boolean> {
    if (!groupId) {
      return Promise.reject(new Error('No group provided'));
    }

    const deleteGroupUrl = this.APIUrl + 'groups/' + groupId;

    return this.http.delete(deleteGroupUrl).toPromise()
      .then((response) => {
        if (response['success'] === false) {
          throw Error('Could not delete ');
        }

        const newGroupList = this.groupList.filter((currentGroup) => {
          return currentGroup.id !== groupId;
        });

        this.updateGroupList(newGroupList);
        return true;
      });
  }

}
