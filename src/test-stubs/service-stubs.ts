import { Injectable } from '@angular/core';
import { User } from '../app/shared/models/user';

@Injectable()
export class UserLoginHistoryServiceStub {

    public getUserFromHistory(): User {
        return null;
    }
    public updateUserHistory(newUser: User): void {
    }
}

