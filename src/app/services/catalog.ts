import { inject, Injectable } from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import { Message } from './message';
import { Brand, EnabledDisabled, Publication, Category, Product } from '../interfaces';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { FormBuilder, Validators } from '@angular/forms';
import { FileRemoveEvent, FileUpload } from 'primeng/fileupload';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { debounceTime, filter, forkJoin, switchMap } from 'rxjs';
import { DataView, DataViewLazyLoadEvent } from 'primeng/dataview';
export interface TableHeader {
  label: string;
  width: string;
}

export interface Sort {
  label: string;
  queryParam: string;
  columnSort: string;
  valueSort: number;
}

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  API_URL = ENV.API_URL;
  http = inject(HttpClient);
  message = inject(Message);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  enumPageSize = [5, 10, 15];

  // component
  dataView: DataView | null = null;
   setDataView(dataView: DataView) {
      this.dataView = dataView;
    }

  isSearch: boolean = false;

  CategoryOrBrandCache: Map<string, Category[] | Brand[]> = new Map<string, Category[] | Brand[]>();
  routerLinkCategoryOrBrand: string = '';
  dataCategoryOrBrand: Category[] | Brand[] = this.createArray(6, {}) as Category[] | Brand[];
  loadingCategoryOrBrand: boolean = true;

  dataCatalog: Product[] = this.createArray(6, {}) as Product[];
  page: number = 1;
  pageSize: number = 5;
  count: number = 0;
  loadingDataCatalog = true;

  sorts: Sort[] = [
    {
      label: 'Precio - a +',
      queryParam: 'price_asc',
      columnSort: 'precio',
      valueSort: 1,
    },
    {
      label: 'Precio + a -',
      queryParam: 'price_desc',
      columnSort: 'precio',
      valueSort: -1,
    },
    {
      label: 'Nombre A a Z',
      queryParam: 'name_asc',
      columnSort: 'nombre',
      valueSort: 1,
    },
    {
      label: 'Nombre Z a A',
      queryParam: 'name_desc',
      columnSort: 'nombre',
      valueSort: -1,
    },
    {
      label: 'Descuento - a +',
      queryParam: 'discount_asc',
      columnSort: 'porcentaje_descuento',
      valueSort: 1,
    },
    {
      label: 'Descuento + a -',
      queryParam: 'discount_desc',
      columnSort: 'porcentaje_descuento',
      valueSort: -1,
    },
  ];
  selectedSort: Sort | null = null;
  minValue: number = 0;
  maxValue: number = 1000;

  rango: number[] = [0, 1000];

  onSliderChange() {
    this.minValue = this.rango[0];
    this.maxValue = this.rango[1];
    this.search();
  }

  onInputChange() {
    this.rango = [this.minValue, this.maxValue];
    this.search();
  }

  lazyLoad(event: DataViewLazyLoadEvent) {
    this.pageSize = event.rows ?? 5;
    this.page = Math.floor((event.first ?? 0) / this.pageSize) + 1;
    this.navigate();
  }
  navigate() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        ...(this.page !== 1 && { page: this.page }),
        ...(this.pageSize !== 5 && { pageSize: this.pageSize }),
        ...(this.minValue !== 0 && { minValue: this.minValue }),
        ...(this.maxValue !== 1000 && { maxValue: this.maxValue }),
        ...(this.selectedSort !== null && { sort: this.selectedSort.queryParam }),
      },
      queryParamsHandling: '',
    });
  }
  search() {
    this.page = 1;
    if (this.dataView) {
      this.dataView.first = 0;
    }
    this.navigate();
  }

  constructor() {
    forkJoin({
      categories: this.http.get(this.API_URL + 'category/findAllEnabled', {
        withCredentials: true,
      }),
      brands: this.http.get(this.API_URL + 'brand/findAllEnabled', { withCredentials: true }),
    }).subscribe(({ categories, brands }) => {
      this.loadingCategoryOrBrand = true;
      const categoriesAll = [
        { nombre: '', secure_url: 'todo.webp' },
        ...(categories as Category[]),
      ] as Category[];
      const brandsAll = [
        { nombre: '', secure_url: 'todo.webp' },
        ...(brands as Brand[]),
      ] as Brand[];

      this.CategoryOrBrandCache?.set('categorias', categoriesAll);
      this.CategoryOrBrandCache?.set('marcas', brandsAll);
      const parseUrl = this.router.parseUrl(this.router.url);
      const [segment1] = parseUrl.root.children['primary'].segments;
      const path1 = segment1.path;
      this.dataCategoryOrBrand =
        path1 === 'categorias' || path1 === 'marcas'
          ? (this.CategoryOrBrandCache.get(path1) as Category[] | Brand[])
          : this.createArray(6,{} ) as Category[];
      this.routerLinkCategoryOrBrand = path1;
      this.loadingCategoryOrBrand = false;
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        switchMap((value, index) => {
          this.loadingDataCatalog = true;
          const parseUrl = this.router.parseUrl(this.router.url);
          const [segment1, segment2 = { path: null }] = parseUrl.root.children['primary'].segments;
          const path1 = segment1.path;
          this.isSearch = path1 === 'busqueda' ? true : false;
          this.dataCategoryOrBrand =
            path1 === 'categorias' || path1 === 'marcas'
              ? (this.CategoryOrBrandCache.get(path1) as Category[] | Brand[]||this.createArray(6,{} ) as Category[])
              : this.createArray(6,{} ) as Category[];
          this.routerLinkCategoryOrBrand = path1;

          const path2 = segment2.path;
          const page = Number(parseUrl.queryParamMap.get('page'));
          const pageSize = Number(parseUrl.queryParamMap.get('pageSize'));
          const minValue = Number(parseUrl.queryParamMap.get('minValue'));
          const maxValue = Number(parseUrl.queryParamMap.get('maxValue'));
          const sort = parseUrl.queryParamMap.get('sort')?.trim().toLowerCase();

          this.page = !Number.isNaN(page) && page > 0 ? page : 1;
          this.pageSize = !Number.isNaN(pageSize) && pageSize > 0 ? pageSize : 5;
          this.minValue =
            !Number.isNaN(minValue) && minValue >= 0 && minValue < maxValue ? minValue : 0;
          this.maxValue =
            !Number.isNaN(maxValue) && maxValue <= 1000 && maxValue > minValue ? maxValue : 1000;
          this.selectedSort = this.sorts.find((s) => s.queryParam === sort) ?? null;
          this.rango = [this.minValue, this.maxValue];

          const body = {
            page: this.page,
            pageSize: this.pageSize,
            ...(path2 && { searchByBrandOrCategoryOrName: path2 }),
            minValue: this.minValue,
            maxValue: this.maxValue,
            ...(this.selectedSort && { columnSort: this.selectedSort.columnSort }),
            ...(this.selectedSort && { valueSort: this.selectedSort.valueSort }),
          };
          return this.http.post<[Product[], number]>(
            this.API_URL + 'product/catalog/' + path1,
            body,
            {
              withCredentials: true,
            }
          );
        })
      )
      .subscribe((res) => {
        const [data, count] = res;
        this.dataCatalog = data;
        this.count = count;
        this.loadingDataCatalog = false;
      });
  }
  createArray(count: number, payload?: any) {
    return Array.from({ length: count }).fill(payload);
  }
  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 4,
      numScroll: 1,
    },
    {
      breakpoint: '1199px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '767px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1,
    },
  ];
  searchByNameOrCode(value:string|null) {
    const searchInput = value?.trim().toLowerCase();
    if (searchInput) {
      this.router.navigate(['/busqueda', searchInput], {
        queryParams: {},
        queryParamsHandling: '', 
      });
    }
  }
}
