import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FollowButtonComponent } from './follow-button/follow-button.component';
import { HeaderComponent } from './header/header.component';
import { ConfirmDialogComponent } from './notifications/confirm-dialog/confirm-dialog.component';
import { ToastMessageComponent } from './notifications/toast-message/toast-message.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    FollowButtonComponent,
    HeaderComponent,
    PageNotFoundComponent,
    ConfirmDialogComponent,
    ToastMessageComponent,
  ],
  imports: [CommonModule, RouterModule],
  exports: [FollowButtonComponent]
})
export class LayoutsModule {}
