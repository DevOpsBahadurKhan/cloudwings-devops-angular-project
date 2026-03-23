import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { BlogService, Blog } from '../../services/blog.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <!-- Navigation -->
      <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-6 py-4">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
              <h1 class="text-2xl font-bold text-gray-900">Cloudwings Technology</h1>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-gray-600">
                <span class="text-lg">👋</span>
                Welcome, {{ displayName }}!
              </span>
              <button (click)="logout()" class="btn btn-outline">
                <span class="text-lg">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-6 py-8">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="flex flex-col items-center justify-center py-20">
          <div class="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
          <p class="text-gray-600">Loading your amazing workspace...</p>
        </div>

        <!-- Hero Section -->
        <div *ngIf="!isLoading" class="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div class="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div class="text-center lg:text-left">
              <p class="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <span class="text-lg">⚡</span>
                Personal Workspace
              </p>
              <h2 class="text-4xl font-bold text-gray-900 mb-4">
                Welcome back, {{ currentUser && currentUser.name ? currentUser.name : displayName }}! 🎉
              </h2>
              <p class="text-gray-600 text-lg max-w-2xl">
                Ready to create amazing content? Your blog dashboard is all set up and waiting for your creative ideas.
              </p>
            </div>
            <div class="flex flex-col sm:flex-row gap-4">
              <button class="btn btn-primary" routerLink="/blog/create">
                <span class="text-lg">✨</span>
                Create New Post
              </button>
              <button class="btn btn-secondary" routerLink="/blogs">
                <span class="text-lg">📝</span>
                Manage Posts
              </button>
            </div>
          </div>
        </div>

        <!-- Dashboard Grid -->
        <div *ngIf="!isLoading && currentUser" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Blog Overview Card -->
          <div class="card p-6">
            <div class="mb-6">
              <h3 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span class="text-lg">�</span>
                Blog Overview
              </h3>
            </div>
            <div class="space-y-4">
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <label class="text-gray-600 font-medium flex items-center gap-2">
                  <span class="text-sm">�</span>
                  Total Posts
                </label>
                <span class="text-gray-900 font-medium">{{ userBlogs.length }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <label class="text-gray-600 font-medium flex items-center gap-2">
                  <span class="text-sm">�</span>
                  Status
                </label>
                <span class="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Active</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <label class="text-gray-600 font-medium flex items-center gap-2">
                  <span class="text-sm">📅</span>
                  Last Activity
                </label>
                <span class="text-gray-900 font-medium">{{ getLastLoginTime() }}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <label class="text-gray-600 font-medium flex items-center gap-2">
                  <span class="text-sm">🎯</span>
                  Performance
                </label>
                <span class="text-gray-900 font-medium">{{ getEngagementRate() }}% engagement</span>
              </div>
            </div>
          </div>

          <!-- Blog Statistics Card -->
          <div class="card p-6">
            <div class="mb-6">
              <h3 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span class="text-lg">📊</span>
                Blog Statistics
              </h3>
            </div>
            <div class="space-y-4">
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <label class="text-gray-600 font-medium flex items-center gap-2">
                  <span class="text-sm">📝</span>
                  Total Posts
                </label>
                <span class="text-gray-900 font-medium">{{ userBlogs.length }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <label class="text-gray-600 font-medium flex items-center gap-2">
                  <span class="text-sm">👁️</span>
                  Total Views
                </label>
                <span class="text-gray-900 font-medium">{{ getTotalViews() }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <label class="text-gray-600 font-medium flex items-center gap-2">
                  <span class="text-sm">💬</span>
                  Total Comments
                </label>
                <span class="text-gray-900 font-medium">{{ getTotalComments() }}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <label class="text-gray-600 font-medium flex items-center gap-2">
                  <span class="text-sm">📈</span>
                  Engagement Rate
                </label>
                <span class="text-gray-900 font-medium">
                  {{ getEngagementRate() }}%
                </span>
              </div>
            </div>
          </div>

          <!-- Recent Activity Card -->
          <div class="card p-6">
            <div class="mb-6">
              <h3 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span class="text-lg">📅</span>
                Recent Activity
              </h3>
            </div>
            <div class="space-y-4">
              <div class="flex items-center gap-3 py-2 border-b border-gray-100">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Dashboard accessed</p>
                  <p class="text-xs text-gray-500">Just now</p>
                </div>
              </div>
              <div class="flex items-center gap-3 py-2 border-b border-gray-100">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Last login</p>
                  <p class="text-xs text-gray-500">{{ getLastLoginTime() }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 py-2 border-b border-gray-100" *ngIf="getMostRecentPost()">
                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Latest post created</p>
                  <p class="text-xs text-gray-500">{{ getMostRecentPost()?.createdAt | date:'MMM dd, yyyy' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 py-2">
                <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Account created</p>
                  <p class="text-xs text-gray-500">{{ getMemberSinceDate() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Card -->
        <div *ngIf="!isLoading && currentUser" class="card p-6">
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <span class="text-lg">⚡</span>
              Quick Actions
            </h3>
          </div>
          <div class="space-y-3">
            <button class="w-full btn btn-secondary justify-start" routerLink="/blog/create">
              <span class="text-lg">✨</span>
              Create New Blog Post
            </button>
            <button class="w-full btn btn-secondary justify-start" routerLink="/blogs">
              <span class="text-lg">📝</span>
              Manage Blog Posts
            </button>
            <button class="w-full btn btn-secondary justify-start">
              <span class="text-lg">⚙️</span>
              Settings
            </button>
            <button class="w-full btn btn-outline justify-start" (click)="logout()">
              <span class="text-lg">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  displayName = '';
  isLoading = true;
  userBlogs: Blog[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private blogService: BlogService
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Get user data immediately from stored data
    const storedUser = this.authService.getUser();

    if (storedUser) {
      this.currentUser = storedUser;
      this.displayName = storedUser.name || 'User';
    } else {
      this.displayName = 'User';
    }

    // Subscribe to observable for real-time updates
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      this.displayName = user?.name || 'User';
      this.isLoading = false;
    });

    this.loadUserBlogs();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getMemberSinceDate(): string {
    return new Date().toLocaleDateString();
  }

  getTotalViews(): number {
    return this.userBlogs.reduce((total: number, blog: Blog) => total + ((blog as any).views || 0), 0);
  }

  getTotalComments(): number {
    return this.userBlogs.reduce((total: number, blog: Blog) => total + ((blog as any).comments || 0), 0);
  }

  getLastLoginTime(): string {
    // In a real app, this would come from the auth service or localStorage
    return localStorage.getItem('lastLogin') || new Date().toLocaleDateString();
  }

  getMostRecentPost(): Blog | null {
    return this.userBlogs.length > 0
      ? this.userBlogs.reduce((mostRecent: Blog, blog: Blog) => {
        const blogDate = new Date(blog.createdAt || 0);
        const mostRecentDate = new Date(mostRecent.createdAt || 0);
        return blogDate > mostRecentDate ? blog : mostRecent;
      })
      : null;
  }

  getEngagementRate(): number {
    return this.userBlogs.length > 0 && this.getTotalViews() > 0 ? Math.round((this.getTotalComments() / this.getTotalViews()) * 100) : 0;
  }

  loadUserBlogs(): void {
    this.blogService.getAllBlogs().subscribe({
      next: (blogs: Blog[]) => {
        this.userBlogs = blogs;
      },
      error: (error: any) => {
        console.error('Failed to load user blogs:', error);
      }
    });
  }
}
