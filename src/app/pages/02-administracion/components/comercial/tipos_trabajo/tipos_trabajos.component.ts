import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Table } from 'primeng/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { AdministracionComercialTipoTrabajoInterface, AdministracionComercialTipTraTipInvInterface } from '../../../interfaces/comercial.interface';
import { GestionInventarioGrupoInventarioInterface, GestionInventarioTipoInventarioInterface } from '../../../interfaces/gestion-inventario.interface';

@Component({
  selector: 'app-administracion-comercial-tipo-trabajos',
  templateUrl: './tipos_trabajos.component.html',
})
export class AdministracionComercialTipoTrabajosComponent {
  apiService = inject(ApiService);
  sweetService = inject(SweetAlertService);
  loginService = inject(LoginService);
  formService = inject(ReactiveFormsService);

  blockedSendData: boolean = false;

  loadingTipoTrabajo: boolean = false;
  listTipoTrabajo: AdministracionComercialTipoTrabajoInterface[] = [];
  searchTipoTrabajo: string | undefined;
  modalCreateTipoTrabajo: boolean = false;
  myFormTipoTrabajo: FormGroup;
  idTipoTrabajo: number = 0;

  infoTipoTrabajo: AdministracionComercialTipoTrabajoInterface = { IdTipoTrabajo: 0, DescripcionTrabajo: '', TrabajoImpreso: false };
  modalInfoTipoTrabajo: boolean = false;
  loadingTipTraTipInv: boolean = false;
  listTipTraTipInv: AdministracionComercialTipTraTipInvInterface[] = [];
  searchTipTraTipInv: string | undefined;
  myFormInsertTipTraTipInv: FormGroup;

  modalInsertTipTraTipInv: boolean = false;
  loadingGrupoInventario: boolean = false;
  listGrupoInventario: GestionInventarioGrupoInventarioInterface[] = [];
  loadingTipoInventario: boolean = false;
  listTipoInventario: GestionInventarioTipoInventarioInterface[] = [];

  idTipTraTipInv: number = 0;
  modalUpdateTipTraTipInv: boolean = false;
  myFormUpdateTipTraTipInv: FormGroup;

  constructor() {
    this.myFormTipoTrabajo = new FormGroup({
      "descripcion": new FormControl('', [Validators.required]),
      "impreso": new FormControl('', [Validators.required]),
    });
    this.myFormInsertTipTraTipInv = new FormGroup({
      "grupoInventario": new FormControl('', [Validators.required]),
      "tipoInventario": new FormControl('', [Validators.required]),
      "precio": new FormControl('', [Validators.required]),
    });
    this.myFormUpdateTipTraTipInv = new FormGroup({
      "precio": new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.onGetAllTiposTrabajos();
    this.onGetAllGrupoInventario();
  }

  onGetAllTiposTrabajos() {
    this.loadingTipoTrabajo = true;
    const parametros = {
      codigo: 1115,
      parametros: {
        "IdTipoTrabajo": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listTipoTrabajo = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingTipoTrabajo = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingTipoTrabajo = false;
      }
    });
  }

  onGetAllGrupoInventario() {
    this.loadingGrupoInventario = true;
    const parametros = {
      codigo: 1016,
      parametros: {
        "GrupoInventario": null,
        "IdLineaInventario": 1,
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

  onGetAllTipoInventario(idGrupo: number) {
    this.loadingTipoInventario = true;
    const parametros = {
      codigo: 1019,
      parametros: {
        "CodigoTipoInventario": null,
        "IdGrupoInventario": idGrupo,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listTipoInventario = [...resp.data];
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

  //TIPO TRABAJO
  onCreateTipoTrabajo() {
    this.modalCreateTipoTrabajo = true;
    this.idTipoTrabajo = 0;
    this.myFormTipoTrabajo.reset();
  }

  onEditTipoTrabajo(infoTipoTrabajo: AdministracionComercialTipoTrabajoInterface) {
    this.idTipoTrabajo = infoTipoTrabajo.IdTipoTrabajo;
    this.myFormTipoTrabajo.patchValue({
      descripcion: infoTipoTrabajo.DescripcionTrabajo,
      impreso: infoTipoTrabajo.TrabajoImpreso,
    });
    this.modalCreateTipoTrabajo = true;
  }

  onInsertTipoTrabajo() {
    this.blockedSendData = true;
    const parametros = {
      codigo: 1114,
      parametros: {
        "DescripcionTrabajo": this.myFormTipoTrabajo.value.descripcion.toUpperCase(),
        "TrabajoImpreso": this.myFormTipoTrabajo.value.impreso,
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Insert",
        "Referencia": "Tipo trabajo",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalCreateTipoTrabajo = false;
          this.sweetService.viewSuccess('Se creo el nuevo tipo de trabajo', () => { });
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

  onUpdateTipoTrabajo() {
    this.blockedSendData = true;
    const parametros = {
      codigo: 1116,
      parametros: {
        "IdTipoTrabajo": this.idTipoTrabajo,
        "DescripcionTrabajo": this.myFormTipoTrabajo.value.descripcion.toUpperCase(),
        "TrabajoImpreso": this.myFormTipoTrabajo.value.impreso,
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Update",
        "Referencia": "Tipo de trabajo",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalCreateTipoTrabajo = false;
          this.sweetService.viewSuccess('Se creo edito el tipo de cilindro', () => { });
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

  onSaveTipoTrabajo() {
    if (this.formService.validForm(this.myFormTipoTrabajo)) {
      if (this.idTipoTrabajo === 0) {
        this.onInsertTipoTrabajo();
      } else {
        this.onUpdateTipoTrabajo();
      }
    } else {
      this.sweetService.toastWarning('Ingrese todos los parametros');
    }
  }

  //TIPO TRABAJO TIPO INVENTARIO
  onGetInfoTipoTrabajo(info: AdministracionComercialTipoTrabajoInterface) {
    this.infoTipoTrabajo = { ...info };
    this.loadingTipoTrabajo = true;
    const parametros = {
      codigo: 1118,
      parametros: {
        "IdTipoTrabajo": this.infoTipoTrabajo.IdTipoTrabajo,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listTipTraTipInv = [...resp.data];
          this.modalInfoTipoTrabajo = true;
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingTipoTrabajo = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingTipoTrabajo = false;
      }
    });
  }

  onCreateTipTraTipInv() {
    this.modalInsertTipTraTipInv = true;
    this.myFormInsertTipTraTipInv.reset();
  }

  onEditTipTraTipInv(info: AdministracionComercialTipTraTipInvInterface) {
    this.idTipTraTipInv = info.IdTipoTrabajoTipoInventario;
    this.myFormUpdateTipTraTipInv.patchValue({
      "precio": info.ValorVentaMPm2,
    });
    this.modalUpdateTipTraTipInv = true;
  }

  onChangeGrupoInventario(infoGrupoInventario: GestionInventarioGrupoInventarioInterface) {
    if (infoGrupoInventario !== null)
      this.onGetAllTipoInventario(infoGrupoInventario.IdGrupoInventario ?? 0);
  }

  onInsertTipTraTipInv() {
    if (this.formService.validForm(this.myFormInsertTipTraTipInv)) {
      this.blockedSendData = true;
      const parametros = {
        codigo: 1117,
        parametros: {
          "IdTipoTrabajo": Number(this.infoTipoTrabajo.IdTipoTrabajo),
          "IdTipoInventario": this.myFormInsertTipTraTipInv.value.tipoInventario.IdTipoInventario,
          "ValorVentaMPm2": this.myFormInsertTipTraTipInv.value.precio,
        },
        infoLog: {
          "Fecha": new Date(),
          "Usuario": this.loginService.usuario.UserName,
          "Evento": "Insert",
          "Referencia": "Tipo trabajo tipo inventario",
          "Detalle": null,
          "ServerName": null,
          "UserHostAddress": null,
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.modalInsertTipTraTipInv = false;
            this.sweetService.viewSuccess('Se ejecuto correctamente', () => { });
            this.onGetInfoTipoTrabajo(this.infoTipoTrabajo);
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

  onUpdateTipTraTipInv() {
    if (this.formService.validForm(this.myFormUpdateTipTraTipInv)) {
      this.blockedSendData = true;
      const parametros = {
        codigo: 1119,
        parametros: {
          "IdTipoTrabajoTipoInventario": this.idTipTraTipInv,
          "IdTipoTrabajo": null,
          "IdTipoInventario": null,
          "ValorVentaMPm2": this.myFormUpdateTipTraTipInv.value.precio,
        },
        infoLog: {
          "Fecha": new Date(),
          "Usuario": this.loginService.usuario.UserName,
          "Evento": "Update",
          "Referencia": "Tipo trabajo tipo inventario",
          "Detalle": null,
          "ServerName": null,
          "UserHostAddress": null,
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.modalUpdateTipTraTipInv = false;
            this.sweetService.viewSuccess('Se ejecuto correctamente', () => { });
            this.onGetInfoTipoTrabajo(this.infoTipoTrabajo);
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

  onDeleteTipTraTipInv(info: AdministracionComercialTipTraTipInvInterface) {
    this.blockedSendData = true;
    const parametros = {
      codigo: 1120,
      parametros: {
        "IdTipoTrabajoTipoInventario": info.IdTipoTrabajoTipoInventario,
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Delete",
        "Referencia": "Tipo trabajo tipo inventario",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'delete', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.sweetService.viewSuccess('Se ejecuto correctamente', () => { });
          this.onGetInfoTipoTrabajo(this.infoTipoTrabajo);
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
}
