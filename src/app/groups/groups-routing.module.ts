import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupsOverviewComponent } from './groups-overview/groups-overview.component';
import { GroupDetailsComponent } from './group-details/group-details.component';

// services
const routes: Routes = [
  { path: 'group/:groupId', component: GroupDetailsComponent },
  { path: 'groups', component: GroupsOverviewComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  providers: [],
  exports: [
    RouterModule
  ]
})
export class GroupsRoutingModule { }
