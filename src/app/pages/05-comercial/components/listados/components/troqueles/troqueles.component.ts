import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Table } from 'primeng/table';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { AdministracionProduccionTroquelesInterface } from 'src/app/pages/02-administracion/interfaces/produccion.interface';


@Component({
  selector: 'app-comercial-listados-troqueles',
  templateUrl: './troqueles.component.html',
})
export class ComercialListadosTroquelesComponent {
  apiService = inject(ApiService);
  sweetService = inject(SweetAlertService);
  loginService = inject(LoginService);
  formService = inject(ReactiveFormsService);

  blockedSendData: boolean = false;

  loadingTroquel: boolean = false;
  listTroquel: AdministracionProduccionTroquelesInterface[] = [];
  searchTroquel: string | undefined;
  modalCreateTroquel: boolean = false;
  idTroquel: number = 0;
  listCalculos: number[] = [];

  constructor() {

  }

  ngOnInit() {
    this.onGetAllTroquel();
  }

  onGetAllTroquel() {
    this.loadingTroquel = true;
    const parametros = {
      codigo: 1112,
      parametros: {
        "IdTroquel": null,
        "CodigoInternoTroquel": null,
        "ZetaTroquel": null,
        "AnchoTotalTroquel": null,
        "AnchoEtiqueta": null,
        "DesarrolloEtiqueta": null,
        "CorteRecto": null,
        "Estado": 1,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listTroquel = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingTroquel = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingTroquel = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
