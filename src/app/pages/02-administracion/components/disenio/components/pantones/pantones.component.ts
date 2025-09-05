import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Table } from 'primeng/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { AdministracionDisenioPantoneInterface } from 'src/app/pages/02-administracion/interfaces/disenio.interface';

@Component({
  selector: 'app-administracion-disenio-pantones',
  templateUrl: './pantones.component.html',
})
export class AdministracionDisenioPantonesComponent {
  apiService = inject(ApiService);
  sweetService = inject(SweetAlertService);
  loginService = inject(LoginService);
  formService = inject(ReactiveFormsService);

  blockedSendData: boolean = false;

  loadingPantone: boolean = false;
  listPantone: AdministracionDisenioPantoneInterface[] = [];
  searchPantone: string | undefined;
  modalPantone: boolean = false;
  myFormPantone: FormGroup;
  idPantone: number = 0;

  constructor() {
    this.myFormPantone = new FormGroup({
      "pantone": new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.onGetAllPantone();
  }

  onGetAllPantone() {
    this.loadingPantone = true;
    const parametros = {
      codigo: 1141,
      parametros: {
        "LineaColor": null,
        "CodigoDescripcionPantone": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listPantone = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingPantone = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingPantone = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onGetCodigoPantone(info: AdministracionDisenioPantoneInterface) {
    return info.IdPantone.toString().padStart(4, '0');
  }

  //PANTONES
  onCreatePantone() {
    this.modalPantone = true;
    this.idPantone = 0;
    this.myFormPantone.reset();
  }

  onEditPantone(info: AdministracionDisenioPantoneInterface) {
    this.idPantone = info.IdPantone;
    this.myFormPantone.patchValue({
      descripcion: info.CodigoDescripcionPantone,
    });
    this.modalPantone = true;
  }

  onInsertPantone() {
    this.blockedSendData = true;
    const parametros = {
      codigo: 1140,
      parametros: {
        "LineaColor": null,
        "CodigoDescripcionPantone": this.myFormPantone.value.pantone.toUpperCase(),
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Insert",
        "Referencia": "Pantone",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalPantone = false;
          this.sweetService.viewSuccess('Se creo el nuevo pantone', () => { });
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
  }

  onUpdatePantone() {
    this.blockedSendData = true;
    const parametros = {
      codigo: 1142,
      parametros: {
        "IdPantone": this.idPantone,
        "LineaColor": null,
        "CodigoDescripcionPantone": this.myFormPantone.value.pantone.toUpperCase(),
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Update",
        "Referencia": "Pantone",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalPantone = false;
          this.sweetService.viewSuccess('Se creo edito el pantone', () => { });
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
  }

  onSavePantone() {
    if (this.formService.validForm(this.myFormPantone)) {
      if (this.idPantone === 0) {
        this.onInsertPantone();
      } else {
        //this.onUpdatePantone();
      }
    } else {
      this.sweetService.toastWarning('Ingrese todos los parametros');
    }
  }
}
