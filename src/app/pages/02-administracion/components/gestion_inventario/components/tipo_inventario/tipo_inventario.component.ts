import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Table } from 'primeng/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { GestionInventarioGrupoInventarioInterface, GestionInventarioLineaInventarioInterface, GestionInventarioTipoInventarioInterface } from 'src/app/pages/02-administracion/interfaces/gestion-inventario.interface';

@Component({
  selector: 'app-administracion-gestion-inventario-tipo-inventario',
  templateUrl: './tipo_inventario.component.html',
})
export class AdministracionGestionInventarioTipoInventarioComponent {
  apiService = inject(ApiService);
  loginService = inject(LoginService);
  sweetService = inject(SweetAlertService);
  formService = inject(ReactiveFormsService);

  blockedSend: boolean = false;

  loadingTipoInventario: boolean = false;
  listTipoInventario: GestionInventarioTipoInventarioInterface[] = [];
  searchTipoInventario: string | undefined;
  modalInfo: boolean = false;

  myForm: FormGroup;
  listLineaInventario: GestionInventarioLineaInventarioInterface[] = [];
  loadingLineaInventario: boolean = false;
  listGrupoInventario: GestionInventarioGrupoInventarioInterface[] = [];
  loadingGrupoInventario: boolean = false;

  codLineaInventario: string = "";
  codGrupoInventario: string = "";
  codTipoInventario: string = "";

  filterGrupoInventario: (string | null)[] = [];

  constructor() {
    this.myForm = new FormGroup({
      "lineaInventario": new FormControl('', [Validators.required]),
      "grupoInventario": new FormControl('', [Validators.required]),
      "nombreTipoMaterial": new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.onGetTipoInventario();
    this.onGetLineaInventario();
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

  onGetLineaInventario() {
    this.loadingLineaInventario = true;
    const parametros = {
      codigo: 1066,
      parametros: {
        'CodigoLineaInventario': null
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listLineaInventario = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingLineaInventario = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingLineaInventario = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onOpenModalCreate() {
    this.modalInfo = true;
    this.myForm.reset();
    this.codLineaInventario = "";
    this.codGrupoInventario = "";
    this.codTipoInventario = "";
  }

  onOpenModalEdit(tipoMaterial: any) {
    this.modalInfo = true;
    this.myForm.patchValue({
      "codigoTipoMaterial": tipoMaterial.CodigoTipoMaterial,
      "nombreTipoMaterial": tipoMaterial.NombreTipoMaterial,
    });
  }

  onChangeLineaInventario(infoLineaInventario: GestionInventarioLineaInventarioInterface) {
    if (infoLineaInventario !== null) {
      this.codLineaInventario = infoLineaInventario.CodigoLineaInventario ?? "";
      this.onGetGrupoInventario(infoLineaInventario.IdLineaInventario ?? 0);
      this.myForm.patchValue({
        "grupoInventario": null,
      });
      this.codGrupoInventario = "";
    }
  }

  onGetGrupoInventario(idLineaInventario: number) {
    this.loadingGrupoInventario = true;
    const parametros = {
      codigo: 1016,
      parametros: {
        "GrupoInventario": null,
        "IdLineaInventario": idLineaInventario,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listGrupoInventario = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingGrupoInventario = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingGrupoInventario = false;
      }
    });
  }

  onChangeGrupoInventario(infoGrupoInvetario: GestionInventarioGrupoInventarioInterface) {
    if (infoGrupoInvetario !== null) {
      this.codGrupoInventario = infoGrupoInvetario.GrupoInventario ?? "";
      const aux: number = this.listTipoInventario.filter(item => item.IdLineaInventario
        === infoGrupoInvetario.IdLineaInventario && item.IdGrupoInventario === infoGrupoInvetario.IdGrupoInventario).length + 1;
      this.codTipoInventario = aux < 10 ? `0${aux}` : `${aux}`;
    }
  }

  onInsertTipoInventario() {
    if (this.formService.validForm(this.myForm)) {
      this.blockedSend = true;
      const parametros = {
        codigo: 1018,
        parametros: {
          "CodigoTipoInventario": this.codTipoInventario,
          "NombreTipoInventario": this.myForm.value.nombreTipoMaterial,
          "IdGrupoInventario": this.myForm.value.grupoInventario.IdGrupoInventario,
        },
        infoLog: {
          "Fecha": new Date(),
          "Usuario": this.loginService.usuario.UserName,
          "Evento": "Insert",
          "Referencia": "Tipo de inventario",
          "Detalle": null,
          "ServerName": null,
          "UserHostAddress": null,
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.modalInfo = false;
            this.blockedSend = false;
            this.sweetService.viewSuccess('Se creo el nuevo tipo de inventario', () => { });
            this.ngOnInit();
          } else {
            this.sweetService.viewDanger(parametros.codigo, resp.message);
          }
        }, error: (err) => {
          this.blockedSend = false;
          this.sweetService.viewDanger(parametros.codigo, err.error);
        }
      });
    } else {
      this.sweetService.toastWarning('Ingrese todos los parametros');
    }
  }
}
