import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuarios } from '../../../services/usuarios';

@Component({
  selector: 'app-ver-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ver-user.html',
  styleUrl: './ver-user.css'
})
export class VerUser implements OnInit {
  private usuariosSrv = inject(Usuarios);

  @Input() soloRolUser = false;
  @Input() soloEstado: 'activo' | 'suspendido' | 'pre_confirmacion' | null = null;


  nombre = '';
  arrayFiltred: any[] = [];
  private _todo: any[] = [];
  cargando = false;
  error = '';

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;

    this.usuariosSrv.getUsuarios({ page: 1, per_page: 100 }).subscribe({

      next: (data: any) => {
        // Normalizo a array
        const raw: any[] =
          Array.isArray(data)           ? data :
          Array.isArray(data?.usuarios) ? data.usuarios :
          Array.isArray(data?.data)     ? data.data :
          Array.isArray(data?.results)  ? data.results :
          Array.isArray(data?.items)    ? data.items :
          (data ? [data] : []);

        // Normalizo campos y rol
        const lista = raw.map(u => {
          const roleRaw = (u.rol ?? u.role ?? '').toString().trim().toLowerCase();
          const roleNorm = roleRaw || 'user'; 
          return {
            ...u,
            estado: u.estado ?? (u.activo ? 'activo' : 'bloqueado'),
            rol: roleNorm
          };
        });

        let base = lista;
        if (this.soloRolUser) {
          base = lista.filter(u => {
            const r = (u.rol || '').toString().toLowerCase();
            if (!r) return true; 
            if (r === 'admin' || r === 'empleado') return false;
            
            return r === 'user' || r === 'usuario' || r === 'cliente';
          });
        }
        if (this.soloEstado) {
          const est = this.soloEstado.toLowerCase();
          base = base.filter(u => (u.estado || '').toString().toLowerCase() === est);
        }

        this._todo = base;
        this.arrayFiltred = [...base];
        this.cargando = false;

        
      },
      error: (err) => {
        console.error('GET /usuarios error:', err);
        this.error = err?.status === 403
          ? 'No tenés permisos para ver esta sección.'
          : 'No se pudo cargar usuarios.';
        this.cargando = false;
      }
    });
  }

  buscar(): void {
    const q = (this.nombre || '').trim().toLowerCase();
    this.arrayFiltred = !q ? [...this._todo] :
      this._todo.filter(u =>
        (u.name  || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
      );
  }

  bloquear(u: any): void {
    if (!confirm(`¿Suspender a ${u.name}?`)) return;
    this.usuariosSrv.updateUsuarioEstado(u.id, 'suspendido').subscribe({
      next: () => { /* ... */ },
      error: (err: any) => { console.error(err); alert('No se pudo suspender'); }
    });
  }
  

  activar(u: any): void {
    if (!confirm(`¿Activar a ${u.name}?`)) return;
    this.usuariosSrv.updateUsuarioEstado(u.id, 'activo').subscribe({
      next: () => { /* ... */ },
      error: (err: any) => { console.error(err); alert('No se pudo activar'); }
    });
  }
}
