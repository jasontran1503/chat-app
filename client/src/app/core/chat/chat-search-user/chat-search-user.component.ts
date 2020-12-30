import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { DataResponse } from 'src/app/common/models/data-response.model';
import { Room } from 'src/app/common/models/room.model';
import { User } from 'src/app/common/models/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat-search-user',
  templateUrl: './chat-search-user.component.html',
  styleUrls: ['./chat-search-user.component.scss'],
})
export class ChatSearchUserComponent implements OnInit, OnDestroy {
  nameFriendChat: string;
  availableRooms: Room[];
  listUser: User[] = [];
  userSearch = new FormControl('');
  destroy$ = new Subject();

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.chatService
      .getAvailableRooms()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: DataResponse<Room[]>) => {
        this.availableRooms = response.data;
      });

    this.userSearch.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value: string) =>
          this.userService.searchUser(value).pipe(takeUntil(this.destroy$))
        )
      )
      .subscribe((response: DataResponse<User[]>) => {
        this.listUser = response.data;
      });
  }

  /**
   * Chat with user
   * @param user user
   */
  goToChatRoom(user: User): void {
    this.chatService
      .goToChatRoom(user._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: DataResponse<Room>) => {
        this.router.navigate(['conversation'], {
          queryParams: {
            receiver: user.username,
            roomId: response.data._id,
          },
          relativeTo: this.route,
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
