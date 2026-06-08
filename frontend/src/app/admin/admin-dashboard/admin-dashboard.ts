import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit, OnDestroy {

  totalCourses = 0;
  totalBatches = 0;
  totalUsers = 0;
  totalEnrolments = 0;
  upcomingBatches = 0;

  adminName = '';

  private url = 'http://localhost:1000/api';
  private refreshInterval: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  private getHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  ngOnInit() {

    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.adminName =
      localStorage.getItem('name') || 'Admin';

    this.loadData();

    this.refreshInterval = setInterval(() => {
      this.loadData();
    }, 3000);
  }

  loadData() {

    this.http.get(
      `${this.url}/courses`,
      this.getHeaders()
    ).subscribe({
      next: (data: any) => {

        this.totalCourses =
          Array.isArray(data)
            ? data.length
            : 0;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Courses Error', err);
      }
    });

    this.http.get(
      `${this.url}/batches`,
      this.getHeaders()
    ).subscribe({
      next: (data: any) => {

        this.totalBatches =
          Array.isArray(data)
            ? data.length
            : 0;

        const today = new Date();

        this.upcomingBatches =
          Array.isArray(data)
            ? data.filter(
                (b: any) =>
                  new Date(b.startDate) > today
              ).length
            : 0;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Batches Error', err);
      }
    });

    this.http.get(
      `${this.url}/auth/users`,
      this.getHeaders()
    ).subscribe({
      next: (data: any) => {

        this.totalUsers =
          Array.isArray(data)
            ? data.length
            : 0;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Users Error', err);
      }
    });

    this.http.get(
      `${this.url}/enrolments`,
      this.getHeaders()
    ).subscribe({
      next: (data: any) => {

        this.totalEnrolments =
          Array.isArray(data)
            ? data.filter(
                (e: any) =>
                  e.status === 'requested'
              ).length
            : 0;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Enrolments Error', err);
      }
    });
  }

  navigate(page: string) {
    this.router.navigate([
      '/admin/' + page
    ]);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {

    if (this.refreshInterval) {
      clearInterval(
        this.refreshInterval
      );
    }
  }
}
