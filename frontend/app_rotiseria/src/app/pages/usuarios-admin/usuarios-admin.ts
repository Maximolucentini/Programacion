import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Usuarios, User, Paged } from '../../services/usuarios';
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

  // estado
  loading = false;
  error: string | null = null;

  // paginación
  page = 1;
  per_page = 5;        // deja 5 para ver varias páginas en la demo
  pages = 1;
  total = 0;

  // datos
  data: User[] = [];          // datos de la página actual (modo API)
  allData: User[] = [];       // datos completos (modo cliente)
  clientPaginate = false;     // si la API no trae pages/total, paginamos en cliente

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

        // Si la API trae pages/total válidos → paginación por API
        if (resp.pages && resp.total) {
          this.clientPaginate = false;
          this.data = items;
          this.pages = resp.pages;
          this.total = resp.total;
        } else {
          // Fallback: la API devuelve todo sin paginar → paginamos en cliente
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

  // ------- paginación UI -------
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

  // muestra máx 7 botones de página
  get pagesToShow(): number[] {
    const max = 7;
    const arr: number[] = [];
    const start = Math.max(1, this.page - 3);
    const end = Math.min(this.pages, start + max - 1);
    for (let i = Math.max(1, end - max + 1); i <= end; i++) arr.push(i);
    return arr;
  }
}
