import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Table } from 'primeng/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { AdministracionProduccionFormatoTroquelesInterface, AdministracionProduccionTipoTroquelesInterface, AdministracionProduccionTroquelesInterface } from '../../../interfaces/produccion.interface';

@Component({
  selector: 'app-administracion-produccion-troqueles',
  templateUrl: './troqueles.component.html',
})
export class AdministracionProduccionTroquelesComponent {
  apiService = inject(ApiService);
  sweetService = inject(SweetAlertService);
  loginService = inject(LoginService);
  formService = inject(ReactiveFormsService);

  blockedSendData: boolean = false;

  loadingFormatoTroquel: boolean = false;
  listFormatoTroquel: AdministracionProduccionTipoTroquelesInterface[] = [];
  modalFormatoTroquel: boolean = false;
  myFormFormatoTroquel: FormGroup;
  idFormatoTroquel: number = 0;

  loadingTipoTroquel: boolean = false;
  listTipoTroquel: AdministracionProduccionFormatoTroquelesInterface[] = [];
  modalTipoTroquel: boolean = false;
  myFormTipoTroquel: FormGroup;
  idTipoTroquel: number = 0;

  loadingTroquel: boolean = false;
  listTroquel: AdministracionProduccionTroquelesInterface[] = [];
  searchTroquel: string | undefined;
  modalCreateTroquel: boolean = false;
  myFormTroquel: FormGroup;
  idTroquel: number = 0;
  listCalculos: number[] = [];

  constructor() {
    this.myFormTipoTroquel = new FormGroup({
      "descripcion": new FormControl('', [Validators.required]),
    });
    this.myFormFormatoTroquel = new FormGroup({
      "descripcion": new FormControl('', [Validators.required]),
    });
    this.myFormTroquel = new FormGroup({
      "tipo": new FormControl('', [Validators.required]),
      "formato": new FormControl('', [Validators.required]),
      "codigo": new FormControl('', [Validators.required]),
      "descripcion": new FormControl('', [Validators.required]),
      "corteRecto": new FormControl(false, [Validators.required]),
      "zeta": new FormControl(0, [Validators.required]),
      "desarrolloTotal": new FormControl(0, [Validators.required]),
      "anchoTotal": new FormControl(0, [Validators.required]),
      "desarrolloTrabajo": new FormControl(0, [Validators.required]),
      "anchoTrabajo": new FormControl(0, [Validators.required]),
      "desarrolloEtiqueta": new FormControl(0, [Validators.required]),
      "anchoEtiqueta": new FormControl(0, [Validators.required]),
      "gapTrabajos": new FormControl(0, [Validators.required]),
      "gapDesarrollo": new FormControl(0, [Validators.required]),
      "gapAncho": new FormControl(0, [Validators.required]),
      "estado": new FormControl(0, [Validators.required]),
    });
  }

  ngOnInit() {
    this.onGetAllFormatoTroquel();
    this.onGetAllTipoTroquel();
    this.onGetAllTroquel();
  }

  onGetAllFormatoTroquel() {
    this.loadingFormatoTroquel = true;
    const parametros = {
      codigo: 1106,
      parametros: {
        "IdFormatoTroquel": null,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listFormatoTroquel = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingFormatoTroquel = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingFormatoTroquel = false;
      }
    });
  }

  onGetAllTipoTroquel() {
    this.loadingTipoTroquel = true;
    const parametros = {
      codigo: 1109,
      parametros: {
        "IdTipoTroquel": null,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listTipoTroquel = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingTipoTroquel = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingTipoTroquel = false;
      }
    });
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
        "Estado": null,
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

  //FORMATO TROQUEL 
  onCreateFormatoTroquel() {
    this.modalFormatoTroquel = true;
    this.idFormatoTroquel = 0;
    this.myFormFormatoTroquel.reset();
  }

  onEditFormatoTroquel(infoFormato: AdministracionProduccionFormatoTroquelesInterface) {
    this.idFormatoTroquel = infoFormato.IdFormatoTroquel;
    this.myFormFormatoTroquel.patchValue({
      descripcion: infoFormato.DescripcionFormatoTorquel,
    });
    this.modalFormatoTroquel = true;
  }

  onInsertFormatoTroquel() {
    this.blockedSendData = true;
    const parametros = {
      codigo: 1105,
      parametros: {
        "DescripcionFormatoTorquel": this.myFormFormatoTroquel.value.descripcion,
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Insert",
        "Referencia": "Formato troquel",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalFormatoTroquel = false;
          this.sweetService.viewSuccess('Se creo el nuevo formato de troquel', () => { });
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

  onUpdateFormatoTroquel() {
    this.blockedSendData = true;
    const parametros = {
      codigo: 1107,
      parametros: {
        "IdFormatoTroquel": this.idFormatoTroquel,
        "DescripcionFormatoTorquel": this.myFormFormatoTroquel.value.descripcion,
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Update",
        "Referencia": "Formato troquel",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalFormatoTroquel = false;
          this.sweetService.viewSuccess('Se edito el formato del troquel', () => { });
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

  onSaveFormatoTroquel() {
    if (this.formService.validForm(this.myFormFormatoTroquel)) {
      if (this.idFormatoTroquel === 0) {
        this.onInsertFormatoTroquel();
      } else {
        this.onUpdateFormatoTroquel();
      }
    } else {
      this.sweetService.toastWarning('Ingrese todos los parametros');
    }
  }

  //TIPO TROQUEL
  onCreateTipoTroquel() {
    this.modalTipoTroquel = true;
    this.idTipoTroquel = 0;
    this.myFormTipoTroquel.reset();
  }

  onEditTipoTroquel(infoTipo: AdministracionProduccionTipoTroquelesInterface) {
    this.idTipoTroquel = infoTipo.IdTipoTroquel;
    this.myFormTipoTroquel.patchValue({
      descripcion: infoTipo.DescripcionTipoTroquel,
    });
    this.modalTipoTroquel = true;
  }

  onInsertTipoTroquel() {
    this.blockedSendData = true;
    const parametros = {
      codigo: 1108,
      parametros: {
        "DescripcionTipoTroquel": this.myFormTipoTroquel.value.descripcion,
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Insert",
        "Referencia": "Tipo troquel",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalTipoTroquel = false;
          this.sweetService.viewSuccess('Se creo el nuevo tipo de troquel', () => { });
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

  onUpdateTipoTroquel() {
    this.blockedSendData = true;
    const parametros = {
      codigo: 1110,
      parametros: {
        "IdTipoTroquel": this.idTipoTroquel,
        "DescripcionTipoTroquel": this.myFormTipoTroquel.value.descripcion,
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Update",
        "Referencia": "Tipo de troquel",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalTipoTroquel = false;
          this.sweetService.viewSuccess('Se creo edito el tipo de troquel', () => { });
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

  onSaveTipoTroquel() {
    if (this.formService.validForm(this.myFormTipoTroquel)) {
      if (this.idTipoTroquel === 0) {
        this.onInsertTipoTroquel();
      } else {
        this.onUpdateTipoTroquel();
      }
    } else {
      this.sweetService.toastWarning('Ingrese todos los parametros');
    }
  }

  //TROQUELES 
  onCalcularDesarrollo() {
    const zeta = this.myFormTroquel.value.zeta ?? 0;
    this.myFormTroquel.patchValue({ desarrolloTotal: zeta * 3.175 });

    this.onCalcularDesarrollo();
  }

  onCalcularInformacion() {
    const desaTotal = this.myFormTroquel.value.desarrolloTotal ?? 0;
    const anchoTotal = this.myFormTroquel.value.anchoTotal ?? 0;
    const desaTrabajo = this.myFormTroquel.value.desarrolloTrabajo ?? 0;
    const anchoTrabajo = this.myFormTroquel.value.anchoTrabajo ?? 0;
    const desaEtiqueta = this.myFormTroquel.value.desarrolloEtiqueta ?? 0;
    const anchoEtiqueta = this.myFormTroquel.value.anchoEtiqueta ?? 0;
    const gapTrabajos = this.myFormTroquel.value.gapTrabajos ?? 0;
    const gapDesarrollo = this.myFormTroquel.value.gapDesarrollo ?? 0;
    const gapAncho = this.myFormTroquel.value.gapAncho ?? 0;

    this.listCalculos[0] = anchoTrabajo !== 0 ? Math.floor(anchoTotal / anchoTrabajo) : 0;
    this.listCalculos[1] = anchoTrabajo !== 0 ? (this.listCalculos[0] + 1) * gapTrabajos : 0;
    this.listCalculos[2] = anchoEtiqueta !== 0 ? Math.floor(anchoTrabajo / anchoEtiqueta) : 0;
    this.listCalculos[3] = (desaEtiqueta + gapDesarrollo) !== 0 ? Math.floor(desaTotal / (desaEtiqueta + gapDesarrollo)) * gapDesarrollo : 0;
    this.listCalculos[4] = (this.listCalculos[0]) * (gapAncho) * (this.listCalculos[2] - 1);
    this.listCalculos[5] = desaEtiqueta !== 0 ? Math.floor((desaTotal - this.listCalculos[3]) / desaEtiqueta) : 0;
    this.listCalculos[6] = anchoEtiqueta !== 0 ? Math.floor((anchoTotal - gapTrabajos - this.listCalculos[4]) / anchoEtiqueta) : 0;
    this.listCalculos[7] = this.listCalculos[5] * this.listCalculos[6];
    this.listCalculos[8] = (this.listCalculos[5] * desaEtiqueta) + this.listCalculos[3];
    this.listCalculos[9] = (this.listCalculos[6] * anchoEtiqueta) + this.listCalculos[4] + this.listCalculos[1];
  }

  onCreateTroquel() {
    this.modalCreateTroquel = true;
    this.idTroquel = 0;
    this.myFormTroquel.reset();
  }

  onEditTroquel(infoTroquel: AdministracionProduccionTroquelesInterface) {
    this.idTroquel = infoTroquel.IdTroquel;
    this.myFormTroquel.patchValue({
      "tipo": infoTroquel.IdTipoTroquel,
      "formato": infoTroquel.IdFormatoTroquel,
      "codigo": infoTroquel.CodigoInternoTroquel,
      "descripcion": infoTroquel.DescripcionTroquel,
      "zeta": infoTroquel.ZetaTroquel,
      "desarrolloTotal": infoTroquel.DesarrolloTotalTroquel,
      "anchoTotal": infoTroquel.AnchoTotalTroquel,
      "desarrolloTrabajo": infoTroquel.DesarrolloTrabajoTroquel,
      "anchoTrabajo": infoTroquel.AnchoTrabajoTroquel,
      "desarrolloEtiqueta": infoTroquel.DesarrolloEtiqueta,
      "anchoEtiqueta": infoTroquel.AnchoEtiqueta,
      "gapTrabajos": infoTroquel.GapEntreTrabajos,
      "gapDesarrollo": infoTroquel.GapDesarrollo,
      "gapAncho": infoTroquel.GapEntreEtiquetas,
      "estado": infoTroquel.Estado,
    });
    this.modalCreateTroquel = true;
  }

  onInsertTroquel() {
    this.blockedSendData = true;
    const parametros = {
      codigo: 1111,
      parametros: {
        "DescripcionTroquel": this.myFormTroquel.value.descripcion,
        "CodigoInternoTroquel": this.myFormTroquel.value.codigo,
        "ZetaTroquel": this.myFormTroquel.value.zeta,
        "AnchoTotalTroquel": this.myFormTroquel.value.anchoTotal,
        "DesarrolloTotalTroquel": this.myFormTroquel.value.desarrolloTotal,
        "AnchoTrabajoTroquel": this.myFormTroquel.value.anchoTrabajo,
        "DesarrolloTrabajoTroquel": this.myFormTroquel.value.desarrolloTrabajo,
        "AnchoEtiqueta": this.myFormTroquel.value.anchoEtiqueta,
        "DesarrolloEtiqueta": this.myFormTroquel.value.desarrolloEtiqueta,
        "CantidadTrabajosAncho": this.listCalculos[0],
        "CorteRecto": this.myFormTroquel.value.corteRecto,
        "GapEntreTrabajos": this.myFormTroquel.value.gapTrabajos,
        "TotalGapEntreTrabajos": this.listCalculos[1],
        "EtiquetasRolloAncho": this.listCalculos[2],
        "GapEntreEtiquetas": this.myFormTroquel.value.gapAncho,
        "TotalGapEntreEtiquetas": this.listCalculos[4],
        "RepeticionesAncho": this.listCalculos[6],
        "RepeticionesDesarrollo": this.listCalculos[5],
        "TotalEtiquetas": this.listCalculos[7],
        "AnchoSugerido": this.listCalculos[9],
        "IdFormatoTroquel": this.myFormTroquel.value.formato,
        "IdTipoTroquel": this.myFormTroquel.value.tipo,
        "Estado": this.myFormTroquel.value.estado,
        "GapDesarrollo": this.myFormTroquel.value.gapDesarrollo,
        "GapTotalDesarrollo": this.listCalculos[3]
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Insert",
        "Referencia": "Troquel",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalCreateTroquel = false;
          this.sweetService.viewSuccess('Se creo el nuevo troquel', () => { });
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

  onUpdateTroquel() {
    this.blockedSendData = true;
    const parametros = {
      codigo: 1113,
      parametros: {
        "IdTroquel": this.idTroquel,
        "DescripcionTroquel": this.myFormTroquel.value.descripcion,
        "CodigoInternoTroquel": this.myFormTroquel.value.codigo,
        "ZetaTroquel": this.myFormTroquel.value.zeta,
        "AnchoTotalTroquel": this.myFormTroquel.value.anchoTotal,
        "DesarrolloTotalTroquel": this.myFormTroquel.value.desarrolloTotal,
        "AnchoTrabajoTroquel": this.myFormTroquel.value.anchoTrabajo,
        "DesarrolloTrabajoTroquel": this.myFormTroquel.value.desarrolloTrabajo,
        "AnchoEtiqueta": this.myFormTroquel.value.anchoEtiqueta,
        "DesarrolloEtiqueta": this.myFormTroquel.value.desarrolloEtiqueta,
        "CantidadTrabajosAncho": this.listCalculos[0],
        "CorteRecto": this.myFormTroquel.value.corteRecto,
        "GapEntreTrabajos": this.myFormTroquel.value.gapTrabajos,
        "TotalGapEntreTrabajos": this.listCalculos[1],
        "EtiquetasRolloAncho": this.listCalculos[2],
        "GapEntreEtiquetas": this.myFormTroquel.value.gapAncho,
        "TotalGapEntreEtiquetas": this.listCalculos[4],
        "RepeticionesAncho": this.listCalculos[6],
        "RepeticionesDesarrollo": this.listCalculos[5],
        "TotalEtiquetas": this.listCalculos[7],
        "AnchoSugerido": this.listCalculos[9],
        "IdFormatoTroquel": this.myFormTroquel.value.formato,
        "IdTipoTroquel": this.myFormTroquel.value.tipo,
        "Estado": this.myFormTroquel.value.estado,
        "GapDesarrollo": this.myFormTroquel.value.gapDesarrollo,
        "GapTotalDesarrollo": this.listCalculos[3],
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Update",
        "Referencia": "Troquel",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalCreateTroquel = false;
          this.sweetService.viewSuccess('Se edito el troquel', () => { });
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

  onSaveTroquel() {
    if (this.formService.validForm(this.myFormTroquel)) {
      if (this.idTroquel === 0) {
        this.onInsertTroquel();
      } else {
        this.onUpdateTroquel();
      }
    } else {
      this.sweetService.toastWarning('Ingrese todos los parametros');
    }
  }
}
