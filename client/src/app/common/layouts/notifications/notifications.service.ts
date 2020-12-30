import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ToastMessageComponent } from './toast-message/toast-message.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) {}

  showConfirmDialog(message: string): Observable<boolean> {
    const initialState = {
      message,
    };
    this.modalRef = this.modalService.show(ConfirmDialogComponent, {
      class: 'modal-dialog',
      ignoreBackdropClick: true,
      initialState,
    });

    return this.modalRef.content.confirmClick as Observable<boolean>;
  }

  private showToast(message: string, icon: string, color: string): void {
    const initialState = {
      message,
      icon,
      color,
    };
    this.modalRef = this.modalService.show(ToastMessageComponent, {
      id: 1,
      class: 'modal-dialog modal-sm',
      ignoreBackdropClick: true,
      initialState,
    });
    setTimeout(() => {
      this.modalService.hide(1);
    }, 1500);
  }

  showToastError(message: string): void {
    return this.showToast(message, 'fa-minus-circle', 'error');
  }

  showToastSuccess(message: string): void {
    return this.showToast(message, 'fa-check-circle', 'success');
  }

  showToastWarning(message: string): void {
    return this.showToast(message, 'fa-exclamation-triangle', 'warning');
  }

  showToastInfo(message: string): void {
    return this.showToast(message, 'fa-info-circle', 'info');
  }
}
