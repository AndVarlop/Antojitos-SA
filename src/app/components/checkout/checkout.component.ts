import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CarritoService } from '../../core/services/carrito.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { DireccionesService } from '../../core/services/direcciones.service';
import { Direccion, MetodoPago } from '../../core/models/cliente.model';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavComponent, FooterComponent],
  template: `
    <app-nav />
    <main class="checkout">
      <div class="contenedor">
        <h1>Finalizar pedido</h1>

        @if (carrito.items().length === 0) {
          <div class="vacio">
            <p>Tu carrito está vacío.</p>
            <a routerLink="/" class="btn-primario">Ver el menú</a>
          </div>
        } @else {
          <div class="grid">
            <section class="bloque">
              <h2>1 · Dirección de entrega</h2>
              @if (direcciones().length === 0) {
                <p class="muted">No tienes direcciones. <a routerLink="/cuenta/direcciones">Agregar una</a>.</p>
              } @else {
                <div class="dirs">
                  @for (d of direcciones(); track d.id) {
                    <label class="dir-opt" [class.sel]="dirSel() === d.id">
                      <input type="radio" name="dir" [value]="d.id"
                        [checked]="dirSel() === d.id"
                        (change)="dirSel.set(d.id)" />
                      <div>
                        <strong>{{ d.etiqueta }}</strong>
                        <span>{{ d.calle }} {{ d.numero }}, {{ d.colonia }}, {{ d.ciudad }}</span>
                      </div>
                    </label>
                  }
                </div>
              }
            </section>

            <section class="bloque">
              <h2>2 · Método de pago</h2>
              <div class="pagos">
                @for (m of metodos; track m.valor) {
                  <label class="pago-opt" [class.sel]="metodo() === m.valor"
                    [class.disabled]="m.valor === 'credito' && disponible() === 0">
                    <input type="radio" name="metodo" [value]="m.valor"
                      [checked]="metodo() === m.valor"
                      [disabled]="m.valor === 'credito' && disponible() === 0"
                      (change)="metodo.set(m.valor)" />
                    <span class="ico">{{ m.icono }}</span>
                    <div>
                      <strong>{{ m.titulo }}</strong>
                      <small>{{ m.desc }}</small>
                    </div>
                  </label>
                }
              </div>

              @if (metodo() === 'credito') {
                <div class="credito-info">
                  Disponible: <strong>$ {{ disponible() | number:'1.2-2' }}</strong>
                  @if (carrito.total() > disponible()) {
                    <div class="alerta-error">Tu crédito disponible no cubre este pedido.</div>
                  }
                </div>
              }
            </section>

            <section class="bloque">
              <h2>3 · Notas (opcional)</h2>
              <textarea [(ngModel)]="notas" name="notas" rows="3" placeholder="Sin chocolate, extra crema, etc."></textarea>
            </section>

            <aside class="resumen">
              <h3>Resumen</h3>
              @for (it of carrito.items(); track it.producto.id) {
                <div class="linea">
                  <span>{{ it.cantidad }}× {{ it.producto.nombre }}</span>
                  <span>$ {{ (it.cantidad * it.producto.precio) | number:'1.2-2' }}</span>
                </div>
              }
              <div class="linea total">
                <span>Total</span>
                <strong>$ {{ carrito.total() | number:'1.2-2' }}</strong>
              </div>

              @if (error()) { <div class="alerta-error">{{ error() }}</div> }
              @if (exitoId()) {
                <div class="alerta-ok">¡Pedido confirmado! ID: {{ exitoId()!.slice(0,8) }}</div>
              }

              <button class="btn-primario" (click)="confirmar()" [disabled]="!puedeConfirmar() || enviando()">
                {{ enviando() ? 'Enviando…' : 'Confirmar pedido' }}
              </button>
              <a routerLink="/" class="btn-fantasma seguir">Seguir comprando</a>
            </aside>
          </div>
        }
      </div>
    </main>
    <app-footer />
  `,
  styles: [`
    :host { display: block; }
    .checkout { padding: 40px 0 80px; }
    h1 { color: var(--lila-700); font-size: 36px; margin-bottom: 28px; }
    h2 { color: var(--lila-700); font-size: 18px; margin-bottom: 14px; }
    h3 { color: var(--lila-700); font-size: 18px; margin-bottom: 14px; }

    .grid { display: grid; grid-template-columns: 1fr 360px; gap: 28px; align-items: start; }
    .bloque { background: white; padding: 24px; border-radius: 16px; border: 1px solid var(--lila-100); margin-bottom: 18px; }

    .dirs, .pagos { display: flex; flex-direction: column; gap: 10px; }
    .dir-opt, .pago-opt {
      display: flex; gap: 12px; align-items: center;
      padding: 14px; border-radius: 12px;
      border: 1px solid var(--lila-200); cursor: pointer;
      transition: all .2s;
    }
    .dir-opt.sel, .pago-opt.sel { border-color: var(--lila-500); background: var(--lila-50); }
    .dir-opt input, .pago-opt input { accent-color: var(--lila-500); }
    .dir-opt strong, .pago-opt strong { display: block; color: var(--lila-700); margin-bottom: 2px; }
    .dir-opt span, .pago-opt small { color: var(--texto-suave); font-size: 13px; }
    .pago-opt.disabled { opacity: .5; cursor: not-allowed; }
    .ico { font-size: 28px; }

    textarea { width: 100%; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--lila-200); font: inherit; outline: none; resize: vertical; }
    textarea:focus { border-color: var(--lila-500); }

    .credito-info { margin-top: 14px; padding: 12px 14px; background: var(--lila-50); border-radius: 12px; font-size: 14px; }
    .alerta-error { padding: 10px 14px; background: #ffe5ec; color: #b00020; border-radius: 10px; font-size: 14px; margin-top: 12px; }
    .alerta-ok { padding: 10px 14px; background: var(--verde-100); color: var(--verde-500); border-radius: 10px; font-size: 14px; margin: 12px 0; }

    .resumen {
      position: sticky; top: 100px;
      background: white; padding: 24px; border-radius: 16px;
      box-shadow: var(--sombra-suave); border: 1px solid var(--lila-100);
    }
    .linea { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
    .linea.total { border-top: 1px solid var(--lila-100); margin-top: 8px; padding-top: 14px; font-size: 18px; }
    .linea.total strong { color: var(--lila-700); }
    .resumen .btn-primario { width: 100%; margin-top: 16px; }
    .seguir { display: block; text-align: center; margin-top: 10px; }

    .vacio { text-align: center; padding: 60px 20px; }
    .vacio p { color: var(--texto-suave); margin-bottom: 18px; }
    .muted { color: var(--texto-suave); }

    @media (max-width: 880px) {
      .grid { grid-template-columns: 1fr; }
      .resumen { position: static; }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  auth = inject(AuthService);
  carrito = inject(CarritoService);
  supa = inject(SupabaseService);
  dirSvc = inject(DireccionesService);
  router = inject(Router);

  direcciones = signal<Direccion[]>([]);
  dirSel = signal<string | null>(null);
  metodo = signal<MetodoPago>('efectivo');
  notas = '';
  enviando = signal(false);
  error = signal<string | null>(null);
  exitoId = signal<string | null>(null);

  metodos: { valor: MetodoPago; titulo: string; desc: string; icono: string }[] = [
    { valor: 'efectivo', titulo: 'Efectivo', desc: 'Pagas al recibir', icono: '💵' },
    { valor: 'tarjeta', titulo: 'Tarjeta', desc: 'En la entrega con terminal', icono: '💳' },
    { valor: 'transferencia', titulo: 'Transferencia', desc: 'Te enviamos los datos', icono: '🏦' },
    { valor: 'credito', titulo: 'Crédito de la tienda', desc: 'Carga a tu cuenta', icono: '⭐' }
  ];

  disponible = computed(() => {
    const p = this.auth.perfil();
    return Math.max((p?.limite_credito ?? 0) - (p?.saldo_credito ?? 0), 0);
  });

  puedeConfirmar = computed(() => {
    if (this.carrito.items().length === 0) return false;
    if (!this.dirSel()) return false;
    if (this.metodo() === 'credito' && this.carrito.total() > this.disponible()) return false;
    return true;
  });

  async ngOnInit() {
    const dirs = await this.dirSvc.listar();
    this.direcciones.set(dirs);
    const pred = dirs.find(d => d.predeterminada) ?? dirs[0];
    if (pred) this.dirSel.set(pred.id);
  }

  async confirmar() {
    this.enviando.set(true); this.error.set(null);
    try {
      const id = await this.supa.crearPedidoAutenticado({
        direccion_id: this.dirSel(),
        metodo_pago: this.metodo(),
        notas: this.notas || undefined,
        items: this.carrito.items().map(i => ({ producto_id: i.producto.id, cantidad: i.cantidad }))
      });
      this.exitoId.set(id);
      this.carrito.limpiar();
      await this.auth.cargarPerfil();
      setTimeout(() => this.router.navigate(['/cuenta/pedidos']), 1500);
    } catch (e: any) {
      this.error.set(e?.message ?? 'Error al crear pedido');
    } finally {
      this.enviando.set(false);
    }
  }
}
