import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { AdminCourses } from './admin/admin-courses/admin-courses';
import { AdminBatches } from './admin/admin-batches/admin-batches';
import { AdminUsers } from './admin/admin-users/admin-users';
import { AdminReports } from './admin/admin-reports/admin-reports';
import { ManagerDashboard } from './manager/manager-dashboard/manager-dashboard';
import { EmployeeDashboard } from './employee/employee-dashboard/employee-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin/dashboard', component: AdminDashboard },
  { path: 'admin/courses', component: AdminCourses },
  { path: 'admin/batches', component: AdminBatches },
  { path: 'admin/users', component: AdminUsers },
  { path: 'admin/reports', component: AdminReports },
  { path: 'manager/dashboard', component: ManagerDashboard },
  { path: 'employee/dashboard', component: EmployeeDashboard }
];
