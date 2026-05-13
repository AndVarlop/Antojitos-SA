import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Actualiza este número con el WhatsApp real del negocio
const WA_NUMBER = '573014030939';

@Component({
  selector: 'app-fresas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fresas.component.html',
  styleUrl: './fresas.component.css'
})
export class FresasComponent {
  readonly hoyEsViernes: boolean;
  readonly proximoViernes: string;
  readonly whatsappUrl: string;
  readonly whatsappUrlToppings: string;

  constructor() {
    const hoy = new Date();
    this.hoyEsViernes = hoy.getDay() === 5;
    this.proximoViernes = this.calcProximoViernes(hoy);
    this.whatsappUrl = this.buildUrl('Hola! Quiero pedir unas fresas con crema para este viernes 🍓');
    this.whatsappUrlToppings = this.buildUrl('Hola! Quiero pedir unas fresas con crema CON TOPPINGS para este viernes 🍓✨');
  }

  private calcProximoViernes(hoy: Date): string {
    const dia = hoy.getDay();
    if (dia === 5) return 'hoy';
    const diff = dia < 5 ? 5 - dia : 7 - dia + 5;
    const viernes = new Date(hoy);
    viernes.setDate(hoy.getDate() + diff);
    return viernes.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  private buildUrl(msg: string): string {
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  }
}
