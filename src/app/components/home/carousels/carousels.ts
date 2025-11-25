import { Component, inject } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';

import { ButtonModule } from 'primeng/button';
import { Router,RouterLink } from "@angular/router";
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { CurrencyPipe } from '@angular/common';
import { HomeService } from '../../../services/home';
import { Carousel } from "./carousel/carousel";
import { CardCategory } from "../card-category/card-category";
import { SkeletonCardCategory } from "../skeleton-card-category/skeleton-card-category";
@Component({
  selector: 'app-carousels',
  imports: [CurrencyPipe, SkeletonModule, CarouselModule, ButtonModule, RouterLink, TagModule, Carousel, CardCategory, SkeletonCardCategory],
  templateUrl: './carousels.html',
  styleUrl: './carousels.css',
  
})
export class Carousels {
   home=inject(HomeService)
    router = inject(Router);
   redirectCategory(category: string) {
       window.scrollTo({
         top: 0,
         behavior: 'smooth',
       });
       this.router.navigate(['/categorias', category.toLowerCase()], {
         queryParams: {},
         queryParamsHandling: '',
       });
     }
}
