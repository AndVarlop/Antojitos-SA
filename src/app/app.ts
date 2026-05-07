import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CarritoComponent } from './components/carrito/carrito.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CarritoComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Antojitos S&A');
}
