import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserListComponent } from './user-list/user-list.component';
import { LayoutsModule } from 'src/app/common/layouts/layouts.module';

@NgModule({
  declarations: [UserComponent, UserListComponent],
  imports: [CommonModule, UserRoutingModule, LayoutsModule],
})
export class UserModule {}
