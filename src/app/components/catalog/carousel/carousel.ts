import { Component, inject } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { CatalogService } from '../../../services/catalog';
import { CardCategory } from '../card-category/card-category';
import { SkeletonCardCategory } from '../skeleton-card-category/skeleton-card-category';

@Component({
  selector: 'app-carousel',
  imports: [CarouselModule,CardCategory,SkeletonCardCategory],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css',
})
export class Carousel {
  catalog = inject(CatalogService);
}
