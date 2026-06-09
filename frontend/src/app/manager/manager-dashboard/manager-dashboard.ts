import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-dashboard.html',
  styleUrl: './manager-dashboard.css'
})
export class ManagerDashboard implements OnInit {

  managerName = '';
  batches: any[] = [];
  enrolments: any[] = [];
  
  currentView = 'dashboard';

  calendarDays: number[] = [];
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  currentMonth = '';
  todayDate = 0;

  // Calendar Report specific
  calendarViewMode = 'calendar'; // 'calendar' | 'tabular'
  filterCourse = '';
  filterStatus = '';
  filterStartDate = '';
  filterEndDate = '';

  // 3-Panel view toggles
  showAllUpcoming = false;
  showAllLive = false;
  showAllCompleted = false;

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

  getEnrolledCount(batchId: string): number {
    return this.enrolments.filter(e => e.batch?._id === batchId && e.status === 'approved').length;
  }

  getAvailableSeats(batch: any): number {
    const capacity = batch.capacity || 0;
    return Math.max(0, capacity - this.getEnrolledCount(batch._id));
  }

  getBatchStatus(batch: any): string {
    const capacity = batch.capacity || 0;
    const available = this.getAvailableSeats(batch);
    if (available === 0 && capacity > 0) return 'Full';
    if (capacity > 0 && (available / capacity) < 0.2) return `Nearly Full (${available} seats left)`;
    return `Available (${available} seats left)`;
  }

  getDuration(start: string, end: string): string {
    if (!start || !end) return '-';
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const days = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days` : '1 day';
  }

  getTimelyStatus(batch: any): string {
    if (!batch.startDate || !batch.endDate) return 'Upcoming';
    const now = new Date().getTime();
    const s = new Date(batch.startDate).getTime();
    const e = new Date(batch.endDate).getTime();
    if (now < s) return 'Upcoming';
    if (now > e) return 'Completed';
    return 'Ongoing';
  }

  get filteredBatches() {
    return this.batches.filter(b => {
      let match = true;
      if (this.filterCourse && b.course?.name !== this.filterCourse) match = false;
      if (this.filterStatus && this.getTimelyStatus(b) !== this.filterStatus) match = false;
      if (this.filterStartDate && new Date(b.startDate) < new Date(this.filterStartDate)) match = false;
      if (this.filterEndDate && new Date(b.endDate) > new Date(this.filterEndDate)) match = false;
      return match;
    });
  }

  getUniqueCourses(): string[] {
    const courses = this.batches.map(b => b.course?.name).filter(n => !!n);
    return [...new Set(courses)];
  }

  exportToCSV() {
    const headers = ['Course Name', 'Batch Name', 'Start Date', 'End Date', 'Duration', 'Mode', 'Total Seats', 'Enrolled', 'Available Seats', 'Status'];
    const rows = this.filteredBatches.map(b => [
      b.course?.name || '-',
      b.name || '-',
      new Date(b.startDate).toLocaleDateString(),
      new Date(b.endDate).toLocaleDateString(),
      this.getDuration(b.startDate, b.endDate),
      b.mode || '-',
      b.capacity || 0,
      this.getEnrolledCount(b._id),
      this.getAvailableSeats(b),
      this.getTimelyStatus(b)
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Course_Calendar_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  get upcomingBatches() {
    const today = new Date();
    const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return this.batches
      .filter(b => {
        if (!b.startDate) return false;
        const startDate = new Date(b.startDate);
        return startDate >= today && startDate <= next30Days;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 3);
  }

  get liveBatches() {
    const today = new Date();
    return this.batches
      .filter(b => {
        if (!b.startDate || !b.endDate) return false;
        const startDate = new Date(b.startDate);
        const endDate = new Date(b.endDate);
        return startDate <= today && endDate >= today;
      })
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, 3);
  }

  get completedBatches() {
    const today = new Date();
    return this.batches
      .filter(b => {
        if (!b.endDate) return false;
        const endDate = new Date(b.endDate);
        return endDate < today;
      })
      .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
      .slice(0, 3);
  }

  get allUpcomingBatches() {
    const today = new Date();
    const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return this.batches
      .filter(b => {
        if (!b.startDate) return false;
        const startDate = new Date(b.startDate);
        return startDate >= today && startDate <= next30Days;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }

  get remainingUpcomingBatches() {
    return this.allUpcomingBatches.slice(3);
  }

  get allLiveBatches() {
    const today = new Date();
    return this.batches
      .filter(b => {
        if (!b.startDate || !b.endDate) return false;
        const startDate = new Date(b.startDate);
        const endDate = new Date(b.endDate);
        return startDate <= today && endDate >= today;
      })
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }

  get remainingLiveBatches() {
    return this.allLiveBatches.slice(3);
  }

  get allCompletedBatches() {
    const today = new Date();
    return this.batches
      .filter(b => {
        if (!b.endDate) return false;
        const endDate = new Date(b.endDate);
        return endDate < today;
      })
      .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
  }

  get remainingCompletedBatches() {
    return this.allCompletedBatches.slice(3);
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
