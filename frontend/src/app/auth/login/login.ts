import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('name', res.name);
        setTimeout(() => {
          if (res.role === 'admin') this.router.navigate(['/admin/dashboard']);
          else if (res.role === 'manager') this.router.navigate(['/manager/dashboard']);
          else this.router.navigate(['/employee/dashboard']);
        }, 300);
      },
      error: () => { this.error = 'Invalid email or password'; }
    });
  }
}
