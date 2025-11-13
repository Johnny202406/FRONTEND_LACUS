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
      nombre: 'Boleta',
      comprobantes: [],
    },
    {
      id: 2,
      nombre: 'Factura',
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
      nombre: 'Retiro en tienda',
    },
    {
      id: 2,
      nombre: 'Delivery',
    },
  ];
  selectedDeliveryType: DeliveryType = this.deliveryTypes[1];

  mensaje: string = '';
  coordenadas: { lat: number; lng: number } | null = null;

  private map!: L.Map;

  private precio_kg_km = 0.05;
  private tarifa = 5;
  delivery_gratis = 1000;
  private distancia!: number;
  private centro = { lat: -13.17, lng: -74.22 };
  private tienda = { lat: -13.1738396, lng: -74.2175546 };

  private radio = 3500;
  private marcadorActual: L.Marker | null = null;
  initMap(): void {
    this.map = L.map('map').setView([this.centro.lat, this.centro.lng], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    const zona = L.circle([this.centro.lat, this.centro.lng], {
      color: 'blue',
      fillColor: '#add8e6',
      fillOpacity: 0.3,
      radius: this.radio,
    }).addTo(this.map);

    L.marker([this.tienda.lat, this.tienda.lng]).addTo(this.map).bindPopup('Tienda');

    if (this.coordenadas) {
      this.marcadorActual = L.marker([this.coordenadas.lat, this.coordenadas.lng], {
        icon: L.icon({
          iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          iconSize: [32, 32],
        }),
      }).addTo(this.map);
    }

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const distancia = (this.map as L.Map).distance(
        [lat, lng],
        [this.tienda.lat, this.tienda.lng]
      );

      if (distancia <= this.radio) {
        this.mensaje = 'Selección válida dentro de la zona.';
        this.coordenadas = { lat, lng };
        this.distancia = distancia / 1000;

        if (this.marcadorActual) {
          this.map.removeLayer(this.marcadorActual);
        }

        this.marcadorActual = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            iconSize: [32, 32],
          }),
        }).addTo(this.map);
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            this.mensaje = data.display_name;
          })
          .catch((error) => console.error('Error al obtener la dirección:', error));
      } else {
        // this.mensaje = '⚠ Selección fuera de la zona permitida.';
      }
    });
  }

  // 3.PAGO
  pagoYapeForm = this.formBuilder.group({
    celular: [
     null as number | null,
      [Validators.required, Validators.pattern(/^\d{9}$/)],
    ], // Solo números, 9 dígitos
    otp: [null as number | null, [Validators.required, Validators.minLength(4), Validators.maxLength(6)]], // OTP de 4 a 6 dígitos
  });

  getLabelButton(): string {
    if (this.checks.every((c) => c === true)) return 'Realizar compra';
    if (this.isCatwalk) return 'Proceso de compra';
    return 'Proceso de compra';
  }

  buttonChecks(): boolean {
    if (this.disabledStartOrderButton) return true;
    if (!this.isCatwalk) return false;
    if (this.isCatwalk && this.checks.every((c) => c === true)) return false;
    return true;
  }
  get checks(): boolean[] {
    return [
      (this.selectedInvoice.id === 1 && this.formBoleta.valid) ||
        (this.selectedInvoice.id === 2 && this.formFactura.valid),
      (this.selectedDeliveryType.id === 2 && !!this.coordenadas && !!this.distancia) ||
        this.selectedDeliveryType.id === 1,
      this.pagoYapeForm.valid,
    ];
  }
  getCheck(check: number): boolean {
    return this.checks[check] ?? false;
  }

  getDeliveryMount() {
    if (this.selectedDeliveryType.id === 1) {
      return 0;
    }
    if (this.getSubtotal() >= this.delivery_gratis) return 0;
    const kg_total = this.cart?.detalles.reduce((previous, current) => {
      return previous + current.producto.peso_kg * current.cantidad;
    }, 0);
    const total = Math.max(this.tarifa, kg_total * this.distancia * this.precio_kg_km);
    return total;
  }
  getTotalMount(): number {
    return this.getDeliveryMount() + this.getSubtotal();
  }

  disabledStartOrderButton: boolean = false;

  startOrder() {
    if (this.cart.detalles.length <= 0) {
      this.message.warn({
        summary: 'No hay productos en carrito',
        detail: 'Agregue productos al carrito',
      });
    }

    this.disabledStartOrderButton = true;
    this.message.info({
      summary: 'Procesando Solicitud',
      detail: 'Por favor espere...',
    });
    if (this.isCatwalk === true && this.checks.every((c) => c === true)) {
      const body = {
        carrito: this.cart,
        ...(this.selectedInvoice.id === 1
          ? { comprobante: { id: this.selectedInvoice.id, boleta: this.formBoleta.value } }
          : { comprobante: { id: this.selectedInvoice.id, factura: this.formFactura.value } }),
        ...(this.selectedDeliveryType.id === 1
          ? { tipo_entrega: { id: this.selectedDeliveryType.id } }
          : { tipo_entrega: { id: this.selectedDeliveryType.id, coordenadas: this.coordenadas } }),
        metodo_pago: { id: 2, yape: this.pagoYapeForm.value },
        subtotal: this.getSubtotal(),
        delivery_costo: this.getDeliveryMount(),
        total: this.getTotalMount(),
      };

      this.http.post(`${this.API_URL}order/create`, body, { withCredentials: true }).subscribe({
        next: () => {
          this.message.success({
            summary: 'Orden creada',
            detail: 'La orden ha sido creada con exito',
          });
          this.closeCatwalk();
          this.formFactura.reset();
          this.formBoleta.reset();
          this.coordenadas = null;
          this.marcadorActual = null;
          this.mensaje = '';
          this.distancia = 0;
          this.selectedDeliveryType = this.deliveryTypes[1];
          this.selectedInvoice = this.invoices[0];
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
          this.router.navigate(['/perfil', 'pedidos']);
        },
        error: (err) => {
          this.getCart();
          const errorMessage = err.error.message || 'Hubo un error inesperado';

          this.message.error({
            summary: `No se pudo crear la orden, intenté de nuevo`,
            detail: `Hubo un problema: ${errorMessage}`,
          });
          this.disabledStartOrderButton = false;
        },
        complete: () => {
          this.getCart();
          this.disabledStartOrderButton = false;
        },
      });
    }
  }

  hasProducts() {
    if (this.cart?.detalles?.length <= 0) return true;
    return false;
  }
}
