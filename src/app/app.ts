import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { Header } from "./header/header";
import { Footer } from "./footer/footer";

import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ButtonModule, Header, Footer,ToastModule,ConfirmPopupModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('FRONTEND_LACUS');
  
}
