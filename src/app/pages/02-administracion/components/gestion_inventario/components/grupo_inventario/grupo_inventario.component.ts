import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Table } from 'primeng/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { GestionInventarioGrupoInventarioInterface, GestionInventarioLineaInventarioInterface } from '../../../../interfaces/gestion-inventario.interface';
import { LoginService } from 'src/app/pages/00-login/services/login.service';

@Component({
  selector: 'app-administracion-gestion-inventario-grupo-inventario',
  templateUrl: './grupo_inventario.component.html',
})
export class AdministracionGestionInventarioGrupoInventarioComponent {
  apiService = inject(ApiService);
  sweetService = inject(SweetAlertService);
  loginService = inject(LoginService);
  formService = inject(ReactiveFormsService);

  loadingGrupoInventario: boolean = false;
  listGrupoInventario: GestionInventarioGrupoInventarioInterface[] = [];
  searchGrupoInventario: string | undefined;
  modalInformacion: boolean = false;

  loadingLineaInventario: boolean = false;
  listLineaInventario: GestionInventarioLineaInventarioInterface[] = [];
  myForm: FormGroup;
  codGrupoInventario: string = "";
  codLineaInventario = "";
  blockedSendData: boolean = false;

  constructor() {
    this.myForm = new FormGroup({
      "lineaInventario": new FormControl('', [Validators.required]),
      "nombre": new FormControl('', [Validators.required]),
      "sigla": new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.onGetGrupoInventario();
    this.onGetLineaInventario();

  }

  onGetGrupoInventario() {
    this.loadingGrupoInventario = true;
    const parametros = {
      codigo: 1016,
      parametros: {
        "GrupoInventario": null,
        "IdLineaInventario": null,
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
    this.modalInformacion = true;
    this.myForm.reset();
  }

  onOpenModalEdit(grupoInventario: GestionInventarioGrupoInventarioInterface) {
    this.myForm.patchValue({
      "grupoInventario": grupoInventario.GrupoInventario,
      "nombre": grupoInventario.NombreGrupo,
      "sigla": grupoInventario.SiglaGrupo,
    });
    this.modalInformacion = true;
  }

  onChangeLineaInventario(infoLineaInventario: GestionInventarioLineaInventarioInterface) {
    if (infoLineaInventario !== null) {
      const aux: number = this.listGrupoInventario.filter(item => item.CodigoLineaInventario === infoLineaInventario.CodigoLineaInventario).length + 1;
      this.codGrupoInventario = aux < 10 ? `0${aux}` : `${aux}`;
      this.codLineaInventario = infoLineaInventario.CodigoLineaInventario ?? '';
    } else {
      this.codGrupoInventario = "";
      this.codLineaInventario = "";
    }
  }

  onInsertGrupoInventario() {
    if (this.formService.validForm(this.myForm)) {
      this.blockedSendData = true;
      const parametros = {
        codigo: 1015,
        parametros: {
          "GrupoInventario": this.codGrupoInventario,
          "NombreGrupo": this.myForm.value.nombre.toUpperCase(),
          "SiglaGrupo": this.myForm.value.sigla.toUpperCase(),
          "IdLineaInventario": this.myForm.value.lineaInventario.IdLineaInventario
        },
        infoLog: {
          "Fecha": new Date(),
          "Usuario": this.loginService.usuario.UserName,
          "Evento": "Insert",
          "Referencia": "Grupo de inventario",
          "Detalle": null,
          "ServerName": null,
          "UserHostAddress": null,
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.modalInformacion = false;
            this.blockedSendData = false;
            this.sweetService.viewSuccess('Se creo el nuevo grupo de inventario', () => { });
            this.ngOnInit();
          } else {
            this.sweetService.viewDanger(parametros.codigo, resp.message);
          }
        }, error: (err) => {
          this.blockedSendData = false;
          this.sweetService.viewDanger(parametros.codigo, err.error);
        }
      });
    } else {
      this.sweetService.toastWarning('Ingrese todos los parametros');
    }
  }
}
