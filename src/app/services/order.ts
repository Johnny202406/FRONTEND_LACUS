import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, Type } from '@angular/core';
import { Message } from './message';
import { BehaviorSubject } from 'rxjs';
import { DeliveryType, OrderDetail, OrderStatus, PaymentMethod } from '../interfaces';
import { ENV } from '../env';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { Order } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  API_URL = ENV.API_URL;
  http = inject(HttpClient);
  message = inject(Message);
  enumPageSize = [5, 10, 15];

  headers: string[] = [
    'Código',
    'Fecha',
    'Hora',
    'Total',
    'Dirección',
    'Última Fecha',
    'Estado',
    'Entrega',
    'Pago',
    'Comprobante',
    'Acciones',
  ];
  colors: string[] = ['', '#F59E0B', '#3B82F6', '#10B981', '#EF4444'];
  maxDate: Date = new Date();
  orders: Order[] = [];
  count: number = 0;
  page = 1;
  pageSize = 5;
  searchByCode: string | null = null;
  dates: Date[] = [];
  orderStatus: OrderStatus[] = [];
  selectedOrderStatus: OrderStatus | null = null;
  deliveryType: DeliveryType[] | null = null;
  selectedDeliveryType: DeliveryType | null = null;
  paymentMethod: PaymentMethod[] | null = null;
  selectedPaymentMethod: PaymentMethod | null = null;

  headersDetails: string[] = ['N°', 'Producto', 'Precio', 'Cantidad', 'Subtotal'];
  selectedOrder: Order | null = null;
  orderDetails: OrderDetail[] = [];
  countDetails: number = 0;
  pageDetails = 1;
  pageSizeDetails = 5;

  constructor() {
    this.http
      .get(this.API_URL + 'order-status/findAll', {
        withCredentials: true,
      })
      .subscribe((res)=>{
        this.orderStatus = res as OrderStatus[]
      });
    this.http
      .get(this.API_URL + 'delivery-type/findAll', {
        withCredentials: true,
      })
      .subscribe((res)=>{
        this.deliveryType = res as DeliveryType[]
      });
    this.http
      .get(this.API_URL + 'payment-method/findAll', {
        withCredentials: true,
      })
      .subscribe((res)=>{
        this.paymentMethod = res as PaymentMethod[]
      });

    
    this.getOrder();
  }

  search(table: Table) {
    this.page = 1;
    table.first = 0;
    this.getOrder();
  }

  getOrder() {
    const body: any = {
      page: this.page,
      pageSize: this.pageSize,
      ...(this.searchByCode && { searchByCode: this.searchByCode }),
      ...(this.dates[0] && { startDate: this.dates[0] }),
      ...(this.dates[1] && { endDate: this.dates[1] }),
      ...(this.selectedOrderStatus && { orderStatus: this.selectedOrderStatus.id }),
      ...(this.selectedDeliveryType && { deliveryType: this.selectedDeliveryType.id }),
      ...(this.selectedPaymentMethod && { paymentMethod: this.selectedPaymentMethod.id }),
    };

    this.http
      .post(this.API_URL + 'order/findByClient', body, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          const [orders, count] = res as [Order[], number];
          this.orders = orders;
          this.count = count;
        },
        error: (err) => {
          this.message.info({
            summary: 'Inicie sesión o Regístrese',
            detail: 'Acceda a la tienda agropecuaria LACUS PERÚ',
          });
        },
        complete: () => {},
      });
  }

  viewDetails(order: Order) {
    this.selectedOrder = order;
    this.pageDetails = 1;
    this.pageSizeDetails = 5;
    this.countDetails = 0;
    this.getOrderDetails();
  }

  lazyLoad(event: TableLazyLoadEvent) {
    this.pageSize = event.rows ?? 5;
    this.page = Math.floor((event.first ?? 0) / this.pageSize) + 1;
    this.getOrder();
  }
  viewInvoice(order: Order) {
    if (order.comprobante.id === 3) {
      this.http
        .get(this.API_URL + 'download/pdf/' + order.id, {
          withCredentials: true,
          responseType: 'blob',
        })
        .subscribe({
          next: (res) => {},
          error: (err) => {
            this.message.info({
              summary: 'Inicie sesión o Regístrese',
              detail: 'Acceda a la tienda agropecuaria LACUS PERÚ',
            });
          },
          complete: () => {},
        });
    }

    window.open(order.comprobante.comprobante, '_blank');
  }

  resetFilters() {
    this.searchByCode = null;
    this.dates = [];
    this.selectedOrderStatus = null;
    this.selectedDeliveryType = null;
    this.selectedPaymentMethod = null;
  }

  getOrderDetails() {
    const body: any = {
      page: this.pageDetails,
      pageSize: this.pageSizeDetails,
    };
    this.http
      .post(this.API_URL + 'order-detail/findByOrder/' + this.selectedOrder?.id, body, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          const [orderDetails, count] = res as [OrderDetail[], number];
          this.orderDetails = orderDetails;
          this.countDetails = count;
        },
        error: (err) => {
          this.message.info({
            summary: 'Inicie sesión o Regístrese',
            detail: 'Acceda a la tienda agropecuaria LACUS PERÚ',
          });
        },
        complete: () => {},
      });
  }

  lazyLoadDetails(event: TableLazyLoadEvent) {
    this.pageSizeDetails = event.rows ?? 5;
    this.pageDetails = Math.floor((event.first ?? 0) / this.pageSizeDetails) + 1;
    this.getOrderDetails();
  }
}
