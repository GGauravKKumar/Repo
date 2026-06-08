import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-dashboard.html',
  styleUrl: './employee-dashboard.css'
})
export class EmployeeDashboard implements OnInit {

  employeeName = '';
  batches: any[] = [];
  myEnrolments: any[] = [];
  
  feedbackForm = {
    batch: '',
    comments: ''
  };

  currentView = 'dashboard';

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
    if (!this.authService.isLoggedIn() || this.authService.getRole() !== 'employee') {
      this.router.navigate(['/login']);
      return;
    }
    this.employeeName = this.authService.getName() || 'Employee';

    this.loadBatches();
    this.loadMyEnrolments();
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

  loadMyEnrolments() {
    const myId = this.authService.getId();
    this.api.getEnrolments().subscribe({
      next: (data: any) => {
        this.myEnrolments = data.filter((e: any) => e.employee?._id === myId);
        this.cdr.detectChanges();
      }
    });
  }

  enrol(batchId: string) {
    const myId = this.authService.getId();
    this.api.createEnrolment({ employee: myId, batch: batchId }).subscribe({
      next: () => {
        alert('Enrolment requested successfully!');
        this.loadMyEnrolments();
      },
      error: (err) => alert('Failed: ' + err.error?.message)
    });
  }

  isEnrolled(batchId: string) {
    return this.myEnrolments.some(e => e.batch && e.batch._id === batchId);
  }

  submitFeedback() {
    if (!this.feedbackForm.batch || !this.feedbackForm.comments) {
      alert('Please select a batch and enter comments.');
      return;
    }
    const myId = this.authService.getId();
    this.api.submitFeedback({
      employee: myId,
      batch: this.feedbackForm.batch,
      comments: this.feedbackForm.comments
    }).subscribe({
      next: () => {
        alert('Thank you! Your feedback has been recorded securely.');
        this.feedbackForm = { batch: '', comments: '' };
        this.setView('dashboard');
      },
      error: (err) => alert('Failed: ' + err.error?.message)
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
