import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/home-redirect/home-redirect.component').then(m => m.HomeRedirectComponent)
    },
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'blogs',
        component: BlogListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'blog/create',
        loadComponent: () => import('./components/blog-create/blog-create.component').then(m => m.BlogCreateComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'blog/edit/:id',
        loadComponent: () => import('./components/blog-edit/blog-edit.component').then(m => m.BlogEditComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'blog/:id',
        loadComponent: () => import('./components/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent),
        canActivate: [AuthGuard]
    },
    { path: '**', redirectTo: '/login' }
];
