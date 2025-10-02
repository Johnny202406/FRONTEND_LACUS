import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { Header } from "./header/header";
import { Footer } from "./footer/footer";



@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ButtonModule, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('FRONTEND_LACUS');
  

}
