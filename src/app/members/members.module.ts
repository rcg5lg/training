import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberOverviewComponent } from './member-overview/member-overview.component';
import { MemberAddComponent } from './member-add/member-add.component';
import { MemberOverviewItemComponent } from './member-overview-item/member-overview-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    MemberOverviewComponent,
    MemberAddComponent,
    MemberOverviewItemComponent
  ],
  exports: [
    MemberOverviewComponent
  ]
})
export class MembersModule { }
