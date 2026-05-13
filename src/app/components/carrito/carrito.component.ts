import {
  Component,
  PLATFORM_ID,
  effect,
  inject,
  signal
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  private platformId = inject(PLATFORM_ID);
  carrito = inject(CarritoService);
  auth = inject(AuthService);
  router = inject(Router);

  readonly abierto = signal(false);

  constructor() {
    effect(async () => {
      const open = this.abierto();
      if (!open || !isPlatformBrowser(this.platformId)) return;
      const animeMod: any = await import('animejs');
      const anime = animeMod.animate ?? animeMod.default ?? animeMod;
      anime('.panel-carrito', {
        translateX: [400, 0],
        opacity: [0, 1],
        duration: 450,
        easing: 'easeOutCubic'
      });
    });
  }

  toggle() { this.abierto.update(v => !v); }
  cerrar() { this.abierto.set(false); }

  irACheckout() {
    this.cerrar();
    if (!this.auth.logueado()) {
      this.router.navigate(['/auth/login'], { queryParams: { redirect: '/checkout' } });
      return;
    }
    if (!this.auth.verificado()) {
      this.router.navigate(['/auth/verificar']);
      return;
    }
    this.router.navigate(['/checkout']);
  }
}
