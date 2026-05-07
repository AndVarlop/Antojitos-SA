import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="nav">
      <div class="contenedor nav-row">
        <a class="brand" routerLink="/" aria-label="Antojitos S&A inicio">
          <img src="/AntojitosS&A.ico" alt="" />
          <span>Antojitos <em>S&amp;A</em></span>
        </a>
        <nav class="links" aria-label="NavegaciÃ³n principal">
          <a routerLink="/" fragment="experiencia">Experiencia</a>
          <a routerLink="/" fragment="catalogo">MenÃº</a>
          <a routerLink="/" fragment="contacto">Contacto</a>
          @if (auth.logueado()) { <a routerLink="/cuenta/pedidos">Mis pedidos</a> }
        </nav>
        <div class="acciones">
          <a routerLink="/checkout" class="carrito" aria-label="Ver carrito">Carrito <strong>{{ carrito.items().length }}</strong></a>
          @if (auth.esAdmin()) { <a routerLink="/admin/dashboard" class="admin-link">Admin</a> }
          @if (auth.logueado()) {
            <a routerLink="/cuenta/perfil" class="usuario">{{ saludo() }}</a>
          } @else {
            <a routerLink="/auth/login" class="btn-fantasma compact">Entrar</a>
            <a routerLink="/auth/registro" class="btn-primario compact">Cuenta</a>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host { display: block; position: sticky; top: 0; z-index: 40; }
    .nav { background: rgba(255,250,242,.88); backdrop-filter: blur(16px); border-bottom: 1px solid var(--linea); }
    .nav-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; gap: 16px; }
    .brand { display: inline-flex; align-items: center; gap: 10px; color: var(--uva-900); min-width: max-content; }
    .brand img { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; box-shadow: 0 4px 12px rgba(76,42,91,.12); }
    .brand span { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 800; }
    .brand em { color: var(--fresa-600); font-style: normal; }
    .links { display: flex; gap: 22px; flex: 1; justify-content: center; }
    .links a { color: var(--texto); font-weight: 700; font-size: 14px; transition: color .2s; }
    .links a:hover { color: var(--fresa-600); }
    .acciones { display: flex; gap: 9px; align-items: center; }
    .compact { min-height: 38px; padding: 8px 14px; font-size: 13px; }
    .carrito, .usuario, .admin-link { min-height: 38px; display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 999px; background: #fff; border: 1px solid var(--linea); color: var(--uva-700); font-size: 13px; font-weight: 800; }
    .carrito strong { display: inline-grid; place-items: center; min-width: 22px; height: 22px; border-radius: 999px; background: var(--fresa-600); color: #fff; font-size: 12px; }
    .admin-link { background: var(--uva-900); color: #fff; }
    @media (max-width: 900px) { .links { display: none; } }
    @media (max-width: 640px) {
      .brand span { font-size: 18px; }
      .acciones { gap: 6px; }
      .acciones .btn-primario, .acciones .btn-fantasma { display: none; }
      .carrito { padding: 8px 10px; }
    }
  `]
})
export class NavComponent {
  carrito = inject(CarritoService);
  auth = inject(AuthService);
  saludo(): string {
    const nombre = this.auth.perfil()?.nombre;
    if (!nombre) return 'Mi cuenta';
    return nombre.split(' ')[0];
  }
}
