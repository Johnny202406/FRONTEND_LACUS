import { inject, Injectable } from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import { Message } from './message';
import { Publication } from '../interfaces';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { FormBuilder, Validators } from '@angular/forms';
import { FileRemoveEvent, FileUpload } from 'primeng/fileupload';
import { Confirmation } from './confirmation';
export interface TableHeader {
  label: string;
  width: string;
}
@Injectable({
  providedIn: 'root',
})
export class PublicationService {
  API_URL = ENV.API_URL;
  http = inject(HttpClient);
  message = inject(Message);
  confirmation = inject(Confirmation);
  formBuilder = inject(FormBuilder);

  enumPageSize = [5, 10, 15];
  loading = true;

  headers: TableHeader[] = [
    { label: 'Titúlo', width: '60%' },
    { label: 'Redirección', width: '15%' },
    { label: 'Imagen', width: '15%' },
    { label: 'Acciones', width: '10%' },
  ];
  // components
  table: Table | null = null;
  fu: FileUpload | null = null;

  publications: Publication[] = [];
  count: number = 0;
  page = 1;
  pageSize = 5;
  searchByTitle: string | null = null;

  visibleModal: boolean = false;
  selectedPublication: Publication | null = null;

  constructor() {
    this.getPublications();
  }

  form = this.formBuilder.group({
    titulo: [
      null as string | null,
      [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    ],
    url_redireccion: [null as string | null, Validators.maxLength(500)],
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
    this.getPublications();
  }
  onSelect(event: any) {
    const file = event.files[0];
    const fileControl = this.form.get('file');
    fileControl?.setValue(file);
    fileControl?.markAsDirty();
    fileControl?.markAsTouched();
    fileControl?.updateValueAndValidity();
  }
  updatePublication(publication: Publication) {
    this.resetForm();
    this.selectedPublication = publication;
    const fileControl = this.form.get('file');
    fileControl?.clearValidators();
    fileControl?.updateValueAndValidity();
    this.form.patchValue({
      titulo: publication.titulo,
      url_redireccion: publication.url_redireccion,
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
    if (!this.selectedPublication) {
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
    this.selectedPublication = null;
    this.form.reset();
  }

  getPublications() {
    this.loading = true;
    const body: any = {
      page: this.page,
      pageSize: this.pageSize,
      ...(this.searchByTitle && { searchByTitle: this.searchByTitle }),
    };
    this.http
      .post(this.API_URL + 'publication/findByAdmin', body, { withCredentials: true })
      .subscribe({
        next: (res) => {
          const [publications, count] = res as [Publication[], number];
          this.publications = publications;
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
    this.getPublications();
  }
  resetFilters() {
    this.searchByTitle = null;
  }
  operationPublication() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const value = this.form.value;

    if (value.titulo) {
      formData.append('titulo', value.titulo.trim().toUpperCase());
    }
    if (value.url_redireccion) {
      formData.append('url_redireccion', value.url_redireccion.trim().toUpperCase());
    }

    if (value.file) {
      formData.append('file', value.file);
    }
    const selectedPublication: Publication | null = this.selectedPublication
      ? this.selectedPublication
      : null;

    const request = selectedPublication
      ? this.http.patch(this.API_URL + 'publication/update/' + selectedPublication.id, formData, {
          withCredentials: true,
        })
      : this.http.post(this.API_URL + 'publication/create', formData, {
          withCredentials: true,
        });

    request.subscribe({
      next: () => {
        this.getPublications();
      },
      error: (error) => {
        const message = selectedPublication ? 'Actualizar' : 'Crear';
        const errorMessage = error.error.message || 'Hubo un error inesperado';
        this.message.error({
          summary: `Error al ${message} publicación`,
          detail: `Hubo un problema: ${errorMessage}`,
        });
      },
      complete: () => {
        const message = selectedPublication ? 'actualizada' : 'creada';
        this.message.success({
          summary: `Publicación ${message}`,
          detail: `La publicación ha sido ${message} correctamente.`,
        });
      },
    });
    this.showDialog();
  }

  async delete(event: Event, publication: Publication) {
    const isConfirmed = await this.confirmation.confirm({
      header: 'Confirmación',
      message: 'Desea eliminar la publicación?',
      position: 'right',
      target: event.currentTarget as HTMLElement,
    });

    if (!isConfirmed) return this.message.info({ summary: 'Acción cancelada' });

    this.http
      .delete(this.API_URL + 'publication/delete/' + publication.id, { withCredentials: true })
      .subscribe({
        next: () => {
          this.getPublications();
        },
        error: (error) => {
          this.message.error({
            summary: 'Error al eliminar publicación',
            detail: `Hubo un problema: al intentar eliminar la publicación`,
          });
        },
        complete: () => {
          this.message.success({
            summary: `Publicación: ${publication.titulo}`,
            detail: `La publicación ha sido eliminada correctamente.`,
          });
        },
      });
  }
}
