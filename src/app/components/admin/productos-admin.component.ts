import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { Producto } from '../../core/models/producto.model';

type Borrador = Partial<Producto>;

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="head">
      <div>
        <h1>Productos</h1>
        <p class="muted">{{ productos().length }} productos</p>
      </div>
      <button class="btn-primario" (click)="nuevo()">+ Nuevo producto</button>
    </header>

    @if (cargando()) { <p>Cargando…</p> }

    <div class="grid">
      @for (p of productos(); track p.id) {
        <article class="card" [class.inactivo]="!p.activo">
          <div class="img" [style.backgroundImage]="'url(' + (p.imagen_url || '') + ')'"></div>
          <div class="cuerpo">
            <h3>{{ p.nombre }}</h3>
            <p class="desc">{{ p.descripcion }}</p>
            <div class="meta">
              <span>$ {{ p.precio | number:'1.2-2' }}</span>
              <span [class.agotado]="p.stock === 0">stock: {{ p.stock }}</span>
              <span class="cat">{{ p.categoria }}</span>
            </div>
            <div class="acciones">
              <button class="link" (click)="editar(p)">Editar</button>
              <button class="link rojo" (click)="eliminar(p)">Eliminar</button>
            </div>
          </div>
        </article>
      }
    </div>

    @if (editando()) {
      <div class="overlay" (click)="cerrar()"></div>
      <aside class="modal">
        <header>
          <h3>{{ b.id ? 'Editar' : 'Nuevo' }} producto</h3>
          <button (click)="cerrar()">✕</button>
        </header>
        <form (ngSubmit)="guardar()">
          <label>Nombre <input [(ngModel)]="b.nombre" name="nombre" required /></label>
          <label>Descripción <textarea [(ngModel)]="b.descripcion" name="desc" rows="3"></textarea></label>
          <div class="row-2">
            <label>Precio <input type="number" min="0" step="0.01" [(ngModel)]="b.precio" name="precio" required /></label>
            <label>Stock <input type="number" min="0" [(ngModel)]="b.stock" name="stock" /></label>
          </div>
          <label>Categoría
            <select [(ngModel)]="b.categoria" name="cat">
              <option value="fresas">Fresas con crema</option>
              <option value="combos">Combos</option>
              <option value="bebidas">Bebidas</option>
              <option value="extras">Extras / toppings</option>
            </select>
          </label>
          <label>URL de imagen <input [(ngModel)]="b.imagen_url" name="img" placeholder="https://…" /></label>
          <label class="check"><input type="checkbox" [(ngModel)]="b.activo" name="activo" /> Activo (visible en tienda)</label>
          @if (error()) { <div class="alerta-error">{{ error() }}</div> }
          <div class="botones">
            <button type="button" class="btn-fantasma" (click)="cerrar()">Cancelar</button>
            <button type="submit" class="btn-primario" [disabled]="enviando()">
              {{ enviando() ? 'Guardando…' : 'Guardar' }}
            </button>
          </div>
        </form>
      </aside>
    }
  `,
  styles: [`
    .head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; }
    h1 { color: var(--lila-700); margin-bottom: 2px; }
    .muted { color: var(--texto-suave); font-size: 14px; margin: 0; }

    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
    .card { background: white; border-radius: 16px; border: 1px solid var(--lila-100); overflow: hidden; transition: all .2s; }
    .card.inactivo { opacity: .55; }
    .img { height: 140px; background-size: cover; background-position: center; background-color: var(--lila-50); }
    .cuerpo { padding: 16px; }
    .cuerpo h3 { color: var(--lila-700); font-size: 16px; margin-bottom: 4px; }
    .desc { font-size: 13px; color: var(--texto-suave); margin: 0 0 10px; line-height: 1.4; max-height: 40px; overflow: hidden; }
    .meta { display: flex; gap: 8px; font-size: 12px; color: var(--texto-suave); flex-wrap: wrap; align-items: center; }
    .meta span:first-child { font-weight: 700; color: var(--lila-700); font-size: 14px; }
    .agotado { color: #b00020; font-weight: 600; }
    .cat { background: var(--lila-50); padding: 2px 8px; border-radius: 999px; }
    .acciones { display: flex; gap: 14px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--lila-100); }
    .link { background: none; color: var(--lila-600); padding: 0; font-size: 13px; }
    .link.rojo { color: #b00020; }

    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 60; }
    .modal { position: fixed; top: 0; right: 0; bottom: 0; width: min(480px, 100%); background: white; padding: 24px; z-index: 70; overflow-y: auto; }
    .modal header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .modal h3 { color: var(--lila-700); }
    .modal header button { background: var(--lila-100); width: 32px; height: 32px; border-radius: 50%; }
    form { display: flex; flex-direction: column; gap: 12px; }
    label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; font-weight: 500; color: var(--lila-700); }
    .check { flex-direction: row; align-items: center; gap: 8px; }
    input, textarea, select { padding: 10px 12px; border-radius: 10px; border: 1px solid var(--lila-200); font: inherit; outline: none; }
    input:focus, textarea:focus, select:focus { border-color: var(--lila-500); }
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .botones { display: flex; gap: 10px; margin-top: 8px; }
    .alerta-error { padding: 8px 12px; background: #ffe5ec; color: #b00020; border-radius: 10px; font-size: 13px; }
  `]
})
export class AdminProductosComponent implements OnInit {
  admin = inject(AdminService);
  productos = signal<Producto[]>([]);
  cargando = signal(false);
  editando = signal(false);
  enviando = signal(false);
  error = signal<string | null>(null);
  b: Borrador = this.vacio();

  async ngOnInit() { await this.cargar(); }

  vacio(): Borrador {
    return { nombre: '', descripcion: '', precio: 0, stock: 0, imagen_url: '', categoria: 'fresas', activo: true };
  }

  async cargar() {
    this.cargando.set(true);
    try { this.productos.set(await this.admin.productos()); }
    finally { this.cargando.set(false); }
  }

  nuevo() { this.b = this.vacio(); this.error.set(null); this.editando.set(true); }
  editar(p: Producto) { this.b = { ...p }; this.error.set(null); this.editando.set(true); }
  cerrar() { this.editando.set(false); }

  async guardar() {
    this.enviando.set(true); this.error.set(null);
    try {
      const datos: Borrador = {
        nombre: this.b.nombre,
        descripcion: this.b.descripcion ?? null,
        precio: Number(this.b.precio ?? 0),
        stock: Number(this.b.stock ?? 0),
        imagen_url: this.b.imagen_url ?? null,
        categoria: this.b.categoria ?? 'fresas',
        activo: this.b.activo ?? true
      };
      if (this.b.id) await this.admin.actualizarProducto(this.b.id, datos);
      else await this.admin.crearProducto(datos);
      this.editando.set(false);
      await this.cargar();
    } catch (e: any) { this.error.set(e?.message ?? 'Error'); }
    finally { this.enviando.set(false); }
  }

  async eliminar(p: Producto) {
    if (!confirm(`¿Eliminar "${p.nombre}"? Esta acción es irreversible.`)) return;
    try {
      await this.admin.eliminarProducto(p.id);
      await this.cargar();
    } catch (e: any) { alert(e?.message ?? 'Error'); }
  }
}
