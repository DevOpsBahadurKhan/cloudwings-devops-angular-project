import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home-redirect',
  standalone: true,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">Redirecting...</p>
      </div>
    </div>
  `,
  styles: []
})
export class HomeRedirectComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('HomeRedirect: Checking authentication status...');
    
    // Check if user is logged in
    if (this.authService.isLoggedIn()) {
      console.log('HomeRedirect: User is logged in, redirecting to dashboard');
      this.router.navigate(['/dashboard']);
    } else {
      console.log('HomeRedirect: User not logged in, redirecting to login');
      this.router.navigate(['/login']);
    }
  }
}
