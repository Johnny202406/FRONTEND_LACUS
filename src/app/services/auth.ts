import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
declare const google: any;
@Injectable({
  providedIn: 'root',
})
export class Auth {
  hasUser$ = new BehaviorSubject<boolean>(false);
  isRegistering$ = new BehaviorSubject<boolean>(false);
  channel = new BroadcastChannel('hasUser');

  http = inject(HttpClient);
  router = inject(Router);

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
      this.hasUser$.next(event.data);
    };
    this.hasUser$.subscribe((value) => {
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
  }

  popup() {
    google.accounts.id.renderButton(document.getElementById('btn-signin'), {
      text:'signin_with',
      theme: 'outline',
      shape: 'circle',
    });
    google.accounts.id.renderButton(document.getElementById('btn-signup'), {
      text:'signup_with',
      theme: 'outline',
      shape: 'circle',
    });
  }

  loginAndRegister(response: any) {
    

    console.log(response);
    this.http.post(this.API_URL+"auth/loginAndRegister",response, { observe: 'response' }).subscribe((response)=>{
      console.log(response);
      
      if (response.status==200) {
        
        
        this.hasUser$.next(true);
        this.channel.postMessage(true);
      }
      if (response.status==202) {
        this.isRegistering$.next(true)
      }
      
    })
  }
  register(){

  }

  logout() {
    this.hasUser$.next(false);
    this.channel.postMessage(false);
  }
}
