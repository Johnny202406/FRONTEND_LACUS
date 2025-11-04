import { inject, Injectable } from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import { Message } from './message';
import {
  Brand,
  Category,
  Discount,
  EnabledDisabled,
  Entry,
  EntryDetail,
  Product,
  ProductImage,
} from '../interfaces';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { FormBuilder, Validators } from '@angular/forms';
import { FileRemoveEvent, FileUpload } from 'primeng/fileupload';
import { Confirmation } from './confirmation';
import { PrimeNG } from 'primeng/config';
import { DataView } from 'primeng/dataview';

export interface TableHeader {
  label: string;
  width: string;
}

export interface EntryDetailPayload {
  product_id: number;
  amount: number;
}

export interface EntryDetailComponent {
  cantidad: number;
  producto: Product;
}

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  API_URL = ENV.API_URL;
  http = inject(HttpClient);
  message = inject(Message);
  confirmation = inject(Confirmation);
  config = inject(PrimeNG);

  enumPageSize = [5, 10, 15];

  // components
  tableEntries: Table | null = null;
  dataView: DataView | null = null;
  setComponents(value: { tableEntries: Table; Dataview: DataView }) {
    this.tableEntries = value.tableEntries;
    this.dataView = value.Dataview;
  }

  // PARA TABLE DE ENTRADAS
  headersEntry: TableHeader[] = [
    { label: 'Fecha', width: '15%' },
    { label: 'Hora', width: '15%' },
    { label: 'Total', width: '15%' },
    { label: 'Habilitado', width: '10%' },
    { label: 'Detalles', width: '10%' },
  ];
  pageEntry = 1;
  pageSizeEntry = 5;
  entries: Entry[] = [];
  countEntry: number = 0;
  dates: Date[] = [];
  maxDate: Date = new Date();
  enabledEntry: EnabledDisabled[] = EnabledDisabled;
  selectedEnabledEntry: EnabledDisabled | null = null;
  loadingEntry = true;

  searchEntrys() {
    this.pageEntry = 1;
    if (this.tableEntries) {
      this.tableEntries.first = 0;
    }
    this.getEntrys();
  }
  resetFiltersEntry() {
    this.dates = [];
    this.selectedEnabledEntry = null;
  }
  lazyLoadEntry(event: TableLazyLoadEvent) {
    this.pageSizeEntry = event.rows ?? 5;
    this.pageEntry = Math.floor((event.first ?? 0) / this.pageSizeEntry) + 1;
    this.getEntrys();
  }
  getEntrys() {
    this.loadingEntry = true;
    const body: any = {
      page: this.pageEntry,
      pageSize: this.pageSizeEntry,
      ...(this.dates[0] && { startDate: this.dates[0] }),
      ...(this.dates[1] && { endDate: this.dates[1] }),
      ...(this.selectedEnabledEntry && { enabled: this.selectedEnabledEntry.value }),
    };
    this.http.post(`${this.API_URL}entry/findByAdmin`, body, { withCredentials: true }).subscribe({
      next: (res) => {
        const [entrys, count] = res as [Entry[], number];
        this.entries = entrys;
        this.countEntry = count;
      },
      error: (res) => {},
      complete: () => {
        this.loadingEntry = false;
      },
    });
  }
  async disabledEntry(event:Event,id_entry:number){
    const isConfirmed = await this.confirmation.confirm({
      header: 'Confirmación',
      message: 'Desea deshabilitar la entrada, esta acción es irreversible?',
      position: 'right',
      target: event.currentTarget as HTMLElement,
    });

    if (!isConfirmed) return this.message.info({ summary: 'Acción cancelada' });

    this.http
      .patch(this.API_URL + 'entry/disabled/' + id_entry, null,{ withCredentials: true })
      .subscribe({
        next: () => {
          this.getEntrys();
        },
        error: () => {
          this.message.error({
            summary: 'Error al deshabilitar entrada',
            detail: `Hubo un problema: al intentar deshabilitar la entrada`,
          });
        },
        complete: () => {
          this.message.success({
            summary: `Entrada: ${id_entry}`,
            detail: `La Entrada ha sido deshabilitada correctamente.`,
          });
        },
      });
  }
  

  // PARA TABLE DE DETALLES ENTRADAS
  viewDetailsEntry(entry: Entry) {
    this.selectedEntry = entry;
    this.getDetails();
  }
  selectedEntry: Entry | null = null;
  headersDetail: TableHeader[] = [
    { label: 'Producto', width: '45%' },
    { label: 'Nombre', width: '45%' },
    { label: 'Cantidad', width: '10%' },
  ];
  pageDetail = 1;
  pageSizeDetail = 5;
  detailsEntry: EntryDetail[] = [];
  countDetails: number = 0;
  loadingDetail = true;
  lazyLoadDetails(event: TableLazyLoadEvent) {
    this.pageSizeDetail = event.rows ?? 5;
    this.pageDetail = Math.floor((event.first ?? 0) / this.pageSizeDetail) + 1;
    this.getDetails();
  }
  getDetails() {
    this.loadingDetail = true;
    const body: any = {
      page: this.pageEntry,
      pageSize: this.pageSizeEntry,
    };
    this.http
      .post(`${this.API_URL}entry-detail/findByEntry/${this.selectedEntry?.id}`, body, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          const [entryDetails, count] = res as [EntryDetail[], number];
          this.detailsEntry = entryDetails;
          this.countDetails = count;
        },
        error: (res) => {},
        complete: () => {
          this.loadingDetail = false;
        },
      });
  }

  // PARA DATAVIEW DE PRODUCTOS
  setDataView(dataView: DataView) {
    this.dataView = dataView;
  }
  isCreatingEntry = false;

  products: Product[] = [];
  count: number = 0;
  page = 1;
  pageSize = 5;
  searchByCodeOrName: string | null = null;
  enabled: EnabledDisabled[] = EnabledDisabled;
  selectedEnabled: EnabledDisabled | null = null;
  discount: Discount[] = Discount;
  selectedDiscount: Discount | null = null;
  categorysAll: Category[] = [];
  selectedCategory: Category | null = null;
  brandsAll: Brand[] = [];
  selectedBrand: Brand | null = null;
  loading = true;

  // detalles para crear entrada
  details: EntryDetailComponent[] = [];

  constructor() {
    this.getEntrys();
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

  openCreatingEntry() {
    this.isCreatingEntry = true;
    this.getProducts();
  }
  closeCreatingEntry() {
    this.isCreatingEntry = false;
    this.details = [];
  }
  getProducts() {
    this.loading = true;
    const body: any = {
      page: this.page,
      pageSize: this.pageSize,
      ...(this.searchByCodeOrName && { searchByCodeOrName: this.searchByCodeOrName }),
      ...(this.selectedEnabled && { enabled: this.selectedEnabled.value }),
      ...(this.selectedDiscount && { discount: this.selectedDiscount.value }),
      ...(this.selectedCategory && { id_category: this.selectedCategory.id }),
      ...(this.selectedBrand && { id_brand: this.selectedBrand.id }),
    };
    this.http
      .post(this.API_URL + 'product/findByAdminForEntry', body, { withCredentials: true })
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
  lazyLoad(event: TableLazyLoadEvent) {
    this.pageSize = event.rows ?? 5;
    this.page = Math.floor((event.first ?? 0) / this.pageSize) + 1;
    this.getProducts();
  }

  resetFilters() {
    this.searchByCodeOrName = null;
    this.selectedEnabled = null;
    this.selectedDiscount = null;
    this.selectedCategory = null;
    this.selectedBrand = null;
  }
  search() {
    this.page = 1;
    if (this.dataView) {
      this.dataView.first = 0;
    }
    this.getProducts();
  }

  createArray(count: number) {
    return Array.from({ length: count }).fill(null);
  }

  isInDetail(id: number): boolean {
    return this.details.some((detail) => detail.producto.id === id);
  }
  // HASTA AQUI PARA DATAVIEW DE PRODUCTOS

  // PARA CREAR ENTRADA
  addDetail(product: Product) {
    this.details.push({ cantidad: 1, producto: product });
  }
  getTotalDetails(): number {
    let total = 0;
    this.details.forEach((detail) => {
      total += detail.cantidad;
    });
    return total;
  }
  removeDetail(index: number) {
    this.details.splice(index, 1);
  }

  createEntry() {
    const entryPayload: EntryDetailPayload[] = this.details.map((detail) => {
      return {
        product_id: detail.producto.id,
        amount: detail.cantidad,
      };
    });
    const data = {
      data: entryPayload,
    };

    this.http.post(this.API_URL + 'entry/create', data, { withCredentials: true }).subscribe({
      next: () => {
        this.getProducts();
        this.closeCreatingEntry();
      },
      error: (error) => {
        this.message.error({
          summary: 'Error al crear entrada',
        });
      },
      complete: () => {
        this.message.success({
          summary: 'Entrada creada',
          detail: 'Entrada creada correctamente',
        });
      },
    });
  }
  // HASTA AQUI PARA CREAR ENTRADA
}
