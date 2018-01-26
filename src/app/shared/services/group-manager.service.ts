import 'rxjs/add/observable/of';
import { Injectable, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// models
import { User } from '../models/user';
import { Group } from '../models/group';
import { GroupMember } from '../models/group-member';

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
      const getGroupUrl = this.APIUrl + 'group/' + groupId;

      return this.http.get(getGroupUrl).toPromise()
        .then((response) => {
          if (response['success'] === false) {
            throw Error('Could not find group');
          }

          const groupItem = new Group(response['group']);
          return groupItem;
        });
    } else {
      return Promise.resolve(cachedGroup);
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

  public getGroupMembers(groupId: number): Promise<GroupMember[]> {
    if (!groupId) {
      return Promise.reject(new Error('No group provided'));
    }

    const getGroupMembersUrl = this.APIUrl + 'group/' + groupId + '/members';

    return this.http.get(getGroupMembersUrl).toPromise()
      .then((response) => {
        if (response['success'] === false) {
          throw Error('Could not add group');
        }

        const membersList: GroupMember[] = response['members'].map((rawMember) => {
          return new GroupMember(rawMember);
        });

        return membersList;
      });
  }

  public deleteGroupMember(groupId, memberId): Promise<boolean> {
    if (!groupId) {
      return Promise.reject(new Error('No group provided'));
    }
    if (!memberId) {
      return Promise.reject(new Error('No member provided'));
    }

    const deleteGroupMemberUrl = this.APIUrl + 'group/' + groupId + '/member/' + memberId;

    return this.http.delete(deleteGroupMemberUrl).toPromise()
      .then((response) => {
        if (response['success'] === false) {
          throw Error('Could not delete member');
        }

        return true;
      });
  }

  public addGroupMember(groupId, userId): Promise<GroupMember> {
    if (!groupId) {
      return Promise.reject(new Error('No group provided'));
    }
    if (!userId) {
      return Promise.reject(new Error('No user provided'));
    }

    const addGroupMemberUrl = this.APIUrl + 'group/' + groupId + '/member';
    const requestData = {
      userId
    };

    return this.http.post(addGroupMemberUrl, requestData).toPromise()
      .then((response) => {
        if (response['success'] === false) {
          throw Error('Could not add member');
        }

        const newMember = new GroupMember(response['member']);
        return newMember;
      });
  }

}
