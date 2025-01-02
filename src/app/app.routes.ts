import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { LandingComponent } from './pages/landing/landing.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: 'LandingComponent',
      //   pathMatch: 'full',
      // },
      {
        path: '',
        component: LandingComponent,
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('./pages/admin-editor/admin-editor.component').then(
            (m) => m.AdminEditorComponent
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/contact-us/contact-us.component').then(
            (m) => m.ContactUsComponent
          ),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/about-us/about-us.component').then(
            (m) => m.AboutUsComponent
          ),
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./pages/blog/blog.component').then((m) => m.BlogComponent),
      },
      {
        path: 'blog/:id',
        loadComponent: () =>
          import('./pages/blog-detail/blog-detail.component').then(
            (m) => m.BlogDetailComponent
          ),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
