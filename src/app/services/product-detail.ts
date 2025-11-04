import { inject, Injectable } from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import { Message } from './message';
import {
  Brand,
  EnabledDisabled,
  Publication,
  Category,
  Product,
  ProductImage,
} from '../interfaces';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { FormBuilder, Validators } from '@angular/forms';
import { FileRemoveEvent, FileUpload } from 'primeng/fileupload';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { debounceTime, filter, forkJoin, map, switchMap, throwError } from 'rxjs';
import { DataView, DataViewLazyLoadEvent } from 'primeng/dataview';
@Injectable({
  providedIn: 'root',
})
export class ProductDetailsService {
  API_URL = ENV.API_URL;
  http = inject(HttpClient);
  message = inject(Message);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  product: Product | null = null;
  selectedImage: ProductImage | null = null;
  loadingProduct = true;

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          const parseUrl = this.router.parseUrl(this.router.url);
          return parseUrl.root.children['primary'].segments;
        }),
        filter((segments) => segments[0]?.path === 'producto' && !!segments[1]?.path),
        map((segments) => ({
          path2: segments[1].path,
        })),
        switchMap(({ path2 }) => {
          this.loadingProduct = true;
          return this.http.get<Product>(this.API_URL + 'product/findOneWithStock/' + path2, {
            withCredentials: true,
          });
        })
      )
      .subscribe({
        next: (res) => {
          this.product = res;
          this.selectedImage = this.product.imagenes[0] || 'Image-not-found.webp';
          this.loadingProduct = false;
        },
        error: (err) => {
           this.router.navigate(['/'], {
            queryParams: {},
            queryParamsHandling: '',
          });
          this.message.info({
            summary: 'Producto no encontrado',
            detail: 'Busca otro producto...',
          });
        },
        complete: () => {
          this.loadingProduct = false;
        },
      });
  }
  changeImage(image: ProductImage) {
    this.selectedImage = image;
  }
}
