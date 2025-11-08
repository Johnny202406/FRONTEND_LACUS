import { inject, Injectable } from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import { Message } from './message';
import { Confirmation } from './confirmation';
import { PrimeNG } from 'primeng/config';
import { Auth } from './auth';
import { Cart, DeliveryType, InvoiceType, PaymentMethod, User } from '../interfaces';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { FileRemoveEvent } from 'primeng/fileupload';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  API_URL = ENV.API_URL;
  http = inject(HttpClient);
  message = inject(Message);
  confirmation = inject(Confirmation);
  config = inject(PrimeNG);
  auth = inject(Auth);
  channel = new BroadcastChannel('cart');
  router = inject(Router);
  formBuilder = inject(FormBuilder);

  cart!: Cart;

  isLoading = true;
  isCatwalk = false;
  skeleton = this.createArray(6, {});

  constructor() {
    this.auth.user$.subscribe((user) => {
      if ((user as User)?.tipo_usuario?.id === 2) {
        this.getCart();
      }
    });
    this.channel.onmessage = (event) => {
      this.cart = event.data;
    };
  }

  addToCart(id_producto: number) {
    if (!this.auth.user())
      return this.router.navigate(['/acceso'], {
        queryParams: {},
        queryParamsHandling: '',
      });

    if (this.auth.user()?.tipo_usuario?.id === 1) {
      return;
    }

    if (!this.cart) {
      return;
    }

    return this.http
      .post(
        `${this.API_URL}cart-detail/create`,
        { id_carrito: this.cart.id, id_producto },
        { withCredentials: true }
      )
      .subscribe({
        next: () => {
          this.getCart();
        },
        error: (error) => {
          this.getCart();
          this.message.info({
            summary: `Error al agregar producto`,
            detail: `Hubo un problema: No se pudo agregar el producto al carrito`,
          });
        },
        complete: () => {
          this.message.success({
            summary: 'Producto agregado al carrito',
            detail: 'El producto ha sido agregado al carrito con exito',
          });
        },
      });
  }
  getCart() {
    this.isLoading = true;
    const id = (this.auth.user() as User).id;
    this.http.get(`${this.API_URL}cart/read/${id}`, { withCredentials: true }).subscribe((res) => {
      this.cart = res as Cart;
      this.isLoading = false;
      this.channel.postMessage(res);
      this.message.success({
        summary: 'Carrito actualizado',
        detail: 'El carrito ha sido actualizado con exito',
      });
    });
  }
  updateQuantity(id: number, quantity: number) {
    return this.http
      .patch(`${this.API_URL}cart-detail/update`, { id, quantity }, { withCredentials: true })
      .subscribe({
        next: () => {
          this.getCart();
        },
        error: (error) => {
          this.getCart();
          this.message.info({
            summary: `Error al actualizar producto`,
            detail: `Hubo un problema: No se pudo actualizar la cantidad de el producto en el carrito`,
          });
        },
        complete: () => {
          this.message.success({
            summary: 'Producto actualizado del carrito',
            detail: 'El producto ha sido actualizado al carrito con exito',
          });
        },
      });
  }
  async removeFromCart(event: Event, id: number) {
    const isConfirmed = await this.confirmation.confirm({
      header: 'Confirmación',
      message: 'Desea eliminar el producto del carrito?',
      position: 'right',
      target: event.currentTarget as HTMLElement,
    });

    if (!isConfirmed) return this.message.info({ summary: 'Acción cancelada' });
    return this.http
      .delete(`${this.API_URL}cart-detail/delete/${id}`, { withCredentials: true })
      .subscribe({
        next: () => {
          this.getCart();
        },
        error: (error) => {
          this.getCart();
          this.message.warn({
            summary: `Error al remover producto`,
            detail: `Hubo un problema: No se pudo remover el producto del carrito`,
          });
        },
        complete: () => {
          this.message.info({
            summary: 'Producto removido del carrito',
            detail: 'El producto ha sido removido del carrito con exito',
          });
        },
      });
  }

  getSubtotal(): number {
    let subtotal = 0;
    this.cart?.detalles?.forEach((cart_detail) => {
      subtotal += cart_detail.producto.precio_final * cart_detail.cantidad;
    });
    return subtotal;
  }
  startCatwalk() {
    this.isCatwalk = true;
  }
  closeCatwalk() {
    this.isCatwalk = false;
  }

  isInCart(id: number): boolean {
    if (!this.cart || !this.cart.detalles) return false;
    return this.cart.detalles.some((detail) => detail.producto.id === id);
  }
  createArray(count: number, payload?: any) {
    return Array.from({ length: count }).fill(payload);
  }

  // 1.CLIENTE
  invoices: InvoiceType[] = [
    {
      id: 1,
      nombre: 'Factura',
      comprobantes: [],
    },
    {
      id: 2,
      nombre: 'Boleta',
      comprobantes: [],
    },
  ];
  selectedInvoice: InvoiceType = this.invoices[0];
  // factura
  formFactura = this.formBuilder.group({
    ruc: [
      null as number | null,
      [Validators.required, Validators.min(10000000000), Validators.max(99999999999)],
    ],
    razon_social: [
      null as string | null,
      [Validators.required, Validators.minLength(1), Validators.maxLength(255)],
    ],
  });

  // boleta
  formBoleta = this.formBuilder.group({
    dni: [
      null as number | null,
      [Validators.required, Validators.min(10000000), Validators.max(99999999)],
    ],
    nombres: [
      null as string | null,
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(510),
        Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ'’-]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñ'’-]+)*$/),
      ],
    ],
  });

  // 2.ENTREGA
  deliveryTypes: DeliveryType[] = [
    {
      id: 1,
      nombre: 'Delivery',
    },
    {
      id: 2,
      nombre: 'Retiro en tienda',
    },
  ];
  selectedDeliveryType: DeliveryType = this.deliveryTypes[0];

  mensaje: string = '';
  coordenadas: { lat: number; lng: number } | null = null;

  private map!: L.Map;
  private tienda = { lat: -12.0464, lng: -77.0428 };
  private radio = 500;
  private precio_kg_km = 0.05;
  private distancia = 1.2;

  // 3.PAGO
  formFile = this.formBuilder.group({
    file: [null as File | null, Validators.required],
  });
  onSelect(event: any) {
    const file = event.files[0];
    const fileControl = this.formFile.get('file');
    fileControl?.setValue(file);
    fileControl?.markAsDirty();
    fileControl?.markAsTouched();
    fileControl?.updateValueAndValidity();
  }
  onRemove(event: FileRemoveEvent) {
    const fileControl = this.formFile.get('file');
    fileControl?.setValue(null);
    fileControl?.setValidators([Validators.required]);
    fileControl?.markAsDirty();
    fileControl?.markAsTouched();
    fileControl?.updateValueAndValidity();
  }

  paymentMethods: any[] = [
    {
      id: 1,
      nombre: 'Transferencia',
      image: 'bcp.webp',
      copy: '123 456 789',
    },
    {
      id: 2,
      nombre: 'Yape',
      image: 'yape.webp',
      copy: '987654321',
    },
  ];

  selectedPaymentMethod: any = this.paymentMethods[0];

  // Copiar al portapapeles
  copyNumber(number: string) {
    navigator.clipboard.writeText(number).then(() => {
      this.message.success({ summary: 'Copiado al portapapeles' });
    });
  }

  getLabelButton(): string {
    if (this.isCatwalk) return 'Proceso de compra';
    if (this.checks.every((c) => c === true)) return 'Realizar compra';
    return 'Iniciar compra';
  }

  // AQUI LOS CHECKS DE PASARELA
  checks: boolean[] = [
    (this.selectedInvoice.id === 1 && this.formFactura.valid) ||
      (this.selectedInvoice.id === 2 && this.formBoleta.valid),
    (this.selectedDeliveryType.id === 1 && !!this.coordenadas) ||
      this.selectedDeliveryType.id === 2,
    this.formFile.valid,
  ];

  getCheck(check: number): boolean {
    return this.checks[check];
  }

  getDeliveryMount() {
    return this.cart.detalles.reduce((previous, current) => {
      return current.producto.peso_kg * this.precio_kg_km;
    }, 0);
  }
  getTotalMount():number {
    return this.getDeliveryMount()+this.getSubtotal();
  }
}
