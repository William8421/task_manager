import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

import {
  ChangePasswordProps,
  CloudinaryUploadResponse,
  DecodedTokenProps,
  SignInInputProps,
  SignUpInputProps,
  UserProps,
  UserResponseProps,
} from 'src/types/userTypes';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  private profileIconSubject = new BehaviorSubject<string | null>('');
  userIcon$: Observable<string | null> = this.profileIconSubject.asObservable();

  baseURL = 'http://35.156.80.110:8000';
  // baseURL = 'http://localhost:8000';

  constructor(private http: HttpClient) {
    this.checkLoggedInStatus();
  }

  // Checks if the user is logged in by verifying the token
  private checkLoggedInStatus(): void {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const isLoggedIn = userData && !this.isTokenExpired(userData.token);
    this.isLoggedInSubject.next(isLoggedIn);
    if (isLoggedIn) {
      this.profileIconSubject.next(userData.profile_picture);
    }
  }

  // Checks if the token is expired
  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken: DecodedTokenProps = jwtDecode(token);
      return decodedToken.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  }

  // Logs out the user
  logOut(): void {
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
    this.profileIconSubject.next('');
  }

  // Sign in user
  signIn(inputData: SignInInputProps): Observable<UserResponseProps> {
    return this.http
      .post<UserResponseProps>(`${this.baseURL}/users/signin`, inputData)
      .pipe(
        tap((response: UserResponseProps) => {
          const { token, user } = response;
          const isLoggedIn = !this.isTokenExpired(token);
          this.isLoggedInSubject.next(isLoggedIn);
          this.profileIconSubject.next(user.profile_picture);
        })
      );
  }

  // Upload user image
  uploadImage(formData: FormData): Observable<CloudinaryUploadResponse> {
    return this.http.post<CloudinaryUploadResponse>(
      'https://api.cloudinary.com/v1_1/denpxdokx/image/upload',
      formData
    );
  }

  // Register user
  register(inputData: SignUpInputProps): Observable<UserResponseProps> {
    // Remove confirmPassword from inputData
    const { confirmPassword, ...signupData } = inputData;

    return this.http
      .post<UserResponseProps>(`${this.baseURL}/users/signup`, signupData)
      .pipe(
        tap((response: UserResponseProps) => {
          const { token, user } = response;
          const isLoggedIn = !this.isTokenExpired(token);
          this.isLoggedInSubject.next(isLoggedIn);
          this.profileIconSubject.next(user.profile_picture);
        })
      );
  }

  // Get logged in user
  getUserInfo(): Observable<UserResponseProps> {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    if (this.isTokenExpired(userData.token)) {
      this.logOut();
      return new Observable<UserResponseProps>();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userData.token}`,
    });
    return this.http.post<UserResponseProps>(
      `${this.baseURL}/users/profile`,
      { user_id: userData.id },
      { headers }
    );
  }

  // Edit user profile
  editProfile(inputData: UserProps): Observable<UserResponseProps> {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = userData.id;

    if (this.isTokenExpired(userData.token)) {
      this.logOut();
      return new Observable<UserResponseProps>();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userData.token}`,
    });

    return this.http
      .put<UserResponseProps>(
        `${this.baseURL}/users/profile/update`,
        { ...inputData, user_id },
        { headers }
      )
      .pipe(
        tap((response: UserResponseProps) => {
          this.profileIconSubject.next(response.profile_picture);
        })
      );
  }

  // Change user password
  changePassword(inputData: ChangePasswordProps): Observable<string> {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = userData.id;

    if (this.isTokenExpired(userData.token)) {
      this.logOut();
      return new Observable<string>();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userData.token}`,
    });

    const options = {
      user_id,
      oldPassword: inputData.oldPassword,
      password: inputData.password,
    };
    return this.http
      .put(`${this.baseURL}/users/password/change`, { ...options }, { headers })
      .pipe(map((response) => response as string));
  }
}
