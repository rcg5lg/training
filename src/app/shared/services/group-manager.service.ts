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

  private updateGroupList(newGroupList: Group[]): void {
    this.groupList = newGroupList;
    this.groupList$.next(this.groupList);
  }

  public getGroupsForUser(userData: User): Promise<boolean> {
    if (!userData) {
      return Promise.reject(new Error('No credentials provided'));
    }

    const getUserGroupUrl = this.APIUrl + 'groups/' + userData.id;

    return this.http.get(getUserGroupUrl).toPromise()
      .then((response) => {
        if (response['success'] === false) {
          throw Error('Invalid user');
        }

        const rawGroupList: Group[] = response['items'];
        const groupList = rawGroupList.map((rawGroup: Object) => {
          return new Group(rawGroup);
        });

        this.updateGroupList(groupList);
        return true;
      });
  }

  public findGroupById(groupId: number): Promise<Group> {
    if (!groupId) {
      return Promise.reject(new Error('No group provided'));
    }

    const cachedGroup: Group = this.groupList.find((currentRecord: Group) => {
      return currentRecord.id === groupId;
    });

    if (!cachedGroup) {
      return Promise.reject(new Error('Group not found'));
      // const getGroupUrl = this.APIUrl + 'groups/' + groupId;

      // return this.http.get(getGroupUrl).toPromise()
      //   .then((response) => {
      //     if (response['success'] === false) {
      //       throw Error('Could not delete ');
      //     }

      //     const groupItem = response['group'] as Group;
      //     return groupItem;
      //   });
    } else {
      return Promise.resolve(cachedGroup.clone());
    }
  }

  public deleteGroup(groupId: number): Promise<boolean> {
    if (!groupId) {
      return Promise.reject(new Error('No group provided'));
    }

    const deleteGroupUrl = this.APIUrl + 'group/' + groupId;

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

  public addGroup(groupData: Group): Promise<boolean> {
    const addGroupUrl = this.APIUrl + 'group';

    const requestData = {
      ...groupData
    };

    return this.http.post(addGroupUrl, requestData).toPromise()
      .then((response) => {
        if (response['success'] === false) {
          throw Error('Could not add group');
        }

        const groupItem = new Group(response['group']);
        this.groupList.push(groupItem);

        this.updateGroupList(this.groupList);
        return true;
      });
  }

  public editGroup(groupData: Group): Promise<boolean> {

    if (!groupData || !groupData.id) {
      return Promise.reject(new Error('No group provided'));
    }

    const editGroupUrl = this.APIUrl + 'group/' + groupData.id;
    const requestData = {
      'name': groupData.name,
      'description': groupData.description,
      'owner': groupData.owner
    };

    return this.http.put(editGroupUrl, requestData).toPromise()
      .then((response) => {
        if (response['success'] === false) {
          throw Error('Could not add group');
        }

        const groupItem = new Group(response['group']);
        const groupIndex = this.groupList.findIndex((currentGroup) => {
          return currentGroup.id === groupData.id;
        });

        this.groupList[groupIndex] = groupItem;

        this.updateGroupList(this.groupList);
        return true;
      });
  }

}
