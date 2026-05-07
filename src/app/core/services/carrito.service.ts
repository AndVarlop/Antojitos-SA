import { Injectable, computed, signal } from '@angular/core';
import { ItemCarrito, Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly _items = signal<ItemCarrito[]>([]);

  readonly items = this._items.asReadonly();
  readonly cantidad = computed(() => this._items().reduce((a, i) => a + i.cantidad, 0));
  readonly total = computed(() =>
    this._items().reduce((a, i) => a + i.cantidad * i.producto.precio, 0)
  );

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
