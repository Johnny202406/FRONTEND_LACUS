import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Catalog } from './components/catalog/catalog';
import { ProductDetails } from './components/product-details/product-details';
import { Cart } from './components/cart/cart';
import { Auth } from './components/auth/auth';
import { ErrorPage } from './components/error-page/error-page';
import { Dashboard } from './components/dashboard/dashboard';

import { isGuestGuard } from './guards/is-guest-guard';
import { isUserGuard } from './guards/is-user-guard';

export const routes: Routes = [
  { path: 'inicio', component: Home },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  { path: 'acceso', component: Auth,canActivate:[isGuestGuard] },
  { path: 'categorias', component: Catalog },
  { path: 'categorias/:id', component: Catalog },
  { path: 'marcas', component: Catalog },
  { path: 'marcas/:id', component: Catalog },
  { path: 'busqueda/:id', component: Catalog },
  { path: 'producto/:id', component: ProductDetails },
  { path: 'carrito', component: Cart,canActivate:[isUserGuard] },
  { path: 'perfil', component: Dashboard,canActivate:[isUserGuard]},
  { path: 'admin', component: Dashboard, canActivate: [isUserGuard] },

  { path: '**', component: ErrorPage },
];
