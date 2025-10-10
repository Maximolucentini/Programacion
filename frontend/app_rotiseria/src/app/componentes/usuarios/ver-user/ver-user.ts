// src/app/componentes/usuarios/ver-user/ver-user.ts
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

  /** En empleado-validar: true para mostrar solo usuarios finales (no admin/empleado) */
  @Input() soloRolUser = false;

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

    this.usuariosSrv.getUsuarios().subscribe({
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
          const roleNorm = roleRaw || 'user'; // si viene vacío/undefined lo consideramos 'user'
          return {
            ...u,
            estado: u.estado ?? (u.activo ? 'activo' : 'bloqueado'),
            rol: roleNorm
          };
        });

        // Filtro solo 'usuarios finales' cuando lo pida el padre (empleado-validar)
        // Incluimos variantes comunes: 'user', 'usuario', 'cliente' y también vacío.
        let base = lista;
        if (this.soloRolUser) {
          base = lista.filter(u => {
            const r = (u.rol || '').toString().toLowerCase();
            if (!r) return true; // vacío => tratar como usuario final
            if (r === 'admin' || r === 'empleado') return false;
            // variantes aceptadas como 'user':
            return r === 'user' || r === 'usuario' || r === 'cliente';
          });
        }

        this._todo = base;
        this.arrayFiltred = [...base];
        this.cargando = false;

        // Si querés ver qué valores de rol están llegando:
        // console.log('roles en respuesta:', lista.map(x => x.rol));
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
    if (!confirm(`¿Bloquear a ${u.name}?`)) return;
    this.usuariosSrv.updateUsuarioEstado(u.id, 'bloqueado').subscribe({
      next: () => { u.estado = 'bloqueado'; this.buscar(); },
      error: (err) => { console.error(err); alert('No se pudo bloquear el usuario'); }
    });
  }

  activar(u: any): void {
    if (!confirm(`¿Activar a ${u.name}?`)) return;
    this.usuariosSrv.updateUsuarioEstado(u.id, 'activo').subscribe({
      next: () => { u.estado = 'activo'; this.buscar(); },
      error: (err) => { console.error(err); alert('No se pudo activar el usuario'); }
    });
  }
}
