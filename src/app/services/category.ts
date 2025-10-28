import { inject, Injectable } from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import { Message } from './message';
import { Category, EnabledDisabled } from '../interfaces';
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
export class CategoryService {
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

  categorys: Category[] = [];
  count: number = 0;
  page = 1;
  pageSize = 5;
  searchByName: string | null = null;
  enabled: EnabledDisabled[] = EnabledDisabled;
  selectedEnabled: EnabledDisabled | null = null;

  visibleModal: boolean = false;
  selectedCategory: Category | null = null;

  constructor() {
    this.getCategorys();
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
    this.getCategorys();
  }
  onSelect(event: any) {
    const file = event.files[0];
    const fileControl = this.form.get('file');
    fileControl?.setValue(file);
    fileControl?.markAsDirty();
    fileControl?.markAsTouched();
    fileControl?.updateValueAndValidity();
  }
  updateCategory(category: Category) {
    this.resetForm()
    this.selectedCategory = category;
    const fileControl = this.form.get('file');
    fileControl?.clearValidators();
    fileControl?.updateValueAndValidity();
    this.form.patchValue({
      name: category.nombre,
    });
    this.toogleDialog()
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
    if(!this.selectedCategory){
      fileControl?.setValidators([Validators.required]);
    }
    fileControl?.updateValueAndValidity();
  }

  resetForm() {
    if (this.fu) {
      this.fu.clear();
    }
    const fileControl = this.form.get('file');
    fileControl?.setValue(null);
    fileControl?.setValidators([Validators.required]);
    fileControl?.updateValueAndValidity();
    this.selectedCategory = null;
    this.form.reset();
  }

  getCategorys() {
    this.loading = true;
    const body: any = {
      page: this.page,
      pageSize: this.pageSize,
      ...(this.searchByName && { searchByName: this.searchByName }),
      ...(this.selectedEnabled && { enabled: this.selectedEnabled.value }),
    };
    this.http.post(this.API_URL + 'category/findByAdmin', body, { withCredentials: true }).subscribe({
      next: (res) => {
        const [categorys, count] = res as [Category[], number];
        this.categorys = categorys;
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
    this.getCategorys();
  }
  resetFilters() {
    this.searchByName = null;
    this.selectedEnabled = null;
  }
  operationCategory() {
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
    const selectedCategory:Category|null = this.selectedCategory ? this.selectedCategory : null
    

    const request = selectedCategory
      ? this.http.patch(this.API_URL + 'category/update/' + selectedCategory.id, formData, {
          withCredentials: true,
        })
      : this.http.post(this.API_URL + 'category/create', formData, {
          withCredentials: true,
        });

    request.subscribe({
      next: () => {
       
          this.getCategorys();
      },
      error: (error) => {
        const message = selectedCategory ? 'Actualizar' : 'Crear';
        const errorMessage = error.error.message || 'Hubo un error inesperado';
        this.message.error({
          summary: `Error al ${message} categoría`,
          detail: `Hubo un problema: ${errorMessage}`,
        });
      },
      complete: () => {
         const message = selectedCategory ? 'actualizada' : 'creada';
        this.message.success({
          summary: `Categoría ${message}`,
          detail: `La categoría ha sido ${message} correctamente.`,
        });
      },
    });
    this.showDialog();

  }

  enabledDisabled(category: Category) {
    const enabled: boolean = !category.habilitado;
    const text = enabled ? 'Habilitado' : 'Deshabilitado';
    const text2 = enabled ? 'Habilitar' : 'Deshabilitar';
    const severity = enabled ? 'success' : 'info';

    this.http
      .patch(
        this.API_URL + 'category/enabledDisabled/' + category.id,
        { enabled },
        { withCredentials: true, responseType: 'text' }
      )
      .subscribe({
        next: () => {
          this.getCategorys();
        },
        error: (error) => {
          this.message.error({
            summary: `Error al ${text2} categoría`,
            detail: `Hubo un problema: ${error.message}`,
          });
        },
        complete: () => {
          this.message.add({
            severity,
            summary: `Categoría: ${category.nombre}`,
            detail: `La Categoría ha sido ${text} correctamente.`,
          });
        },
      });
  }
}
