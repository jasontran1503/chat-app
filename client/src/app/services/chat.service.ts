import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { DataResponse } from '../common/models/data-response.model';
import { Message } from '../common/models/message.model';
import { Room } from '../common/models/room.model';
import { User } from './../common/models/user.model';

const url = environment.apiUrl + '/api/chat/';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  socket: any;

  constructor(private http: HttpClient) {}

  /**
   * Connect socket io
   */
  connectSocket(): void {
    this.socket = io(environment.apiUrl);
  }

  /**
   * Go to chat room
   * @param userId userId
   */
  goToChatRoom(userId: string): Observable<DataResponse<Room>> {
    const body = { userId };
    return this.http.post<DataResponse<Room>>(`${url}chat-room`, body);
  }

  /**
   * Get available rooms
   */
  getAvailableRooms(): Observable<DataResponse<Room[]>> {
    return this.http.get<DataResponse<Room[]>>(`${url}available-rooms`);
  }

  /**
   * Get room info
   * @param roomId roomId
   */
  getRoomInfo(roomId: string): Observable<DataResponse<Room>> {
    const params = { roomId };
    return this.http.get<DataResponse<Room>>(`${url}room`, {
      params,
    });
  }

  /**
   * Get conversation
   * @param roomId roomId
   */
  getConversation(roomId: string): Observable<DataResponse<Message[]>> {
    const params = { roomId };
    return this.http.get<DataResponse<Message[]>>(`${url}conversation`, {
      params,
    });
  }

  /**
   * Send message
   * @param message message
   * @param receiver receiver
   * @param roomId roomId
   */
  sendMessage(
    message: string,
    roomId: string
  ): Observable<DataResponse<Message>> {
    this.socket.emit('new-message', message);
    const body = { message, roomId };
    return this.http.post<DataResponse<Message>>(`${url}new-message`, body);
  }

  /**
   * Get real time message
   */
  getNewMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('new-message', (data: any) => {
        observer.next(data);
      });
    });
  }
}
