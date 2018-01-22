import { Injectable, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// models
import { User } from '../models/user';

@Injectable()
export class UserManagerService {

  private loggedUser: User;
  public loggedUser$: BehaviorSubject<User>;

  private APIUrl = 'http://localhost:81/api/';

  private LocalStorage_UserKey = 'jorj-training-userDetails';

  constructor(private http: HttpClient) {
    this.loggedUser = null;

    const storedUser = localStorage.getItem(this.LocalStorage_UserKey);
    if (storedUser !== '') {
      this.loggedUser = JSON.parse(storedUser) as User;
    } else {
      localStorage.removeItem(this.LocalStorage_UserKey);
    }

    this.loggedUser$ = new BehaviorSubject(this.loggedUser);
  }

  public getLoggedUser(): User {
    return this.loggedUser;
  }

  public hasLoggedUser(): boolean {
    return this.loggedUser !== null;
  }

  public updateLoggedUser(newUser: User): void {
    localStorage.setItem(this.LocalStorage_UserKey, newUser ? (JSON.stringify(newUser)) : '');

    this.loggedUser = newUser;
    this.loggedUser$.next(this.loggedUser);
  }

  public doUserLogin(username: string, password: string): Promise<void | User> {
    if (!username || !password) {
      return Promise.reject(new Error('No credentials provided'));
    }

    const checkLoginUrl = this.APIUrl + 'users/check_login';
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

  public doUserLogout(): Promise<void | boolean> {
    if (!this.loggedUser) {
      return Promise.reject(new Error('No user logged in'));
    }

    const logoutUrl = this.APIUrl + 'users/logout';
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

  public registerUser(userData: User, password: string): Promise<void | User> {
    if (!userData) {
      return Promise.reject(new Error('No user data provided'));
    }

    const registerUrl = this.APIUrl + 'users';
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

        return newUser;
      });
  }

  public deleteUser(userData: User): Promise<void | boolean> {
    const terminateUrl = this.APIUrl + 'users/' + userData.id;

    return this.http.delete(terminateUrl).toPromise()
      .then((response) => {
        if (response['success'] === false) {
          throw Error('Invalid data');
        }

        this.updateLoggedUser(null);

        return true;
      });
  }

  public updateUser(userData: User): Promise<void | boolean> {
    const updateUserUrl = this.APIUrl + 'users/' + userData.id;

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

        return true;
      });
  }

  public getAllUsers(): Promise<void | User[]> {
    const getUsersUrl = this.APIUrl + 'users/';

    return this.http.get(getUsersUrl).toPromise()
      .then((response) => {
        if (response['success'] === false) {
          throw Error('Invalid data');
        }

        const userList: User[] = response['users'];
        return userList;
      });
  }
}
