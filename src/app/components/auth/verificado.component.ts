import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-verificado',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>¡Correo verificado! 🎉</h2>
    <p class="muted">Ya puedes hacer pedidos y solicitar crédito.</p>
    <a routerLink="/" class="btn-primario" style="display:inline-block;margin-top:14px">Ir a la tienda</a>
  `,
  styles: [`
    h2 { color: var(--lila-700); margin-bottom: 10px; }
    .muted { color: var(--texto-suave); margin-bottom: 18px; }
  `]
})
export class VerificadoComponent implements OnInit {
  auth = inject(AuthService);
  async ngOnInit() { await this.auth.cargarPerfil(); }
}
