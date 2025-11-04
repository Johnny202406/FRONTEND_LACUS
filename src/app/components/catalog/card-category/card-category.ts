import { Component, inject, Input } from '@angular/core';
import { Brand, Category } from '../../../interfaces';
import { CatalogService } from '../../../services/catalog';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-card-category',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './card-category.html',
  styleUrl: './card-category.css',
})
export class CardCategory {
  catalog = inject(CatalogService);
  @Input() item!: Category | Brand;
}
