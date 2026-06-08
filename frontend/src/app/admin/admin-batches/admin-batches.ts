import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-batches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-batches.html',
  styleUrl: './admin-batches.css'
})
export class AdminBatches implements OnInit {

  batches: any[] = [];
  courses: any[] = [];
  users: any[] = []; // employees

  showForm = false;
  showList = false;
  showEnrolModal = false;

  isEdit = false;
  selectedId = '';
  currentBatchId: string | null = null;

  adminName = '';

  form = {
    batchId: '',
    name: '',
    course: '',
    startDate: '',
    endDate: '',
    capacity: '',
    trainer: '',
    startTime: '',
    endTime: '',
    mode: '',
    status: ''
  };

  enrolForm = {
    batchId: '',
    employeeId: ''
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

    this.adminName =
      this.authService.getName() || 'Admin';

    this.loadData();
  }

  loadData() {
    this.api.getCourses().subscribe({
      next: (data: any) => {
        this.courses = data;
        this.cdr.detectChanges();
      }
    });

    this.api.getBatches().subscribe({
      next: (data: any) => {
        this.batches = data;
        this.cdr.detectChanges();
      }
    });

    this.api.getUsers().subscribe({
      next: (data: any) => {
        this.users = data.filter((u: any) => u.role === 'employee');
        this.cdr.detectChanges();
      }
    });
  }

  get totalBatches(): number {
    return this.batches.length;
  }

  loadBatches() {

    this.api.getBatches()
      .subscribe({

        next: (data:any) => {

          this.batches = data;
          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(err);

        }

      });
  }

  loadCourses() {

    this.api.getCourses()
      .subscribe({

        next: (data:any) => {

          this.courses = data;
          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(err);

        }

      });
  }

  toggleList() {

    this.showList =
      !this.showList;
  }

  openAdd() {

    this.form = {

      batchId: '',
      name: '',
      course: '',
      startDate: '',
      endDate: '',
      capacity: '',
      trainer: '',
      startTime: '',
      endTime: '',
      mode: '',
      status: ''

    };

    this.isEdit = false;

    this.showForm = true;
  }

  openEdit(batch:any) {

    this.form = {

      batchId: batch.batchId,

      name: batch.name,

      course:
        batch.course?._id ||
        batch.course,

      startDate:
        batch.startDate?.substring(0,10),

      endDate:
        batch.endDate?.substring(0,10),

      capacity:
        batch.capacity,

      trainer:
        batch.trainer,

      startTime:
        batch.startTime,

      endTime:
        batch.endTime,

      mode:
        batch.mode,

      status:
        batch.status
    };

    this.selectedId =
      batch._id;

    this.isEdit = true;

    this.showForm = true;
  }

  save() {

    if(this.isEdit){

      this.api
        .updateBatch(
          this.selectedId,
          this.form
        )
        .subscribe({

          next:(updated:any)=>{

            this.loadBatches();

            this.showForm =
              false;
          },

          error:(err)=>{

            alert(
              'Error: ' +
              err.error?.message
            );

          }

        });

    } else {

      this.api
        .createBatch(
          this.form
        )
        .subscribe({

          next:(batch:any)=>{

            this.loadBatches();

            this.showForm =
              false;

            this.form = {

              batchId:'',
              name:'',
              course:'',
              startDate:'',
              endDate:'',
              capacity:'',
              trainer:'',
              startTime:'',
              endTime:'',
              mode:'',
              status:''

            };
            this.cdr.detectChanges();

          },

          error:(err)=>{

            alert(
              'Error: ' +
              err.error?.message
            );

          }

        });
    }
  }

  delete(id:string) {

    if(
      confirm(
        'Delete this batch?'
      )
    ){

      this.api
        .deleteBatch(id)
        .subscribe({

          next:()=>{

            this.batches =
              this.batches.filter(
                b =>
                b._id !== id
              );
            this.cdr.detectChanges();

          },

          error:(err)=>{

            alert(
              'Error: ' +
              err.error?.message
            );

          }

        });
    }
  }

  upcomingBatches() {

    return this.batches
      .slice(0,5);
  }

  navigate(page:string) {

    this.router.navigate([
      '/admin/' + page
    ]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }



  openEnrolModal(batch: any) {
    this.enrolForm = { batchId: batch._id, employeeId: '' };
    this.showEnrolModal = true;
  }

  closeEnrolModal() {
    this.showEnrolModal = false;
  }

  saveEnrolment() {
    if (!this.enrolForm.employeeId) {
      alert('Please select an employee.');
      return;
    }
    this.api.createEnrolment({
      employee: this.enrolForm.employeeId,
      batch: this.enrolForm.batchId,
      status: 'approved'
    }).subscribe({
      next: () => {
        alert('Employee manually enrolled successfully!');
        this.closeEnrolModal();
      },
      error: (err) => alert('Failed: ' + err.error?.message)
    });
  }
}
