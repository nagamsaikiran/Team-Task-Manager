import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiUrl;
  private userSubject = new BehaviorSubject<any>(this.getStoredUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  signup(data: { name: string; email: string; password: string }) {
    return this.http.post<any>(`${this.api}/auth/signup`, data).pipe(
      tap(res => this.saveSession(res))
    );
  }

  login(data: { email: string; password: string }) {
    return this.http.post<any>(`${this.api}/auth/login`, data).pipe(
      tap(res => this.saveSession(res))
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser() {
    return this.userSubject.value;
  }

  private saveSession(res: any) {
    localStorage.setItem('token', res.access_token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.userSubject.next(res.user);
  }

  private getStoredUser() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }
}
