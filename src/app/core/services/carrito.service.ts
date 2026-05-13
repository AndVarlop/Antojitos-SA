import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ItemCarrito, Producto } from '../models/producto.model';

const STORAGE_KEY = 'antojitos_carrito_v1';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private platformId = inject(PLATFORM_ID);
  private readonly _items = signal<ItemCarrito[]>([]);

  readonly items = this._items.asReadonly();
  readonly cantidad = computed(() => this._items().reduce((a, i) => a + i.cantidad, 0));
  readonly total = computed(() =>
    this._items().reduce((a, i) => a + i.cantidad * i.producto.precio, 0)
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Restaurar desde localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: ItemCarrito[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) this._items.set(parsed);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }

    // Persistir en cada cambio
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
      } catch { /* quota exceeded, ignore */ }
    });
  }

  agregar(p: Producto, cantidad = 1) {
    const list = [...this._items()];
    const idx = list.findIndex(i => i.producto.id === p.id);
    if (idx >= 0) list[idx] = { ...list[idx], cantidad: list[idx].cantidad + cantidad };
    else list.push({ producto: p, cantidad });
    this._items.set(list);
  }

  quitar(id: string) {
    this._items.set(this._items().filter(i => i.producto.id !== id));
  }

  setCantidad(id: string, cantidad: number) {
    if (cantidad <= 0) return this.quitar(id);
    this._items.set(this._items().map(i => (i.producto.id === id ? { ...i, cantidad } : i)));
  }

  limpiar() {
    this._items.set([]);
  }
}
