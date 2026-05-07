import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2>Crea tu cuenta 🍦</h2>
    <p class="muted">Te enviaremos un correo para verificar que eres tú.</p>

    @if (exito()) {
      <div class="alerta-ok">
        ¡Listo! Revisa tu correo <strong>{{ email }}</strong> y haz clic en el enlace de verificación.
      </div>
      <a routerLink="/auth/login" class="btn-fantasma" style="margin-top:16px;display:inline-block">
        Ir a iniciar sesión
      </a>
    } @else {
      <form (ngSubmit)="registrar()" #f="ngForm" class="auth-form">
        <label>
          Nombre
          <input name="nombre" [(ngModel)]="nombre" required minlength="2" />
        </label>
        <label>
          Correo
          <input type="email" name="email" [(ngModel)]="email" required autocomplete="email" />
        </label>
        <label>
          Teléfono
          <input name="telefono" [(ngModel)]="telefono" inputmode="tel" />
        </label>
        <label>
          Contraseña
          <input type="password" name="password" [(ngModel)]="password" required minlength="6" autocomplete="new-password" />
          <small class="hint">Mínimo 6 caracteres</small>
        </label>

        @if (error()) { <div class="alerta-error">{{ error() }}</div> }

        <button type="submit" class="btn-primario" [disabled]="enviando() || !f.form.valid">
          {{ enviando() ? 'Creando…' : 'Crear cuenta' }}
        </button>
      </form>

      <div class="auth-links">
        ¿Ya tienes cuenta? <a routerLink="/auth/login">Inicia sesión</a>
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
    .hint { color: var(--texto-suave); font-weight: 400; font-size: 12px; }
    .btn-primario { margin-top: 8px; }
    .alerta-error { padding: 10px 14px; background: #ffe5ec; color: #b00020; border-radius: 10px; font-size: 14px; }
    .alerta-ok { padding: 14px; background: var(--verde-100); color: var(--verde-500); border-radius: 12px; font-size: 14px; }
    .auth-links { text-align: center; margin-top: 22px; font-size: 14px; color: var(--texto-suave); }
  `]
})
export class RegistroComponent {
  auth = inject(AuthService);
  router = inject(Router);

  nombre = '';
  email = '';
  telefono = '';
  password = '';

  enviando = signal(false);
  error = signal<string | null>(null);
  exito = signal(false);

  async registrar() {
    this.enviando.set(true);
    this.error.set(null);
    try {
      await this.auth.registrar({
        email: this.email,
        password: this.password,
        nombre: this.nombre,
        telefono: this.telefono || undefined
      });
      this.exito.set(true);
    } catch (e: any) {
      this.error.set(this.traducir(e?.message));
    } finally {
      this.enviando.set(false);
    }
  }

  private traducir(msg?: string): string {
    if (!msg) return 'Error al registrar';
    if (msg.includes('already registered')) return 'Ese correo ya está registrado';
    if (msg.toLowerCase().includes('password')) return 'La contraseña no es válida';
    return msg;
  }
}
