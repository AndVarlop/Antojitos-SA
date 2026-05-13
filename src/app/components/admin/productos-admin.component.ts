import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { Producto } from '../../core/models/producto.model';

type Borrador = Partial<Producto>;

const CATEGORIAS = [
  { val: 'Snacks',       ico: '🍟' },
  { val: 'Dulces',       ico: '🍬' },
  { val: 'Chocolates',   ico: '🍫' },
  { val: 'Galletas',     ico: '🍪' },
  { val: 'Bebidas',      ico: '🥤' },
  { val: 'Fresas',       ico: '🍓' },
  { val: 'Mecatos',      ico: '🧂' },
  { val: 'Especiales',   ico: '⭐' },
];

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="prod">

      <!-- Header -->
      <div class="prod-head">
        <div>
          <h1>Productos</h1>
          <p class="sub">{{ productos().length }} productos registrados</p>
        </div>
        <button class="btn-primario" (click)="nuevo()">+ Nuevo producto</button>
      </div>

      <!-- Filtro categorías -->
      <div class="cat-filtros">
        <button [class.activo]="catFiltro() === ''" (click)="catFiltro.set('')">Todos</button>
        @for (c of CATS; track c.val) {
          <button [class.activo]="catFiltro() === c.val" (click)="catFiltro.set(c.val)">
            {{ c.ico }} {{ c.val }}
          </button>
        }
      </div>

      @if (cargando()) {
        <div class="grid">
          @for (i of [1,2,3,4,5,6]; track i) { <div class="card-skel"></div> }
        </div>
      }

      @if (!cargando()) {
        @if (productosFiltrados().length === 0) {
          <div class="empty">
            <span>🛍️</span>
            <p>Sin productos en esta categoría.</p>
          </div>
        } @else {
          <div class="grid">
            @for (p of productosFiltrados(); track p.id) {
              <article class="card" [class.inactivo]="!p.activo">
                <div class="card-img" [style.backgroundImage]="p.imagen_url ? 'url(' + p.imagen_url + ')' : null">
                  <span class="cat-badge">{{ catIco(p.categoria) }} {{ p.categoria }}</span>
                  @if (!p.activo) { <span class="inactivo-badge">Inactivo</span> }
                  @if (p.stock === 0) { <span class="stock-badge">Agotado</span> }
                </div>

                <div class="card-body">
                  <h3>{{ p.nombre }}</h3>
                  @if (p.descripcion) { <p class="desc">{{ p.descripcion }}</p> }

                  <div class="card-meta">
                    <span class="precio">$ {{p.precio | number:'1.0-0' }}</span>
                    <span class="stock" [class.stock-bajo]="p.stock > 0 && p.stock <= 5" [class.stock-off]="p.stock === 0">
                      Stock: {{ p.stock }}
                    </span>
                  </div>

                  <div class="card-acciones">
                    <button class="ac-btn ac-edit" (click)="editar(p)">✏️ Editar</button>
                    <button class="ac-btn ac-del"
                      [disabled]="eliminando()"
                      [title]="p.activo ? 'Desactivar producto' : 'Ya está inactivo'"
                      (click)="pedirConfirmacion(p)">
                      {{ p.activo ? '🚫' : '✅' }}
                    </button>
                  </div>
                </div>
              </article>
            }
          </div>
        }
      }

      <!-- Modal -->
      @if (editando()) {
        <div class="overlay" (click)="cerrar()"></div>
        <aside class="modal">

          <div class="modal-head">
            <h3>{{ b.id ? 'Editar' : 'Nuevo' }} producto</h3>
            <button class="cerrar-btn" (click)="cerrar()">✕</button>
          </div>

          <form class="modal-body" (ngSubmit)="guardar()">

            <!-- Preview imagen -->
            <div class="img-preview" [style.backgroundImage]="b.imagen_url ? 'url(' + b.imagen_url + ')' : null"
              [class.uploading]="subiendo()">
              @if (subiendo()) {
                <div class="upload-overlay">
                  <span class="spinner"></span>
                  <small>Subiendo…</small>
                </div>
              } @else if (!b.imagen_url) {
                <span>📷 Sin imagen</span>
              }
            </div>

            <!-- File picker -->
            <div class="upload-zona">
              <label class="upload-btn" [class.disabled]="subiendo()">
                <input type="file" accept="image/*" (change)="onFileChange($event)" [disabled]="subiendo()" />
                {{ subiendo() ? 'Subiendo…' : '📤 Subir imagen' }}
              </label>
              @if (errorUpload()) {
                <span class="upload-error">{{ errorUpload() }}</span>
              }
              @if (b.imagen_url && !subiendo()) {
                <button type="button" class="upload-quitar" (click)="quitarImagen()">✕ Quitar</button>
              }
            </div>

            <!-- URL manual como fallback -->
            <details class="url-fallback">
              <summary>O pegar URL externa</summary>
              <input [(ngModel)]="b.imagen_url" name="img" placeholder="https://…" />
            </details>

            <div class="field">
              <label>Nombre *</label>
              <input [(ngModel)]="b.nombre" name="nombre" required placeholder="Ej: Fresas con crema clásica" />
            </div>

            <div class="field">
              <label>Descripción</label>
              <textarea [(ngModel)]="b.descripcion" name="desc" rows="2" placeholder="Descripción breve del producto"></textarea>
            </div>

            <div class="row-2">
              <div class="field">
                <label>Precio (COP) *</label>
                <input type="number" min="0" step="100" [(ngModel)]="b.precio" name="precio" required placeholder="8000" />
              </div>
              <div class="field">
                <label>Stock</label>
                <input type="number" min="0" [(ngModel)]="b.stock" name="stock" placeholder="0" />
              </div>
            </div>

            <div class="field">
              <label>Categoría</label>
              <div class="cat-picker">
                @for (c of CATS; track c.val) {
                  <button type="button"
                    [class.cat-sel]="b.categoria === c.val"
                    (click)="b.categoria = c.val">
                    {{ c.ico }} {{ c.val }}
                  </button>
                }
              </div>
            </div>

            <label class="toggle-field">
              <span>Visible en la tienda</span>
              <div class="toggle" [class.on]="b.activo" (click)="b.activo = !b.activo">
                <span class="toggle-dot"></span>
              </div>
            </label>

            @if (error()) { <div class="alerta-error">{{ error() }}</div> }

            <div class="modal-foot">
              <button type="button" class="btn-fantasma" (click)="cerrar()">Cancelar</button>
              <button type="submit" class="btn-primario" [disabled]="enviando() || subiendo()">
                {{ enviando() ? 'Guardando…' : subiendo() ? 'Esperando imagen…' : (b.id ? 'Guardar cambios' : 'Crear producto') }}
              </button>
            </div>

          </form>
        </aside>
      }

      <!-- Modal de confirmación de eliminación -->
      @if (aEliminar()) {
        <div class="overlay del-overlay" (click)="cancelarEliminar()"></div>
        <div class="del-modal">
          <div class="del-ico">🚫</div>
          <h3>¿Desactivar producto?</h3>
          <p class="del-nombre">{{ aEliminar()!.nombre }}</p>
          <p class="del-aviso">El producto dejará de mostrarse en la tienda. Puedes reactivarlo en cualquier momento editándolo.</p>

          @if (errorEliminar()) {
            <div class="del-error">❌ {{ errorEliminar() }}</div>
          }

          <div class="del-btns">
            <button class="btn-fantasma" (click)="cancelarEliminar()" [disabled]="eliminando()">
              Cancelar
            </button>
            <button class="del-btn-confirmar" (click)="confirmarEliminar()" [disabled]="eliminando()">
              @if (eliminando()) { <span class="spinner"></span> Desactivando… }
              @else { Sí, desactivar }
            </button>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    .prod { max-width: 1100px; }

    .prod-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      gap: 14px;
    }

    h1 { font-size: clamp(20px, 4vw, 28px); color: var(--uva-900); margin: 0 0 4px; }
    .sub { color: var(--texto-suave); margin: 0; font-size: 13px; }

    /* Cat filtros */
    .cat-filtros {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }

    .cat-filtros button {
      padding: 6px 13px;
      border-radius: 8px;
      border: 1px solid rgba(95,52,120,.12);
      background: #fff;
      color: var(--texto-suave);
      font-size: 13px;
      font-weight: 600;
      transition: all .18s;
    }
    .cat-filtros button:hover { border-color: var(--fresa-300); color: var(--fresa-600); }
    .cat-filtros button.activo { background: var(--uva-900); color: #fff; border-color: transparent; }

    /* Grid */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }

    .card-skel {
      height: 280px;
      border-radius: 14px;
      background: linear-gradient(90deg, #f8f7fc, #f0eef8, #f8f7fc);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
    }
    @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

    .card {
      background: #fff;
      border: 1px solid rgba(95,52,120,.10);
      border-radius: 14px;
      overflow: hidden;
      transition: all .22s;
      box-shadow: 0 2px 10px rgba(76,42,91,.05);
    }
    .card:hover { transform: translateY(-4px); box-shadow: 0 14px 32px rgba(76,42,91,.12); border-color: rgba(201,54,79,.2); }
    .card.inactivo { opacity: .55; filter: grayscale(.3); }

    .card-img {
      height: 150px;
      background-size: cover;
      background-position: center;
      background-color: var(--malva-100);
      background-image: linear-gradient(135deg, var(--fresa-100), var(--malva-100));
      position: relative;
    }

    .cat-badge {
      position: absolute;
      bottom: 10px; left: 10px;
      background: rgba(255,255,255,.9);
      color: var(--uva-700);
      font-size: 11px;
      font-weight: 700;
      padding: 3px 9px;
      border-radius: 999px;
    }

    .inactivo-badge, .stock-badge {
      position: absolute;
      top: 10px; right: 10px;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 9px;
      border-radius: 999px;
    }
    .inactivo-badge { background: rgba(0,0,0,.5); color: #fff; }
    .stock-badge { background: #ffe5ec; color: #b00020; }

    .card-body { padding: 14px 16px; }
    .card-body h3 { font-size: 15px; color: var(--uva-900); margin: 0 0 6px; }
    .desc { font-size: 12.5px; color: var(--texto-suave); margin: 0 0 10px; line-height: 1.45; max-height: 36px; overflow: hidden; }

    .card-meta { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
    .precio { font-size: 16px; font-weight: 800; color: var(--fresa-600); }
    .stock { font-size: 12px; font-weight: 600; color: var(--hoja-700); }
    .stock.stock-bajo { color: var(--cacao); }
    .stock.stock-off { color: #b00020; }

    .card-acciones { display: flex; gap: 8px; border-top: 1px solid rgba(95,52,120,.08); padding-top: 10px; }
    .ac-btn { padding: 6px 12px; border-radius: 8px; font-size: 12.5px; font-weight: 600; transition: all .18s; }
    .ac-edit { flex: 1; background: var(--malva-50); color: var(--uva-700); border: 1px solid rgba(95,52,120,.14); }
    .ac-edit:hover { background: var(--malva-100); }
    .ac-del { background: #ffe5ec; color: #b00020; border: 1px solid rgba(176,0,32,.15); }
    .ac-del:hover { background: #ffd0db; }

    .empty { text-align: center; padding: 60px 20px; color: var(--texto-suave); }
    .empty span { font-size: 40px; display: block; margin-bottom: 12px; }

    /* Modal */
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 60; }
    .modal {
      position: fixed;
      top: 0; right: 0; bottom: 0;
      width: min(500px, 100vw);
      background: #fff;
      z-index: 70;
      display: flex;
      flex-direction: column;
      box-shadow: -16px 0 50px rgba(76,42,91,.18);
      animation: slideIn .28s cubic-bezier(.2,.8,.2,1);
    }
    @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }

    .modal-head {
      padding: 18px 20px;
      border-bottom: 1px solid rgba(95,52,120,.10);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #faf9ff;
    }
    .modal-head h3 { color: var(--uva-900); margin: 0; font-size: 18px; }

    .cerrar-btn {
      background: var(--malva-100); color: var(--uva-700);
      width: 32px; height: 32px; border-radius: 50%; font-size: 14px;
    }

    .modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .img-preview {
      height: 140px;
      border-radius: 12px;
      background-color: var(--malva-50);
      background-size: cover;
      background-position: center;
      border: 2px dashed rgba(95,52,120,.18);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--texto-suave);
      font-size: 13px;
      position: relative;
      overflow: hidden;
      transition: border-color .2s;
    }
    .img-preview.uploading { border-color: var(--fresa-300); }

    .upload-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,.85);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--uva-700);
    }
    .upload-overlay small { font-size: 13px; font-weight: 600; }

    .upload-zona {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .upload-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 16px;
      border-radius: 10px;
      background: var(--malva-50);
      border: 1px solid rgba(95,52,120,.2);
      color: var(--uva-700);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all .18s;
    }
    .upload-btn:hover { background: var(--malva-100); }
    .upload-btn.disabled { opacity: .55; cursor: not-allowed; }
    .upload-btn input[type="file"] { display: none; }

    .upload-error {
      color: #b00020;
      font-size: 12px;
      flex: 1;
    }

    .upload-quitar {
      background: none;
      color: var(--texto-suave);
      font-size: 12px;
      padding: 0;
    }
    .upload-quitar:hover { color: #b00020; }

    .url-fallback {
      border: 1px solid rgba(95,52,120,.12);
      border-radius: 10px;
      padding: 0;
      overflow: hidden;
    }
    .url-fallback summary {
      padding: 9px 12px;
      font-size: 12px;
      color: var(--texto-suave);
      cursor: pointer;
      font-weight: 600;
      user-select: none;
      list-style: none;
    }
    .url-fallback summary::-webkit-details-marker { display: none; }
    .url-fallback summary::before { content: '▶ '; font-size: 10px; }
    .url-fallback[open] summary::before { content: '▼ '; }
    .url-fallback input {
      display: block;
      width: 100%;
      padding: 10px 12px;
      border: none;
      border-top: 1px solid rgba(95,52,120,.10);
      font: inherit;
      font-size: 13px;
      outline: none;
      background: var(--malva-50);
    }

    .field { display: flex; flex-direction: column; gap: 5px; }
    .field label { font-size: 12px; font-weight: 700; color: var(--uva-700); letter-spacing: .3px; text-transform: uppercase; }
    .field input, .field textarea, .field select {
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid rgba(95,52,120,.18);
      font: inherit;
      font-size: 14px;
      outline: none;
      transition: border-color .2s, box-shadow .2s;
      resize: vertical;
    }
    .field input:focus, .field textarea:focus {
      border-color: rgba(201,54,79,.45);
      box-shadow: 0 0 0 3px rgba(201,54,79,.10);
    }

    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    .cat-picker { display: flex; flex-wrap: wrap; gap: 6px; }
    .cat-picker button {
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid rgba(95,52,120,.15);
      background: #fff;
      color: var(--texto-suave);
      font-size: 12.5px;
      font-weight: 600;
      transition: all .18s;
    }
    .cat-picker button:hover { border-color: var(--fresa-300); color: var(--fresa-600); }
    .cat-picker button.cat-sel { background: var(--uva-900); color: #fff; border-color: transparent; }

    .toggle-field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px;
      background: var(--malva-50);
      border-radius: 10px;
      border: 1px solid rgba(95,52,120,.12);
    }
    .toggle-field span { font-size: 14px; font-weight: 600; color: var(--uva-900); }

    .toggle {
      width: 44px; height: 24px;
      border-radius: 999px;
      background: rgba(95,52,120,.2);
      position: relative;
      cursor: pointer;
      transition: background .25s;
    }
    .toggle.on { background: var(--fresa-600); }
    .toggle-dot {
      position: absolute;
      top: 3px; left: 3px;
      width: 18px; height: 18px;
      border-radius: 50%;
      background: #fff;
      transition: transform .25s;
      box-shadow: 0 2px 4px rgba(0,0,0,.15);
    }
    .toggle.on .toggle-dot { transform: translateX(20px); }

    .alerta-error {
      padding: 10px 14px;
      background: #ffe5ec;
      color: #b00020;
      border-radius: 10px;
      font-size: 13px;
    }

    .modal-foot {
      display: flex;
      gap: 10px;
      padding: 16px 20px;
      border-top: 1px solid rgba(95,52,120,.10);
      background: #faf9ff;
      margin: 0 -20px -14px;
    }
    .modal-foot .btn-fantasma { flex: 1; }
    .modal-foot .btn-primario { flex: 2; }

    /* ── Delete confirmation modal ── */
    .del-overlay { z-index: 80; background: rgba(0,0,0,.55); }

    .del-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 90;
      width: min(420px, calc(100vw - 32px));
      background: #fff;
      border-radius: 18px;
      padding: 32px 28px 24px;
      text-align: center;
      box-shadow: 0 32px 80px rgba(0,0,0,.28);
      animation: popIn .22s cubic-bezier(.34,1.56,.64,1);
    }

    @keyframes popIn {
      from { opacity: 0; transform: translate(-50%, -50%) scale(.88); }
      to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }

    .del-ico { font-size: 42px; margin-bottom: 14px; }

    .del-modal h3 {
      font-size: 20px;
      color: var(--uva-900);
      margin: 0 0 8px;
    }

    .del-nombre {
      font-size: 15px;
      font-weight: 700;
      color: var(--fresa-600);
      margin: 0 0 12px;
      padding: 6px 12px;
      background: var(--fresa-50);
      border-radius: 8px;
      display: inline-block;
    }

    .del-aviso {
      font-size: 13px;
      color: var(--texto-suave);
      margin: 0 0 20px;
      line-height: 1.55;
    }

    .del-error {
      background: #ffe5ec;
      color: #b00020;
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 13px;
      margin-bottom: 16px;
      text-align: left;
    }

    .del-btns {
      display: flex;
      gap: 10px;
    }
    .del-btns .btn-fantasma { flex: 1; }

    .del-btn-confirmar {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 46px;
      padding: 12px 20px;
      border-radius: 999px;
      background: linear-gradient(135deg, #e53935, #b00020);
      color: #fff;
      font-weight: 700;
      font-size: 14px;
      transition: all .22s;
      box-shadow: 0 8px 22px rgba(176,0,32,.3);
    }
    .del-btn-confirmar:hover { transform: translateY(-1px); box-shadow: 0 12px 30px rgba(176,0,32,.42); }
    .del-btn-confirmar:disabled { opacity: .65; cursor: not-allowed; transform: none; }

    .spinner {
      display: inline-block;
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,.35);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin .7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 760px) {
      .prod-head { flex-direction: column; }
      .prod-head .btn-primario { width: 100%; }
      .grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .modal { width: 100vw; }
      .row-2 { grid-template-columns: 1fr; }
      .del-btns { flex-direction: column; }
    }

    @media (max-width: 420px) {
      .grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminProductosComponent implements OnInit {
  admin = inject(AdminService);
  readonly CATS = CATEGORIAS;
  productos = signal<Producto[]>([]);
  catFiltro = signal('');
  cargando = signal(false);
  editando = signal(false);
  enviando = signal(false);
  error = signal<string | null>(null);
  b: Borrador = this.vacio();

  // Upload
  subiendo = signal(false);
  errorUpload = signal<string | null>(null);

  // Delete flow
  aEliminar = signal<Producto | null>(null);
  eliminando = signal(false);
  errorEliminar = signal<string | null>(null);

  productosFiltrados() {
    const cat = this.catFiltro();
    if (!cat) return this.productos();
    return this.productos().filter(p => p.categoria === cat);
  }

  catIco(cat: string): string {
    return CATEGORIAS.find(c => c.val === cat)?.ico ?? '📦';
  }

  async ngOnInit() { await this.cargar(); }

  vacio(): Borrador {
    return { nombre: '', descripcion: '', precio: 0, stock: 0, imagen_url: '', categoria: 'Snacks', activo: true };
  }

  async cargar() {
    this.cargando.set(true);
    try { this.productos.set(await this.admin.productos()); }
    finally { this.cargando.set(false); }
  }

  nuevo() {
    this.b = this.vacio();
    this.error.set(null);
    this.errorUpload.set(null);
    this.editando.set(true);
  }

  editar(p: Producto) {
    this.b = { ...p };
    this.error.set(null);
    this.errorUpload.set(null);
    this.editando.set(true);
  }

  cerrar() { this.editando.set(false); }

  quitarImagen() { this.b.imagen_url = ''; }

  async onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const MAX_MB = 5;
    if (file.size > MAX_MB * 1024 * 1024) {
      this.errorUpload.set(`Imagen muy grande (máx ${MAX_MB} MB).`);
      return;
    }
    const TIPOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!TIPOS.includes(file.type)) {
      this.errorUpload.set('Solo JPG, PNG, WebP o GIF.');
      return;
    }

    this.subiendo.set(true);
    this.errorUpload.set(null);
    try {
      const url = await this.admin.subirImagenProducto(file);
      this.b.imagen_url = url;
    } catch (e: any) {
      this.errorUpload.set(e?.message ?? 'Error al subir imagen');
    } finally {
      this.subiendo.set(false);
      input.value = '';
    }
  }

  async guardar() {
    this.enviando.set(true); this.error.set(null);
    try {
      const datos: Borrador = {
        nombre: this.b.nombre?.trim() || '',
        descripcion: this.b.descripcion?.trim() ?? null,
        precio: Number(this.b.precio ?? 0),
        stock: Number(this.b.stock ?? 0),
        imagen_url: this.b.imagen_url?.trim() || null,
        categoria: this.b.categoria ?? 'Snacks',
        activo: this.b.activo ?? true
      };
      if (!datos.nombre) throw new Error('El nombre es obligatorio');
      if ((datos.precio as number) < 0) throw new Error('El precio no puede ser negativo');
      if (this.b.id) await this.admin.actualizarProducto(this.b.id, datos);
      else await this.admin.crearProducto(datos);
      this.editando.set(false);
      await this.cargar();
    } catch (e: any) { this.error.set(e?.message ?? 'Error al guardar'); }
    finally { this.enviando.set(false); }
  }

  // ── Delete flow ──
  pedirConfirmacion(p: Producto) {
    if (this.eliminando()) return;
    // Si ya está inactivo, reactivar directamente sin modal
    if (!p.activo) {
      this.toggleActivo(p, true);
      return;
    }
    this.errorEliminar.set(null);
    this.aEliminar.set(p);
  }

  async toggleActivo(p: Producto, activo: boolean) {
    if (this.eliminando()) return;
    this.eliminando.set(true);
    try {
      await this.admin.actualizarProducto(p.id, { activo });
      this.productos.update(list =>
        list.map(x => x.id === p.id ? { ...x, activo } : x)
      );
    } catch (e: any) {
      console.error('Error toggling activo:', e?.message);
    } finally {
      this.eliminando.set(false);
    }
  }

  cancelarEliminar() {
    if (this.eliminando()) return;
    this.aEliminar.set(null);
    this.errorEliminar.set(null);
  }

  async confirmarEliminar() {
    const p = this.aEliminar();
    if (!p || this.eliminando()) return;

    this.eliminando.set(true);
    this.errorEliminar.set(null);
    try {
      // Desactivar, no eliminar — seguro con FK constraints y reversible
      await this.admin.actualizarProducto(p.id, { activo: false });
      // Optimistic update: marcar inactivo sin recargar
      this.productos.update(list =>
        list.map(x => x.id === p.id ? { ...x, activo: false } : x)
      );
      this.aEliminar.set(null);
    } catch (e: any) {
      this.errorEliminar.set(e?.message ?? 'Error al desactivar');
    } finally {
      this.eliminando.set(false);
    }
  }
}
