import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { HeroComponent } from '../hero/hero.component';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { ContactoComponent } from '../contacto/contacto.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavComponent, HeroComponent, CatalogoComponent, ContactoComponent, FooterComponent],
  template: `
    <app-nav />
    <main>
      <app-hero />
      <section class="seccion prueba-social" aria-label="Indicadores de calidad">
        <div class="contenedor metricas">
          <article><span>24h</span><p>Fresas seleccionadas y crema preparada a diario.</p></article>
          <article><span>4.9/5</span><p>Experiencia dulce, puntual y bien presentada.</p></article>
          <article><span>+12</span><p>Toppings, combinaciones y sabores para eventos.</p></article>
          <article><span>100%</span><p>Pedidos conectados a catálogo, carrito y cuenta.</p></article>
        </div>
      </section>
      <section id="experiencia" class="seccion experiencia">
        <div class="contenedor experiencia-grid">
          <div>
            <p class="seccion-kicker">Experiencia Antojitos</p>
            <h2 class="seccion-titulo">Postres frescos con presentación de marca seria.</h2>
            <p class="seccion-subtitulo">Antojitos S&amp;A opera como tienda boutique: catálogo vivo, carrito, cuentas de cliente, crédito interno y panel administrativo conectado a Supabase.</p>
          </div>
          <div class="proceso">
            <article><b>01</b><h3>Selección</h3><p>Fruta visible, crema suave y toppings ordenados por disponibilidad.</p></article>
            <article><b>02</b><h3>Pedido</h3><p>Cliente compra, guarda direcciones y consulta historial desde su cuenta.</p></article>
            <article><b>03</b><h3>Entrega</h3><p>Resumen limpio, método de pago claro y flujo listo para crecer.</p></article>
          </div>
        </div>
      </section>
      <app-catalogo />
      <section class="seccion eventos">
        <div class="contenedor eventos-grid">
          <div class="eventos-copy">
            <p class="seccion-kicker">Eventos y empresas</p>
            <h2 class="seccion-titulo">Mesas dulces, detalles corporativos y pedidos por volumen.</h2>
            <p class="seccion-subtitulo">Presentación cuidada para cumpleaños, oficinas, ferias y fechas especiales. El negocio se ve cercano, pero funciona con orden.</p>
            <a class="btn-oscuro" href="#contacto">Cotizar evento</a>
          </div>
          <div class="eventos-lista surface">
            <div><strong>Empaque premium</strong><span>Vasitos sellados, etiquetas y presentación uniforme.</span></div>
            <div><strong>Sabores por temporada</strong><span>Especiales con chocolate, crema, fruta y topping.</span></div>
            <div><strong>Atención rápida</strong><span>Formulario directo para pedidos grandes y alianzas.</span></div>
          </div>
        </div>
      </section>
      <app-contacto />
    </main>
    <app-footer />
  `,
  styles: [`
    :host { display: block; } main { overflow: hidden; }
    .prueba-social { padding: 0; margin-top: -42px; position: relative; z-index: 3; }
    .metricas { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--linea); border: 1px solid var(--linea); border-radius: var(--radius); overflow: hidden; box-shadow: var(--sombra-suave); }
    .metricas article { background: #fff; padding: 24px; }
    .metricas span { display: block; color: var(--fresa-600); font-size: 28px; font-weight: 800; }
    .metricas p { margin: 8px 0 0; color: var(--texto-suave); font-size: 14px; }
    .experiencia { background: linear-gradient(180deg, var(--crema) 0%, #fff 100%); }
    .experiencia-grid, .eventos-grid { display: grid; grid-template-columns: .95fr 1.05fr; gap: 42px; align-items: start; }
    .proceso { display: grid; gap: 14px; }
    .proceso article { padding: 24px; border: 1px solid var(--linea); border-radius: var(--radius); background: #fff; box-shadow: 0 12px 26px rgba(76,42,91,.08); }
    .proceso b { color: var(--fresa-600); letter-spacing: 2px; font-size: 12px; }
    .proceso h3 { font-size: 24px; color: var(--uva-900); margin-top: 8px; }
    .proceso p { margin: 8px 0 0; color: var(--texto-suave); }
    .eventos { background: #fff; }
    .eventos-copy .btn-oscuro { margin-top: 26px; }
    .eventos-lista { padding: 12px; display: grid; gap: 10px; }
    .eventos-lista div { padding: 20px; border-radius: var(--radius); background: linear-gradient(135deg, var(--malva-50), #fff); }
    .eventos-lista strong { display: block; color: var(--uva-900); margin-bottom: 6px; }
    .eventos-lista span { color: var(--texto-suave); font-size: 14px; line-height: 1.6; }
    @media (max-width: 900px) { .metricas { grid-template-columns: repeat(2,1fr); } .experiencia-grid, .eventos-grid { grid-template-columns: 1fr; } }
    @media (max-width: 560px) { .prueba-social { margin-top: -24px; } .metricas { grid-template-columns: 1fr; } }
  `]
})
export class HomeComponent { }
