import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-courses.html',
  styleUrl: './admin-courses.css'
})
export class AdminCourses implements OnInit {

  courses: any[] = [];
  batches: any[] = [];
  showAllUpcoming = false;
  showAllLive = false;
  showAllCompleted = false;

  showForm = false;
  showList = false;
  showCalendar = false;

  isEdit = false;
  selectedId = '';

  adminName = '';

  form = {
    name: '',
    courseCode: '',
    description: '',
    duration: '',
    category: '',
    trainingMode: ''
  };

  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  calendarDays: number[] = [];

  currentMonth = '';
  todayDate = 0;

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

    this.adminName =
      this.authService.getName() || 'Admin';

    this.loadCourses();
    this.loadBatches();

    this.buildCalendar();
  }

  get totalCourses(): number {
    return this.courses.length;
  }

  navigate(page: string) {
    this.router.navigate([
      '/admin/' + page
    ]);
  }

  loadCourses() {

    this.api.getCourses()
      .subscribe({

        next: (data: any) => {

          this.courses = data;
          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(err);

        }

      });
  }

  loadBatches() {
    this.api.getBatches().subscribe({
      next: (data: any) => {
        this.batches = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
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

    this.currentMonth =
      now.toLocaleString(
        'default',
        {
          month: 'long',
          year: 'numeric'
        }
      );

    const firstDay =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      ).getDay();

    const daysInMonth =
      new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();

    this.calendarDays = [];

    for (
      let i = 0;
      i < firstDay;
      i++
    ) {
      this.calendarDays.push(0);
    }

    for (
      let i = 1;
      i <= daysInMonth;
      i++
    ) {
      this.calendarDays.push(i);
    }
  }

  toggleList() {

    this.showList =
      !this.showList;

    this.showCalendar = false;
  }

  toggleCalendar() {

    this.showCalendar =
      !this.showCalendar;

    this.showList = false;
  }

  openAdd() {

    this.form = {
      name: '',
      courseCode: '',
      description: '',
      duration: '',
      category: '',
      trainingMode: ''
    };

    this.isEdit = false;

    this.showForm = true;
  }

  openEdit(course: any) {

    this.form = {

      name: course.name,

      courseCode:
        course.courseCode,

      description:
        course.description,

      duration:
        course.duration,

      category:
        course.category,

      trainingMode:
        course.trainingMode

    };

    this.selectedId =
      course._id;

    this.isEdit = true;

    this.showForm = true;
  }

  save() {

    if (this.isEdit) {

      this.api
        .updateCourse(
          this.selectedId,
          this.form
        )
        .subscribe({

          next: (
            updated: any
          ) => {

            this.loadCourses();

            this.showForm =
              false;
            this.cdr.detectChanges();
          },

          error: (err) => {

            alert(
              'Error: ' +
              err.error?.message
            );
          }

        });

    } else {

      this.api
        .createCourse(
          this.form
        )
        .subscribe({

          next: (
            course: any
          ) => {

            this.loadCourses();

            this.showForm =
              false;

            this.form = {
              name: '',
              courseCode: '',
              description: '',
              duration: '',
              category: '',
              trainingMode: ''
            };
            this.cdr.detectChanges();
          },

          error: (err) => {

            alert(
              'Error: ' +
              err.error?.message
            );
          }

        });

    }
  }

  delete(id: string) {

    if (
      confirm(
        'Delete this course?'
      )
    ) {

      this.api
        .deleteCourse(id)
        .subscribe({

          next: () => {

            this.courses =
              this.courses.filter(
                c =>
                  c._id !== id
              );
            this.cdr.detectChanges();

          },

          error: (err) => {

            alert(
              'Error: ' +
              err.error?.message
            );
          }

        });
    }
  }

  upcomingCourses() {
    return this.courses.slice(0, 5);
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

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
