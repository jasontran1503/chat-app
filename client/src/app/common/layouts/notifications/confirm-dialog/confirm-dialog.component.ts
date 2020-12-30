import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  @Input() message: string;
  public confirmClick = new BehaviorSubject<boolean>(false);

  constructor(private modalClose: BsModalRef) {}

  ngOnInit(): void {}

  close() {
    this.confirmClick.next(false);
    this.confirmClick.complete();
    this.modalClose.hide();
  }

  confirm() {
    this.confirmClick.next(true);
    this.confirmClick.complete();
    this.modalClose.hide();
  }
}
