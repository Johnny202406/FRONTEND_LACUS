import { Button } from 'primeng/button';
import { RouterLinkActive, RouterOutlet } from '@angular/router';
import { Bk } from '../../services/bk';
import { RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { User } from '../../interfaces';
import { AfterViewChecked, AfterViewInit, Component, inject, Input, ViewChild } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';

import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { CurrencyPipe } from '@angular/common';
import { CatalogService } from '../../services/catalog';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { DataView, DataViewModule } from 'primeng/dataview';
import { CardProduct } from "./card-product/card-product";
import { SkeletonCardProduct } from "./skeleton-card-product/skeleton-card-product";
import { CardCategory } from "./card-category/card-category";
import { SkeletonCardCategory } from "./skeleton-card-category/skeleton-card-category";
import { Carousel } from './carousel/carousel';

@Component({
  selector: 'app-catalog',
  imports: [
    Carousel,
    DataViewModule,
    SelectModule,
    FloatLabel,
    IconField,
    InputIcon,
    InputNumberModule,
    FormsModule,
    SliderModule,
    Button,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CarouselModule,
    RouterLink,
    ButtonModule,
    TagModule,
    SkeletonModule,
    CurrencyPipe,
    DataViewModule,
    CardProduct,
    SkeletonCardProduct,
    CardCategory,
    SkeletonCardCategory
],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements AfterViewInit,AfterViewChecked {
  hasMenu = true;
  bk = inject(Bk);
  catalog = inject(CatalogService);

  constructor() {
    this.bk.isHandset$.subscribe((value) => {
      this.hasMenu = false;
    });
  }

  toogleMenu() {
    this.hasMenu = !this.hasMenu;
  }
  dtButton = {
    primary: {
      background: '{primary.whiteMy}',
      color: '{primary.blackMy}',
    },
  };
  @ViewChild('dv') dataView!: DataView;

  private dataViewInitialized = false;

  ngAfterViewChecked() {
    if (!this.dataViewInitialized && this.dataView) {
      this.catalog.setDataView(this.dataView);
      this.dataViewInitialized = true;
    }
  }

  ngAfterViewInit() {
    this.catalog.setDataView(this.dataView);
  }
}
