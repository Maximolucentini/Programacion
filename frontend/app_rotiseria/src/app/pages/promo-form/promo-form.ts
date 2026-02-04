import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Navbar } from '../../componentes/navbar/navbar';
import { Footer } from '../../componentes/footer/footer';

import { PromosService } from '../../services/promos';
import { Promo } from '../../interfaces/Promo';

@Component({
  selector: 'app-promo-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Footer],
  templateUrl: './promo-form.html',
  styleUrls: ['./promo-form.css'],
})
export class PromoForm implements OnInit {
  private promosSrv = inject(PromosService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = false;
  saving = false;
  error: string | null = null;

  promoId: number | null = null;
  modoEdicion = false;

  
  form = {
    title: '',
    description: '',
    fecha: '', 
    activa: true, 
  };

  ngOnInit(): void {
    const idParam = this.route.snapshot.queryParamMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!Number.isNaN(id)) {
        this.promoId = id;
        this.modoEdicion = true;
        this.cargarPromo(id);
      }
    }
  }

  private cargarPromo(id: number): void {
    this.loading = true;
    this.error = null;

    this.promosSrv.getPromo(id).subscribe({
      next: (p: Promo) => {
        this.form.title = p.title ?? '';
        this.form.description = p.description ?? '';
        this.form.fecha = p.fecha ?? '';
        this.form.activa = p.estado === 'activa';
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.error = 'No se pudo cargar la promoción.';
        this.loading = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/promos-admin']);
  }

  private validar(): boolean {
    const title = this.form.title.trim();
    const description = this.form.description.trim();
    const fecha = this.form.fecha;

    if (!title) {
      this.error = 'El título es obligatorio.';
      return false;
    }

    if (!description) {
      this.error = 'La descripción es obligatoria.';
      return false;
    }

    if (!fecha) {
      this.error = 'La fecha es obligatoria.';
      return false;
    }

    this.error = null;
    return true;
  }

  guardar(): void {
    if (!this.validar()) return;

    this.saving = true;

    const estado: 'activa' | 'suspendida' =
      this.form.activa ? 'activa' : 'suspendida';

    const payload: Partial<Omit<Promo, 'id'>> = {
      title: this.form.title.trim(),
      description: this.form.description.trim(),
      fecha: this.form.fecha,
      estado,
    };


    if (this.modoEdicion && this.promoId) {
      this.promosSrv.updatePromo(this.promoId, payload).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/promos-admin']);
        },
        error: (e) => {
          console.error(e);
          this.error = 'No se pudieron guardar los cambios.';
          this.saving = false;
        }
      });
      return;
    }

    // Crear nueva promo
    this.promosSrv.createPromo(payload as any).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/promos-admin']);
      },
      error: (e) => {
        console.error(e);
        this.error = 'No se pudo crear la promoción.';
        this.saving = false;
      }
    });
  }
}
