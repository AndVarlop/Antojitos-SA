import {
  AfterViewInit,
  Component,
  ElementRef,
  PLATFORM_ID,
  ViewChild,
  inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  @ViewChild('seccion') secRef!: ElementRef<HTMLElement>;

  enviado = false;
  modelo = { nombre: '', mensaje: '', telefono: '' };

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const obs = new IntersectionObserver(async entries => {
      const e = entries[0];
      if (!e.isIntersecting) return;
      const animeMod: any = await import('animejs');
      const anime = animeMod.animate ?? animeMod.default ?? animeMod;
      anime('.contacto-card .anim', {
        translateY: [30, 0],
        opacity: [0, 1],
        delay: (_: any, i: number) => i * 110,
        duration: 700,
        easing: 'easeOutCubic'
      });
      obs.disconnect();
    }, { threshold: 0.25 });

    obs.observe(this.secRef.nativeElement);
  }

  enviar() {
    this.enviado = true;
    setTimeout(() => (this.enviado = false), 4000);
  }
}
