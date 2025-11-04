import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from "@angular/router";
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
}
