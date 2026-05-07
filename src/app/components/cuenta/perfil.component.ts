import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (auth.perfil(); as p) {
      <h2>Mi perfil</h2>
      <form (ngSubmit)="guardar()" class="form">
        <label>
          Nombre
          <input name="nombre" [(ngModel)]="modelo.nombre" required />
        </label>
        <label>
          Teléfono
          <input name="tel" [(ngModel)]="modelo.telefono" />
        </label>
        <label>
          Fecha de nacimiento
          <input name="fn" type="date" [(ngModel)]="modelo.fecha_nacimiento" />
        </label>
        @if (mensaje()) { <div class="alerta-ok">{{ mensaje() }}</div> }
        @if (error()) { <div class="alerta-error">{{ error() }}</div> }
        <button class="btn-primario" type="submit" [disabled]="enviando()">
          {{ enviando() ? 'Guardando…' : 'Guardar cambios' }}
        </button>
      </form>
    }
  `,
  styles: [`
    h2 { color: var(--lila-700); margin-bottom: 22px; }
    .form { display: flex; flex-direction: column; gap: 14px; max-width: 480px; }
    label { display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 500; color: var(--lila-700); }
    input { padding: 12px 14px; border-radius: 12px; border: 1px solid var(--lila-200); font: inherit; outline: none; }
    input:focus { border-color: var(--lila-500); box-shadow: 0 0 0 4px rgba(128,90,213,.12); }
    .alerta-ok { padding: 10px 14px; background: var(--verde-100); color: var(--verde-500); border-radius: 10px; font-size: 14px; }
    .alerta-error { padding: 10px 14px; background: #ffe5ec; color: #b00020; border-radius: 10px; font-size: 14px; }
    button { align-self: flex-start; }
  `]
})
export class PerfilComponent {
  auth = inject(AuthService);
  modelo = {
    nombre: this.auth.perfil()?.nombre ?? '',
    telefono: this.auth.perfil()?.telefono ?? '',
    fecha_nacimiento: this.auth.perfil()?.fecha_nacimiento ?? ''
  };
  enviando = signal(false);
  mensaje = signal<string | null>(null);
  error = signal<string | null>(null);

  async guardar() {
    const uid = this.auth.session()?.user.id;
    if (!uid) return;
    this.enviando.set(true); this.mensaje.set(null); this.error.set(null);
    try {
      const { error } = await this.auth.db.from('clientes').update({
        nombre: this.modelo.nombre,
        telefono: this.modelo.telefono || null,
        fecha_nacimiento: this.modelo.fecha_nacimiento || null
      }).eq('id', uid);
      if (error) throw error;
      this.mensaje.set('Datos actualizados ✓');
      await this.auth.cargarPerfil();
    } catch (e: any) {
      this.error.set(e?.message ?? 'Error');
    } finally {
      this.enviando.set(false);
    }
  }
}
