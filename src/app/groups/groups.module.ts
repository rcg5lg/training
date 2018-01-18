import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsOverviewComponent } from './groups-overview/groups-overview.component';
import { GroupsRoutingModule } from './groups-routing.module';
import { GroupItemComponent } from './group-item/group-item.component';

@NgModule({
  imports: [
    CommonModule,
    GroupsRoutingModule
  ],
  declarations: [
    GroupsOverviewComponent,
    GroupItemComponent
  ]
})
export class GroupsModule { }
