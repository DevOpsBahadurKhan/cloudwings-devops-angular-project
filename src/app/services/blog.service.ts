import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Blog {
  _id?: string;
  title: string;
  content: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  // GET /blog
  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<any>(`${this.baseUrl}/blog`).pipe(
      map(response => {
        // Extract blogs array from wrapped response
        if (response && response.success && response.data) {
          return response.data;
        }
        return response;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Test backend connectivity
  testBackendConnection(): Observable<any> {
    console.log('BlogService: Testing backend connection to:', this.baseUrl);
    return this.http.get(`${this.baseUrl}/test`).pipe(
      tap(response => {
        console.log('BlogService: Backend connection successful:', response);
      }),
      catchError(error => {
        console.error('BlogService: Backend connection failed:', error);
        return throwError(() => error);
      })
    );
  }

  // GET /blog/:id
  getBlogById(id: string): Observable<Blog> {
    return this.http.get<any>(`${this.baseUrl}/blog/${id}`).pipe(
      map(response => {
        // Extract blog data from wrapped response
        if (response && response.success && response.data) {
          return response.data;
        }
        return response;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // POST /blog
  createBlog(blog: Pick<Blog, 'title' | 'content'>): Observable<Blog> {
    return this.http.post<Blog>(`${this.baseUrl}/blog`, blog);
  }

  // PATCH /blog/:id
  updateBlog(id: string, blog: Partial<Blog>): Observable<Blog> {
    return this.http.patch<any>(`${this.baseUrl}/blog/${id}`, blog).pipe(
      map(response => {
        // Extract blog data from wrapped response
        if (response && response.success && response.data) {
          return response.data;
        }
        return response;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // DELETE /blog/:id
  deleteBlog(id: string): Observable<{ success: boolean }> {
    return this.http.delete<any>(`${this.baseUrl}/blog/${id}`).pipe(
      map(response => {
        // Handle wrapped response
        if (response && response.success !== undefined) {
          return { success: response.success };
        }
        return response;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

}
