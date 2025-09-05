import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Table } from 'primeng/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { AdministracionProduccionAcabadoInterface } from '../../../interfaces/produccion.interface';

@Component({
  selector: 'app-administracion-produccion-acabados',
  templateUrl: './acabados.component.html',
})
export class AdministracionProduccionAcabadosComponent {
  apiService = inject(ApiService);
  sweetService = inject(SweetAlertService);
  loginService = inject(LoginService);
  formService = inject(ReactiveFormsService);

  loadingAcabado: boolean = false;
  listAcabados: AdministracionProduccionAcabadoInterface[] = [];
  searchAcabado: string | undefined;
  modalAcabado: boolean = false;

  myForm: FormGroup;
  idAcabado: number = 0;

  blockedSendData: boolean = false;

  constructor() {
    this.myForm = new FormGroup({
      "descripcion": new FormControl('', [Validators.required]),
      "precio": new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.onGetAllAcabados();
  }

  onGetAllAcabados() {
    this.loadingAcabado = true;
    const parametros = {
      codigo: 1128,
      parametros: {
        "IdAcabado": null,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listAcabados = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingAcabado = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingAcabado = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onCreateAcabado() {
    this.modalAcabado = true;
    this.idAcabado = 0;
    this.myForm.reset();
  }

  onEditAcabados(infoAcabado: AdministracionProduccionAcabadoInterface) {
    this.idAcabado = infoAcabado.IdAcabado;
    this.myForm.patchValue({
      descripcion: infoAcabado.DescripcionAcabado,
      precio: infoAcabado.PrecioMillar,
    });
    this.modalAcabado = true;
  }

  onInsertAcabado() {
    if (this.formService.validForm(this.myForm)) {
      this.blockedSendData = true;
      const parametros = {
        codigo: 1127,
        parametros: {
          "DescripcionAcabado": this.myForm.value.descripcion,
          "PrecioMillar": this.myForm.value.precio,
        },
        infoLog: {
          "Fecha": new Date(),
          "Usuario": this.loginService.usuario.UserName,
          "Evento": "Insert",
          "Referencia": "Acabado",
          "Detalle": null,
          "ServerName": null,
          "UserHostAddress": null,
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.modalAcabado = false;
            this.sweetService.viewSuccess('Se creo el nuevo acabado', () => { });
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

  onUpdateAcabados() {
    if (this.formService.validForm(this.myForm)) {
      this.blockedSendData = true;
      const parametros = {
        codigo: 1129,
        parametros: {
          "IdAcabado": this.idAcabado,
          "DescripcionAcabado": this.myForm.value.descripcion,
          "PrecioMillar": this.myForm.value.precio,
        },
        infoLog: {
          "Fecha": new Date(),
          "Usuario": this.loginService.usuario.UserName,
          "Evento": "Update",
          "Referencia": "Rebobinados",
          "Detalle": null,
          "ServerName": null,
          "UserHostAddress": null,
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.modalAcabado = false;
            this.sweetService.viewSuccess('Se creo el nuevo acabado', () => { });
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

  onSaveAcabado() {
    if (this.idAcabado === 0) {
      this.onInsertAcabado();
    } else {
      this.onUpdateAcabados();
    }
  }
}
