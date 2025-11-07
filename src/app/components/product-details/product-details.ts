import { Component, inject } from '@angular/core';
import { ProductDetailsService } from '../../services/product-detail';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

import { SkeletonProductDetail } from './skeleton-product-detail/skeleton-product-detail';

import { CurrencyPipe } from '@angular/common';
import { Auth } from '../../services/auth';
import { CartService } from '../../services/cart';
@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, AccordionModule, TagModule, ButtonModule, SkeletonProductDetail],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  detail = inject(ProductDetailsService);
  auth = inject(Auth);
  cart = inject(CartService);

  tagStyles = {
    
    success: {
      background: '{primary-green}',
      color: '#fff',
    },
    warn: {
      background: '{primary-yellow}',
      color: '#fff',
    },
    danger: {
      background: '{primary-red}',
      color: '#fff',
    },
  };
  dtButton = {
    success: {
      background: '{primary.green}',
      borderColor: '{primary.green}',
    },
    primary: {
      background: '{primary.whiteMy}',
      color: '{primary.green}',
      borderColor: '{primary.green}',
    },
    secondary: {
      background: '{primary.frenchGrey}',
      color: '{primary.whiteMy}',
      borderColor: '{primary.frenchGrey}',
    },
  };
}
