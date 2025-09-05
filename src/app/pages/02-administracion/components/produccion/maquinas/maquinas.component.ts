import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Table } from 'primeng/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { AdministracionProduccionCargoConsumosInterface, AdministracionProduccionMaquinaGastosFuncionamientoInterface, AdministracionProduccionMaquinaInterface, AdministracionProduccionMaquinaOperadorInterface, AdministracionProduccionMaquinaResumenInterface } from '../../../interfaces/produccion.interface';
import { AdministracionPersonalColaboradorInterface } from '../../../interfaces/personal.interface';

@Component({
  selector: 'app-administracion-produccion-maquinas',
  templateUrl: './maquinas.component.html',
})
export class AdministracionProduccionMaquinasComponent {
  apiService = inject(ApiService);
  sweetService = inject(SweetAlertService);
  loginService = inject(LoginService);
  formService = inject(ReactiveFormsService);

  loadingMaquinas: boolean = false;
  listMaquinas: AdministracionProduccionMaquinaInterface[] = [];
  searchLineaInventario: string | undefined;

  blockedSendData: boolean = false;
  blockedGetData: boolean = false;

  modalInfoMaquina: boolean = false;
  idMaquina: number = 0;
  infoMaquina: AdministracionProduccionMaquinaInterface[] = [];
  infoMaquinaOperador: AdministracionProduccionMaquinaOperadorInterface[] = [];
  infoMaquinaGasto: AdministracionProduccionMaquinaGastosFuncionamientoInterface[] = [];
  infoMaquinaResumen: AdministracionProduccionMaquinaResumenInterface[] = [];

  modalCreateMaquina: boolean = false;
  myFormMaquina: FormGroup;

  modalCreateGasto: boolean = false;
  myFormGasto: FormGroup;
  idGasto: number = 0;
  loadingCargoConsumo: boolean = false;
  listCargoConsumos: AdministracionProduccionCargoConsumosInterface[] = [];

  modalCreateOperador: boolean = false;
  myFormOperador: FormGroup;
  idOperador: number = 0;
  loadingColaborador: boolean = false;
  listColaborador: AdministracionPersonalColaboradorInterface[] = [];

  constructor() {
    this.myFormMaquina = new FormGroup({
      "nombre": new FormControl('', [Validators.required]),
      "modelo": new FormControl('', [Validators.required]),
      "fechaAdquisicion": new FormControl('', [Validators.required]),
      "aniosDepreciacion": new FormControl('', [Validators.required]),
      "velocidadNominal": new FormControl('', [Validators.required]),
      "horasUsoDiario": new FormControl('', [Validators.required]),
      "potencia": new FormControl('', [Validators.required]),
      "porcentajeMantenimiento": new FormControl('', [Validators.required]),
      "costo": new FormControl('', [Validators.required]),
      "porcentajeInteres": new FormControl('', [Validators.required]),
      "porcentajeSeguros": new FormControl('', [Validators.required]),
    });
    this.myFormGasto = new FormGroup({
      "idGasto": new FormControl('', [Validators.required]),
      "cantidad": new FormControl('', [Validators.required]),
    });
    this.myFormOperador = new FormGroup({
      "idColaborador": new FormControl('', [Validators.required]),
      "estado": new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.onGetAllMaquina();
    this.onGetAllCargoConsumo();
    this.onGetAllColaborador();
  }

  onGetAllMaquina() {
    this.loadingMaquinas = true;
    const parametros = {
      codigo: 1084,
      parametros: {
        'IdMaquina': null
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listMaquinas = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingMaquinas = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingMaquinas = false;
      }
    });
  }

  onGetAllCargoConsumo() {
    this.loadingCargoConsumo = true;
    const parametros = {
      codigo: 1087,
      parametros: {
        "IdGastosVariosMaquinas": null,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listCargoConsumos = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingCargoConsumo = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingCargoConsumo = false;
      }
    });
  }

  onGetAllColaborador() {
    this.loadingColaborador = true;
    const parametros = {
      codigo: 1005,
      parametros: {
        "identificacion": null,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listColaborador = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingColaborador = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingColaborador = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onGetInfoMaquina(id: number) {
    this.idMaquina = id;
    this.blockedGetData = true;
    const parametros = {
      codigo: 1095,
      parametros: {
        'IdMaquina': this.idMaquina
      },
      tablas: ['TablaMaquina', 'MaquinaGastoFuncionamiento', 'TablaMaquinaOperador', 'TablaResumenCostos'],
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.infoMaquina = [...resp.data[0].TablaMaquina];
          this.infoMaquinaOperador = [...resp.data[0].TablaMaquinaOperador];
          this.infoMaquinaGasto = [...resp.data[0].MaquinaGastoFuncionamiento];
          this.infoMaquinaResumen = [...resp.data[0].TablaResumenCostos]
          this.modalInfoMaquina = true;
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.blockedGetData = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.blockedGetData = false;
      }
    });
  }

  onCreateMaquina() {
    this.idMaquina = 0;
    this.myFormMaquina.reset();
    this.modalCreateMaquina = true;
  }

  onEditMaquina() {
    this.myFormMaquina.patchValue({
      nombre: this.infoMaquina[0].Nombre,
      modelo: this.infoMaquina[0].Modelo,
      fechaAdquisicion: new Date(this.infoMaquina[0].FechaAdquisicion),
      aniosDepreciacion: this.infoMaquina[0].AniosDepreciacion,
      velocidadNominal: this.infoMaquina[0].VelocidadNominal,
      horasUsoDiario: this.infoMaquina[0].HorasUsoAnualEstimado / 365,
      potencia: this.infoMaquina[0].Potencia,
      porcentajeMantenimiento: this.infoMaquina[0].FactorPorcentajeMantenimiento,
      costo: this.infoMaquina[0].Costo,
      porcentajeInteres: this.infoMaquina[0].PorcentajeInteres,
      porcentajeSeguros: this.infoMaquina[0].PorcentajeSeguro,
    });
    this.modalCreateMaquina = true;
  }

  onUpdateMaquina() {
    const fechaAdq = new Date(this.myFormMaquina.value.fechaAdquisicion);
    const fechaFin = new Date(this.myFormMaquina.value.fechaAdquisicion);
    fechaFin.setFullYear(fechaFin.getFullYear() + this.myFormMaquina.value.aniosDepreciacion);
    const diferencia = (fechaFin.getTime() - fechaAdq.getTime()) / (1000 * 60 * 60);

    this.blockedSendData = true;
    const parametros = {
      codigo: 1085,
      parametros: {
        "IdMaquina": this.idMaquina,
        "Nombre": this.myFormMaquina.value.nombre,
        "Modelo": this.myFormMaquina.value.modelo,
        "FechaAdquisicion": fechaAdq,
        "AniosDepreciacion": this.myFormMaquina.value.aniosDepreciacion,
        "FechaFin": fechaFin,
        "VelocidadNominal": this.myFormMaquina.value.velocidadNominal,
        "HorasDepreciacion": diferencia,
        "Potencia": this.myFormMaquina.value.potencia,
        "FactorPorcentajeMantenimiento": this.myFormMaquina.value.porcentajeMantenimiento,
        "Costo": this.myFormMaquina.value.costo,
        "HorasUsoAnualEstimado": this.myFormMaquina.value.horasUsoDiario * 365,
        "ValorDepreciacionHora": (this.myFormMaquina.value.costo / diferencia),
        "PorcentajeValorResidual": 0,
        "TotalValorResidual": 0,
        "PorcentajeInteres": this.myFormMaquina.value.porcentajeInteres,
        "ValorInversion": (this.myFormMaquina.value.costo * (this.myFormMaquina.value.porcentajeInteres / 100)) / (2 * this.myFormMaquina.value.horasUsoDiario * 365),
        "PorcentajeSeguro": this.myFormMaquina.value.porcentajeSeguros,
        "ValorSeguro": (this.myFormMaquina.value.costo * (this.myFormMaquina.value.porcentajeSeguros / 100)) / (2 * this.myFormMaquina.value.horasUsoDiario * 365),
        "CargoMantenimiento": (this.myFormMaquina.value.costo / diferencia) * (this.myFormMaquina.value.porcentajeMantenimiento / 100),
        "Estado": null,
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Update",
        "Referencia": "Maquina",
        "Detalle": this.idMaquina,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalCreateMaquina = false;
          this.onGetInfoMaquina(this.idMaquina);
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.blockedSendData = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.blockedSendData = false;
      }
    });

  }

  onInsertMaquina() {
    const fechaAdq = new Date(this.myFormMaquina.value.fechaAdquisicion);
    const fechaFin = new Date(this.myFormMaquina.value.fechaAdquisicion);
    fechaFin.setFullYear(fechaFin.getFullYear() + this.myFormMaquina.value.aniosDepreciacion);
    const diferencia = (fechaFin.getTime() - fechaAdq.getTime()) / (1000 * 60 * 60);

    this.blockedSendData = true;
    const parametros = {
      codigo: 1083,
      parametros: {
        "Nombre": this.myFormMaquina.value.nombre,
        "Modelo": this.myFormMaquina.value.modelo,
        "FechaAdquisicion": fechaAdq,
        "AniosDepreciacion": this.myFormMaquina.value.aniosDepreciacion,
        "FechaFin": fechaFin,
        "VelocidadNominal": this.myFormMaquina.value.velocidadNominal,
        "HorasDepreciacion": diferencia,
        "Potencia": this.myFormMaquina.value.potencia,
        "FactorPorcentajeMantenimiento": this.myFormMaquina.value.porcentajeMantenimiento,
        "Costo": this.myFormMaquina.value.costo,
        "HorasUsoAnualEstimado": this.myFormMaquina.value.horasUsoDiario * 365,
        "ValorDepreciacionHora": (this.myFormMaquina.value.costo / diferencia),
        "PorcentajeValorResidual": 0,
        "TotalValorResidual": 0,
        "PorcentajeInteres": this.myFormMaquina.value.porcentajeInteres,
        "ValorInversion": (this.myFormMaquina.value.costo * (this.myFormMaquina.value.porcentajeInteres / 100)) / (2 * this.myFormMaquina.value.horasUsoDiario * 365),
        "PorcentajeSeguro": this.myFormMaquina.value.porcentajeSeguros,
        "ValorSeguro": (this.myFormMaquina.value.costo * (this.myFormMaquina.value.porcentajeSeguros / 100)) / (2 * this.myFormMaquina.value.horasUsoDiario * 365),
        "CargoMantenimiento": (this.myFormMaquina.value.costo / diferencia) * (this.myFormMaquina.value.porcentajeMantenimiento / 100),
        "CapacidadAncho": 0,
        "CapacidadColores": 0,
        "Estado": 1,
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Insert",
        "Referencia": "Maquina",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalCreateMaquina = false;
          this.ngOnInit();
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.blockedSendData = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.blockedSendData = false;
      }
    });
  }

  onSaveMaquina() {
    if (this.formService.validForm(this.myFormMaquina)) {
      if (this.idMaquina === 0) {
        this.onInsertMaquina();
      } else {
        this.onUpdateMaquina();
      }
    } else {
      this.sweetService.toastWarning('Ingrese todos los campos');
    }
  }

  onCreateGasto() {
    this.idGasto = 0;
    this.myFormGasto.reset();
    this.modalCreateGasto = true;
  }

  onEditGasto(infogasto: AdministracionProduccionMaquinaGastosFuncionamientoInterface) {
    this.idGasto = infogasto.IdMaquinaGastoFuncionamiento;
    this.myFormGasto.patchValue({
      "idGasto": infogasto.IdGastosVariosMaquinas,
      "cantidad": infogasto.CantidadUsoHora,
    });
    this.modalCreateGasto = true;
  }

  onUpdateGasto() {
    const valor = this.listCargoConsumos.find(item => item.IdGastosVariosMaquinas === this.myFormGasto.value.idGasto)?.ValorUnitario ?? 0;
    this.blockedSendData = true;
    const parametros = {
      codigo: 1091,
      parametros: {
        "IdMaquinaGastoFuncionamiento": this.idGasto,
        "IdMaquina": this.idMaquina,
        "IdGastosVariosMaquinas": Number(this.myFormGasto.value.idGasto),
        "CantidadUsoHora": this.myFormGasto.value.cantidad,
        "ValorUsoHora": (this.myFormGasto.value.cantidad * valor),
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Update",
        "Referencia": "Maquina Gasto",
        "Detalle": this.idGasto,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalCreateGasto = false;
          this.onGetInfoMaquina(this.idMaquina);
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.blockedSendData = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.blockedSendData = false;
      }
    });

  }

  onInsertGasto() {
    const valor = this.listCargoConsumos.find(item => item.IdGastosVariosMaquinas === this.myFormGasto.value.idGasto)?.ValorUnitario ?? 0;
    this.blockedSendData = true;
    const parametros = {
      codigo: 1089,
      parametros: {
        "IdMaquina": this.idMaquina,
        "IdGastosVariosMaquinas": Number(this.myFormGasto.value.idGasto),
        "CantidadUsoHora": this.myFormGasto.value.cantidad,
        "ValorUsoHora": (this.myFormGasto.value.cantidad * valor),
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Insert",
        "Referencia": "Maquina Gasto",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalCreateGasto = false;
          this.onGetInfoMaquina(this.idMaquina);
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.blockedSendData = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.blockedSendData = false;
      }
    });

  }

  onSaveGasto() {
    if (this.formService.validForm(this.myFormGasto)) {
      if (this.idGasto === 0) {
        this.onInsertGasto();
      } else {
        this.onUpdateGasto();
      }
    } else {
      this.sweetService.toastWarning('Ingrese todos los campos');
    }
  }

  onCreateOperador() {
    this.idOperador = 0;
    this.myFormOperador.reset();
    this.modalCreateOperador = true;
  }

  onEditOperador(infoOperador: AdministracionProduccionMaquinaOperadorInterface) {
    this.idOperador = infoOperador.IdMaquinaOperador;
    this.myFormOperador.patchValue({
      "idColaborador": infoOperador.IdColaborador,
      "estado": infoOperador.Estado,
    });
    this.modalCreateOperador = true;
  }

  onInsertOperador() {
    this.blockedSendData = true;
    const parametros = {
      codigo: 1092,
      parametros: {
        "IdMaquina": this.infoMaquina[0].IdMaquina,
        "IdColaborador": this.myFormOperador.value.idColaborador,
        "Estado": this.myFormOperador.value.estado,
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Insert",
        "Referencia": "Maquina Operador",
        "Detalle": this.idOperador,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalCreateOperador = false;
          this.onGetInfoMaquina(this.idMaquina);
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.blockedSendData = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.blockedSendData = false;
      }
    });
  }

  onUpdateOperador() {
    this.blockedSendData = true;
    const parametros = {
      codigo: 1094,
      parametros: {
        "IdMaquinaOperador": this.idOperador,
        "IdMaquina": this.infoMaquina[0].IdMaquina,
        "IdColaborador": this.myFormOperador.value.idColaborador,
        "Estado": this.myFormOperador.value.estado,
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Update",
        "Referencia": "Maquina Operador",
        "Detalle": this.idOperador,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalCreateOperador = false;
          this.onGetInfoMaquina(this.idMaquina);
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.blockedSendData = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.blockedSendData = false;
      }
    });
  }

  onSaveOperador() {
    if (this.formService.validForm(this.myFormOperador)) {
      if (this.idOperador === 0) {
        this.onInsertOperador();
      } else {
        this.onUpdateOperador();
      }
    } else {
      this.sweetService.toastWarning('Ingrese todos los datos');
    }
  }
}
