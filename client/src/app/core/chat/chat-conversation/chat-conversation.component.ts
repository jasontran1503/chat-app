import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DataResponse } from 'src/app/common/models/data-response.model';
import { Message } from 'src/app/common/models/message.model';
import { Room } from 'src/app/common/models/room.model';
import { User } from 'src/app/common/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from './../../../services/user.service';

@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrls: ['./chat-conversation.component.scss'],
})
export class ChatConversationComponent
  implements OnInit, AfterViewChecked, OnDestroy {
  newMessage = '';
  currentUser: User;
  roomId: string;
  conversation: Message[];
  friendChat: User;
  @ViewChild('scrollChat') private chatContainerScroll: ElementRef;
  destroy$ = new Subject();

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Connect socket
    this.chatService.connectSocket();

    this.authService.currentUser
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User) => {
        this.currentUser = user;
      });

    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        switchMap((result: { roomId: string; receiver: string }) => {
          this.roomId = result.roomId;
          return forkJoin([
            this.getConversation(this.roomId),
            this.getFriendChat(result.receiver)
          ]);
        })
      )
      .subscribe();

    this.getNewMessageRealTime();
    this.scrollToBottom();
  }

  /**
   * Get friend chat
   * @param username username
   */
  getFriendChat(username: string): Observable<User> {
    return this.userService.getUserProfile(username).pipe(
      takeUntil(this.destroy$),
      map((response: DataResponse<User>) => response.data),
      tap((user: User) => (this.friendChat = user))
    );
  }

  /**
   * Get conversation
   * @param roomId roomId
   */
  getConversation(roomId: string): Observable<DataResponse<Message[]>> {
    return this.chatService.getConversation(roomId).pipe(
      takeUntil(this.destroy$),
      tap((response: DataResponse<Message[]>) => {
        this.conversation = response.data;
      })
    );
  }

  /**
   * Send message
   */
  sendMessage(): void {
    this.chatService.sendMessage(this.newMessage, this.roomId).subscribe();
    this.newMessage = '';
  }

  /**
   * Get new realtime message
   */
  getNewMessageRealTime(): void {
    this.chatService
      .getNewMessage()
      .pipe(
        tap((data: any) => {
          const newMessage: Message = {
            sender: data.createdBy,
            roomId: this.roomId,
            message: data.message,
          };
          this.conversation.push(newMessage);
        })
      )
      .subscribe();
  }

  /**
   * Always scroll to bottom
   */
  scrollToBottom(): void {
    try {
      this.chatContainerScroll.nativeElement.scrollTop = this.chatContainerScroll.nativeElement.scrollHeight;
    } catch (error) {}
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
