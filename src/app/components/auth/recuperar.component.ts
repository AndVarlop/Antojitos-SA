import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2>Recuperar contraseña</h2>
    <p class="muted">Te enviaremos un enlace para crear una nueva.</p>

    @if (enviado()) {
      <div class="alerta-ok">Revisa tu correo <strong>{{ email }}</strong>.</div>
      <a routerLink="/auth/login" class="btn-fantasma" style="margin-top:14px;display:inline-block">
        Volver al login
      </a>
    } @else {
      <form (ngSubmit)="enviar()" #f="ngForm" class="auth-form">
        <label>
          Correo
          <input type="email" name="email" [(ngModel)]="email" required />
        </label>
        @if (error()) { <div class="alerta-error">{{ error() }}</div> }
        <button class="btn-primario" type="submit" [disabled]="enviando() || !f.form.valid">
          {{ enviando() ? 'Enviando…' : 'Enviar enlace' }}
        </button>
      </form>
      <div class="auth-links">
        <a routerLink="/auth/login">← Volver</a>
      </div>
    }
  `,
  styles: [`
    h2 { color: var(--lila-700); margin-bottom: 8px; }
    .muted { color: var(--texto-suave); margin-bottom: 24px; font-size: 14px; }
    .auth-form { display: flex; flex-direction: column; gap: 14px; }
    label { display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 500; color: var(--lila-700); }
    input { padding: 12px 14px; border-radius: 12px; border: 1px solid var(--lila-200); font: inherit; outline: none; }
    input:focus { border-color: var(--lila-500); box-shadow: 0 0 0 4px rgba(128,90,213,.12); }
    .alerta-ok { padding: 12px; background: var(--verde-100); color: var(--verde-500); border-radius: 12px; font-size: 14px; }
    .alerta-error { padding: 10px 14px; background: #ffe5ec; color: #b00020; border-radius: 10px; font-size: 14px; }
    .auth-links { text-align: center; margin-top: 18px; font-size: 14px; }
  `]
})
export class RecuperarComponent {
  auth = inject(AuthService);
  email = '';
  enviando = signal(false);
  enviado = signal(false);
  error = signal<string | null>(null);

  async enviar() {
    this.enviando.set(true);
    this.error.set(null);
    try {
      await this.auth.recuperarPassword(this.email);
      this.enviado.set(true);
    } catch (e: any) {
      this.error.set(e?.message ?? 'Error');
    } finally {
      this.enviando.set(false);
    }
  }
}
