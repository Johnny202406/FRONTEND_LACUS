import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Message } from './message';
import { BehaviorSubject } from 'rxjs';
import { DeliveryType, OrderStatus } from '../interfaces';
import { ENV } from '../env';

@Injectable({
  providedIn: 'root'
})
export class Order {
  API_URL = ENV.API_URL
  http = inject(HttpClient);
  message = inject(Message);

  headers = new BehaviorSubject<string[]>([
    'Codigo', 'Fecha', 'Hora', 'Total', 'Dirección', 'Última Fecha', 'Estado', 'Entrega', 'Pago', 'Acciones'
  ])
  headersDetails = new BehaviorSubject<string[]>([
    'N°', 'Producto', 'Precio', 'Cantidad', 'Subtotal',
  ])
  colors = signal(['', '#F59E0B', '#3B82F6', '#10B981', '#EF4444']);

  order$ = new BehaviorSubject<Order[] | null>(null)

  orderStatus = signal<OrderStatus[] | null>(null)

  enumPageSize = signal([5, 10, 15])
  page = signal(1)
  pageSize = signal(5)
  searchByCode=signal<string|null>(null)
  startDate=signal<Date|null>(new Date())
  endDate=signal<Date|null>(null)
  deliveryTyp=signal<DeliveryType|null>(null)

  constructor() {
    this.http
      .get(this.API_URL + 'order-status/findAll', {
        observe: 'response',
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          this.orderStatus.set(res.body as OrderStatus[])
        },
        error: (err) => {
          this.message.info({
            summary: 'Inicie sesión o Regístrese',
            detail: 'Acceda a la tienda agropecuaria LACUS PERÚ',
          });
        },
        complete: () => { },
      });
  }

  search() {

  }

}
