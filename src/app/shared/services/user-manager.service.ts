import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpUrlEncodingCodec } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

// models
import { User } from '../models/user';

// services
import { UserLoginHistoryService } from './user-login-history.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserManagerService {

  private loggedUser: User;
  public loggedUser$: BehaviorSubject<User>;

  public APIUrl = 'http://localhost:81/api/';

  constructor(private http: HttpClient, private userLoginHistoryMgr: UserLoginHistoryService) {
    this.loggedUser = userLoginHistoryMgr.getUserFromHistory();
    this.loggedUser$ = new BehaviorSubject(this.loggedUser);
  }

  public getLoggedUser(): User {
    return this.loggedUser;
  }

  public hasLoggedUser(): boolean {
    return this.loggedUser !== null;
  }

  public updateLoggedUser(newUser: User): void {
    this.userLoginHistoryMgr.updateUserHistory(newUser);

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
          throw new Error('Invalid credentials');
        }

        const userData: User = response['user'];
        this.updateLoggedUser(userData);

        return userData;
      });
  }

  public doUserLogout(): Promise<boolean> {
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
          throw new Error('Invalid token');
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

  public getAllUsersBySearchTerm(searchTerm: string): Observable<User[]> {

    const urlEncoder = new HttpUrlEncodingCodec();
    const getUsersUrl = this.APIUrl + 'users/search/' + urlEncoder.encodeValue(searchTerm);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.get(getUsersUrl, httpOptions).map(res => {
      if (res['success'] === false) {
        return Observable.throw('-- eroarea mea este');
      }
      return res['users'].map((rawUser) => {
        return new User(rawUser);
      });
    });
  }
}
