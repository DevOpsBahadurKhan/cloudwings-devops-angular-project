import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BlogService, Blog } from '../../services/blog.service';

@Component({
  selector: 'app-blog-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 to-white py-8">
      <div class="max-w-4xl mx-auto px-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
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
          
          <!-- Back Button -->
          <button class="btn btn-outline" (click)="goBack()">
            <span class="text-lg">←</span>
            Back to Blogs
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="flex flex-col items-center justify-center py-16">
          <div class="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
          <p class="text-gray-600">{{ blog ? 'Updating your blog...' : 'Loading blog...' }}</p>
        </div>
        
        <!-- Error State -->
        <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center gap-3">
          <span class="text-xl">⚠️</span>
          {{ error }}
        </div>
        
        <!-- Success State -->
        <div *ngIf="success" class="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-6 flex items-center gap-3">
          <span class="text-xl">🎉</span>
          {{ success }}
        </div>

        <!-- Form -->
        <form
          *ngIf="!loading && !success && blog"
          (ngSubmit)="onSubmit()"
          class="bg-white rounded-2xl shadow-lg p-8"
        >
          <div class="space-y-6">
            <!-- Title Field -->
            <div>
              <label for="title" class="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <span class="text-lg">📝</span>
                Title *
              </label>
              <input
                id="title"
                type="text"
                [(ngModel)]="blog.title"
                name="title"
                required
                placeholder="Enter an engaging title..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            <!-- Content Field -->
            <div>
              <label for="content" class="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <span class="text-lg">📄</span>
                Content *
              </label>
              <textarea
                id="content"
                [(ngModel)]="blog.content"
                name="content"
                required
                placeholder="Share your thoughts, ideas, and stories..."
                rows="12"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
              ></textarea>
            </div>

            <!-- Form Actions -->
            <div class="flex gap-4 pt-4">
              <button type="submit" class="btn btn-primary" [disabled]="!blog.title || !blog.content">
                <span class="text-lg">💾</span>
                Update Post
              </button>
              <button type="button" class="btn btn-secondary" (click)="goBack()">
                <span class="text-lg">❌</span>
                Cancel
              </button>
              <button type="button" class="btn btn-outline border-red-300 text-red-600 hover:bg-red-50" (click)="deleteBlog()" [disabled]="loading">
                <span class="text-lg">🗑️</span>
                Delete
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class BlogEditComponent implements OnInit {
  blog!: Blog;
  blogId!: string;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.blogId = this.route.snapshot.paramMap.get('id')!;
    this.loadBlog();
  }

  loadBlog(): void {
    this.loading = true;
    this.error = null;

    this.blogService.getBlogById(this.blogId).subscribe({
      next: (blog) => {
        this.blog = blog;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load blog: ' + (err?.error?.message || err?.message || 'Server error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (!this.blog.title || !this.blog.content) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    this.blogService.updateBlog(this.blogId, {
      title: this.blog.title,
      content: this.blog.content
    }).subscribe({
      next: (updatedBlog) => {
        this.loading = false;
        this.success = 'Blog post updated successfully!';

        // Navigate to blog detail after successful update
        setTimeout(() => {
          this.router.navigate(['/blog', this.blogId]);
        }, 1500);
      },
      error: (err) => {
        this.error = 'Failed to update blog post. Please try again.';
        this.loading = false;
      }
    });
  }

  deleteBlog(): void {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    this.loading = true;
    this.error = null;

    this.blogService.deleteBlog(this.blogId).subscribe({
      next: () => {
        this.success = 'Blog post deleted successfully!';
        this.loading = false;

        setTimeout(() => this.router.navigate(['/blogs']), 1500);
      },
      error: (err) => {
        this.error =
          'Failed to delete blog: ' +
          (err?.error?.message || err?.message || 'Server error');
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/blogs']);
  }
}
