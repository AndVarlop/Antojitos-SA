import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="foot">
      <div class="contenedor foot-row">
        <p>🍓 Antojitos S&amp;A · Hecho con cariño y mucha crema.</p>
        <p class="muted">© {{ year }} — Todos los antojos reservados.</p>
      </div>
    </footer>
  `,
  styles: [`
    :host { display: block; }
    .foot {
      background: var(--lila-700);
      color: white;
      padding: 36px 0;
      margin-top: 40px;
    }
    .foot-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .muted { opacity: .7; font-size: 14px; }
    p { margin: 0; }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
}
