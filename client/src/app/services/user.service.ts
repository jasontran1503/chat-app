import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataResponse } from '../common/models/data-response.model';
import { User } from '../common/models/user.model';

const url = environment.apiUrl + '/api/user/';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  /**
   * Get user profile
   * @param username username
   */
  getUserProfile(username: string): Observable<DataResponse<User>> {
    const params = { username };
    return this.http.get<DataResponse<User>>(`${url}profile`, { params });
  }

  /**
   * Follow user
   * @param username username
   */
  followUser(username: string): Observable<DataResponse<any>> {
    const body = { username };
    return this.http.post<DataResponse<any>>(`${url}follow`, body);
  }

  /**
   * Unfollow user
   * @param username username
   */
  unfollowUser(username: string): Observable<DataResponse<any>> {
    const body = { username };
    return this.http.post<DataResponse<any>>(`${url}unfollow`, body);
  }

  /**
   * Get user followers
   * @param username username
   */
  getUserFollowers(username: string): Observable<DataResponse<User[]>> {
    const params = { username };
    return this.http.get<DataResponse<User[]>>(`${url}followers`, {
      params,
    });
  }

  /**
   * Get user following
   * @param username username
   */
  getUserFollowing(username: string): Observable<DataResponse<User[]>> {
    const params = { username };
    return this.http.get<DataResponse<User[]>>(`${url}following`, {
      params,
    });
  }

  /**
   * Search user
   * @param username username
   */
  searchUser(username: string): Observable<DataResponse<User[]>> {
    const params = { username };
    return this.http.get<DataResponse<User[]>>(`${url}search`, {
      params,
    });
  }

  /**
   * Upload image
   * @param image image file
   * @param folder folder name
   */
  uploadImage(image: File, folder: string): Observable<DataResponse<string>> {
    const params = { folder };
    const formData = new FormData();
    formData.append('image', image, image.name);
    return this.http.post<DataResponse<string>>(`${url}upload`, formData, {
      params,
    });
  }
}
