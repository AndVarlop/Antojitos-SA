import { AfterViewInit, Component, ElementRef, PLATFORM_ID, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase.service';
import { CarritoService } from '../../core/services/carrito.service';
import { Producto } from '../../core/models/producto.model';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  supa = inject(SupabaseService);
  carrito = inject(CarritoService);
  @ViewChild('grid') gridRef!: ElementRef<HTMLElement>;
  private animado = false;
  categoria = signal('Todos');
  busqueda = signal('');

  categorias = computed(() => {
    const set = new Set(this.supa.productos().map(p => p.categoria).filter(Boolean));
    return ['Todos', ...Array.from(set)];
  });

  productosFiltrados = computed(() => {
    const cat = this.categoria();
    const q = this.busqueda().trim().toLowerCase();
    return this.supa.productos().filter(p => {
      const porCategoria = cat === 'Todos' || p.categoria === cat;
      const texto = `${p.nombre} ${p.descripcion ?? ''}`.toLowerCase();
      return porCategoria && (!q || texto.includes(q));
    });
  });

  constructor() {
    this.supa.cargarProductos();
    effect(() => {
      const items = this.productosFiltrados();
      if (items.length && !this.animado) queueMicrotask(() => this.animarTarjetas());
    });
  }

  ngAfterViewInit(): void {
    if (this.productosFiltrados().length) this.animarTarjetas();
  }

  agregar(p: Producto, btn: HTMLElement) {
    this.carrito.agregar(p, 1);
    this.pulso(btn);
  }

  seleccionarCategoria(cat: string) {
    this.categoria.set(cat);
    this.animado = false;
    queueMicrotask(() => this.animarTarjetas());
  }

  trackId(_: number, p: Producto) { return p.id; }

  private async animarTarjetas() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.gridRef) return;
    const animeMod: any = await import('animejs');
    const anime = animeMod.animate ?? animeMod.default ?? animeMod;
    this.animado = true;
    anime('.tarjeta', {
      translateY: [28, 0],
      opacity: [0, 1],
      scale: [0.97, 1],
      delay: (_: any, i: number) => i * 75,
      duration: 620,
      easing: 'easeOutCubic'
    });
  }

  private async pulso(el: HTMLElement) {
    if (!isPlatformBrowser(this.platformId)) return;
    const animeMod: any = await import('animejs');
    const anime = animeMod.animate ?? animeMod.default ?? animeMod;
    anime(el, {
      scale: [
        { value: 0.94, duration: 90 },
        { value: 1.04, duration: 140 },
        { value: 1, duration: 180 }
      ],
      easing: 'easeOutQuad'
    });
  }
}
