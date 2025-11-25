import { Component, inject } from '@angular/core';
import { Skeleton } from "primeng/skeleton";
import { CarouselModule } from 'primeng/carousel';
import { HomeService } from '../../../services/home';
import { CardProduct } from "../../catalog/card-product/card-product";
import { SkeletonCardProduct } from "../../catalog/skeleton-card-product/skeleton-card-product";

@Component({
  selector: 'app-new-products',
  imports: [Skeleton, CarouselModule, CardProduct, SkeletonCardProduct],
  templateUrl: './new-products.html',
  styleUrl: './new-products.css'
})
export class NewProducts {
   home=inject(HomeService)
    dt={
    content:{
      gap:'20px'
    }
  }
}
