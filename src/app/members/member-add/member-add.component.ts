import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { UserManagerService } from '../../shared/services/user-manager.service';

import { User } from '../../shared/models/user';

@Component({
  selector: 'app-member-add',
  templateUrl: './member-add.component.html',
  styleUrls: ['./member-add.component.css']
})
export class MemberAddComponent implements OnInit {

  @Output() addUserAsMember: EventEmitter<number> = new EventEmitter<number>();

  usersLoading = false;
  showList = false;
  searchUserList: Observable<User[]>;
  private searchField: FormControl;

  constructor(private userMgr: UserManagerService) { }

  ngOnInit() {
    this.searchField = new FormControl();
    this.createSearchHandler();
  }

  createSearchHandler(): void {
    this.initSearchHandler().subscribe(
      (data) => { this.searchUserList = Observable.of(data); },
      (error) => { console.log(error.message); this.createSearchHandler(); },
      () => { console.log('--- on complet'); },
    ); // Need to call subscribe to make it hot!
  }

  initSearchHandler(): Observable<User[]> {
    return this.searchField.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .do(() => {
        this.usersLoading = true;
      })
      .switchMap((term) => {
        return this.userMgr.getAllUsersBySearchTerm(term);
      }).do(() => {
        this.usersLoading = false;
      });
  }

  addAsMember(userId: number): void {
    this.addUserAsMember.emit(userId);
  }

  handleKeyEvent(event): void {
    switch (event.keyCode) {
      case 27: { // escape press
        // this.clearInput();
        console.log('--- clear input');
        break;
      }
      default: {
        break;
      }
    }
  }

  showUserList(showList: boolean) {
    this.showList = showList;
  }

}
