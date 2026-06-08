import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private url = 'http://localhost:1000/api';

  constructor(private http: HttpClient) {}

 private headers() {
  const token = localStorage.getItem('token');
  return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
}
  getCourses() { return this.http.get(`${this.url}/courses`, this.headers()); }
  createCourse(data: any) { return this.http.post(`${this.url}/courses`, data, this.headers()); }
  updateCourse(id: string, data: any) { return this.http.put(`${this.url}/courses/${id}`, data, this.headers()); }
  deleteCourse(id: string) { return this.http.delete(`${this.url}/courses/${id}`, this.headers()); }

  getBatches() { return this.http.get(`${this.url}/batches`, this.headers()); }
  createBatch(data: any) { return this.http.post(`${this.url}/batches`, data, this.headers()); }
  updateBatch(id: string, data: any) { return this.http.put(`${this.url}/batches/${id}`, data, this.headers()); }
  deleteBatch(id: string) { return this.http.delete(`${this.url}/batches/${id}`, this.headers()); }

  getUsers() { return this.http.get(`${this.url}/auth/users`, this.headers()); }
  createUser(data: any) { return this.http.post(`${this.url}/auth/users`, data, this.headers()); }
  updateUser(id: string, data: any) { return this.http.put(`${this.url}/auth/users/${id}`, data, this.headers()); }
  deleteUser(id: string) { return this.http.delete(`${this.url}/auth/users/${id}`, this.headers()); }

  getEnrolments() { return this.http.get(`${this.url}/enrolments`, this.headers()); }
  createEnrolment(data: any) { return this.http.post(`${this.url}/enrolments`, data, this.headers()); }
  updateEnrolment(id: string, data: any) { return this.http.put(`${this.url}/enrolments/${id}`, data, this.headers()); }
  deleteEnrolment(id: string) { return this.http.delete(`${this.url}/enrolments/${id}`, this.headers()); }
  submitFeedback(data: any) { return this.http.post(`${this.url}/enrolments/feedback`, data, this.headers()); }
  getFeedbacks() { return this.http.get(`${this.url}/enrolments/feedback`, this.headers()); }
}
