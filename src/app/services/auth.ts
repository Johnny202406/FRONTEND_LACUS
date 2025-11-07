import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Confirmation } from './confirmation';
import { Message } from './message';
import { UpdateUser, User } from '../interfaces';
import { toSignal } from '@angular/core/rxjs-interop';
import { ENV } from '../env';
interface links {
  icon: string;
  label: string;
  routerLink: string;
}
declare const google: any;
@Injectable({
  providedIn: 'root',
})
export class Auth {
  user$ = new BehaviorSubject<boolean | User>(false);
  user = toSignal(this.user$ as BehaviorSubject<User>);
  channel = new BroadcastChannel('user');
  API_URL = ENV.API_URL;
  http = inject(HttpClient);
  router = inject(Router);
  message = inject(Message);

  protectedRoutes = ['/perfil', '/carrito', '/admin'];
  routesForGuests = ['/acceso'];

  linksClient: links[] = [
    { icon: 'pi pi-user', label: 'Datos', routerLink: 'datos' },
    { icon: 'pi pi-shopping-bag', label: 'Pedidos', routerLink: 'pedidos' },
  ];

  linksAdmin: links[] = [
    { icon: 'pi pi-slack', label: 'Marcas', routerLink: 'marcas' },
    { icon: 'pi pi-expand', label: 'Categorías', routerLink: 'categorias' },
    { icon: 'pi pi-barcode', label: 'Entradas', routerLink: 'entradas' },
    { icon: 'pi pi-shopping-bag', label: 'Pedidos', routerLink: 'pedidos' },
    { icon: 'pi pi-gift', label: 'Productos', routerLink: 'productos' },
    { icon: 'pi pi-images', label: 'Publicaciones', routerLink: 'publicaciones' },
    { icon: 'pi pi-users', label: 'Usuarios', routerLink: 'usuarios' },
  ];
  linksUsed: links[] = [];

  constructor() {
    google.accounts.id.initialize({
      client_id: '674258805885-7b0nm3fhmh2l8k6cu87gq9cmj6tbtn6o.apps.googleusercontent.com',
      ux_mode: 'popup',
      callback: (response: any) => {
        this.loginAndRegister(response);
      },
    });
    this.channel.onmessage = (event) => {
      this.user$.next(event.data);
    };
    this.user$.subscribe((value) => {
      const isGuestRoute = this.routesForGuests.some((route) => this.router.isActive(route, false));

      const user = value as unknown as User;
      if (user?.tipo_usuario?.id === 1) {
        this.linksUsed = this.linksAdmin;
        isGuestRoute?this.router.navigate(['/admin']):null;
      }

      if (user?.tipo_usuario?.id === 2) {
        this.linksUsed = this.linksClient;
        isGuestRoute?this.router.navigate(['/perfil']):null;
        return;
      }

      
      const isProtectedRoute = this.protectedRoutes.some((route) =>
        this.router.isActive(route, false)
      );

      if (!value && isProtectedRoute) {
        this.router.navigate(['/acceso']);
        return;
      }
    });
    this.loadUser();
  }

  popup() {
    google.accounts.id.renderButton(document.getElementById('btn-signin'), {
      text: 'signin_with',
      theme: 'outline',
      shape: 'circle',
    });
    google.accounts.id.renderButton(document.getElementById('btn-signup'), {
      text: 'signup_with',
      theme: 'outline',
      shape: 'circle',
    });
  }

  loginAndRegister(jwt: any) {
    this.message.info({ detail: 'Procesando...', summary: 'Espere por favor', sticky: true });
    console.log(jwt);
    this.http
      .post(this.API_URL + 'auth/loginAndRegister', jwt, {
        observe: 'response',
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          this.message.clear();
          console.log(res);
          this.user$.next(res.body as User);
          this.channel.postMessage(res.body);
          if (res.status == 200) {
            this.message.success({
              summary: 'Inicio de sesión exitoso',
              detail: 'Gracias por regresar a la tienda agropecuaria LACUS PERÚ',
            });
          }
          if (res.status == 202) {
            this.message.success({
              summary: 'Registro exitoso',
              detail:
                'Bienvenido a LACUS PERÚ. Completa tu perfil y disfruta de compras más rápidas.',
              sticky: true,
            });
          }
        },
        error: (err) => {
          this.message.clear();
          this.message.error({
            summary: 'Proceso fallido',
            detail: 'No se pudo completar el proceso, intenté de nuevo',
          });
        },
        complete: () => {},
      });
  }
  loadUser() {
    this.http
      .get(this.API_URL + 'auth/loadUser', {
        observe: 'response',
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.user$.next(res.body as User);
          this.channel.postMessage(res.body);
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

  logout() {
    this.http
      .get(this.API_URL + 'auth/logout', {
        observe: 'response',
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          this.user$.next(false);
          this.channel.postMessage(false);
          this.message.info({
            summary: 'Cierre de sesión exitoso',
            detail: 'Gracias por visitar la tienda agropecuaria LACUS PERÚ',
          });
        },
        error: (err) => {
          this.message.warn({
            summary: 'Proceso fallido',
            detail: 'No se pudo completar el proceso, intenté de nuevo',
          });
        },
        complete() {},
      });
  }
  updateUser(value: UpdateUser) {
    const payload = {
      nombre: value.nombre.toUpperCase().trim(),
      apellido: value.apellido.toUpperCase().trim(),
      dni: value.dni.toString().trim(),
      numero: value.numero.toString().trim(),
    };
    const id = this.user() ? this.user()!.id : '';
    this.http
      .patch(this.API_URL + 'user/update/' + id, payload, {
        observe: 'response',
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          this.user$.next(res.body as User);
          this.channel.postMessage(res.body);
          this.message.success({
            summary: 'Perfil actualizado',
            detail: 'Tu perfil ha sido actualizado con exito',
          });
        },
        error: (err) => {
          this.message.error({
            summary: 'Proceso fallido',
            detail: 'No se pudo actualizar tu perfil, intenté de nuevo',
          });
        },
      });
  }
}
