import 'rxjs/add/observable/of';
import { Injectable, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationRef } from '@angular/core';

import { User } from '../models/user';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UserManagerService {

  private loggedUser: User;
  public loggedUser$: BehaviorSubject<User>;
  private userAPIUrl = 'http://localhost:81/api/';

  constructor(private http: HttpClient) {
    this.loggedUser = null;
    this.loggedUser$ = new BehaviorSubject(this.loggedUser);
  }

  public hasLoggedUser() {
    return this.loggedUser !== null;
  }

  updateLoggedUser(newUser: User) {
    this.loggedUser = newUser;
    this.loggedUser$.next(this.loggedUser);
  }

  doUserLogin(username: string, password: string): Promise<any> {
    if (!username || !password) {
      return Promise.reject(new Error('No credentials provided'));
    }

    const checkLoginUrl = this.userAPIUrl + 'users/check_login';
    const requestData = {
      username,
      password
    };

    return this.http.post(checkLoginUrl, requestData).toPromise()
      .then((response) => {
        if (response['success'] === false) {
          throw Error('Invalid credentials');
        }

        const userData: User = response['user'];
        this.updateLoggedUser(userData);

        return userData;
      });
  }

  doUserLogout() {
    if (!this.loggedUser) {
      return Promise.reject(new Error('No user logged in'));
    }

    const logoutUrl = this.userAPIUrl + 'users/logout';
    const requestData = {
      token: this.loggedUser.token
    };

    return this.http.post(logoutUrl, requestData).toPromise()
      .then((response) => {
        if (response['success'] === false) {
          throw Error('Invalid token');
        }

        this.updateLoggedUser(null);

        return true;
      });
  }

  registerUser(userData: User, password: string) {
    if (!userData) {
      return Promise.reject(new Error('No user data provided'));
    }

    const registerUrl = this.userAPIUrl + 'users';
    const requestData = {
      ...userData,
      password
    };

    return this.http.post(registerUrl, requestData).toPromise()
      .then((response) => {
        if (response['success'] === false) {
          throw Error('Invalid data');
        }

        const newUser: User = response['user'];
        this.updateLoggedUser(newUser);

        return userData;
      });
  }

  deleteUser(userData: User) {
    const terminateUrl = this.userAPIUrl + 'users/' + userData.token;

    return this.http.delete(terminateUrl).toPromise()
      .then((response) => {
        if (response['success'] === false) {
          throw Error('Invalid data');
        }

        console.log('---- DELETE _-- ');
        console.log(response);

        return userData;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updateUser(userData: User) {
    const updateUserUrl = this.userAPIUrl + 'users/' + userData.token;

    const requestData = {
      ...userData
    };

    return this.http.put(updateUserUrl, requestData).toPromise()
      .then((response) => {
        if (response['success'] === false) {
          throw Error('Invalid data');
        }

        const newUser: User = response['user'];
        this.updateLoggedUser(newUser);

        return userData;
      });
  }
}
