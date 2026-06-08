import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = 'http://localhost:1000/api/auth';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.url}/login`, data);
  }

  saveToken(token: string, role: string, name: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('name', name);
  }

  getRole() { return localStorage.getItem('role'); }
  getToken() { return localStorage.getItem('token'); }
  getName() { return localStorage.getItem('name'); }
  getId() {
    const token = this.getToken();
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1])).id;
    } catch(e) { return null; }
  }
  isLoggedIn() { return !!localStorage.getItem('token'); }
  logout() { localStorage.clear(); }
}
