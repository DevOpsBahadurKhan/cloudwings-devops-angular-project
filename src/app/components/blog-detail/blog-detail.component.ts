import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService, Blog } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-6 py-4">
          <div class="flex justify-between items-center">
            <!-- Brand Logo -->
            <a routerLink="/dashboard" class="flex items-center gap-3 group cursor-pointer">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <span class="text-white font-bold text-lg">🚀</span>
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                  Cloudwings Technology
                </h1>
              </div>
            </a>
            
            <!-- Action Buttons -->
            <div class="flex items-center gap-3">
              <button class="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md font-medium transition-colors" routerLink="/blogs">
                ← Back to Posts
              </button>
              <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors" [routerLink]="['/blog/edit', blog?._id]">
                ✏️ Edit Post
              </button>
              <button class="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md font-medium transition-colors" (click)="logout()">
                → Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-600">Loading post...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="flex justify-center items-center py-20">
        <div class="bg-white border border-red-200 rounded-xl p-8 text-center max-w-md shadow-sm">
          <h3 class="text-red-600 text-lg font-semibold mb-2">Post not found</h3>
          <p class="text-gray-600 text-sm mb-6">{{ error }}</p>
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors" routerLink="/blogs">Back to Posts</button>
        </div>
      </div>

    

      <!-- Blog Content -->
      <main class="max-w-4xl mx-auto px-6 py-8">
        <article *ngIf="blog" class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <!-- Article Header -->
          <div class="p-8 pb-6 border-b border-gray-100">
            <h1 class="text-4xl font-bold text-gray-900 mb-6 leading-tight">{{ blog.title }}</h1>
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div class="flex flex-wrap gap-4">
                <span class="flex items-center gap-2 text-gray-600 text-sm" *ngIf="blog.author">
                  <span class="text-sm">👤</span>
                  {{ blog.author }}
                </span>
              </div>
              <span class="flex items-center gap-2 text-gray-600 text-sm">
                <span class="text-sm">⏱️</span>
                {{ getReadingTime() }} min read
              </span>
            </div>
          </div>

          <!-- Article Content -->
          <div class="px-8 py-6">
            <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">{{ formatContent(blog.content) }}</div>
          </div>

          <!-- Article Footer -->
          <div class="px-8 py-6 border-t border-gray-100 bg-gray-50">
            <div class="flex flex-col sm:flex-row gap-4">
              <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors" [routerLink]="['/blog/edit', blog._id]">
                ✏️ Edit Post
              </button>
              <button class="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md font-medium transition-colors" routerLink="/blogs">
                📝 View All Posts
              </button>
            </div>
          </div>
        </article>

        <!-- Related Posts Section -->
        <section *ngIf="relatedBlogs.length > 0" class="mt-12">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article *ngFor="let relatedBlog of relatedBlogs" [routerLink]="['/blog', relatedBlog._id]" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow">
              <h3 class="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">{{ relatedBlog.title }}</h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ relatedBlog.content | slice:0:100 }}{{ relatedBlog.content.length > 100 ? '...' : '' }}</p>
              <span class="text-gray-500 text-xs">{{ relatedBlog.createdAt | date:'MMM dd' }}</span>
            </article>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: []
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;
  relatedBlogs: Blog[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Check if user is authenticated
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'Blog post ID not found';
      return;
    }

    this.loadBlog(id);
    this.loadRelatedBlogs(id);
  }

  loadBlog(id: string): void {
    this.loading = true;
    this.error = null;

    this.blogService.getBlogById(id).subscribe({
      next: (blog) => {
        this.blog = blog;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 404) {
          this.error = 'Blog post not found.';
        } else if (err.status === 401) {
          this.error = 'Authentication required. Please login again.';
          this.router.navigate(['/login']);
        } else {
          this.error = `Failed to load blog post: ${err.message || 'Unknown error'}`;
        }

        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadRelatedBlogs(currentId: string): void {
    this.blogService.getAllBlogs().subscribe({
      next: (blogs) => {
        this.relatedBlogs = blogs
          .filter(blog => blog._id !== currentId)
          .slice(0, 3); // Show max 3 related posts

        this.cdr.detectChanges();
      },
      error: (err) => {
        // Silently handle related blogs error
      }
    });
  }

  getReadingTime(): number {
    if (!this.blog?.content) return 1;
    const wordsPerMinute = 200;
    const words = this.blog.content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  formatContent(content: string): string {
    // Convert newlines to paragraphs
    return content
      .split('\n\n')
      .map(paragraph => {
        // Check if it's a heading (starts with #)
        if (paragraph.startsWith('#')) {
          const level = paragraph.match(/^#+/)?.[0].length || 1;
          const text = paragraph.replace(/^#+\s*/, '');
          return `<h${Math.min(level, 6)}>${text}</h${Math.min(level, 6)}>`;
        }
        // Regular paragraph
        return `<p>${paragraph}</p>`;
      })
      .join('');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
