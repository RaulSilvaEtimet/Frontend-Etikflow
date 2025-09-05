import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Table } from 'primeng/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { GestionInventarioLineaInventarioInterface } from '../../../../interfaces/gestion-inventario.interface';
import { LoginService } from 'src/app/pages/00-login/services/login.service';

@Component({
  selector: 'app-administracion-gestion-inventario-linea-inventario',
  templateUrl: './linea_inventario.component.html',
})
export class AdministracionGestionInventarioLineaInventarioComponent {
  apiService = inject(ApiService);
  sweetService = inject(SweetAlertService);
  loginService = inject(LoginService);
  formService = inject(ReactiveFormsService);

  loadingLineaInventario: boolean = false;
  listLineaInventario: GestionInventarioLineaInventarioInterface[] = [];
  searchLineaInventario: string | undefined;

  modalInformacion: boolean = false;
  myForm: FormGroup;
  blockedSendData: boolean = false;

  constructor() {
    this.myForm = new FormGroup({
      "descripcion": new FormControl('', [Validators.required]),
      "codigo": new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.onGetLineaInventario();
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

  onInsertLineaInventario() {
    if (this.formService.validForm(this.myForm)) {
      this.blockedSendData = true;
      const parametros = {
        codigo: 1065,
        parametros: {
          "DescripcionLineaInventario": this.myForm.value.descripcion.toUpperCase(),
          "CodigoLineaInventario": this.myForm.value.codigo.toUpperCase(),
        },
        infoLog: {
          "Fecha": new Date(),
          "Usuario": this.loginService.usuario.UserName,
          "Evento": "Insert",
          "Referencia": "Linea de inventario",
          "Detalle": null,
          "ServerName": null,
          "UserHostAddress": null,
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.sweetService.viewSuccess('Se creo la nueva linea de inventario', () => { });
            this.modalInformacion = false;
            this.ngOnInit();
          } else {
            this.sweetService.viewDanger(parametros.codigo, resp.message);
          }
          this.blockedSendData = false;
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
