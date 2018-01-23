import { Injectable } from '@angular/core';

// models
import { User } from '../models/user';

export class UserLoginHistoryService {

    private LocalStorage_UserKey = 'jorj-training-userDetails';

    public getUserFromHistory(): User {
        const storedUser: string = localStorage.getItem(this.LocalStorage_UserKey);
        let loggedUser = null;

        if (storedUser !== '') {
            loggedUser = JSON.parse(storedUser) as User;
        } else {
            localStorage.removeItem(this.LocalStorage_UserKey);
        }

        return loggedUser;
    }

    public updateUserHistory(newUser: User): void {
        let historyValue = '';
        if (newUser) {
            historyValue = JSON.stringify(newUser);
        }
        localStorage.setItem(this.LocalStorage_UserKey, historyValue);
    }
}
