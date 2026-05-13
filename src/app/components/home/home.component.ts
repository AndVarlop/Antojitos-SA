import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { HeroComponent } from '../hero/hero.component';
import { FresasComponent } from '../fresas/fresas.component';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { ContactoComponent } from '../contacto/contacto.component';
import { FooterComponent } from '../footer/footer.component';

// Actualiza este número con el WhatsApp real del negocio
const WA_FLOAT = 'https://wa.me/573014030939?text=' + encodeURIComponent('Hola! Quiero pedir algo de Antojitos S&A 🍓');

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavComponent, HeroComponent, FresasComponent, CatalogoComponent, ContactoComponent, FooterComponent],
  template: `
    <app-nav />
    <main>
      <app-hero />

      <!-- Métricas -->
      <section class="seccion prueba-social" aria-label="Lo que ofrecemos">
        <div class="contenedor metricas">
          <article>
            <span>🍫</span>
            <p>Mecatos, snacks, chocolates y galletas disponibles todos los días.</p>
          </article>
          <article>
            <span>🍓</span>
            <p>Fresas con crema cada viernes. El postre estrella de la oficina.</p>
          </article>
          <article>
            <span>⚡</span>
            <p>Pedidos rápidos por WhatsApp. Sin vueltas, sin complicaciones.</p>
          </article>
          <article>
            <span>❤️</span>
            <p>Hechos con amor para alegrar tu empresa cada día.</p>
          </article>
        </div>
      </section>

      <!-- Fresas con crema - sección premium -->
      <app-fresas />

      <!-- Catálogo -->
      <app-catalogo />

      <!-- Pedidos para empresa -->
      <section class="seccion eventos">
        <div class="contenedor eventos-grid">
          <div class="eventos-copy">
            <p class="seccion-kicker">Para tu empresa 🏢</p>
            <h2 class="seccion-titulo">Mesas dulces, detalles y pedidos por volumen.</h2>
            <p class="seccion-subtitulo">
              Cumpleaños, reuniones, ferias y fechas especiales. Presentación cuidada,
              cantidades a tu medida. El negocio se ve cercano pero funciona con orden.
            </p>
            <a class="btn-oscuro" href="#contacto">Cotizar pedido</a>
          </div>
          <div class="eventos-lista surface">
            <div><strong>🎁 Empaque especial</strong><span>Vasitos sellados, etiquetas y presentación uniforme.</span></div>
            <div><strong>🍬 Variedad de sabores</strong><span>Snacks, chocolates, fresas y sorpresas de temporada.</span></div>
            <div><strong>💬 Respuesta rápida</strong><span>Escríbenos por WhatsApp y coordinamos tu pedido.</span></div>
          </div>
        </div>
      </section>

      <app-contacto />
    </main>
    <app-footer />

    <!-- WhatsApp flotante -->
    <a [href]="wa" class="wa-float" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp">
      <span aria-hidden="true">💬</span>
    </a>
  `,
  styles: [`
    :host { display: block; }
    main { overflow: hidden; }

    .prueba-social { 
    padding: 0; 
    margin-top: 20px; 
    position: relative; 
    z-index: 3; 
    margin-bottom: 30px;
    }
    .metricas {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1px;
      background: var(--linea);
      border: 1px solid var(--linea);
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: var(--sombra-suave);
    }
    .metricas article { background: #fff; padding: 24px; }
    .metricas span { display: block; font-size: 30px; margin-bottom: 10px; }
    .metricas p { margin: 0; color: var(--texto-suave); font-size: 14px; line-height: 1.5; }

    .eventos { background: #fff; }
    .eventos-grid { display: grid; grid-template-columns: .95fr 1.05fr; gap: 48px; align-items: start; }
    .eventos-copy .btn-oscuro { display: inline-flex; margin-top: 28px; }
    .eventos-lista { padding: 12px; display: grid; gap: 10px; }
    .eventos-lista div { padding: 20px 22px; border-radius: var(--radius); background: linear-gradient(135deg, var(--malva-50), #fff); }
    .eventos-lista strong { display: block; color: var(--uva-900); margin-bottom: 7px; font-size: 15px; }
    .eventos-lista span { color: var(--texto-suave); font-size: 14px; line-height: 1.6; }

    /* WhatsApp float */
    .wa-float {
      position: fixed;
      bottom: 26px;
      right: 26px;
      z-index: 200;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: #25d366;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      box-shadow: 0 8px 28px rgba(37,211,102,.48);
      transition: transform .25s ease, box-shadow .25s ease;
      text-decoration: none;
    }
    .wa-float:hover {
      transform: scale(1.12) translateY(-3px);
      box-shadow: 0 16px 44px rgba(37,211,102,.65);
    }

    @media (max-width: 900px) {
      .metricas { grid-template-columns: repeat(2,1fr); }
      .eventos-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 760px) {
      .prueba-social { margin-top: 16px; margin-bottom: 0; }
      .metricas article { padding: 18px 16px; }
      .metricas span { font-size: 24px; margin-bottom: 6px; }
      .metricas p { font-size: 13px; }
      .wa-float { bottom: 20px; right: 20px; width: 52px; height: 52px; font-size: 24px; }
      .eventos-lista div { padding: 16px 18px; }
    }
    @media (max-width: 480px) {
      .metricas { grid-template-columns: repeat(2,1fr); }
    }
    @media (max-width: 380px) {
      .metricas { grid-template-columns: 1fr; }
      .metricas article { padding: 14px; }
    }
  `]
})
export class HomeComponent {
  readonly wa = WA_FLOAT;
}
