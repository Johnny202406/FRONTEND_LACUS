import { inject, Injectable } from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import { Message } from './message';
import { Brand, Category, Discount, EnabledDisabled, Product, ProductImage } from '../interfaces';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { FormBuilder, Validators } from '@angular/forms';
import { FileRemoveEvent, FileUpload } from 'primeng/fileupload';
import { Confirmation } from './confirmation';
import { PrimeNG } from 'primeng/config';

export interface TableHeader {
  label: string;
  width: string;
}
@Injectable({
  providedIn: 'root',

})
export class ProductService {
  API_URL = ENV.API_URL;
  http = inject(HttpClient);
  message = inject(Message);
  confirmation = inject(Confirmation);
  formBuilder = inject(FormBuilder);
  config = inject(PrimeNG);

  loading = true;

  headers: TableHeader[] = [
    { label: 'Código', width: '20%' },
    { label: 'Nombre', width: '30%' },
    { label: 'Descripción', width: '30%' },
    { label: 'Marca', width: '20%' },
    { label: 'Categoría', width: '20%' },
    { label: 'Peso_kg', width: '10%' },
    { label: 'Precio', width: '10%' },
    { label: 'Descuento', width: '10%' },
    { label: 'Precio Final', width: '10%' },
    { label: 'Stock', width: '10%' },
    { label: 'Habilitado', width: '5%' },
    { label: 'Opciones', width: '15%' },
  ];
 

  products: Product[] = [];
  count: number = 0;
  searchByCodeOrName: string | null = null;
  enabled: EnabledDisabled[] = EnabledDisabled;
  selectedEnabled: EnabledDisabled | null = null;
  discount: Discount[] = Discount;
  selectedDiscount: Discount | null = null;
  categorysAll: Category[] = [];
  selectedCategory: Category | null = null;
  brandsAll: Brand[] = [];
  selectedBrand: Brand | null = null;


  constructor() {
    this.getProducts();
    this.http
      .get(this.API_URL + 'category/findAll', {
        withCredentials: true,
      })
      .subscribe((res) => {
        this.categorysAll = res as Category[];
      });
  
    this.http
      .get(this.API_URL + 'brand/findAll', {
        withCredentials: true,
      })
      .subscribe((res) => {
        this.brandsAll = res as Brand[];
      });
  
  }







  getProducts() {
    this.loading = true;
    const body: any = {
      ...(this.searchByCodeOrName && { searchByCodeOrName: this.searchByCodeOrName }),
      ...(this.selectedEnabled && { enabled: this.selectedEnabled.value }),
      ...(this.selectedDiscount && { discount: this.selectedDiscount.value }),
      ...(this.selectedCategory && { id_category: this.selectedCategory.id }),
      ...(this.selectedBrand && { id_brand: this.selectedBrand.id }),
    };
    this.http
      .post(this.API_URL + 'product/findByAdminWithStock', body, { withCredentials: true })
      .subscribe({
        next: (res) => {
          const [products, count] = res as [Product[], number];
          this.products = products;
          this.count = count;
        },
        error: (res) => {},
        complete: () => {
          this.loading = false;
        },
      });
  }

  resetFilters() {
    this.searchByCodeOrName = null;
    this.selectedEnabled = null;
    this.selectedDiscount = null;
    this.selectedCategory = null;
    this.selectedBrand = null;
  }

 
 



  

}
