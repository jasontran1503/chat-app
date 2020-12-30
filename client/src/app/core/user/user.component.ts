import { ChatService } from 'src/app/services/chat.service';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { IMAGE_FOLDER } from 'src/app/common/enums/image-folder.enum';
import { NotificationsService } from 'src/app/common/layouts/notifications/notifications.service';
import { DataResponse } from 'src/app/common/models/data-response.model';
import { User } from 'src/app/common/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Room } from 'src/app/common/models/room.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  user$: Observable<User>;
  userProfile: User;
  username: string;
  @ViewChild('uploadModal', { static: true }) uploadModal: TemplateRef<any>;
  imageFile: File;
  imageUrl: string;
  titleUploadModal: string;
  isDisplay: boolean;
  typeImage: string;
  modalRef: BsModalRef;
  destroy$ = new Subject();

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private notifications: NotificationsService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.authService.currentUser,
      this.route.params.pipe(
        takeUntil(this.destroy$),
        map((params: { username: string }) => params.username),
        switchMap((username: string) => this.getUserProfile(username))
      ),
    ])
      .pipe(
        takeUntil(this.destroy$),
        map((result: User[]) => {
          const [currentUser, userProfile] = result;
          return {
            currentUsername: currentUser?.username,
            usernameProfile: userProfile.username,
          };
        }),
        tap(
          (response: { currentUsername: string; usernameProfile: string }) => {
            this.username = response.usernameProfile;
            response.currentUsername === response.usernameProfile
              ? (this.isDisplay = false)
              : (this.isDisplay = true);
          }
        )
      )
      .subscribe();
  }

  /**
   * Chat with user
   */
  goToChatRoom(): void {
    this.chatService
      .goToChatRoom(this.userProfile._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: DataResponse<Room>) => {
        this.router.navigate(['/', 'chat', 'conversation'], {
          queryParams: {
            receiver: this.userProfile.username,
            roomId: response.data._id,
          },
        });
      });
  }

  /**
   * Get user profile
   * @param username username
   */
  getUserProfile(username: string): Observable<User> {
    this.user$ = this.userService.getUserProfile(username).pipe(
      takeUntil(this.destroy$),
      map((response: DataResponse<User>) => response.data),
      tap((user: User) => (this.userProfile = user))
    );
    return this.user$;
  }

  /**
   * Open upload modal
   */
  showUploadModal(typeImage: string): void {
    this.typeImage = typeImage;
    this.typeImage === IMAGE_FOLDER.AVATAR
      ? (this.titleUploadModal = 'Cập nhật ảnh đại diện')
      : (this.titleUploadModal = 'Cập nhật ảnh bìa');
    this.modalRef = this.modalService.show(this.uploadModal, {
      class: 'modal-dialog modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  /**
   * Selected image
   */
  selectedImage(event): void {
    this.imageFile = event.target.files[0] as File;
    console.log(this.imageFile);
    const maxSize = 1 * 1024 * 1024;
    if (!this.imageFile.name.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
      this.notifications.showToastError('Ảnh tải lên không đúng định dạng');
      this.imageFile = null;
    } else if (this.imageFile.size > maxSize) {
      this.notifications.showToastError('Ảnh tải lên không quá 1MB');
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(this.imageFile);
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
    }
  }

  /**
   * Upload image
   */
  uploadImage(): void {
    if (this.imageFile) {
      this.userService
        .uploadImage(this.imageFile, this.typeImage)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response) => {
          if (response && response.data) {
            this.getUserProfile(this.username);
            this.close();
          }
        });
    }
  }

  /**
   * Close modal upload
   */
  close(): void {
    this.modalRef.hide();
    this.imageUrl = null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
