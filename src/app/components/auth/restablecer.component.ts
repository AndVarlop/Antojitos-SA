import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-restablecer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Nueva contraseña</h2>
    <p class="muted">Crea una contraseña nueva para tu cuenta.</p>

    <form (ngSubmit)="guardar()" #f="ngForm" class="auth-form">
      <label>
        Contraseña
        <input type="password" name="p1" [(ngModel)]="p1" required minlength="6" autocomplete="new-password" />
      </label>
      <label>
        Repetir contraseña
        <input type="password" name="p2" [(ngModel)]="p2" required autocomplete="new-password" />
      </label>
      @if (error()) { <div class="alerta-error">{{ error() }}</div> }
      <button class="btn-primario" type="submit" [disabled]="enviando() || !f.form.valid">
        {{ enviando() ? 'Guardando…' : 'Guardar' }}
      </button>
    </form>
  `,
  styles: [`
    h2 { color: var(--lila-700); margin-bottom: 8px; }
    .muted { color: var(--texto-suave); margin-bottom: 24px; font-size: 14px; }
    .auth-form { display: flex; flex-direction: column; gap: 14px; }
    label { display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 500; color: var(--lila-700); }
    input { padding: 12px 14px; border-radius: 12px; border: 1px solid var(--lila-200); font: inherit; outline: none; }
    input:focus { border-color: var(--lila-500); box-shadow: 0 0 0 4px rgba(128,90,213,.12); }
    .alerta-error { padding: 10px 14px; background: #ffe5ec; color: #b00020; border-radius: 10px; font-size: 14px; }
  `]
})
export class RestablecerComponent {
  auth = inject(AuthService);
  router = inject(Router);
  p1 = '';
  p2 = '';
  enviando = signal(false);
  error = signal<string | null>(null);

  async guardar() {
    if (this.p1 !== this.p2) { this.error.set('Las contraseñas no coinciden'); return; }
    this.enviando.set(true);
    this.error.set(null);
    try {
      await this.auth.actualizarPassword(this.p1);
      this.router.navigate(['/']);
    } catch (e: any) {
      this.error.set(e?.message ?? 'Error');
    } finally {
      this.enviando.set(false);
    }
  }
}
