import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Catalog } from './components/catalog/catalog';
import { ProductDetails } from './components/product-details/product-details';
import { Cart } from './components/cart/cart';
import { Auth } from './components/auth/auth';
import { ErrorPage } from './components/error-page/error-page';
import { Dashboard } from './components/dashboard/dashboard';

import { isGuestGuard } from './guards/is-guest-guard';
import { Pedidos } from './components/dashboard/client/pedidos/pedidos';
import { Datos } from './components/dashboard/client/datos/datos';
import { isClientGuard } from './guards/is-client-guard';
import { isAdminGuard } from './guards/is-admin-guard';
import { Brand } from './components/dashboard/admin/brand/brand';
import { Category } from './components/dashboard/admin/category/category';
import { Entry } from './components/dashboard/admin/entry/entry';
import { Order } from './components/dashboard/admin/order/order';
import { Product } from './components/dashboard/admin/product/product';
import { Publication } from './components/dashboard/admin/publication/publication';
import { User } from './components/dashboard/admin/user/user';

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
  { path: 'carrito', component: Cart,canActivate:[isClientGuard] },
  { path: 'perfil', component: Dashboard,canActivate:[isClientGuard],canActivateChild:[isClientGuard],children:[
    {path:'',redirectTo:'pedidos',pathMatch:'full'},
    {path:'datos',component:Datos},
    {path:'pedidos',component:Pedidos}
  ]},
  { path: 'admin', component: Dashboard,canActivate:[isAdminGuard],canActivateChild:[isAdminGuard],children:[
    {path:'',redirectTo:'marcas',pathMatch:'full'},
    {path:'marcas',component:Brand},
    {path:'categorias',component:Category},
    {path:'entradas',component:Entry},
    {path:'pedidos',component:Order},
    {path:'productos',component:Product},
    {path:'publicaciones',component:Publication},
    {path:'usuarios',component:User},
  ]},

  { path: '**', component: ErrorPage },
];
