import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { MovimientoCredito } from '../../core/models/cliente.model';

@Component({
  selector: 'app-credito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Mi crédito</h2>

    @if (auth.perfil(); as p) {
      <div class="resumen">
        <div class="card">
          <span>Límite</span>
          <strong>$ {{ p.limite_credito | number:'1.2-2' }}</strong>
        </div>
        <div class="card">
          <span>Usado</span>
          <strong class="usado">$ {{ p.saldo_credito | number:'1.2-2' }}</strong>
        </div>
        <div class="card destacada">
          <span>Disponible</span>
          <strong>$ {{ disponible() | number:'1.2-2' }}</strong>
        </div>
      </div>

      @if (p.limite_credito > 0) {
        <form (ngSubmit)="abonar()" class="abonar">
          <h3>Abonar a mi crédito</h3>
          <div class="row">
            <input type="number" min="1" step="0.01" [(ngModel)]="monto" name="monto" placeholder="Monto" required />
            <input [(ngModel)]="notas" name="notas" placeholder="Nota (opcional)" />
            <button class="btn-primario" [disabled]="enviando()">
              {{ enviando() ? 'Abonando…' : 'Abonar' }}
            </button>
          </div>
          @if (mensaje()) { <div class="alerta-ok">{{ mensaje() }}</div> }
          @if (error()) { <div class="alerta-error">{{ error() }}</div> }
        </form>
      } @else {
        <div class="aviso">
          Aún no tienes línea de crédito. Pide al equipo que te asigne un límite.
        </div>
      }

      <h3 class="hist-titulo">Movimientos</h3>
      @if (movimientos().length === 0) {
        <p class="muted">Sin movimientos todavía.</p>
      }
      @for (m of movimientos(); track m.id) {
        <div class="mov" [class.cargo]="m.tipo === 'cargo'" [class.abono]="m.tipo === 'abono'">
          <div>
            <strong class="mov-tipo">{{ m.tipo }}</strong>
            <span class="muted">· {{ m.created_at | date:'short' }}</span>
            @if (m.notas) { <span class="muted">· {{ m.notas }}</span> }
          </div>
          <span class="mov-monto">{{ m.tipo === 'abono' ? '−' : '+' }} $ {{ m.monto | number:'1.2-2' }}</span>
        </div>
      }
    }
  `,
  styles: [`
    h2 { color: var(--lila-700); margin-bottom: 22px; }
    .resumen { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 28px; }
    .card { padding: 18px; border-radius: 16px; background: var(--lila-50); display: flex; flex-direction: column; gap: 6px; }
    .card span { color: var(--texto-suave); font-size: 13px; }
    .card strong { font-size: 24px; color: var(--lila-700); }
    .card.destacada { background: var(--gradiente-hero); }
    .card.destacada strong { color: var(--lila-700); }
    .usado { color: var(--rosa-fresa); }

    .abonar { padding: 22px; border-radius: 16px; border: 1px solid var(--lila-100); background: white; margin-bottom: 28px; }
    .abonar h3 { margin: 0 0 12px; color: var(--lila-700); font-size: 16px; }
    .row { display: grid; grid-template-columns: 130px 1fr auto; gap: 10px; }
    input { padding: 12px 14px; border-radius: 12px; border: 1px solid var(--lila-200); font: inherit; outline: none; }
    input:focus { border-color: var(--lila-500); }
    .alerta-ok, .alerta-error { padding: 8px 12px; border-radius: 10px; font-size: 13px; margin-top: 10px; }
    .alerta-ok { background: var(--verde-100); color: var(--verde-500); }
    .alerta-error { background: #ffe5ec; color: #b00020; }

    .aviso { padding: 14px; background: var(--lila-50); color: var(--texto-suave); border-radius: 12px; }
    .hist-titulo { color: var(--lila-700); margin: 16px 0; font-size: 18px; }
    .muted { color: var(--texto-suave); font-size: 13px; }

    .mov { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-bottom: 1px solid var(--lila-100); }
    .mov-tipo { text-transform: capitalize; color: var(--lila-700); }
    .mov-monto { font-weight: 700; }
    .mov.cargo .mov-monto { color: var(--rosa-fresa); }
    .mov.abono .mov-monto { color: var(--verde-500); }

    @media (max-width: 640px) {
      .resumen { grid-template-columns: 1fr; }
      .row { grid-template-columns: 1fr; }
    }
  `]
})
export class CreditoComponent implements OnInit {
  auth = inject(AuthService);
  supa = inject(SupabaseService);

  movimientos = signal<MovimientoCredito[]>([]);
  monto?: number;
  notas = '';
  enviando = signal(false);
  mensaje = signal<string | null>(null);
  error = signal<string | null>(null);

  disponible = computed(() => {
    const p = this.auth.perfil();
    return Math.max((p?.limite_credito ?? 0) - (p?.saldo_credito ?? 0), 0);
  });

  async ngOnInit() {
    this.movimientos.set(await this.supa.movimientosCredito());
  }

  async abonar() {
    if (!this.monto || this.monto <= 0) return;
    this.enviando.set(true); this.mensaje.set(null); this.error.set(null);
    try {
      await this.supa.abonarCredito(this.monto, this.notas || undefined);
      this.mensaje.set('Abono registrado ✓');
      this.movimientos.set(await this.supa.movimientosCredito());
      this.monto = undefined; this.notas = '';
    } catch (e: any) {
      this.error.set(e?.message ?? 'Error');
    } finally {
      this.enviando.set(false);
    }
  }
}
