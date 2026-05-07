import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-verificar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2>Verifica tu correo 💌</h2>
    @if (auth.verificado()) {
      <div class="alerta-ok">¡Listo! Tu correo ya está verificado.</div>
      <a routerLink="/" class="btn-primario" style="margin-top:18px;display:inline-block">Ir a la tienda</a>
    } @else {
      <p class="muted">
        Te enviamos un enlace a <strong>{{ auth.session()?.user?.email }}</strong>.
        Si no lo encuentras, revisa spam o reenvíalo.
      </p>

      <button class="btn-primario" [disabled]="enviando()" (click)="reenviar()">
        {{ enviando() ? 'Enviando…' : 'Reenviar correo' }}
      </button>

      @if (mensaje()) { <div class="alerta-ok">{{ mensaje() }}</div> }
      @if (error()) { <div class="alerta-error">{{ error() }}</div> }

      <div class="auth-links">
        <button class="link" (click)="recargar()">Ya verifiqué — recargar</button>
        <span>·</span>
        <button class="link" (click)="auth.logout()">Salir</button>
      </div>
    }
  `,
  styles: [`
    h2 { color: var(--lila-700); margin-bottom: 12px; }
    .muted { color: var(--texto-suave); margin-bottom: 18px; line-height: 1.6; font-size: 15px; }
    .alerta-ok { padding: 12px; background: var(--verde-100); color: var(--verde-500); border-radius: 12px; font-size: 14px; margin: 14px 0; }
    .alerta-error { padding: 12px; background: #ffe5ec; color: #b00020; border-radius: 12px; font-size: 14px; margin: 14px 0; }
    .auth-links { display: flex; gap: 10px; align-items: center; justify-content: center; margin-top: 18px; font-size: 14px; }
    .link { background: none; color: var(--lila-600); padding: 0; border: 0; cursor: pointer; font: inherit; }
    .link:hover { color: var(--verde-500); }
  `]
})
export class VerificarComponent {
  auth = inject(AuthService);
  enviando = signal(false);
  mensaje = signal<string | null>(null);
  error = signal<string | null>(null);

  async reenviar() {
    const email = this.auth.session()?.user?.email;
    if (!email) { this.error.set('No hay sesión'); return; }
    this.enviando.set(true);
    this.error.set(null);
    try {
      await this.auth.reenviarVerificacion(email);
      this.mensaje.set('Correo reenviado ✓');
    } catch (e: any) {
      this.error.set(e?.message ?? 'No se pudo reenviar');
    } finally {
      this.enviando.set(false);
    }
  }

  async recargar() {
    await this.auth.cargarPerfil();
  }
}
