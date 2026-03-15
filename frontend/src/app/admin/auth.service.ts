import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly KEY = 'admin_token';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http
      .post<{ token: string; username: string }>('/api/auth/login', { username, password })
      .pipe(tap((res) => localStorage.setItem(this.KEY, res.token)));
  }

  logout() {
    localStorage.removeItem(this.KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}
