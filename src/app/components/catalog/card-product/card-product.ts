import { Product } from '../../../interfaces';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';

import {  Component, inject, Input } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';

import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { CurrencyPipe } from '@angular/common';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-card-product',
  imports: [
    SelectModule,
    InputNumberModule,
    FormsModule,
    SliderModule,
    Button,
    RouterLink,
    CarouselModule,
    RouterLink,
    ButtonModule,
    TagModule,
    SkeletonModule,
    CurrencyPipe,
  ],
  templateUrl: './card-product.html',
  styleUrl: './card-product.css'
})
export class CardProduct {
  @Input() product!:Product
  cart=inject(CartService)

   tagStyles = {
  root: {
    fontSize: '12px',
    fontWeight: '600',
    padding: '0',
  },
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
  }
};
   dtButton ={
    success: {
      background: '{primary.green}',
      borderColor: '{primary.green}',
    },
    primary: {
      background: '{primary.whiteMy}',
      color: '{primary.green}',
      borderColor: '{primary.green}',
    },
    secondary:{
      background: '{primary.frenchGrey}',
      color: '{primary.whiteMy}',
      borderColor: '{primary.frenchGrey}',
    }
  };
}
