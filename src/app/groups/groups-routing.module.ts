import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupsOverviewComponent } from './groups-overview/groups-overview.component';

// services
const routes: Routes = [
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
