import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BlogService, Blog } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 font-sans">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-8 py-8">
          <div class="flex justify-between items-center">
            <!-- Brand Logo -->
            <a routerLink="/dashboard" class="flex items-center gap-3 group cursor-pointer">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <span class="text-white font-bold text-lg">🚀</span>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                  Cloudwings Technology
                </h1>
              </div>
            </a>
            
            <!-- Action Buttons -->
            <div class="flex gap-4">
              <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors" routerLink="/blog/create">
                + New Post
              </button>
              <button class="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md font-medium transition-colors border border-gray-300" (click)="logout()">
                → Logout
              </button>
            </div>
          </div>
        </div>
      </header>

    
      <!-- Loading State -->
      <div *ngIf="loading" class="flex flex-col items-center justify-center py-16">
        <div class="w-10 h-10 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-600 text-sm">Loading posts...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="flex justify-center py-16">
        <div class="bg-white border border-red-200 rounded-xl p-8 text-center max-w-md shadow-sm">
          <h3 class="text-red-600 text-lg font-semibold mb-2">Something went wrong</h3>
          <p class="text-gray-600 text-sm mb-6">{{ error }}</p>
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors" (click)="loadBlogs()">Try Again</button>
        </div>
      </div>

      <!-- Blog Grid -->
      <main *ngIf="!loading && !error" class="max-w-7xl mx-auto px-8 py-8">
        <div *ngIf="blogs.length > 0; else noBlogs">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex flex-col hover:shadow-md transition-shadow" *ngFor="let blog of blogs; trackBy: trackByBlogId">
              <div class="mb-4">
                <h2 class="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                  <a [routerLink]="['/blog', blog._id]" class="text-inherit no-underline transition-colors duration-200 hover:text-primary-500">{{ blog.title }}</a>
                </h2>
                <div class="flex flex-wrap gap-4">
                  <span class="flex items-center gap-1.5 text-gray-600 text-sm" *ngIf="blog.author">
                    <span class="text-xs">👤</span>
                    {{ blog.author }}
                  </span>
                  <span class="flex items-center gap-1.5 text-gray-600 text-sm" *ngIf="blog.createdAt">
                    <span class="text-xs">📅</span>
                    {{ blog.createdAt | date:'MMM dd, yyyy' }}
                  </span>
                </div>
              </div>
              
              <div class="flex-1 mb-6">
                <p class="text-gray-700 leading-relaxed text-sm">{{ blog.content | slice:0:120 }}{{ blog.content.length > 120 ? '...' : '' }}</p>
              </div>

              <div class="mt-auto flex gap-3">
                <a [routerLink]="['/blog', blog._id]" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  👁️ Read More
                </a>
                <button class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-gray-300" [routerLink]="['/blog/edit', blog._id]">
                  ✏️ Edit
                </button>
                <button class="text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-red-300" (click)="deleteBlog(blog._id!, blog.title)">
                  🗑️ Delete
                </button>
              </div>
            </article>
          </div>
        </div>

        <ng-template #noBlogs>
          <div class="text-center py-16">
            <div class="text-6xl mb-6 opacity-50">📝</div>
            <h2 class="text-2xl font-semibold text-gray-900 mb-2">No posts yet</h2>
            <p class="text-gray-600 text-sm mb-8">Start creating amazing content for your blog</p>
            <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors" routerLink="/blog/create">
              + Create Your First Post
            </button>
          </div>
        </ng-template>
      </main>
    </div>
  `,
  styles: []
})

export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private blogService: BlogService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = null;

    this.blogService.getAllBlogs().subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load blogs';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  trackByBlogId(index: number, blog: Blog): string {
    return blog._id || index.toString();
  }

  deleteBlog(blogId: string, blogTitle: string): void {
    if (confirm(`Are you sure you want to delete "${blogTitle}"? This action cannot be undone.`)) {
      this.blogService.deleteBlog(blogId).subscribe({
        next: (response) => {
          if (response.success) {
            // Remove blog from the list
            this.blogs = this.blogs.filter(blog => blog._id !== blogId);
            this.cdr.detectChanges();
          } else {
            alert('Failed to delete blog. Please try again.');
          }
        },
        error: (err) => {
          alert('Error deleting blog. Please try again.');
        }
      });
    }
  }
}
