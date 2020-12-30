import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DataResponse } from '../common/models/data-response.model';
import { User } from '../common/models/user.model';

const url = environment.apiUrl + '/api/auth/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Check authentication
   */
  isAuthenticated(): Observable<DataResponse<boolean>> {
    return this.http.get<DataResponse<boolean>>(url + 'is-auth');
  }

  /**
   * Get current user
   */
  getCurrentUser(): Observable<DataResponse<User>> {
    return this.http.get<DataResponse<User>>(url + 'user').pipe(
      tap((response: DataResponse<User>) => {
        if (response.success) {
          this.currentUserSubject.next(response.data);
        }
        return response;
      })
    );
  }

  /**
   * Login
   * @param body email & password
   */
  login(body: {
    email: string;
    password: string;
  }): Observable<DataResponse<string>> {
    return this.http.post<DataResponse<string>>(url + 'login', body).pipe(
      tap((response: DataResponse<string>) => {
        // localStorage.setItem('token', response.data);
      })
    );
  }

  /**
   * Register
   * @param body email, password & username
   */
  register(body: {
    email: string;
    password: string;
    username: string;
  }): Observable<DataResponse<User>> {
    return this.http.post<DataResponse<User>>(url + 'register', body);
  }

  /**
   * Logout
   */
  logout(): Observable<DataResponse<any>> {
    this.currentUserSubject.next(null);
    return this.http.post<DataResponse<any>>(url + 'logout', null);
  }

  /**
   * Send mail when register success
   * @param email email
   */
  sendMail(email: string): Observable<DataResponse<any>> {
    return this.http.post<DataResponse<any>>(url + 'send-mail', { email });
  }
}
