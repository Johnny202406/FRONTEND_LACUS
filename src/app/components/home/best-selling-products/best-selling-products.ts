import { Component, inject } from '@angular/core';
import { Skeleton } from "primeng/skeleton";
import { CarouselModule } from 'primeng/carousel';
import { HomeService } from '../../../services/home';
import { CardProduct } from "../../catalog/card-product/card-product";
import { SkeletonCardProduct } from "../../catalog/skeleton-card-product/skeleton-card-product";

@Component({
  selector: 'app-best-selling-products',
  imports: [Skeleton, CarouselModule, CardProduct, SkeletonCardProduct],
  templateUrl: './best-selling-products.html',
  styleUrl: './best-selling-products.css'
})
export class BestSellingProducts {
    home=inject(HomeService)
      dt={
      content:{
        gap:'20px'
      }
    }
}
