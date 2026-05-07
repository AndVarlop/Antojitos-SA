import {
  AfterViewInit,
  Component,
  ElementRef,
  PLATFORM_ID,
  ViewChild,
  effect,
  inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';
import { CarritoService } from '../../core/services/carrito.service';
import { Producto } from '../../core/models/producto.model';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  supa = inject(SupabaseService);
  carrito = inject(CarritoService);

  @ViewChild('grid') gridRef!: ElementRef<HTMLElement>;
  private animado = false;

  constructor() {
    this.supa.cargarProductos();
    effect(() => {
      const items = this.supa.productos();
      if (items.length && !this.animado) {
        queueMicrotask(() => this.animarTarjetas());
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.supa.productos().length) this.animarTarjetas();
  }

  agregar(p: Producto, btn: HTMLElement) {
    this.carrito.agregar(p, 1);
    this.pulso(btn);
  }

  trackId(_: number, p: Producto) { return p.id; }

  private async animarTarjetas() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.gridRef) return;
    const animeMod: any = await import('animejs');
    const anime = animeMod.animate ?? animeMod.default ?? animeMod;
    this.animado = true;

    anime('.tarjeta', {
      translateY: [40, 0],
      opacity: [0, 1],
      scale: [0.92, 1],
      delay: (_: any, i: number) => i * 100,
      duration: 700,
      easing: 'easeOutCubic'
    });
  }

  private async pulso(el: HTMLElement) {
    if (!isPlatformBrowser(this.platformId)) return;
    const animeMod: any = await import('animejs');
    const anime = animeMod.animate ?? animeMod.default ?? animeMod;
    anime(el, {
      scale: [
        { value: 0.9, duration: 100 },
        { value: 1.05, duration: 150 },
        { value: 1, duration: 200 }
      ],
      easing: 'easeOutQuad'
    });
  }
}
