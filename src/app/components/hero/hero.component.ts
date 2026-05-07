import { AfterViewInit, Component, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const animeMod: any = await import('animejs');
    const anime = animeMod.animate ?? animeMod.default ?? animeMod;

    anime('.hero-eyebrow, .hero-sub, .hero-cta, .hero-badges', {
      translateY: [18, 0],
      opacity: [0, 1],
      delay: (_: any, i: number) => 120 + i * 120,
      duration: 780,
      easing: 'easeOutCubic'
    });

    anime('.hero-titulo .palabra', {
      translateY: [70, 0],
      opacity: [0, 1],
      delay: (_: any, i: number) => 160 * i,
      duration: 920,
      easing: 'easeOutExpo'
    });

    anime('.producto-frame', {
      translateY: [32, 0],
      rotate: [5, 2],
      opacity: [0, 1],
      delay: 260,
      duration: 900,
      easing: 'easeOutCubic'
    });

    anime('.pedido-card', {
      translateY: [18, 0],
      opacity: [0, 1],
      delay: 760,
      duration: 700,
      easing: 'easeOutBack'
    });
  }
}
