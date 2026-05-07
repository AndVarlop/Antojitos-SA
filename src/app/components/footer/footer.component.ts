import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="foot">
      <div class="contenedor foot-grid">
        <div><a class="brand" routerLink="/"><img src="/AntojitosS&A.ico" alt="" /><span>Antojitos <em>S&amp;A</em></span></a><p>Fresas con crema y más delicias. Dulces momentos, hechos con amor.</p></div>
        <nav aria-label="Enlaces de pie de página"><a routerLink="/" fragment="catalogo">Menú</a><a routerLink="/checkout">Carrito</a><a routerLink="/auth/login">Clientes</a><a routerLink="/admin/dashboard">Admin</a></nav>
        <div class="legal"><strong>© {{ year }} Antojitos S&amp;A</strong><span>Todos los antojos reservados.</span></div>
      </div>
    </footer>
  `,
  styles: [`
    :host { display: block; }
    .foot { background: var(--uva-900); color: #fff; padding: 42px 0; }
    .foot-grid { display: grid; grid-template-columns: 1.4fr .8fr .8fr; gap: 28px; align-items: start; }
    .brand { display: inline-flex; align-items: center; gap: 10px; color: #fff; }
    .brand img { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; }
    .brand span { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 800; }
    .brand em { color: #ffd5dd; font-style: normal; }
    p { color: rgba(255,255,255,.72); margin: 14px 0 0; max-width: 420px; }
    nav { display: grid; gap: 10px; }
    nav a { color: rgba(255,255,255,.78); font-weight: 700; }
    nav a:hover { color: #fff; }
    .legal { display: grid; gap: 8px; color: rgba(255,255,255,.72); }
    .legal strong { color: #fff; }
    @media (max-width: 760px) { .foot-grid { grid-template-columns: 1fr; } }
  `]
})
export class FooterComponent { year = new Date().getFullYear(); }
