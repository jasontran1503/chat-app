import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { DataResponse } from 'src/app/common/models/data-response.model';
import { User } from 'src/app/common/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  listUser$: Observable<DataResponse<User[]>>;
  destroy$ = new Subject();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    combineLatest([this.getUsername(), this.getTypeFollow()])
      .pipe(
        map((result: string[]) => {
          const [username, typeFollow] = result;
          return { username, typeFollow };
        }),
        tap((data: { username: string; typeFollow: string }) => {
          if (data.typeFollow === 'followers') {
            this.getUserFollowers(data.username);
          } else {
            this.getUserFollowing(data.username);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  /**
   * Get username route
   */
  getUsername(): Observable<string> {
    return this.route.parent.params.pipe(
      map((params: { username: string }) => params.username)
    );
  }

  /**
   * Get type follow route (followers or following)
   */
  getTypeFollow(): Observable<string> {
    return this.route.params.pipe(
      map((params: { follow: string }) => params.follow)
    );
  }

  /**
   * Get user followers
   * @param username username
   */
  getUserFollowers(username: string): Observable<DataResponse<User[]>> {
    this.listUser$ = this.userService.getUserFollowers(username);
    return this.listUser$;
  }

  /**
   * Get user following
   * @param username username
   */
  getUserFollowing(username: string): Observable<DataResponse<User[]>> {
    this.listUser$ = this.userService.getUserFollowing(username);
    return this.listUser$;
  }

  /**
   * Navigate to user page
   * @param username username
   */
  navigateToUserPage(username: string): void {
    this.router.navigate(['/', 'user', username]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
