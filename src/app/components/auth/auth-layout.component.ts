import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="auth-wrap">
      <a routerLink="/" class="auth-brand">🍓 Antojitos <em>S&amp;A</em></a>
      <div class="auth-card">
        <router-outlet />
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: var(--gradiente-hero); padding: 40px 20px; }
    .auth-wrap { max-width: 460px; margin: 0 auto; }
    .auth-brand {
      display: block; text-align: center; margin-bottom: 24px;
      font-family: 'Playfair Display', serif; font-size: 28px; color: var(--lila-700);
      font-weight: 700;
    }
    .auth-brand em { color: var(--verde-500); font-style: normal; }
    .auth-card {
      background: white; border-radius: 24px; padding: 40px 32px;
      box-shadow: var(--sombra-fuerte); border: 1px solid var(--lila-100);
    }
  `]
})
export class AuthLayoutComponent {}
