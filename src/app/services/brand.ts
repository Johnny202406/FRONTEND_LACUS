import { inject, Injectable } from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import { Message } from './message';
import { EnabledDisabled } from '../interfaces';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Brand } from '../interfaces';
import { Brand as BrandComp } from '../components/dashboard/admin/brand/brand';
import { FileRemoveEvent, FileUpload } from 'primeng/fileupload';
export interface TableHeader {
  label: string;
  width: string;
}
@Injectable({
  providedIn: 'root',
})
export class BrandService {
  API_URL = ENV.API_URL;
  http = inject(HttpClient);
  message = inject(Message);
  formBuilder = inject(FormBuilder);

  enumPageSize = [5, 10, 15];
  loading = true;

  headers: TableHeader[] = [
    { label: 'Nombre', width: '60%' },
    { label: 'Imagen', width: '15%' },
    { label: 'Habilitado', width: '5%' },
    { label: 'Editar', width: '5%' },
  ];
  // components
  table: Table | null = null;
  fu: FileUpload | null = null;

  brands: Brand[] = [];
  count: number = 0;
  page = 1;
  pageSize = 5;
  searchByName: string | null = null;
  enabled: EnabledDisabled[] = EnabledDisabled;
  selectedEnabled: EnabledDisabled | null = null;

  visibleModal: boolean = false;
  selectedBrand: Brand | null = null;

  constructor() {
    this.getBrands();
  }

  form = this.formBuilder.group({
    name: [
      null as string | null,
      [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    ],
    file: [null as File | null, Validators.required],
  });
  setComponents(value: { table: Table; fu: FileUpload }) {
    this.table = value.table;
    this.fu = value.fu;
  }

  search() {
    this.page = 1;
    if (this.table) {
      this.table.first = 0;
    }
    this.getBrands();
  }
  onSelect(event: any) {
    const file = event.files[0];
    const fileControl = this.form.get('file');
    fileControl?.setValue(file);
    fileControl?.markAsDirty();
    fileControl?.markAsTouched();
    fileControl?.updateValueAndValidity();
  }
  updateBrand(brand: Brand) {
    this.selectedBrand = brand;
    const fileControl = this.form.get('file');
    if (!this.selectedBrand) {
      fileControl?.setValidators([Validators.required]);
    } else {
      fileControl?.clearValidators();
    }
    fileControl?.updateValueAndValidity();
    this.form.patchValue({
      name: brand.nombre,
    });
    this.toogleDialog();
  }
  toogleDialog() {
    this.visibleModal = !this.visibleModal;
  }
  showDialog() {
    this.resetForm();
    this.toogleDialog();
  }
  onRemove(event: FileRemoveEvent) {
    const fileControl = this.form.get('file');
    fileControl?.setValue(null);
    if(this.selectedBrand){
      fileControl?.setValidators([Validators.required]);
    }
    fileControl?.markAsUntouched();
    fileControl?.updateValueAndValidity();
  }

  resetForm() {
    if (this.fu) {
      this.fu.clear();
      this.fu.files = [];
    }
    const fileControl = this.form.get('file');
    fileControl?.setValidators([Validators.required]);
    fileControl?.updateValueAndValidity();
    this.selectedBrand = null;
    this.form.reset();
  }

  getBrands() {
    this.loading = true;
    const body: any = {
      page: this.page,
      pageSize: this.pageSize,
      ...(this.searchByName && { searchByName: this.searchByName }),
      ...(this.selectedEnabled && { enabled: this.selectedEnabled.value }),
    };
    this.http.post(this.API_URL + 'brand/findByAdmin', body, { withCredentials: true }).subscribe({
      next: (res) => {
        const [brands, count] = res as [Brand[], number];
        this.brands = brands;
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
    this.getBrands();
  }
  resetFilters() {
    this.searchByName = null;
    this.selectedEnabled = null;
  }
  operationBrand() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const value = this.form.value;

    if (value.name) {
      formData.append('name', value.name.trim().toUpperCase());
    }

    if (value.file) {
      formData.append('file', value.file);
    }

    const request = this.selectedBrand
      ? this.http.patch(this.API_URL + 'brand/update/' + this.selectedBrand.id, formData, {
          withCredentials: true,
          responseType: 'text',
        })
      : this.http.post(this.API_URL + 'brand/create', formData, {
          withCredentials: true,
          responseType: 'text',
        });

    request.subscribe({
      next: () => {
        const message = this.selectedBrand ? 'actualizada' : 'creada';
        this.message.success({
          summary: `Marca ${message}`,
          detail: `La marca ha sido ${message} correctamente.`,
        });
      },
      error: (error) => {
        const message = this.selectedBrand ? 'Actualizar' : 'Crear';
        this.message.error({
          summary: `Error al ${message} marca`,
          detail: `Hubo un problema: ${error.message}`,
        });
      },
      complete: () => {
        this.getBrands();
        this.showDialog();
      },
    });
  }

  enabledDisabled(brand: Brand) {
    const enabled: boolean = !brand.habilitado;
    const text = enabled ? 'Habilitado' : 'Deshabilitado';
    const text2 = enabled ? 'Habilitar' : 'Deshabilitar';
    const severity = enabled ? 'success' : 'info';

    this.http
      .patch(
        this.API_URL + 'brand/enabledDisabled/' + brand.id,
        { enabled },
        { withCredentials: true, responseType: 'text' }
      )
      .subscribe({
        next: () => {
          this.getBrands();
        },
        error: (error) => {
          this.message.error({
            summary: `Error al ${text2} marca`,
            detail: `Hubo un problema: ${error.message}`,
          });
        },
        complete: () => {
          this.message.add({
            severity,
            summary: `Marca: ${brand.nombre}`,
            detail: `La Marca ha sido ${text} correctamente.`,
          });
        },
      });
  }
}
