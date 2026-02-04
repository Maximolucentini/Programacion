import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Navbar } from '../../componentes/navbar/navbar';
import { Footer } from '../../componentes/footer/footer';

import { PromosService } from '../../services/promos';
import { Promo } from '../../interfaces/Promo';

@Component({
  selector: 'app-promos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Footer],
  templateUrl: './promos-admin.html',
  styleUrls: ['./promos-admin.css'],
})
export class PromosAdmin implements OnInit {
  private promosSrv = inject(PromosService);

  promos: Promo[] = [];
  loading = false;
  error: string | null = null;

  // filtros
  filtroEstado: '' | 'activa' | 'suspendida' = '';
  order: 'asc' | 'desc' = 'desc';

  ngOnInit(): void {
    this.cargarPromos();
  }

  cargarPromos(): void {
    this.loading = true;
    this.error = null;

    const estado = this.filtroEstado || undefined;

    this.promosSrv.getPromos({ estado, order: this.order }).subscribe({
      next: (data) => {
        
        this.promos = (data || []).map((p) => ({
          ...p,
          enviada: p.enviada ?? false,
        }));
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.error = 'No se pudieron cargar las promociones.';
        this.loading = false;
      },
    });
  }

  aplicarFiltros(): void {
    this.cargarPromos();
  }

  limpiarFiltros(): void {
    this.filtroEstado = '';
    this.order = 'desc';
    this.cargarPromos();
  }

  eliminarPromo(p: Promo): void {
    if (!confirm('¿Seguro que querés eliminar esta promoción?')) return;

    this.promosSrv.deletePromo(p.id).subscribe({
      next: () => {
        this.promos = this.promos.filter((x) => x.id !== p.id);
      },
      error: (e) => {
        console.error(e);
        alert('No se pudo eliminar la promoción.');
      },
    });
  }

  toggleEstado(p: Promo): void {
    const nuevoEstado: 'activa' | 'suspendida' =
      p.estado === 'activa' ? 'suspendida' : 'activa';

    const previo = p.estado;
    p.estado = nuevoEstado;

    this.promosSrv.updatePromo(p.id, { estado: nuevoEstado }).subscribe({
      next: (updated) => {
        p.estado = updated.estado;
      },
      error: (e) => {
        console.error(e);
        p.estado = previo;
        alert('No se pudo actualizar el estado.');
      },
    });
  }

  //enviar a todos los mails registrados
  enviarPromo(p: Promo): void {
    if (p.enviada) return;

    if (!confirm('¿Querés enviar esta promoción a todos los clientes registrados?')) {
      return;
    }

    this.promosSrv.sendPromo(p.id).subscribe({
      next: (updated) => {
        
        p.enviada = updated.enviada ?? true;
        p.sent_at = updated.sent_at;
      },
      error: (e) => {
        console.error(e);
        alert('No se pudo enviar la promoción.');
      },
    });
  }

  // helpers 
  fechaUi(fecha: string): string {
    if (!fecha) return '';
    
    const [y, m, d] = fecha.split('-');
    if (!y || !m || !d) return fecha;
    return `${d}/${m}/${y}`;
  }
}
