import { Routes } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./modules/index/index.component').then((m) => m.IndexComponent),
    title: 'Inicio',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./modules/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    title: 'Registro',
  },
  {
    path: 'product',
    loadComponent: () =>
      import('./modules/product/product.component').then(
        (m) => m.ProductComponent
      ),
    title: 'Producto',
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('./modules/shop/shop.component').then((m) => m.ShopComponent),
    title: 'Shop',
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./modules/cart/cart.component').then((m) => m.CartComponent),
    title: 'Cart',
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./modules/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
    title: 'Checkout',
  },
  {
    path: 'account',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./modules/account/account.component').then(
        (m) => m.AccountComponent
      ),
    title: 'Cuenta',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./modules/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
    title: 'Página no encontrada',
  },
];
