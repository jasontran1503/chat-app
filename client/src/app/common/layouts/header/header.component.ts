import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { DataResponse } from '../../models/data-response.model';
import { User } from '../../models/user.model';
import { NotificationsService } from '../notifications/notifications.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: User;
  destroy$ = new Subject();

  constructor(
    private notifications: NotificationsService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated();
    this.authService.currentUser
      .pipe(
        takeUntil(this.destroy$),
        tap((user: User) => {
          this.user = user;
        })
      )
      .subscribe();
  }

  /**
   * Check authentication
   */
  isAuthenticated(): void {
    this.authService
      .isAuthenticated()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((response: DataResponse<boolean>) => {
          if (response.data) {
            return this.authService.getCurrentUser();
          }
        })
      )
      .subscribe();
  }

  /**
   * Logout
   */
  logout(): void {
    this.notifications
      .showConfirmDialog('Bạn có chắc chắn muốn đăng xuất?')
      .subscribe((result: boolean) => {
        if (result) {
          this.authService.logout().subscribe((response: DataResponse<any>) => {
            if (response && response.success) {
              this.router.navigate(['/auth/login']);
            }
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
