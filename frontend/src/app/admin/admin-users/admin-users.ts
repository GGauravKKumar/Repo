import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsers implements OnInit {

  users: any[] = [];
  managers: any[] = [];

  showForm = false;
  showList = true;
  showViewModal = false;

  isEdit = false;
  selectedId = '';

  adminName = '';
  viewData: any = null;

  form = {
    empId: '',
    name: '',
    email: '',
    password: '',
    role: 'employee',
    department: '',
    dateOfJoining: '',
    age: null as number | null,
    gender: '',
    currentPostingLocation: '',
    dateOfCurrentPosting: '',
    managerId: ''
  };

  get yearsInCompany(): number | null {
    if (!this.form.dateOfJoining) return null;
    const diff = new Date().getTime() - new Date(this.form.dateOfJoining).getTime();
    return Math.max(0, parseFloat((diff / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)));
  }

  get yearsAtPosting(): number | null {
    if (!this.form.dateOfCurrentPosting) return null;
    const diff = new Date().getTime() - new Date(this.form.dateOfCurrentPosting).getTime();
    return Math.max(0, parseFloat((diff / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)));
  }

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
    this.loadUsers();
  }

  get totalUsers(): number {
    return this.users.length;
  }

  navigate(page: string) {
    this.router.navigate(['/admin/' + page]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadUsers() {
    this.api.getUsers().subscribe({
      next: (data: any) => {
        this.users = data;
        this.managers = data.filter((u: any) => u.role === 'manager');
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  toggleList() {
    this.showList = !this.showList;
  }

  generateNextEmpId() {
    const empIds = this.users
      .map(u => u.empId)
      .filter(id => id && id.startsWith('EMP-'))
      .map(id => parseInt(id.replace('EMP-', ''), 10))
      .filter(num => !isNaN(num));

    if (empIds.length === 0) {
      return 'EMP-0001';
    }

    const maxNum = Math.max(...empIds);
    const nextNum = maxNum + 1;
    return 'EMP-' + nextNum.toString().padStart(4, '0');
  }

  openAdd() {
    this.form = {
      empId: this.generateNextEmpId(),
      name: '',
      email: '',
      password: '',
      role: 'employee',
      department: '',
      dateOfJoining: '',
      age: null,
      gender: '',
      currentPostingLocation: '',
      dateOfCurrentPosting: '',
      managerId: ''
    };
    this.isEdit = false;
    this.showForm = true;
  }

  openEdit(user: any) {
    this.form = {
      empId: user.empId || '',
      name: user.name,
      email: user.email,
      password: '', // Leave blank so we don't accidentally update it empty
      role: user.role,
      department: user.department || '',
      dateOfJoining: user.dateOfJoining ? user.dateOfJoining.substring(0, 10) : '',
      age: user.age || null,
      gender: user.gender || '',
      currentPostingLocation: user.currentPostingLocation || '',
      dateOfCurrentPosting: user.dateOfCurrentPosting ? user.dateOfCurrentPosting.substring(0, 10) : '',
      managerId: user.managerId?._id || ''
    };
    this.selectedId = user._id;
    this.isEdit = true;
    this.showForm = true;
  }

  save() {
    if (this.isEdit) {
      const payload: any = {
        empId: this.form.empId,
        name: this.form.name,
        email: this.form.email,
        role: this.form.role,
        department: this.form.department,
        dateOfJoining: this.form.dateOfJoining,
        age: this.form.age,
        gender: this.form.gender,
        currentPostingLocation: this.form.currentPostingLocation,
        dateOfCurrentPosting: this.form.dateOfCurrentPosting,
        managerId: this.form.managerId || null
      };

      this.api.updateUser(this.selectedId, payload).subscribe({
        next: (updated: any) => {
          const index = this.users.findIndex(u => u._id === this.selectedId);
          if (index !== -1) {
            this.users[index] = updated;
          }
          this.showForm = false;
          this.cdr.detectChanges();
        },
        error: (err) => alert('Error: ' + err.error?.message)
      });
    } else {
      if (!this.form.password) {
        alert("Password is required for new user");
        return;
      }
      const payload = {
        ...this.form,
        managerId: this.form.managerId || null
      };
      this.api.createUser(payload).subscribe({
        next: () => {
          this.loadUsers(); // Need to reload as create just returns message
          this.showForm = false;
        },
        error: (err) => alert('Error: ' + err.error?.message)
      });
    }
  }

  delete(id: string) {
    if (confirm('Delete this user?')) {
      this.api.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u._id !== id);
          this.cdr.detectChanges();
        },
        error: (err) => alert('Error: ' + err.error?.message)
      });
    }
  }

  viewUser(user: any) {
    this.viewData = user;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.viewData = null;
  }
}
