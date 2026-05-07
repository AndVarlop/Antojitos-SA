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
      <app-catalogo />
      <app-contacto />
    </main>
    <app-footer />
  `
})
export class HomeComponent {}
