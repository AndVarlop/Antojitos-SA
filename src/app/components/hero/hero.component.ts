import {
  AfterViewInit,
  Component,
  ElementRef,
  PLATFORM_ID,
  ViewChild,
  inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  @ViewChild('hero') heroRef!: ElementRef<HTMLElement>;

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const animeMod: any = await import('animejs');
    const anime = animeMod.animate ?? animeMod.default ?? animeMod;

    anime('.hero-titulo .palabra', {
      translateY: [60, 0],
      opacity: [0, 1],
      delay: (_: any, i: number) => 120 * i,
      duration: 900,
      easing: 'easeOutExpo'
    });

    anime('.hero-sub', {
      opacity: [0, 1],
      translateY: [20, 0],
      delay: 600,
      duration: 800,
      easing: 'easeOutQuad'
    });

    anime('.hero-cta a, .hero-cta button', {
      opacity: [0, 1],
      scale: [0.85, 1],
      delay: (_: any, i: number) => 800 + i * 150,
      duration: 700,
      easing: 'easeOutBack'
    });

    anime('.fresa-flotante', {
      translateY: [
        { value: -14, duration: 2200 },
        { value: 0, duration: 2200 }
      ],
      rotate: [
        { value: 6, duration: 2200 },
        { value: -6, duration: 2200 }
      ],
      easing: 'easeInOutSine',
      loop: true,
      delay: (_: any, i: number) => i * 400
    });
  }
}
