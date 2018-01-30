import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostOverviewComponent } from './post-overview/post-overview.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostManagerService } from '../shared/services/post-manager.service';
import { PostListItemComponent } from './post-list-item/post-list-item.component';
import { PostItemAddComponent } from './post-item-add/post-item-add.component';
import { PostItemAddFormComponent } from './post-item-add-form/app-post-item-add-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    PostOverviewComponent,
    PostListComponent,
    PostListItemComponent,
    PostItemAddComponent,
    PostItemAddFormComponent
  ],
  exports: [
    PostOverviewComponent
  ]
})

export class PostsModule { }
