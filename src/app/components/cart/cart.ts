import { AfterViewChecked, AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { StepperModule } from 'primeng/stepper';
import { CartService } from '../../services/cart';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CardProduct } from './card-product/card-product';
import { SkeletonCardProduct } from './skeleton-card-product/skeleton-card-product';
import { FloatLabel } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import * as L from 'leaflet';
import { Message } from 'primeng/message';
import { Map } from "./map/map";

@Component({
  selector: 'app-cart',
  imports: [
    InputTextModule,
    FileUploadModule,
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    InputNumber,
    StepperModule,
    CardProduct,
    SkeletonCardProduct,
    FloatLabel,
    SelectModule,
    Message,
    Map
],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cart = inject(CartService);
  dtButton = {
    success: {
      background: '{primary.green}',
      borderColor: '{primary.green}',
    },
  };

 
}
