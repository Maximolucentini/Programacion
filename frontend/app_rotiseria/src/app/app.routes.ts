// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Errorpage } from './pages/errorpage/errorpage';

export const routes: Routes = [
  {path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login)},
  
  {path: 'menu',loadComponent: () => import('./pages/menu/menu').then(m => m.Menu)},

  {path: 'registro',loadComponent: () => import('./pages/registro/registro').then(m => m.Registro)},
  
  {path: 'pedido-exito',loadComponent: () =>import('./pages/pedido-exito/pedido-exito').then(m => m.PedidoExito)},

  {path: 'estado-pedido',loadComponent: () =>import('./pages/estado-pedido/estado-pedido').then(m => m.EstadoPedido)},
 
  {path: 'calificar',loadComponent: () => import('./pages/calificar/calificar').then(m => m.Calificar)},
  
  {path: 'empleado',loadComponent: () => import('./pages/empleado/empleado').then(m => m.Empleado)},
  
  {path: 'estado-pedido-empleado',loadComponent: () => import('./pages/estado-pedido-empleado/estado-pedido-empleado').then(m => m.EstadoPedidoEmpleado)},
  
  {path: 'empleado-actualizar-estado',loadComponent: () => import('./pages/empleado-actualizar-estado/empleado-actualizar-estado').then(m => m.EmpleadoActualizarEstado)},

  {path: 'empleado-validar',loadComponent: () => import('./pages/empleado-validar/empleado-validar').then(m => m.EmpleadoValidar)},

  {path: 'empleado-stock',loadComponent: () => import('./pages/empleado-stock/empleado-stock').then(m => m.EmpleadoStock)},

  {path: 'empleado-cargar',loadComponent: () => import('./pages/empleado-cargar/empleado-cargar').then(m => m.EmpleadoCargar)},

  {path: 'admin',loadComponent: () => import('./pages/admin/admin').then(m => m.Admin)},

  {path: 'menu-admin',loadComponent: () => import('./pages/menu-admin/menu-admin').then(m => m.MenuAdmin)},
  
  {path: 'historial-admin',loadComponent: () => import('./pages/historial-admin/historial-admin').then(m => m.HistorialAdmin)},
  
  {path: 'usuarios-admin',loadComponent: () => import('./pages/usuarios-admin/usuarios-admin').then(m => m.UsuariosAdmin)},
  
  {path: 'promos-admin',loadComponent: () => import('./pages/promos-admin/promos-admin').then(m => m.PromosAdmin)},
  
  {path: 'editar-promo',loadComponent: () => import('./pages/editar-promo/editar-promo').then(m => m.EditarPromo)},
  
  {path: 'agregar-promo',loadComponent: () => import('./pages/agregar-promo/agregar-promo').then(m => m.AgregarPromo)},
  
  {path: 'editar-producto',loadComponent: () => import('./pages/editar-producto/editar-producto').then(m => m.EditarProducto)},

  {path: 'agregar-producto',loadComponent: () => import('./pages/agregar-producto/agregar-producto').then(m => m.AgregarProducto)},
  
  {path:'error', component: Errorpage},

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {path:'**',redirectTo: 'error'}


  
];
