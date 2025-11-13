import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css'
})
export class Map implements OnInit{
  cart = inject(CartService);

  ngOnInit(){
    this.cart.initMap()
  }
}
