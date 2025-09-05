import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Table } from 'primeng/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { AdministracionProduccionRebobinadoInterface } from '../../../interfaces/produccion.interface';

@Component({
  selector: 'app-administracion-produccion-rebobinados',
  templateUrl: './rebobinados.component.html',
})
export class AdministracionProduccionRebobinadosComponent {
  apiService = inject(ApiService);
  sweetService = inject(SweetAlertService);
  loginService = inject(LoginService);
  formService = inject(ReactiveFormsService);

  loadingRebobinados: boolean = false;
  listRebobinados: AdministracionProduccionRebobinadoInterface[] = [];
  searchRebobinado: string | undefined;
  modalRebobinado: boolean = false;

  myForm: FormGroup;
  idRebobinado: number = 0;

  blockedSendData: boolean = false;

  constructor() {
    this.myForm = new FormGroup({
      "descripcion": new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.onGetAllRebobinados();
  }

  onGetAllRebobinados() {
    this.loadingRebobinados = true;
    const parametros = {
      codigo: 1125,
      parametros: {
        "IdRebobinado": null,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listRebobinados = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingRebobinados = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingRebobinados = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onCreateRebobinado() {
    this.modalRebobinado = true;
    this.idRebobinado = 0;
    this.myForm.reset();
  }

  onEditConos(infoRebobinado: AdministracionProduccionRebobinadoInterface) {
    this.idRebobinado = infoRebobinado.IdRebobinado;
    this.myForm.patchValue({
      descripcion: infoRebobinado.DescripcionRebobinado,
    });
    this.modalRebobinado = true;
  }

  onInsertRebobinados() {
    if (this.formService.validForm(this.myForm)) {
      this.blockedSendData = true;
      const parametros = {
        codigo: 1124,
        parametros: {
          "DescripcionRebobinado": this.myForm.value.descripcion,
        },
        infoLog: {
          "Fecha": new Date(),
          "Usuario": this.loginService.usuario.UserName,
          "Evento": "Insert",
          "Referencia": "Rebobinados",
          "Detalle": null,
          "ServerName": null,
          "UserHostAddress": null,
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.modalRebobinado = false;
            this.sweetService.viewSuccess('Se creo el nuevo cargo por consumo', () => { });
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

  onUpdateRebobinados() {
    if (this.formService.validForm(this.myForm)) {
      this.blockedSendData = true;
      const parametros = {
        codigo: 1126,
        parametros: {
          "IdRebobinado": this.idRebobinado,
          "DescripcionRebobinado": this.myForm.value.descripcion,
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
            this.modalRebobinado = false;
            this.sweetService.viewSuccess('Se creo el nuevo cargo por consumo', () => { });
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

  onSaveRebobinado() {
    if (this.idRebobinado === 0) {
      this.onInsertRebobinados();
    } else {
      this.onUpdateRebobinados();
    }
  }
}
