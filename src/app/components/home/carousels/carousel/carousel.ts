import { Component, inject, Input } from '@angular/core';
import { HomeService } from '../../../../services/home';
import { CarouselModule } from 'primeng/carousel';

import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { Product } from '../../../../interfaces';
import { CardProduct } from "../../../catalog/card-product/card-product";
import { SkeletonCardProduct } from "../../../catalog/skeleton-card-product/skeleton-card-product";

@Component({
  selector: 'app-carousel',
  imports: [CarouselModule, ButtonModule, TagModule, SkeletonModule, CardProduct, SkeletonCardProduct],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css'
})
export class Carousel {
   home=inject(HomeService)
  @Input() productos:Product[] = [];
}
