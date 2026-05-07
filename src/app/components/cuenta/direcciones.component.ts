import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DireccionesService } from '../../core/services/direcciones.service';
import { Direccion } from '../../core/models/cliente.model';

type Borrador = Partial<Direccion>;

@Component({
  selector: 'app-direcciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Mis direcciones</h2>

    <div class="lista">
      @for (d of direcciones(); track d.id) {
        <div class="dir" [class.predet]="d.predeterminada">
          <div>
            <strong>{{ d.etiqueta }}</strong>
            @if (d.predeterminada) { <span class="badge">Predeterminada</span> }
            <p>{{ d.calle }} {{ d.numero }}, {{ d.colonia }}, {{ d.ciudad }} {{ d.cp }}</p>
            @if (d.referencias) { <small>{{ d.referencias }}</small> }
          </div>
          <div class="acciones">
            @if (!d.predeterminada) {
              <button class="link" (click)="setPred(d.id)">Marcar predeterminada</button>
            }
            <button class="link rojo" (click)="eliminar(d.id)">Eliminar</button>
          </div>
        </div>
      }
      @if (direcciones().length === 0) {
        <p class="muted">No tienes direcciones guardadas.</p>
      }
    </div>

    @if (!agregando()) {
      <button class="btn-fantasma" (click)="agregando.set(true)">+ Agregar dirección</button>
    } @else {
      <form (ngSubmit)="guardar()" class="form">
        <h3>Nueva dirección</h3>
        <div class="row-2">
          <label>Etiqueta <input name="et" [(ngModel)]="b.etiqueta" required /></label>
          <label>Calle <input name="ca" [(ngModel)]="b.calle" required /></label>
        </div>
        <div class="row-3">
          <label>Número <input name="num" [(ngModel)]="b.numero" /></label>
          <label>Colonia <input name="col" [(ngModel)]="b.colonia" /></label>
          <label>CP <input name="cp" [(ngModel)]="b.cp" /></label>
        </div>
        <div class="row-2">
          <label>Ciudad <input name="ci" [(ngModel)]="b.ciudad" required /></label>
          <label>Estado <input name="ed" [(ngModel)]="b.estado" /></label>
        </div>
        <label>Referencias <input name="ref" [(ngModel)]="b.referencias" /></label>
        <label class="check">
          <input type="checkbox" name="pred" [(ngModel)]="b.predeterminada" /> Marcar como predeterminada
        </label>
        @if (error()) { <div class="alerta-error">{{ error() }}</div> }
        <div class="botones">
          <button type="button" class="btn-fantasma" (click)="cancelar()">Cancelar</button>
          <button type="submit" class="btn-primario" [disabled]="enviando()">
            {{ enviando() ? 'Guardando…' : 'Guardar' }}
          </button>
        </div>
      </form>
    }
  `,
  styles: [`
    h2 { color: var(--lila-700); margin-bottom: 22px; }
    h3 { color: var(--lila-700); margin-bottom: 10px; font-size: 16px; }
    .lista { display: flex; flex-direction: column; gap: 12px; margin-bottom: 18px; }
    .dir {
      padding: 16px; border-radius: 14px; border: 1px solid var(--lila-100);
      display: flex; justify-content: space-between; gap: 16px;
    }
    .dir.predet { border-color: var(--lila-300); background: var(--lila-50); }
    .dir strong { color: var(--lila-700); }
    .dir p { margin: 6px 0 0; color: var(--texto); font-size: 14px; }
    .dir small { color: var(--texto-suave); }
    .badge { background: var(--verde-100); color: var(--verde-500); font-size: 11px; padding: 3px 8px; border-radius: 999px; margin-left: 6px; }
    .acciones { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
    .link { background: none; padding: 4px 0; color: var(--lila-600); font-size: 13px; text-align: right; }
    .link:hover { color: var(--verde-500); }
    .link.rojo { color: #b00020; }

    .form { display: flex; flex-direction: column; gap: 12px; padding: 22px; border-radius: 16px; border: 1px solid var(--lila-100); background: white; margin-top: 14px; }
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
    label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--lila-700); font-weight: 500; }
    .check { flex-direction: row; align-items: center; gap: 8px; }
    input[type="text"], input:not([type]), input[type="email"] { padding: 10px 12px; }
    input { padding: 10px 12px; border-radius: 10px; border: 1px solid var(--lila-200); font: inherit; outline: none; }
    input:focus { border-color: var(--lila-500); }
    .botones { display: flex; gap: 10px; }
    .alerta-error { padding: 8px 12px; background: #ffe5ec; color: #b00020; border-radius: 10px; font-size: 13px; }
    .muted { color: var(--texto-suave); }
    @media (max-width: 640px) { .row-2, .row-3 { grid-template-columns: 1fr; } }
  `]
})
export class DireccionesComponent implements OnInit {
  service = inject(DireccionesService);

  direcciones = signal<Direccion[]>([]);
  agregando = signal(false);
  enviando = signal(false);
  error = signal<string | null>(null);
  b: Borrador = this.vacio();

  async ngOnInit() { await this.recargar(); }

  vacio(): Borrador {
    return { etiqueta: 'Casa', ciudad: '', calle: '', numero: '', colonia: '', cp: '', referencias: '', predeterminada: false };
  }

  cancelar() { this.agregando.set(false); this.b = this.vacio(); this.error.set(null); }

  async recargar() {
    this.direcciones.set(await this.service.listar());
  }

  async guardar() {
    this.enviando.set(true); this.error.set(null);
    try {
      const creada = await this.service.crear(this.b);
      if (creada.predeterminada) await this.service.setPredeterminada(creada.id);
      this.cancelar();
      await this.recargar();
    } catch (e: any) {
      this.error.set(e?.message ?? 'Error');
    } finally {
      this.enviando.set(false);
    }
  }

  async setPred(id: string) {
    await this.service.setPredeterminada(id);
    await this.recargar();
  }

  async eliminar(id: string) {
    if (!confirm('¿Eliminar esta dirección?')) return;
    await this.service.eliminar(id);
    await this.recargar();
  }
}
