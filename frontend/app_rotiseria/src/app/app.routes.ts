// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Errorpage } from './pages/errorpage/errorpage';
import { authsessionGuard } from './guards/authsession-guard';
import { adminGuard } from './guards/admin.guard-guard';
import { empleadoGuard } from './guards/empleado.guard-guard';

export const routes: Routes = [
  {path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login)},
  
  {path: 'menu',loadComponent: () => import('./pages/menu/menu').then(m => m.Menu),data: { ver: false }},

  {path: 'registro',loadComponent: () => import('./pages/registro/registro').then(m => m.Registro)},
  
  {path: 'pedido-exito',loadComponent: () =>import('./pages/pedido-exito/pedido-exito').then(m => m.PedidoExito),canActivate: [authsessionGuard]},
  
  {path: 'estado-pedido',loadComponent: () => import('./pages/estado-pedido/estado-pedido').then(m => m.EstadoPedido),data: { ver: false },canActivate: [authsessionGuard]},
  
  {path: 'estado-pedido-empleado',loadComponent: () => import('./pages/estado-pedido/estado-pedido').then(m => m.EstadoPedido),data: { ver: true },canActivate: [empleadoGuard]},

  {path: 'calificar',loadComponent: () => import('./pages/calificar/calificar').then(m => m.Calificar),canActivate: [authsessionGuard]},
  
  {path: 'admin',loadComponent: () => import('./pages/panel/panel').then(m => m.Panel),data: { ver: true } , canActivate: [adminGuard]},
  
  {path: 'empleado',loadComponent: () => import('./pages/panel/panel').then(m => m.Panel),data: { ver: false } ,canActivate: [empleadoGuard] },
      
  {path: 'empleado-actualizar-estado',loadComponent: () => import('./pages/empleado-actualizar-estado/empleado-actualizar-estado').then(m => m.EmpleadoActualizarEstado),canActivate: [empleadoGuard]},

  {path: 'empleado-validar',loadComponent: () => import('./pages/empleado-validar/empleado-validar').then(m => m.EmpleadoValidar),canActivate: [empleadoGuard]},

  {path: 'empleado-stock',loadComponent: () => import('./pages/empleado-stock/empleado-stock').then(m => m.EmpleadoStock),canActivate: [empleadoGuard]},

  {path: 'empleado-cargar',loadComponent: () => import('./pages/empleado-cargar/empleado-cargar').then(m => m.EmpleadoCargar),canActivate: [empleadoGuard]},
  
  {path: 'historial-admin',loadComponent: () => import('./pages/historial-admin/historial-admin').then(m => m.HistorialAdmin),canActivate: [adminGuard]},
  
  {path: 'usuarios-admin',loadComponent: () => import('./pages/usuarios-admin/usuarios-admin').then(m => m.UsuariosAdmin),canActivate: [adminGuard]},

  {path: 'menu-admin',loadComponent: () => import('./pages/menu/menu').then(m => m.Menu),data: { ver: true },canActivate: [adminGuard]},
  
  {path: 'promos-admin',loadComponent: () => import('./pages/promos-admin/promos-admin').then(m => m.PromosAdmin),canActivate: [adminGuard]},
  
  {path: 'agregar-producto',loadComponent: () => import('./pages/producto-form/producto-form').then(m => m.ProductoForm),data: { ver: false },canActivate: [adminGuard]}, // agregar
  
  {path: 'editar-producto',loadComponent: () => import('./pages/producto-form/producto-form').then(m => m.ProductoForm),data: { ver: true },canActivate: [adminGuard]} ,// editar

  {path: 'agregar-promo',loadComponent: () => import('./pages/promo-form/promo-form').then(m => m.PromoForm),data: { ver: false } ,canActivate: [adminGuard]},
  
  {path: 'editar-promo',loadComponent: () => import('./pages/promo-form/promo-form').then(m => m.PromoForm),data: { ver: true } ,canActivate: [adminGuard]},
  
  {path:'error', component: Errorpage},

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {path:'**',redirectTo: 'error'}


  
];
