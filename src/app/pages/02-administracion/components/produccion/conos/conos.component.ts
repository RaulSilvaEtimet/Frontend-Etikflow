import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Table } from 'primeng/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { AdministracionProduccionConoInterface } from '../../../interfaces/produccion.interface';

@Component({
  selector: 'app-administracion-produccion-conos',
  templateUrl: './conos.component.html',
})
export class AdministracionProduccionConosComponent {
  apiService = inject(ApiService);
  sweetService = inject(SweetAlertService);
  loginService = inject(LoginService);
  formService = inject(ReactiveFormsService);

  loadingConos: boolean = false;
  listConos: AdministracionProduccionConoInterface[] = [];
  searchConos: string | undefined;
  modalCono: boolean = false;

  myForm: FormGroup;
  idConos: number = 0;

  blockedSendData: boolean = false;

  constructor() {
    this.myForm = new FormGroup({
      "descripcion": new FormControl('', [Validators.required]),
      "medida": new FormControl('', [Validators.required]),
      "siglas": new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.onGetAllConos();
  }

  onGetAllConos() {
    this.loadingConos = true;
    const parametros = {
      codigo: 1122,
      parametros: {
        "IdCono": null,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listConos = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingConos = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingConos = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onCreateConos() {
    this.modalCono = true;
    this.idConos = 0;
    this.myForm.reset();
  }

  onEditConos(infoConos: AdministracionProduccionConoInterface) {
    this.idConos = infoConos.IdCono;
    this.myForm.patchValue({
      descripcion: infoConos.DescripcionCono,
      medida: infoConos.MedidaCono,
      siglas: infoConos.SiglaCono,
    });
    this.modalCono = true;
  }

  onInsertConos() {
    if (this.formService.validForm(this.myForm)) {
      this.blockedSendData = true;
      const parametros = {
        codigo: 1121,
        parametros: {
          "DescripcionCono": this.myForm.value.descripcion,
          "MedidaCono": this.myForm.value.medida,
          "SiglaCono": this.myForm.value.siglas,
        },
        infoLog: {
          "Fecha": new Date(),
          "Usuario": this.loginService.usuario.UserName,
          "Evento": "Insert",
          "Referencia": "Conos",
          "Detalle": null,
          "ServerName": null,
          "UserHostAddress": null,
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.modalCono = false;
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

  onUpdateConos() {
    if (this.formService.validForm(this.myForm)) {
      this.blockedSendData = true;
      const parametros = {
        codigo: 1123,
        parametros: {
          "IdCono": this.idConos,
          "DescripcionCono": this.myForm.value.descripcion,
          "MedidaCono": this.myForm.value.medida,
          "SiglaCono": this.myForm.value.siglas,
        },
        infoLog: {
          "Fecha": new Date(),
          "Usuario": this.loginService.usuario.UserName,
          "Evento": "Update",
          "Referencia": "Conos",
          "Detalle": null,
          "ServerName": null,
          "UserHostAddress": null,
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.modalCono = false;
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

  onSaveConos() {
    if (this.idConos === 0) {
      this.onInsertConos();
    } else {
      this.onUpdateConos();
    }
  }
}
