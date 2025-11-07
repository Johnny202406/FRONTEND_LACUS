import { Component, inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { CartDetail } from '../../../interfaces';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart';
@Component({
  selector: 'app-card-product',
  imports: [RouterLink, FormsModule, ButtonModule, InputNumber, CurrencyPipe, ReactiveFormsModule],
  templateUrl: './card-product.html',
  styleUrl: './card-product.css',
})
export class CardProduct {
  @Input() detail!: CartDetail;
  cart=inject(CartService)
}
