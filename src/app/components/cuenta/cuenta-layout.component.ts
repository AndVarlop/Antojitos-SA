import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-cuenta-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, NavComponent, FooterComponent],
  template: `
    <app-nav />
    <main class="cuenta">
      <div class="contenedor">
        <header class="cuenta-head">
          <h1>Hola, {{ auth.perfil()?.nombre || 'cliente' }} 🍓</h1>
          <p>{{ auth.session()?.user?.email }}</p>
          @if (!auth.verificado()) {
            <div class="aviso">Tu correo aún no está verificado. <a routerLink="/auth/verificar">Verificar ahora</a></div>
          }
        </header>

        <div class="cuenta-grid">
          <nav class="cuenta-nav" aria-label="Navegación de cuenta">
            <a routerLink="/cuenta/perfil" routerLinkActive="activo">Mi perfil</a>
            <a routerLink="/cuenta/pedidos" routerLinkActive="activo">Mis pedidos</a>
            <a routerLink="/cuenta/credito" routerLinkActive="activo">Mi crédito</a>
            <a routerLink="/cuenta/direcciones" routerLinkActive="activo">Direcciones</a>
            <button class="salir" (click)="salir()">Cerrar sesión</button>
          </nav>
          <section class="cuenta-cuerpo">
            <router-outlet />
          </section>
        </div>
      </div>
    </main>
    <app-footer />
  `,
  styles: [`
    :host { display: block; }
    .cuenta { padding: 40px 0 80px; min-height: 70vh; }
    .cuenta-head { margin-bottom: 32px; }
    .cuenta-head h1 { font-size: clamp(26px, 4vw, 36px); color: var(--uva-900); margin-bottom: 4px; }
    .cuenta-head p { color: var(--texto-suave); margin: 0; }
    .aviso {
      margin-top: 14px; padding: 12px 16px;
      background: var(--aviso-bg); color: var(--aviso);
      border-radius: var(--radius-sm); font-size: 14px;
    }
    .aviso a { color: var(--uva-700); font-weight: 700; }

    .cuenta-grid { display: grid; grid-template-columns: 240px 1fr; gap: 32px; align-items: start; }

    .cuenta-nav {
      display: flex; flex-direction: column; gap: 4px;
      position: sticky; top: 90px;
    }
    .cuenta-nav a {
      padding: 12px 16px; border-radius: var(--radius-sm);
      color: var(--texto); font-weight: 600; font-size: 14px;
      transition: all .2s;
    }
    .cuenta-nav a:hover { background: var(--malva-50); color: var(--uva-700); }
    .cuenta-nav a.activo {
      background: var(--malva-100); color: var(--uva-900);
      font-weight: 800;
      box-shadow: inset 3px 0 0 var(--fresa-600);
    }
    .salir {
      margin-top: 18px; padding: 12px 16px; border-radius: var(--radius-sm);
      background: transparent; color: var(--texto-suave); text-align: left;
      font-weight: 600; transition: all .2s;
    }
    .salir:hover { background: var(--error-bg); color: var(--error); }

    .cuenta-cuerpo {
      background: #fff; border-radius: var(--radius);
      padding: 32px;
      box-shadow: var(--sombra-suave);
      border: 1px solid var(--linea);
      min-height: 400px;
    }

    @media (max-width: 768px) {
      .cuenta { padding: 24px 0 60px; }
      .cuenta-head { margin-bottom: 22px; }
      .cuenta-grid { grid-template-columns: 1fr; gap: 18px; }
      .cuenta-nav {
        position: static;
        flex-direction: row;
        overflow-x: auto;
        padding-bottom: 8px;
        gap: 6px;
        -webkit-overflow-scrolling: touch;
      }
      .cuenta-nav::-webkit-scrollbar { display: none; }
      .cuenta-nav a, .salir {
        flex: 0 0 auto;
        margin-top: 0;
        padding: 10px 14px;
        font-size: 13px;
        white-space: nowrap;
      }
      .cuenta-nav a.activo { box-shadow: inset 0 -3px 0 var(--fresa-600); }
      .cuenta-cuerpo { padding: 20px; }
    }
  `]
})
export class CuentaLayoutComponent {
  auth = inject(AuthService);
  router = inject(Router);
  async salir() {
    await this.auth.logout();
    this.router.navigate(['/']);
  }
}
