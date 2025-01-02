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
    ],
  },

  { path: '**', redirectTo: '' },
];
