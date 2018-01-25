import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-post-overview',
  templateUrl: './post-overview.component.html',
  styleUrls: ['./post-overview.component.css']
})
export class PostOverviewComponent implements OnInit {

  @Input() groupId: number;

  constructor() { }

  ngOnInit() {
  }

}
