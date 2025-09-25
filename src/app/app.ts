import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Count } from "./count/count";
import { Result } from "./result/result";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Count, Result],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('FRONTEND_LACUS');
}
