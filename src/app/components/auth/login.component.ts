import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2>Bienvenido de vuelta 🍓</h2>
    <p class="muted">Inicia sesión para hacer pedidos y ver tu crédito.</p>

    <form (ngSubmit)="entrar()" #f="ngForm" class="auth-form">
      <label>
        Correo
        <input type="email" name="email" [(ngModel)]="email" required autocomplete="email" />
      </label>
      <label>
        Contraseña
        <input type="password" name="password" [(ngModel)]="password" required autocomplete="current-password" />
      </label>

      @if (error()) { <div class="alerta-error">{{ error() }}</div> }

      <button type="submit" class="btn-primario" [disabled]="enviando() || !f.form.valid">
        {{ enviando() ? 'Entrando…' : 'Entrar' }}
      </button>
    </form>

    <div class="auth-links">
      <a routerLink="/auth/recuperar">¿Olvidaste tu contraseña?</a>
      <span>·</span>
      <a routerLink="/auth/registro">Crear cuenta</a>
    </div>
  `,
  styles: [`
    h2 { color: var(--lila-700); margin-bottom: 8px; }
    .muted { color: var(--texto-suave); margin-bottom: 24px; font-size: 14px; }
    .auth-form { display: flex; flex-direction: column; gap: 14px; }
    label { display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 500; color: var(--lila-700); }
    input { padding: 12px 14px; border-radius: 12px; border: 1px solid var(--lila-200); font: inherit; outline: none; }
    input:focus { border-color: var(--lila-500); box-shadow: 0 0 0 4px rgba(128,90,213,.12); }
    .btn-primario { margin-top: 8px; }
    .alerta-error { padding: 10px 14px; background: #ffe5ec; color: #b00020; border-radius: 10px; font-size: 14px; }
    .auth-links { display: flex; gap: 12px; justify-content: center; margin-top: 22px; font-size: 14px; }
  `]
})
export class LoginComponent {
  auth = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  email = '';
  password = '';
  enviando = signal(false);
  error = signal<string | null>(null);

  async entrar() {
    this.enviando.set(true);
    this.error.set(null);
    try {
      await this.auth.login(this.email, this.password);
      const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/';
      this.router.navigateByUrl(redirect);
    } catch (e: any) {
      this.error.set(this.traducir(e?.message));
    } finally {
      this.enviando.set(false);
    }
  }

  private traducir(msg?: string): string {
    if (!msg) return 'Error desconocido';
    if (msg.includes('Invalid login')) return 'Correo o contraseña incorrectos';
    if (msg.includes('Email not confirmed')) return 'Confirma tu correo antes de entrar';
    return msg;
  }
}
