import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Usuarios, User, Paged } from '../../services/usuarios';
import { PedidosService } from '../../services/pedidos';
import { Navbar } from '../../componentes/navbar/navbar';
import { Footer } from '../../componentes/footer/footer';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Footer,RouterLink],
  templateUrl: './usuarios-admin.html',
  styleUrls: ['./usuarios-admin.css']
})
export class UsuariosAdmin implements OnInit {
  private usuariosSrv = inject(Usuarios);
  private pedidosSrv = inject(PedidosService);

  // estado
  loading = false;
  loadingPendientesUserId: number | null = null;
  updatingUserId: number | null = null;  
  error: string | null = null;

  // paginación
  page = 1;
  per_page = 5;        
  pages = 1;
  total = 0;

  // datos
  data: User[] = [];          
  allData: User[] = [];       
  clientPaginate = false;     

  ngOnInit(): void { this.cargar(); }

  private params() {
    return { page: this.page, per_page: this.per_page };
  }

  cargar(): void {
    this.loading = true;
    this.error = null;

    this.usuariosSrv.getUsuarios(this.params()).subscribe({
      next: (resp: Paged<User>) => {
        const items = resp.items ?? [];

        
        if (resp.pages && resp.total) {
          this.clientPaginate = false;
          this.data = items;
          this.pages = resp.pages;
          this.total = resp.total;
        } else {
          
          this.clientPaginate = true;
          this.allData = items;
          this.total = this.allData.length;
          this.pages = Math.max(1, Math.ceil(this.total / this.per_page));
          this.data = this.sliceClient();
        }

        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.error = 'No se pudieron cargar los usuarios.';
        this.loading = false;
      }
    });
  }
  verPendientes(u: User): void {
    if (!u || u.id == null) return;
  
    this.loadingPendientesUserId = u.id;
  
    this.pedidosSrv
      .list({
        user_id: u.id,
        status: 'cancelado',
        per_page: 1000,
      })
      .subscribe({
        next: (resp: { pedidos: any[] }) => {
          const pedidos = resp.pedidos ?? [];
  
          const total = pedidos.reduce(
            (acc: number, p: any) => acc + (p.total_amount ?? 0),
            0
          );
  
          this.loadingPendientesUserId = null;
  
          alert(
            `Total de pedidos cancelados de ${u.name || 'usuario #' + u.id}: $${total.toFixed(2)}`
          );
        },
        error: (e) => {
          console.error('Error al cargar pedidos cancelados', e);
          this.loadingPendientesUserId = null;
          alert('No se pudo obtener el total de pedidos cancelados de este usuario.');
        },
      });
  }
  
  editarRol(u: User): void {
    if (!u || u.id == null) return;

    const actual = u.role || 'user';
    const nuevo = prompt(
      `Nuevo rol para ${u.name || 'usuario #' + u.id} (por ejemplo: admin, empleado, user)`,
      actual
    );

    if (nuevo === null) return; 
    const role = nuevo.trim();
    if (!role || role === actual) return;

    this.updatingUserId = u.id;

    this.usuariosSrv.updateUsuario(u.id, { role }).subscribe({
      next: (updated) => {
        
        u.role = updated.role ?? role;
        this.updatingUserId = null;
      },
      error: (e) => {
        console.error('Error al actualizar rol', e);
        this.updatingUserId = null;
        alert('No se pudo actualizar el rol de este usuario.');
      },
    });
  }
  suspenderUsuario(u: User): void {
    if (!u || u.id == null) return;
    if (u.estado === 'suspendido') return;

    const ok = confirm(
      `¿Seguro que querés suspender al usuario ${u.name || 'usuario #' + u.id}?`
    );
    if (!ok) return;

    this.updatingUserId = u.id;

    this.usuariosSrv.updateUsuarioEstado(u.id, 'suspendido').subscribe({
      next: (updated) => {
        u.estado = updated.estado ?? 'suspendido';
        this.updatingUserId = null;
      },
      error: (e) => {
        console.error('Error al suspender usuario', e);
        this.updatingUserId = null;
        alert('No se pudo suspender este usuario.');
      },
    });
  }
  activarUsuario(u: User): void {
    if (!u || u.id == null) return;

    const ok = confirm(
      `¿Seguro que querés volver a activar al usuario ${u.name || 'usuario #' + u.id}?`
    );
    if (!ok) return;

    this.updatingUserId = u.id;

    this.usuariosSrv.updateUsuarioEstado(u.id, 'activo').subscribe({
      next: (updated) => {
        u.estado = updated.estado ?? 'activo';
        this.updatingUserId = null;
      },
      error: (e) => {
        console.error('Error al activar usuario', e);
        this.updatingUserId = null;
        alert('No se pudo activar este usuario.');
      },
    });
  }




  // ------- paginación  -------
  cambiarPagina(p: number): void {
    if (p < 1 || p > this.pages || p === this.page) return;
    this.page = p;
    if (this.clientPaginate) this.data = this.sliceClient();
    this.cargarIfApi();
  }

  primero() { this.cambiarPagina(1); }
  anterior() { this.cambiarPagina(this.page - 1); }
  siguiente() { this.cambiarPagina(this.page + 1); }
  ultima() { this.cambiarPagina(this.pages); }

  cambiarPageSize(): void {
    this.page = 1;
    if (this.clientPaginate) {
      this.pages = Math.max(1, Math.ceil(this.total / this.per_page));
      this.data = this.sliceClient();
    }
    this.cargarIfApi();
  }

  private cargarIfApi() {
    if (!this.clientPaginate) this.cargar();
  }

  private sliceClient(): User[] {
    const from = (this.page - 1) * this.per_page;
    return this.allData.slice(from, from + this.per_page);
  }

  get pagesToShow(): number[] {
    const max = 7;
    const arr: number[] = [];
    const start = Math.max(1, this.page - 3);
    const end = Math.min(this.pages, start + max - 1);
    for (let i = Math.max(1, end - max + 1); i <= end; i++) arr.push(i);
    return arr;
  }
}
