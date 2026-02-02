import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  name?: string;
  email?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name?: string;
    email: string;
    role: string;
  };
  accessToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;
  private readonly tokenKey = 'authToken';
  private readonly userKey = 'authUser';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize with stored user data if available
    const storedUser = this.getStoredUser();
    const token = this.getToken();

    if (storedUser && token) {
      console.log('AuthService: Initializing with stored user:', storedUser);
      this.currentUserSubject.next(storedUser);
    }
  }

  private getStoredUser(): User | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) as User : null;
  }

  private setSession(response: AuthResponse): void {
    const token = response.accessToken;

    // Handle the user data from the response
    let userData = response.user;

    // Ensure name field is properly handled
    if (userData) {
      // If name is missing, use email as name
      if (!userData.name && userData.email) {
        userData.name = userData.email.split('@')[0]; // Use email prefix as name
      }

      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(userData));
      this.currentUserSubject.next(userData);
    }
  }

  signup(user: User & { password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/signup`, user)
      .pipe(
        tap(res => this.setSession(res)),
        catchError((error: any) => {
          // If signup fails but we want to store user info locally
          if (error.status === 201) {
            const userData = {
              _id: Date.now().toString(),
              name: user.name,
              email: user.email
            };
            this.currentUserSubject.next(userData);
            localStorage.setItem(this.userKey, JSON.stringify(userData));
          }
          return throwError(() => error);
        })
      );
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(tap(res => this.setSession(res)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    // Check both observable state and localStorage token
    const hasToken = !!this.getToken();
    const hasUser = !!this.currentUserSubject.value;
    const hasStoredUser = !!this.getStoredUser();

    return hasToken && (hasUser || hasStoredUser);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    return this.getStoredUser();
  }

  setUser(userData: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(userData));
    this.currentUserSubject.next(userData);
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user`);
  }
}
