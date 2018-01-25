import { Component, OnInit } from '@angular/core';
import { GroupManagerService } from '../../shared/services/group-manager.service';
import { ActivatedRoute } from '@angular/router';
import { GroupMember } from '../../shared/models/group-member';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {

  groupId: number;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.groupId = +this.route.snapshot.paramMap.get('groupId');
  }

}
