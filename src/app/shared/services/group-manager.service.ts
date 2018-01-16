import 'rxjs/add/observable/of';
import { Injectable, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationRef } from '@angular/core';

import { User } from '../models/user';
import { Group } from '../models/group';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class GroupManagerService {

  private groupAPIUrl = 'http://localhost:81/api/';

  constructor(private http: HttpClient) { }

  getGroupForUser(userData: User): Promise<any> {
    if (!userData) {
      return Promise.reject(new Error('No credentials provided'));
    }

    const getUserGroupUrl = this.groupAPIUrl + 'groups/' + userData.token;

    return this.http.get(getUserGroupUrl).toPromise()
      .then((response) => {
        if (response['success'] === false) {
          throw Error('Invalid user');
        }

        const rawGroupList: [any] = response['items'];
        const groupList = rawGroupList.map((rawGroup) => {
          const groupItem = rawGroup as Group;
          return groupItem;
        });

        return groupList;
      });
  }

}
