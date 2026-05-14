import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Páginas con sesión → solo cliente (no se prerenderizan)
  { path: 'auth/**',    renderMode: RenderMode.Client },
  { path: 'checkout',   renderMode: RenderMode.Client },
  { path: 'cuenta/**',  renderMode: RenderMode.Client },
  { path: 'admin/**',   renderMode: RenderMode.Client },
  // Resto de páginas públicas → prerenderizado
  { path: '**',         renderMode: RenderMode.Prerender },
];
