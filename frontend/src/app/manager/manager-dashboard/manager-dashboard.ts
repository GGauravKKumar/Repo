import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-dashboard.html',
  styleUrl: './manager-dashboard.css'
})
export class ManagerDashboard implements OnInit {

  managerName = '';
  batches: any[] = [];
  enrolments: any[] = [];
  
  currentView = 'dashboard'; // 'dashboard', 'batches', 'calendar', 'enrolments'

  calendarDays: number[] = [];
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  currentMonth = '';
  todayDate = 0;

  constructor(
    private api: ApiService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn() || this.authService.getRole() !== 'manager') {
      this.router.navigate(['/login']);
      return;
    }
    this.managerName = this.authService.getName() || 'Manager';

    this.loadBatches();
    this.loadEnrolments();
    this.buildCalendar();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  setView(view: string) {
    this.currentView = view;
  }

  loadBatches() {
    this.api.getBatches().subscribe({
      next: (data: any) => {
        this.batches = data;
        this.cdr.detectChanges();
      }
    });
  }

  loadEnrolments() {
    this.api.getEnrolments().subscribe({
      next: (data: any) => {
        // Optionally filter by manager's employees, but here we see all for demo
        this.enrolments = data;
        this.cdr.detectChanges();
      }
    });
  }

  updateEnrolmentStatus(id: string, status: string) {
    this.api.updateEnrolment(id, { status }).subscribe({
      next: () => {
        this.loadEnrolments();
      },
      error: (err) => alert(err.error?.message)
    });
  }

  getBatchesForDate(day: number): any[] {
    if (day === 0) return [];
    const date = new Date();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    return this.batches.filter(b => {
      if (!b.startDate) return false;
      const bDate = new Date(b.startDate);
      return bDate.getDate() === day && 
             bDate.getMonth() === currentMonth && 
             bDate.getFullYear() === currentYear;
    });
  }

  buildCalendar() {
    const now = new Date();
    this.todayDate = now.getDate();
    this.currentMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    this.calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push(0);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      this.calendarDays.push(i);
    }
  }
}
