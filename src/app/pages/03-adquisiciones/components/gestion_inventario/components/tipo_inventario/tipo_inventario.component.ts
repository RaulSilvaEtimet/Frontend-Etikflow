import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Table } from 'primeng/table';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { GestionInventarioTipoInventarioInterface } from 'src/app/pages/02-administracion/interfaces/gestion-inventario.interface';

@Component({
  selector: 'app-adquisiciones-gestion-inventario-tipo-inventario',
  templateUrl: './tipo_inventario.component.html',
})
export class AdquisicionesGestionInventarioTipoInventarioComponent {
  apiService = inject(ApiService);
  loginService = inject(LoginService);
  sweetService = inject(SweetAlertService);
  formService = inject(ReactiveFormsService);

  loadingTipoInventario: boolean = false;
  listTipoInventario: GestionInventarioTipoInventarioInterface[] = [];
  searchTipoInventario: string | undefined;

  filterGrupoInventario: (string | null)[] = [];

  constructor() {

  }

  ngOnInit() {
    this.onGetTipoInventario();
  }

  onGetTipoInventario() {
    this.loadingTipoInventario = true;
    const parametros = {
      codigo: 1019,
      parametros: {
        "CodigoTipoInventario": null,
        "IdGrupoInventario": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listTipoInventario = [...resp.data];

          this.filterGrupoInventario = [...new Set(this.listTipoInventario.map(item => item.NombreGrupo))];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingTipoInventario = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingTipoInventario = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
