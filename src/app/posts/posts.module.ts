import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostOverviewComponent } from './post-overview/post-overview.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PostOverviewComponent
  ],
  exports: [
    PostOverviewComponent
  ]
})

export class PostsModule { }
