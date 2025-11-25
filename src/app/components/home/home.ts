import { Component, inject } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { HomeService } from '../../services/home';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { Carousels } from './carousels/carousels';
import { CardPublication } from "./card-publication/card-publication";
import { BestSellingProducts } from "./best-selling-products/best-selling-products";
import { NewProducts } from "./new-products/new-products";
@Component({
  selector: 'app-home',
  imports: [Carousels, SkeletonModule, CarouselModule, ButtonModule, TagModule, CardPublication,BestSellingProducts, NewProducts],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  home=inject(HomeService)
}
