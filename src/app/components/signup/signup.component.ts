import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Header -->
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-xl mb-6">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-gray-900">Create your account</h2>
          <p class="mt-2 text-gray-600">Already have an account? 
            <a routerLink="/login" class="text-primary-600 hover:text-primary-500 font-medium">Sign in</a>
          </p>
        </div>

        <!-- Signup Form -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {{ errorMessage }}
            </div>

            <!-- Success Message -->
            <div *ngIf="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {{ successMessage }}
            </div>

            <!-- Name Field -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Full name
              </label>
              <input
                id="name"
                type="text"
                formControlName="name"
                placeholder="Enter your full name"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                [class]="f['name'].invalid && f['name'].touched ? 'border-red-500 focus:ring-red-500' : ''"
              />
              <div *ngIf="f['name'].invalid && f['name'].touched" class="mt-2 text-sm text-red-600">
                <div *ngIf="f['name'].errors?.['required']">Name is required</div>
                <div *ngIf="f['name'].errors?.['minlength']">Name must be at least 2 characters</div>
              </div>
            </div>

            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="Enter your email"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                [class]="f['email'].invalid && f['email'].touched ? 'border-red-500 focus:ring-red-500' : ''"
              />
              <div *ngIf="f['email'].invalid && f['email'].touched" class="mt-2 text-sm text-red-600">
                <div *ngIf="f['email'].errors?.['required']">Email is required</div>
                <div *ngIf="f['email'].errors?.['email']">Please enter a valid email</div>
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                placeholder="Create a password"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                [class]="f['password'].invalid && f['password'].touched ? 'border-red-500 focus:ring-red-500' : ''"
              />
              <div *ngIf="f['password'].invalid && f['password'].touched" class="mt-2 text-sm text-red-600">
                <div *ngIf="f['password'].errors?.['required']">Password is required</div>
                <div *ngIf="f['password'].errors?.['minlength']">Password must be at least 3 characters</div>
              </div>
            </div>

            <!-- Terms & Privacy -->
            <div class="flex items-start">
              <input id="terms" name="terms" type="checkbox" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1">
              <label for="terms" class="ml-2 block text-sm text-gray-900">
                I agree to the 
                <a href="#" class="text-primary-600 hover:text-primary-500">Terms of Service</a> and 
                <a href="#" class="text-primary-600 hover:text-primary-500">Privacy Policy</a>
              </label>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              [disabled]="isLoading || signupForm.invalid"
            >
              <span *ngIf="!isLoading">Create account</span>
              <span *ngIf="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            </button>
          </form>
        </div>

        <!-- Footer -->
        <div class="text-center text-sm text-gray-500">
          <p>© 2024 Your Company. All rights reserved.</p>
          <div class="mt-2 space-x-4">
            <a href="#" class="text-gray-500 hover:text-gray-700">Privacy Policy</a>
            <a href="#" class="text-gray-500 hover:text-gray-700">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.markFormGroupTouched(this.signupForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { name, email, password } = this.signupForm.value;

    this.authService.signup({ name, email, password }).subscribe({
      next: (response) => {
        // Subscribe to get the current user state
        this.authService.currentUser$.subscribe(user => {
          // If no user data in response, store it manually
          if (!user || !user.name) {
            const userData = {
              _id: Date.now().toString(),
              name: name,
              email: email
            };
            this.authService.setUser(userData);
          }
        });

        this.successMessage = 'Account created successfully! Redirecting to dashboard...';

        // Wait for auth state to be properly set
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get f() {
    return this.signupForm.controls;
  }
}
