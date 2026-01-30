import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  displayName = '';
  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
      this.displayName = user?.name || 'User';
    });
    this.isLoading = false;

    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.displayName = user?.name || 'User';
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to fetch user profile:', error);
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
