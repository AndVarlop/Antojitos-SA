import { Routes } from '@angular/router';
import { adminGuard, authGuard, verificadoGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },

  {
    path: 'auth',
    loadComponent: () =>
      import('./components/auth/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./components/auth/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'registro',
        loadComponent: () =>
          import('./components/auth/registro.component').then(m => m.RegistroComponent)
      },
      {
        path: 'verificar',
        loadComponent: () =>
          import('./components/auth/verificar.component').then(m => m.VerificarComponent)
      },
      {
        path: 'verificado',
        loadComponent: () =>
          import('./components/auth/verificado.component').then(m => m.VerificadoComponent)
      },
      {
        path: 'recuperar',
        loadComponent: () =>
          import('./components/auth/recuperar.component').then(m => m.RecuperarComponent)
      },
      {
        path: 'restablecer',
        loadComponent: () =>
          import('./components/auth/restablecer.component').then(m => m.RestablecerComponent)
      }
    ]
  },

  {
    path: 'checkout',
    canActivate: [verificadoGuard],
    loadComponent: () =>
      import('./components/checkout/checkout.component').then(m => m.CheckoutComponent)
  },

  {
    path: 'cuenta',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/cuenta/cuenta-layout.component').then(m => m.CuentaLayoutComponent),
    children: [
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./components/cuenta/perfil.component').then(m => m.PerfilComponent)
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./components/cuenta/pedidos.component').then(m => m.PedidosComponent)
      },
      {
        path: 'credito',
        loadComponent: () =>
          import('./components/cuenta/credito.component').then(m => m.CreditoComponent)
      },
      {
        path: 'direcciones',
        loadComponent: () =>
          import('./components/cuenta/direcciones.component').then(m => m.DireccionesComponent)
      }
    ]
  },

  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./components/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/admin/dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./components/admin/pedidos-admin.component').then(m => m.AdminPedidosComponent)
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./components/admin/clientes-admin.component').then(m => m.AdminClientesComponent)
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./components/admin/productos-admin.component').then(m => m.AdminProductosComponent)
      }
    ]
  },

  { path: '**', redirectTo: '' }
];
