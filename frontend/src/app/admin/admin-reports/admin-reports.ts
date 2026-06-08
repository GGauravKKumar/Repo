import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-reports.html',
  styleUrl: './admin-reports.css'
})
export class AdminReports implements OnInit {

  adminName = '';
  batches: any[] = [];
  enrolments: any[] = [];
  feedbacks: any[] = [];

  activeReport = 'participant-request';

  calendarDays: number[] = [];
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  currentMonth = '';
  todayDate = 0;

  stats = {
    requested: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  };

  constructor(
    private api: ApiService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.adminName = this.authService.getName() || 'Admin';

    this.loadData();
    this.buildCalendar();
  }

  navigate(page: string) {
    this.router.navigate(['/admin/' + page]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadData() {
    this.api.getBatches().subscribe({
      next: (data: any) => {
        this.batches = data;
        this.cdr.detectChanges();
      }
    });

    this.api.getEnrolments().subscribe({
      next: (data: any) => {
        this.enrolments = data;
        this.calculateStats();
        this.cdr.detectChanges();
      }
    });

    this.api.getFeedbacks().subscribe({
      next: (data: any) => {
        this.feedbacks = data;
        this.cdr.detectChanges();
      }
    });
  }

  calculateStats() {
    this.stats = { requested: 0, pending: 0, approved: 0, rejected: 0, total: this.enrolments.length };
    this.enrolments.forEach(e => {
      if (this.stats[e.status as keyof typeof this.stats] !== undefined) {
        this.stats[e.status as keyof typeof this.stats]++;
      }
    });
  }

  updateEnrolmentStatus(id: string, status: string) {
    this.api.updateEnrolment(id, { status }).subscribe({
      next: () => {
        this.loadData();
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

  setActiveReport(report: string) {
    this.activeReport = report;
  }

  get filteredEnrolments() {
    if (this.activeReport === 'participant-request') {
      return this.enrolments;
    } else if (this.activeReport === 'requested') {
      return this.enrolments.filter(e => e.status === 'requested');
    } else if (this.activeReport === 'not-approved') {
      return this.enrolments.filter(e => e.status === 'rejected');
    } else if (this.activeReport === 'pending') {
      return this.enrolments.filter(e => e.status === 'pending');
    }
    return this.enrolments;
  }

  getReportTitle() {
    switch (this.activeReport) {
      case 'calendar': return 'Course Calendar';
      case 'participant-request': return 'Participant Request for Enrolment';
      case 'requested': return 'Requested for Enrolment';
      case 'not-approved': return 'Requested but Not Approved by Manager';
      case 'pending': return 'Requested but Pending with Manager';
      case 'feedback': return 'Feedback Data';
      default: return 'System Reports';
    }
  }
}
