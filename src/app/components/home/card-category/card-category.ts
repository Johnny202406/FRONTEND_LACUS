import { Component, inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from "@angular/router";
import { Category } from '../../../interfaces';

@Component({
  selector: 'app-card-category',
  imports: [ButtonModule,RouterLink],
  templateUrl: './card-category.html',
  styleUrl: './card-category.css'
})
export class CardCategory {
  @Input() category!: Category
  ;
    router = inject(Router);
  redirectCategory(nombre: string) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    this.router.navigate(['/categorias', nombre.toLowerCase()], {
      queryParams: {},
      queryParamsHandling: '',
    });
  }
}
