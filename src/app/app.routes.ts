import { Routes } from '@angular/router';
import { LoginComponent } from './login-component/login-component';
import { LayoutComponent } from './pages/layout-component/layout-component';
import { Not404Component } from './pages/not404-component/not404-component';
import { certGuard } from './guard/cert.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: 'pages',
    component: LayoutComponent,
    canActivate: [certGuard],
    loadChildren: () => import('./pages/pages.routes').then((m) => m.pagesRoutes),
  },

  { path: '**', component: Not404Component },
];
