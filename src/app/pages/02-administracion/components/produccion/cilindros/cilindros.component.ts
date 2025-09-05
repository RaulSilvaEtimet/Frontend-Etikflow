import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Table } from 'primeng/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { AdministracionProduccionCategoriaCilindrosInterface, AdministracionProduccionCilindrosInterface, AdministracionProduccionTipoCilindrosInterface } from '../../../interfaces/produccion.interface';

@Component({
  selector: 'app-administracion-produccion-cilindros',
  templateUrl: './cilindros.component.html',
})
export class AdministracionProduccionCilindrosComponent {
  apiService = inject(ApiService);
  sweetService = inject(SweetAlertService);
  loginService = inject(LoginService);
  formService = inject(ReactiveFormsService);

  blockedSendData: boolean = false;

  loadingTipoCilindro: boolean = false;
  listTipoCilindro: AdministracionProduccionTipoCilindrosInterface[] = [];
  modalTipoCilindro: boolean = false;
  myFormTipoCilindro: FormGroup;
  idTipoCilindro: number = 0;

  loadingCategoriaCilindro: boolean = false;
  listCategoriaCilindro: AdministracionProduccionCategoriaCilindrosInterface[] = [];
  modalCategoriaCilindro: boolean = false;
  myFormCategoriaCilindro: FormGroup;
  idCategoriaCilindro: number = 0;

  loadingCilindro: boolean = false;
  listCilindro: AdministracionProduccionCilindrosInterface[] = [];
  searchCilindro: string | undefined;
  modalCreateCilindro: boolean = false;
  myFormCilindro: FormGroup;
  idCilindro: number = 0;
  desarrollo: number = 0;

  constructor() {
    this.myFormTipoCilindro = new FormGroup({
      "descripcion": new FormControl('', [Validators.required]),
    });
    this.myFormCategoriaCilindro = new FormGroup({
      "cantidad": new FormControl('', [Validators.required]),
    });
    this.myFormCilindro = new FormGroup({
      "descripcion": new FormControl('', [Validators.required]),
      "ancho": new FormControl('', [Validators.required]),
      "tipo": new FormControl('', [Validators.required]),
      "categoria": new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.onGetAllTipoCilindro();
    this.onGetAllCategoriaCilindro();
    this.onGetAllCilindro();
  }

  onGetAllTipoCilindro() {
    this.loadingTipoCilindro = true;
    const parametros = {
      codigo: 1097,
      parametros: {
        "IdTipoCilindro": null,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listTipoCilindro = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingTipoCilindro = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingTipoCilindro = false;
      }
    });
  }

  onGetAllCategoriaCilindro() {
    this.loadingTipoCilindro = true;
    const parametros = {
      codigo: 1100,
      parametros: {
        "IdCategoriaCilindro": null,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listCategoriaCilindro = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingTipoCilindro = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingTipoCilindro = false;
      }
    });
  }

  onGetAllCilindro() {
    this.loadingTipoCilindro = true;
    const parametros = {
      codigo: 1103,
      parametros: {
        "IdCilindro": null,
        "AnchoCilindroMm": null,
        "DesarrolloCilindroMm": null,
        "IdTipoCilindro": null,
        "IdCategoriaCilindro": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listCilindro = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingTipoCilindro = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingTipoCilindro = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  //TIPO CILINDRO

  onCreateTipoCilindro() {
    this.modalTipoCilindro = true;
    this.idTipoCilindro = 0;
    this.myFormTipoCilindro.reset();
  }

  onEditTipoCilindro(infoTipoCilindro: AdministracionProduccionTipoCilindrosInterface) {
    this.idCategoriaCilindro = infoTipoCilindro.IdTipoCilindro;
    this.myFormTipoCilindro.patchValue({
      descripcion: infoTipoCilindro.DescripcionTipoCilindro,
    });
    this.modalTipoCilindro = true;
  }

  onInsertTipoCilindro() {
    this.blockedSendData = true;
    const parametros = {
      codigo: 1096,
      parametros: {
        "DescripcionTipoCilindro": this.myFormTipoCilindro.value.descripcion,
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Insert",
        "Referencia": "Tipo cilindro",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalTipoCilindro = false;
          this.sweetService.viewSuccess('Se creo el nuevo tipo de cilindro', () => { });
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

  onUpdateTipoCilindro() {
    this.blockedSendData = true;
    const parametros = {
      codigo: 1098,
      parametros: {
        "IdTipoCilindro": this.idTipoCilindro,
        "DescripcionTipoCilindro": this.myFormTipoCilindro.value.descripcion,
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Update",
        "Referencia": "Tipo de cilindro",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalTipoCilindro = false;
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

  onSaveTipoCilindro() {
    if (this.formService.validForm(this.myFormTipoCilindro)) {
      if (this.idTipoCilindro === 0) {
        this.onInsertTipoCilindro();
      } else {
        this.onUpdateTipoCilindro();
      }
    } else {
      this.sweetService.toastWarning('Ingrese todos los parametros');
    }
  }

  //CATEGORIA CILINDRO 
  onCreateCategoriaCilindro() {
    this.modalCategoriaCilindro = true;
    this.idCategoriaCilindro = 0;
    this.myFormCategoriaCilindro.reset();
    this.desarrollo = 0;
  }

  onEditCategoriaCilindro(infoCategoriaCilindro: AdministracionProduccionCategoriaCilindrosInterface) {
    this.idCategoriaCilindro = infoCategoriaCilindro.IdCategoriaCilindro;
    this.myFormCategoriaCilindro.patchValue({
      cantidad: infoCategoriaCilindro.CantidadDientes,
    });
    this.modalCategoriaCilindro = true;
  }

  onInsertCategoriaCilindro() {
    this.blockedSendData = true;
    const parametros = {
      codigo: 1099,
      parametros: {
        "CantidadDientes": this.myFormCategoriaCilindro.value.cantidad,
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Insert",
        "Referencia": "Categoria cilindro",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalCategoriaCilindro = false;
          this.sweetService.viewSuccess('Se creo la nueva categoria de cilindro', () => { });
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

  onUpdateCategoriaCilindro() {
    this.blockedSendData = true;
    const parametros = {
      codigo: 1101,
      parametros: {
        "IdCategoriaCilindro": this.idCategoriaCilindro,
        "CantidadDientes": this.myFormCategoriaCilindro.value.cantidad,
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Update",
        "Referencia": "Categoria de cilindro",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalCategoriaCilindro = false;
          this.sweetService.viewSuccess('Se edito la categoria de cilindro', () => { });
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

  onSaveCategoriaCilindro() {
    if (this.formService.validForm(this.myFormCategoriaCilindro)) {
      if (this.idCategoriaCilindro === 0) {
        this.onInsertCategoriaCilindro();
      } else {
        this.onUpdateCategoriaCilindro();
      }
    } else {
      this.sweetService.toastWarning('Ingrese todos los parametros');
    }
  }

  //CILINDROS 
  onCreateCilindro() {
    this.modalCreateCilindro = true;
    this.idCilindro = 0;
    this.desarrollo = 0;
    this.myFormCilindro.reset();
  }

  onCalcularDesarrollo(idCateCilindro: number) {
    if (idCateCilindro !== null) {
      const dientes = this.listCategoriaCilindro.find(item => item.IdCategoriaCilindro === idCateCilindro)!.CantidadDientes;
      this.desarrollo = dientes * 3.175;
    }
  }

  onEditCilindro(infoCilindro: AdministracionProduccionCilindrosInterface) {
    this.idCilindro = infoCilindro.IdCilindro;
    this.myFormCilindro.patchValue({
      descripcion: infoCilindro.DescripcionCilindro,
      ancho: infoCilindro.AnchoCilindroMm,
      tipo: infoCilindro.IdTipoCilindro,
      categoria: infoCilindro.IdCategoriaCilindro,
    });
    this.modalCreateCilindro = true;
  }

  onInsertCilindro() {
    this.blockedSendData = true;
    const parametros = {
      codigo: 1102,
      parametros: {
        "DescripcionCilindro": this.myFormCilindro.value.descripcion,
        "AnchoCilindroMm": this.myFormCilindro.value.ancho,
        "DesarrolloCilindroMm": this.desarrollo,
        "IdTipoCilindro": Number(this.myFormCilindro.value.tipo),
        "IdCategoriaCilindro": Number(this.myFormCilindro.value.categoria),
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Insert",
        "Referencia": "Cilindro",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalCreateCilindro = false;
          this.sweetService.viewSuccess('Se creo el nuevo cilindro', () => { });
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

  onUpdateCilindro() {
    this.blockedSendData = true;
    const parametros = {
      codigo: 1104,
      parametros: {
        "IdCilindro": this.idCilindro,
        "DescripcionCilindro": this.myFormCilindro.value.descripcion,
        "AnchoCilindroMm": this.myFormCilindro.value.ancho,
        "DesarrolloCilindroMm": this.desarrollo,
        "IdTipoCilindro": Number(this.myFormCilindro.value.tipo),
        "IdCategoriaCilindro": Number(this.myFormCilindro.value.categoria),
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Update",
        "Referencia": "Cilindro",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalCreateCilindro = false;
          this.sweetService.viewSuccess('Se edito el cilindro', () => { });
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

  onSaveCilindro() {
    if (this.formService.validForm(this.myFormCilindro)) {
      if (this.idCilindro === 0) {
        this.onInsertCilindro();
      } else {
        this.onUpdateCilindro();
      }
    } else {
      this.sweetService.toastWarning('Ingrese todos los parametros');
    }
  }
}
