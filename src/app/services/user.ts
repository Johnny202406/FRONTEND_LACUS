import { inject, Injectable } from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import { Message } from './message';
import { EnabledDisabled, User } from '../interfaces';
import { Table, TableLazyLoadEvent } from 'primeng/table';

export interface TableHeader {
  label: string;
  width: string;
}
@Injectable({
  providedIn: 'root',
})
export class UserService {
  API_URL = ENV.API_URL;
  http = inject(HttpClient);
  message = inject(Message);

  enumPageSize = [5, 10, 15];
  loading = true;

  headers: TableHeader[] = [
    { label: 'Correo', width: '60%' },
    { label: 'Nombre', width: '15%' },
    { label: 'Apellido', width: '15%' },
    { label: 'Dni', width: '15%' },
    { label: 'Número', width: '15%' },
    { label: 'Habilitado', width: '10%' },
  ];
  // components
  table: Table | null = null;

  users: User[] = [];
  count: number = 0;
  page = 1;
  pageSize = 5;
  searchByEmail: string | null = null;
  enabled: EnabledDisabled[] = EnabledDisabled;
  selectedEnabled: EnabledDisabled | null = null;
  
  visibleModal: boolean = false;

  constructor() {
    this.getUsers();
  }

  
  setComponents(value: { table: Table;}) {
    this.table = value.table;
  }

  search() {
    this.page = 1;
    if (this.table) {
      this.table.first = 0;
    }
    this.getUsers();
  }
 
   

  getUsers() {
    this.loading = true;
    const body: any = {
      page: this.page,
      pageSize: this.pageSize,
      ...(this.searchByEmail && { searchByEmail: this.searchByEmail }),
      ...(this.selectedEnabled && { enabled: this.selectedEnabled.value }),
    };
    this.http
      .post(this.API_URL + 'user/findByAdmin', body, { withCredentials: true })
      .subscribe({
        next: (res) => {
          const [users, count] = res as [User[], number];
          this.users = users;
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
    this.getUsers();
  }
  resetFilters() {
    this.searchByEmail = null;
    this.selectedEnabled = null;
  }

   enabledDisabled(user: User) {
      const enabled: boolean = !user.habilitado;
      const text = enabled ? 'Habilitado' : 'Deshabilitado';
      const text2 = enabled ? 'Habilitar' : 'Deshabilitar';
      const severity = enabled ? 'success' : 'info';
  
      this.http
        .patch(
          this.API_URL + 'user/enabledDisabled/' + user.id,
          { enabled },
          { withCredentials: true }
        )
        .subscribe({
          next: () => {
            this.getUsers();
          },
          error: (error) => {
            this.message.error({
              summary: `Error al ${text2} usuario`,
              detail: `Hubo un problema: al intentar ${text2} el usuario`,
            });
          },
          complete: () => {
            this.message.add({
              severity,
              summary: `Usuario: ${user.correo}`,
              detail: `El Usuario ha sido ${text} correctamente.`,
            });
          },
        });
    }
  
}
