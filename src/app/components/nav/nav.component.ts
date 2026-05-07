import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="nav">
      <div class="contenedor nav-row">
        <a class="brand" routerLink="/" aria-label="Antojitos S&amp;A inicio" (click)="cerrar()">
          <img src="antojitos-logo.jpeg" alt="" />
          <span>Antojitos <em>S&amp;A</em></span>
        </a>

        <nav class="links solo-desktop" aria-label="Navegación principal">
          <a routerLink="/" fragment="experiencia">Experiencia</a>
          <a routerLink="/" fragment="catalogo">Menú</a>
          <a routerLink="/" fragment="contacto">Contacto</a>
          @if (auth.logueado()) { <a routerLink="/cuenta/pedidos">Mis pedidos</a> }
        </nav>

        <div class="acciones">
          <a routerLink="/checkout" class="carrito" aria-label="Ver carrito">
            <span class="carrito-ico" aria-hidden="true">🛒</span>
            <strong>{{ carrito.items().length }}</strong>
          </a>

          <div class="solo-desktop acciones-desk">
            @if (auth.esAdmin()) { <a routerLink="/admin/dashboard" class="admin-link">Admin</a> }
            @if (auth.logueado()) {
              <a routerLink="/cuenta/perfil" class="usuario">{{ saludo() }}</a>
            } @else {
              <a routerLink="/auth/login" class="btn-fantasma compact">Entrar</a>
              <a routerLink="/auth/registro" class="btn-primario compact">Cuenta</a>
            }
          </div>

          <button class="hamb solo-movil" type="button"
            (click)="toggle()"
            [attr.aria-expanded]="abierto()"
            aria-label="Abrir menú">
            <span [class.activa]="abierto()"></span>
            <span [class.activa]="abierto()"></span>
            <span [class.activa]="abierto()"></span>
          </button>
        </div>
      </div>
    </header>

    @if (abierto()) {
      <div class="overlay-mov" (click)="cerrar()" aria-hidden="true"></div>
      <aside class="drawer" role="dialog" aria-label="Menú móvil">
        <header class="drawer-head">
          <span>Menú</span>
          <button class="drawer-x" (click)="cerrar()" aria-label="Cerrar menú">×</button>
        </header>

        <nav class="drawer-links" aria-label="Navegación móvil">
          <a routerLink="/" fragment="experiencia" (click)="cerrar()">Experiencia</a>
          <a routerLink="/" fragment="catalogo" (click)="cerrar()">Menú</a>
          <a routerLink="/" fragment="contacto" (click)="cerrar()">Contacto</a>
          @if (auth.logueado()) {
            <a routerLink="/cuenta/perfil" (click)="cerrar()">Mi perfil</a>
            <a routerLink="/cuenta/pedidos" (click)="cerrar()">Mis pedidos</a>
            <a routerLink="/cuenta/credito" (click)="cerrar()">Mi crédito</a>
            <a routerLink="/cuenta/direcciones" (click)="cerrar()">Direcciones</a>
          }
          @if (auth.esAdmin()) { <a routerLink="/admin/dashboard" (click)="cerrar()" class="link-admin">⚙ Panel admin</a> }
        </nav>

        <div class="drawer-foot">
          @if (auth.logueado()) {
            <button class="btn-fantasma" (click)="salir()">Cerrar sesión</button>
          } @else {
            <a routerLink="/auth/login" class="btn-fantasma" (click)="cerrar()">Entrar</a>
            <a routerLink="/auth/registro" class="btn-primario" (click)="cerrar()">Crear cuenta</a>
          }
        </div>
      </aside>
    }
  `,
  styles: [`
    :host { display: block; position: sticky; top: 0; z-index: 40; }
    .nav {
      background: rgba(255, 250, 242, .92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--linea);
    }
    .nav-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      gap: 14px;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--uva-900);
      min-width: max-content;
    }
    .brand img {
      width: 38px; height: 38px;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 4px 12px rgba(76, 42, 91, .12);
      background: var(--malva-100);
    }
    .brand span {
      font-family: 'Playfair Display', serif;
      font-size: 22px; font-weight: 800;
      line-height: 1;
    }
    .brand em { color: var(--fresa-600); font-style: normal; }

    .links {
      display: flex; gap: 22px;
      flex: 1; justify-content: center;
    }
    .links a {
      color: var(--texto); font-weight: 700; font-size: 14px;
      transition: color .2s;
    }
    .links a:hover { color: var(--fresa-600); }

    .acciones { display: flex; gap: 9px; align-items: center; }
    .acciones-desk { display: flex; gap: 9px; align-items: center; }
    .compact { min-height: 38px; padding: 8px 14px; font-size: 13px; }
    .carrito, .usuario, .admin-link {
      min-height: 38px; display: inline-flex; align-items: center; gap: 8px;
      padding: 8px 12px; border-radius: var(--radius-pill);
      background: #fff; border: 1px solid var(--linea);
      color: var(--uva-700); font-size: 13px; font-weight: 800;
      transition: all .2s;
    }
    .carrito:hover, .usuario:hover { border-color: var(--fresa-300); color: var(--fresa-600); }
    .carrito strong {
      display: inline-grid; place-items: center;
      min-width: 22px; height: 22px; padding: 0 6px;
      border-radius: var(--radius-pill);
      background: var(--fresa-600); color: #fff; font-size: 12px;
    }
    .carrito-ico { font-size: 16px; line-height: 1; }
    .admin-link { background: var(--uva-900); color: #fff; border-color: var(--uva-900); }
    .admin-link:hover { background: var(--uva-800); color: #fff; }

    /* Hamburger */
    .hamb {
      width: 44px; height: 44px;
      background: #fff;
      border: 1px solid var(--linea);
      border-radius: 12px;
      display: inline-flex;
      flex-direction: column;
      gap: 5px;
      align-items: center;
      justify-content: center;
      padding: 0;
    }
    .hamb span {
      display: block;
      width: 22px; height: 2px;
      background: var(--uva-900);
      border-radius: 2px;
      transition: transform .25s ease, opacity .25s ease;
    }
    .hamb span.activa:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .hamb span.activa:nth-child(2) { opacity: 0; }
    .hamb span.activa:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    /* Overlay + drawer móvil */
    .overlay-mov {
      position: fixed; inset: 0;
      background: rgba(36, 27, 36, .42);
      z-index: 50;
      animation: fade .25s ease;
    }
    .drawer {
      position: fixed;
      top: 0; right: 0; bottom: 0;
      width: min(320px, 86vw);
      background: #fff;
      z-index: 60;
      display: flex;
      flex-direction: column;
      box-shadow: -20px 0 60px rgba(76, 42, 91, .25);
      animation: slide .28s cubic-bezier(.2,.8,.2,1);
    }
    .drawer-head {
      display: flex; justify-content: space-between; align-items: center;
      padding: 18px 22px;
      border-bottom: 1px solid var(--linea);
      font-family: 'Playfair Display', serif;
      font-weight: 800; color: var(--uva-900);
      font-size: 18px;
    }
    .drawer-x {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: var(--malva-100);
      color: var(--uva-700);
      font-size: 22px;
      line-height: 1;
    }
    .drawer-links {
      display: flex; flex-direction: column;
      padding: 12px 0;
      flex: 1;
      overflow-y: auto;
    }
    .drawer-links a {
      padding: 14px 22px;
      font-weight: 700; color: var(--texto);
      font-size: 16px;
      border-bottom: 1px solid var(--malva-50);
      transition: background .2s, color .2s;
    }
    .drawer-links a:hover { background: var(--malva-50); color: var(--fresa-600); }
    .drawer-links .link-admin {
      background: var(--uva-900); color: #fff;
      margin: 10px 16px; border-radius: var(--radius);
      border: 0;
    }
    .drawer-links .link-admin:hover { background: var(--uva-800); color: #fff; }
    .drawer-foot {
      padding: 18px 22px;
      border-top: 1px solid var(--linea);
      display: flex; flex-direction: column; gap: 10px;
    }

    @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slide { from { transform: translateX(100%); } to { transform: translateX(0); } }

    @media (max-width: 760px) {
      .acciones { gap: 8px; }
      .carrito { padding: 8px 10px; }
      .carrito strong { min-width: 20px; height: 20px; font-size: 11px; }
      .brand img { width: 34px; height: 34px; }
      .brand span { font-size: 18px; }
    }
    @media (max-width: 380px) {
      .brand span { font-size: 16px; }
      .nav-row { gap: 10px; }
    }
  `]
})
export class NavComponent {
  carrito = inject(CarritoService);
  auth = inject(AuthService);
  router = inject(Router);
  abierto = signal(false);

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.cerrar());
  }

  toggle() { this.abierto.update(v => !v); }
  cerrar() { this.abierto.set(false); }

  async salir() {
    this.cerrar();
    await this.auth.logout();
    this.router.navigate(['/']);
  }

  saludo(): string {
    const n = this.auth.perfil()?.nombre;
    return n ? n.split(' ')[0] : 'Mi cuenta';
  }

  @HostListener('window:keydown.escape')
  onEsc() { this.cerrar(); }
}
