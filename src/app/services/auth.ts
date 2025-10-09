import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Confirmation } from './confirmation';
import { Message } from './message';
declare const google: any;
@Injectable({
  providedIn: 'root',
})
export class Auth {
  user$ = new BehaviorSubject<any>(false);
  channel = new BroadcastChannel('user');

  http = inject(HttpClient);
  router = inject(Router);
  message = inject(Message);

  API_URL = 'http://localhost:3000/api/';
  protectedRoutes = ['/perfil', '/carrito', '/admin'];
  routesForGuests = ['/acceso'];

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
      const isGuestRoute = this.routesForGuests.some((route) => this.router.isActive(route, true));

      if (value && isGuestRoute) {
        this.router.navigate(['/carrito']);
        return;
      }
      const isProtectedRoute = this.protectedRoutes.some((route) =>
        this.router.isActive(route, true)
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
          this.user$.next(res.body);
          this.channel.postMessage(res.body);
          if (res.status == 200) {
            this.message.success({
              detail: 'Inicio de sesión exitoso',
              summary: 'Gracias por regresar a la tienda agropecuaria LACUS PERÚ',
            });
          }
          if (res.status == 202) {
            this.message.success({
              detail: 'Registro exitoso',
              summary: 'Bienvenido a la tienda agropecuaria LACUS PERÚ',
              text: 'Completa tu perfil y disfruta de compras más rápidas gracias al autocompletado.',
              sticky: true,
            });
          }
        },
        error: (err) => {
          this.message.clear();
          this.message.error({
            detail: 'Proceso fallido',
            summary: 'No se pudo completar el proceso, intenté de nuevo',
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
          this.user$.next(res.body);
          this.channel.postMessage(res.body);
        },
        error: (err) => {
          this.message.info({
            detail: 'Inicie sesión o Regístrese',
            summary: 'Bienvenido a la tienda agropecuaria LACUS PERÚ',
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
            detail: 'Cierre de sesión exitoso',
            summary: 'Gracias por visitar la tienda agropecuaria LACUS PERÚ',
          });
        },
        error: (err) => {
          this.message.warn({
            detail: 'Proceso fallido',
            summary: 'No se pudo completar el proceso, intenté de nuevo',
          })
        },
        complete() {},
      });
  }
}
