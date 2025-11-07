import { inject, Injectable } from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import { Message } from './message';
import { Brand, EnabledDisabled, Publication, Category } from '../interfaces';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { FormBuilder, Validators } from '@angular/forms';
import { FileRemoveEvent, FileUpload } from 'primeng/fileupload';
export interface TableHeader {
  label: string;
  width: string;
}
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  API_URL = ENV.API_URL;
  http = inject(HttpClient);
  message = inject(Message);

  publications: Publication[] = this.createArray(6, {}) as Publication[];
  loadingPublications = true;
  categorys: Category[] = this.createArray(6, { productos: this.createArray(6, {}) }) as Category[];
  loadingCategory = true;

  constructor() {
    this.http
      .get(this.API_URL + 'publication/findAll', { withCredentials: true })
      .subscribe((res) => {
        this.publications = res as Publication[];
        this.loadingPublications = false;
      });
    this.http
      .get(this.API_URL + 'category/findLastCategoriesWithProducts', { withCredentials: true })
      .subscribe((res) => {
        this.categorys = res as Category[];
        this.loadingCategory = false;
      });
  }
  createArray(count: number, payload?: any) {
    return Array.from({ length: count }).fill(payload);
  }
  responsiveOptions = [
    {
      breakpoint: '4000px',
      numVisible: 5,
      numScroll: 1,
    },
    {
      breakpoint: '3000px',
      numVisible: 5,
      numScroll: 1,
    },
    {
      breakpoint: '2400px',
      numVisible: 5,
      numScroll: 1,
    },
    {
      breakpoint: '1920px',
      numVisible: 5,
      numScroll: 1,
    },
    {
      breakpoint: '1400px',
      numVisible: 5,
      numScroll: 1,
    },
    {
      breakpoint: '1199px',
      numVisible: 4,
      numScroll: 1,
    },
    {
      breakpoint: '970px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '800px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '600px',
      numVisible: 1,
      numScroll: 1,
    },
  ];
}
