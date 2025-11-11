import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, Type } from '@angular/core';
import { Message } from './message';
import { BehaviorSubject } from 'rxjs';
import { DeliveryType, OrderDetail, OrderStatus, PaymentMethod } from '../interfaces';
import { ENV } from '../env';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { Order } from '../interfaces';
import { Auth } from './auth';
export interface TableHeader {
  label: string;
  width: string;
}
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  API_URL = ENV.API_URL;
  http = inject(HttpClient);
  message = inject(Message);
  auth = inject(Auth);
  enumPageSize = [5, 10, 15];

  loading = true;
 
  headers:TableHeader[] = [
    {label: 'Código', width: '20%'},
    {label: 'Usuario', width: '15%'},
    {label: 'Fecha', width: '5%'},
    {label: 'Hora', width: '5%'},
    {label: 'Subtotal', width: '5%'},
    {label: 'Entrega_costo', width: '5%'},
    {label: 'Total', width: '5%'},
    {label: 'Entrega', width: '10%'},
    {label: 'Dirección', width: '10%'},
    {label: 'Última Fecha', width: '5%'},
    {label: 'Estado', width: '5%'},
    {label: 'Datos', width: '5%'},
    {label: 'Acciones', width: '15%'},
  ]
  colors: string[] = ['', '#F59E0B', '#3B82F6', '#10B981', '#EF4444'];
  maxDate: Date = new Date();
  orders: Order[] = [];
  count: number = 0;
  page = 1;
  pageSize = 5;
  searchByCodeOrEmail: string | null = null;
  dates: Date[] = [];
  orderStatus: OrderStatus[] = [];
  selectedOrderStatus: OrderStatus | null = null;
  deliveryType: DeliveryType[] | null = null;
  selectedDeliveryType: DeliveryType | null = null;

  headersDetails: TableHeader[] = [
    { label: 'N°', width: '20%' },
    { label: 'Producto', width: '50%' },
    { label: 'Precio', width: '10%' },
    { label: 'Cantidad', width: '10%' },
    { label: 'Subtotal', width: '10%' },
  ];
  selectedOrder: Order | null = null;
  orderDetails: OrderDetail[] = [];
  countDetails: number = 0;
  pageDetails = 1;
  pageSizeDetails = 5;
  loadingDetail = true;

  // components
  table: Table | null = null;
  setComponents(value: { table: Table }) {
    this.table = value.table;
  }

  constructor() {
    this.http
      .get(this.API_URL + 'order-status/findAll', {
        withCredentials: true,
      })
      .subscribe((res) => {
        this.orderStatus = res as OrderStatus[];
      });
    this.http
      .get(this.API_URL + 'delivery-type/findAll', {
        withCredentials: true,
      })
      .subscribe((res) => {
        this.deliveryType = res as DeliveryType[];
      });

    this.getOrder();
  }

  search() {
    this.page = 1;
    if (this.table) {
      this.table.first = 0;
    }
    this.getOrder();
  }

  getOrder() {
    this.loading = true;
    const id = this.auth.user()?.id;
    const body: any = {
      page: this.page,
      pageSize: this.pageSize,
      ...(this.searchByCodeOrEmail && { searchByCodeOrEmail: this.searchByCodeOrEmail }),
      ...(this.dates[0] && { startDate: this.dates[0] }),
      ...(this.dates[1] && { endDate: this.dates[1] }),
      ...(this.selectedOrderStatus && { orderStatus: this.selectedOrderStatus.id }),
      ...(this.selectedDeliveryType && { deliveryType: this.selectedDeliveryType.id }),
    };

    this.http
      .post(this.API_URL + 'order/findByAdmin', body, {
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
        complete: () => {
          this.loading = false;
        },
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
  downloadTicket(order: Order) {
    this.http
      .get(this.API_URL + 'order/download/pdf/' + order.id, {
        withCredentials: true,
        responseType: 'arraybuffer',
      })
      .subscribe({
        next: (res) => {
           const blob = new Blob([res], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Crear un enlace temporal para forzar la descarga
        const a = document.createElement('a');
        a.href = url;
        a.download = `${order.codigo}.pdf`; // Nombre del archivo
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url); // Liberar memoria
        },
        error: (err) => {
          this.message.info({
            summary: 'No se pudo descargar el ticket',
            detail: 'Intentelo de nuevo',
          });
        },
        complete: () => {},
      });
  }

  resetFilters() {
    this.searchByCodeOrEmail = null;
    this.dates = [];
    this.selectedOrderStatus = null;
    this.selectedDeliveryType = null;
  }

  getOrderDetails() {
    this.loadingDetail = true;

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
        complete: () => {
          this.loadingDetail = false;
        },
      });
  }

  lazyLoadDetails(event: TableLazyLoadEvent) {
    this.pageSizeDetails = event.rows ?? 5;
    this.pageDetails = Math.floor((event.first ?? 0) / this.pageSizeDetails) + 1;
    this.getOrderDetails();
  }

  googleMaps(direccion: { x: number; y: number }) {
    const url = `https://www.google.com/maps?q=${direccion.x},${direccion.y}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }


  //  ACTUALIZAR PEDIDO
  visibleModal: boolean = false;
  estadoParaActualizarPedido: OrderStatus | undefined;
  selectedPedidos:Order[]=[]
  showDialog() {
      this.visibleModal = !this.visibleModal;
  }
    
  actualizarPedido(){
    if(!this.selectedPedidos) return this.message.warn({ summary: 'Pedidos No seleccionados', detail: 'No hay pedidos seleccionados a los que actulizar estado' });
    if(!this.estadoParaActualizarPedido) return this.message.warn({  summary: 'Estado No Seleccionado', detail: 'El Estado no se encuentra seleccionado' });
    
    const idestado=this.estadoParaActualizarPedido.id
    const obj = {
      id_order_status:idestado,
      id_orders: this.selectedPedidos
        .filter(pedido => idestado !== pedido.estado_pedido.id) 
        .map(pedido => pedido.id) 
    };
 
    
    if(!obj.id_orders.length) return this.message.warn({ summary: 'Pedidos No seleccionados', detail: 'No hay pedidos seleccionados a los que actualizar con ese estado' });

    
    this.http.patch(this.API_URL + 'order/updateStatus/',obj,{
      withCredentials:true
    }).subscribe({
        next: () => {
          this.getOrder()
          this.selectedPedidos=[]
          this.estadoParaActualizarPedido=undefined
        },
        error: () => {
          return this.message.error({  summary: 'Pedido Fallido', detail: 'Pedido no actualizado' });
        },
        complete:()=>{
          return this.message.success({ summary: 'Pedido Actualizado', detail: 'Pedido actualizado con exito' });
          
        }
      })
    this.showDialog()


  }  

}
