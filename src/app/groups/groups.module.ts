import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GroupsOverviewComponent } from './groups-overview/groups-overview.component';
import { GroupsRoutingModule } from './groups-routing.module';
import { GroupOverviewItemComponent } from './group-overview-item/group-overview-item.component';
import { ModalComponent } from '../shared/components/modal.component';
import { GroupEditWindowComponent } from './group-edit-window/group-edit-window.component';

@NgModule({
  imports: [
    CommonModule,
    GroupsRoutingModule,
    FormsModule
  ],
  declarations: [
    GroupsOverviewComponent,
    GroupOverviewItemComponent,
    ModalComponent,
    GroupEditWindowComponent
  ]
})
export class GroupsModule { }
