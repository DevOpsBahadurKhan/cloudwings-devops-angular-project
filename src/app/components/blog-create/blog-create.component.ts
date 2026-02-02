import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BlogService, Blog } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-blog-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <!-- Full Screen Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-6 py-4">
          <div class="flex justify-between items-center">
            <!-- Brand Logo -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span class="text-white font-bold text-lg">🚀</span>
              </div>
              <a routerLink="/dashboard" class="hover:text-blue-600 transition-colors">
                <h1 class="text-2xl font-bold text-gray-900">
                  Cloudwings Technology
                </h1>
              </a>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex items-center gap-4">
              <button class="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md font-medium transition-colors" (click)="goBack()">
                ← Back to Blogs
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-4xl mx-auto px-6 py-8">
        <!-- Loading State -->
        <div *ngIf="loading" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
            <svg class="w-6 h-6 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V4"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Creating your blog post...</h3>
          <p class="text-gray-600">Please wait while we publish your content</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-xl p-6">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13 7 7 4.732 10 9.068a.996.996 0 01-.732.732L10 16.268"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-medium text-red-800">Error</h3>
              <p class="text-red-700 mt-1">{{ error }}</p>
            </div>
          </div>
        </div>
        
        <!-- Success State -->
        <div *ngIf="success" class="bg-green-50 border border-green-200 rounded-xl p-6">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-medium text-green-800">Success!</h3>
              <p class="text-green-700 mt-1">{{ success }}</p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form *ngIf="!loading && !success" (ngSubmit)="onSubmit()" class="max-w-4xl mx-auto">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div class="space-y-6">
              <!-- Title Field -->
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                  Title <span class="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  [(ngModel)]="blog.title"
                  name="title"
                  required
                  placeholder="Enter a compelling title for your blog post..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500"
                />
              </div>

              <!-- Content Field -->
              <div>
                <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
                  Content <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  [(ngModel)]="blog.content"
                  name="content"
                  required
                  placeholder="Write your blog post content here. Share your ideas, insights, and stories..."
                  rows="12"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500 resize-none"
                ></textarea>
                <div class="mt-2 text-xs text-gray-500">
                  <span>{{ blog.content?.length || 0 }} characters</span>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="flex justify-between items-center pt-6 border-t border-gray-200">
                <button type="button" class="text-gray-700 hover:text-gray-900 font-medium transition-colors" (click)="goBack()">
                  Cancel
                </button>
                <div class="flex gap-3">
                  <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2" [disabled]="!blog.title || !blog.content">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Create Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  `,
  styles: []
})
export class BlogCreateComponent implements OnInit {
  blog: Partial<Blog> = {
    title: '',
    content: '',
    author: ''
  };

  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private blogService: BlogService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
  }

  onSubmit(): void {
    if (!this.blog.title || !this.blog.content) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    this.blogService.createBlog(this.blog as Blog).subscribe({
      next: (response) => {
        this.success = 'Blog post created successfully! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/blogs']);
        }, 2000);
      },
      error: (err) => {
        this.error = 'Failed to create blog post. Please try again.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/blogs']);
  }
}
