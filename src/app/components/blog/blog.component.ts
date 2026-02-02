import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BlogService, Blog } from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 to-white py-8">
      <div class="max-w-6xl mx-auto px-6">
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
          
          <div class="flex items-center gap-4">
            <!-- Create Button -->
            <button *ngIf="!showForm" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors" (click)="showCreateForm()">
              Create New Blog
            </button>
          </div>
        </div>

        <!-- Create / Edit Form -->
        <div *ngIf="showForm" class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div class="border-b border-gray-200 px-6 py-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900">{{ editingBlog ? 'Edit Blog Post' : 'Create New Blog Post' }}</h3>
              <button class="text-gray-400 hover:text-gray-600" (click)="cancelEdit()">
                <span class="text-xl">✕</span>
              </button>
            </div>
          </div>

          <form (ngSubmit)="onSubmit()" class="p-6">
            <div class="space-y-4">
              <!-- Title Field -->
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  id="title"
                  type="text"
                  [(ngModel)]="currentBlog.title"
                  name="title"
                  required
                  placeholder="Enter post title..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <!-- Content Field -->
              <div>
                <label for="content" class="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  id="content"
                  [(ngModel)]="currentBlog.content"
                  name="content"
                  required
                  placeholder="Write your post content..."
                  rows="8"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                ></textarea>
              </div>

              <!-- Form Actions -->
              <div class="flex justify-between items-center pt-4">
                <div class="flex gap-3">
                  <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors" [disabled]="!currentBlog.title || !currentBlog.content">
                    {{ editingBlog ? 'Update' : 'Create' }} Post
                  </button>
                  <button type="button" class="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md font-medium transition-colors" (click)="cancelEdit()">
                    Cancel
                  </button>
                </div>
                <button *ngIf="editingBlog" type="button" class="text-red-600 hover:text-red-700 px-4 py-2 rounded-md font-medium transition-colors" (click)="deleteBlog()">
                  Delete
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="flex flex-col items-center justify-center py-16">
          <div class="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p class="text-gray-600">Loading...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {{ error }}
        </div>

        <!-- Success State -->
        <div *ngIf="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {{ success }}
        </div>

        <!-- Blog Grid -->
        <div *ngIf="!loading && !error && !showForm" class="space-y-6">
          <!-- Blog Posts -->
          <div *ngIf="blogs.length > 0">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-gray-900">Your Blog Posts</h2>
              <span class="text-sm text-gray-500">{{ blogs.length }} posts</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow" *ngFor="let blog of blogs; trackBy: trackByBlogId">
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">{{ blog.title }}</h3>
                  <div class="flex gap-2">
                    <button class="text-blue-600 hover:text-blue-700 text-sm font-medium" [routerLink]="['/blog', blog._id]">
                      View
                    </button>
                    <button class="text-gray-600 hover:text-gray-700 text-sm font-medium" (click)="editBlog(blog)">
                      Edit
                    </button>
                  </div>
                </div>
                <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ blog.content | slice:0:150 }}{{ blog.content.length > 150 ? '...' : '' }}</p>
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span *ngIf="blog.createdAt">{{ blog.createdAt | date:'MMM dd, yyyy' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="blogs.length === 0" class="text-center py-16">
            <div class="text-6xl mb-6 opacity-30">📝</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No blog posts yet</h3>
            <p class="text-gray-600 mb-8">Start creating amazing content for your blog</p>
            <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors" (click)="showCreateForm()">
              Create Your First Blog
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class BlogComponent implements OnInit {
  blogs: Blog[] = [];
  currentBlog: Partial<Blog> = {
    title: '',
    content: '',
    author: ''
  };
  editingBlog: Blog | null = null;
  showForm = false;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private blogService: BlogService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = null;

    this.blogService.getAllBlogs().subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load blogs. Please try again.';
        this.loading = false;
      }
    });
  }

  showCreateForm(): void {
    this.showForm = true;
    this.editingBlog = null;
    this.currentBlog = {
      title: '',
      content: '',
      author: ''
    };
  }

  editBlog(blog: Blog): void {
    this.showForm = true;
    this.editingBlog = blog;
    this.currentBlog = { ...blog };
  }

  cancelEdit(): void {
    this.showForm = false;
    this.editingBlog = null;
    this.currentBlog = {
      title: '',
      content: '',
      author: ''
    };
  }

  onSubmit(): void {
    if (!this.currentBlog.title || !this.currentBlog.content) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    if (this.editingBlog) {
      // Update existing blog
      this.blogService.updateBlog(this.editingBlog._id!, this.currentBlog as Blog).subscribe({
        next: () => {
          this.success = 'Blog post updated successfully!';
          this.loading = false;
          this.loadBlogs();
          setTimeout(() => {
            this.cancelEdit();
          }, 1500);
        },
        error: (err) => {
          this.error = 'Failed to update blog post. Please try again.';
          this.loading = false;
        }
      });
    } else {
      // Create new blog
      this.blogService.createBlog(this.currentBlog as Blog).subscribe({
        next: () => {
          this.success = 'Blog post created successfully!';
          this.loading = false;
          this.loadBlogs();
          setTimeout(() => {
            this.cancelEdit();
          }, 1500);
        },
        error: (err) => {
          this.error = 'Failed to create blog post. Please try again.';
          this.loading = false;
        }
      });
    }
  }

  deleteBlog(): void {
    if (!this.editingBlog || !confirm('Are you sure you want to delete this blog post?')) return;

    this.loading = true;
    this.error = null;

    this.blogService.deleteBlog(this.editingBlog._id!).subscribe({
      next: () => {
        this.success = 'Blog post deleted successfully!';
        this.loading = false;
        this.loadBlogs();
        setTimeout(() => {
          this.cancelEdit();
        }, 1500);
      },
      error: (err) => {
        this.error = 'Failed to delete blog post. Please try again.';
        this.loading = false;
      }
    });
  }

  trackByBlogId(index: number, blog: Blog): string {
    return blog._id!;
  }
}
