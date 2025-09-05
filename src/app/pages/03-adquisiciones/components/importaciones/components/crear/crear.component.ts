import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdministracionProveedorInterface } from 'src/app/pages/02-administracion/interfaces/proveedor.interface';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { AdquisicionesImportacionesDocumentosLocalesInterface, AdquisicionesImportacionesImportacionInterface } from 'src/app/pages/03-adquisiciones/interface/importaciones';
import { AdquisicionOrdenCompraCabeceraInterface } from 'src/app/pages/03-adquisiciones/interface/adquisicion-cabecera';
import { AdquisicionOrdenCompraDetalleInterface } from 'src/app/pages/03-adquisiciones/interface/adquisicion-detalle';

@Component({
  selector: 'app-adquisiciones-importaciones-crear',
  templateUrl: './crear.component.html',
})
export class AdquisicionesImportacionesCrearComponent {
  apiService = inject(ApiService);
  loginService = inject(LoginService);
  apiRouter = inject(Router);
  sweetService = inject(SweetAlertService);
  apiActivateRoute = inject(ActivatedRoute);
  formService = inject(ReactiveFormsService);

  blockedPanelGet: boolean = false;
  blockedPanelSend: boolean = false;
  blocekdPanelProcess: boolean = false;
  myFormImportacion: FormGroup;
  myFormGastoLocales: FormGroup;
  myFormSearch: FormGroup;
  myFormOrdCom: FormGroup;
  myFormDistribucion: FormGroup;

  modalInfoImportacion: boolean = false;
  infoImportacion: AdquisicionesImportacionesImportacionInterface = {
    Antiduping: 0,
    ArancelAdvaloren: 0,
    ArancelEspecifico: 0,
    FechaCierre: new Date(),
    FechaImportacion: new Date(),
    Fodinfa: 0,
    GastosDistribuir: 0,
    IceAdvaloren: 0,
    IceEspecifico: 0,
    IdImportacion: 0,
    Intereses: 0,
    Iva: 0,
    Multas: 0,
    Observacion: '',
    Otros: 0,
    Referencia: '',
    Salvaguardia: 0,
    SalvaguardiaEspecifica: 0,
    TasaAduanera: 0,
    Usuario: '',
    ValorLiquidado: 0,
  };
  listGastosLocales: AdquisicionesImportacionesDocumentosLocalesInterface[] = [];
  valorLiquidado: number = 0;
  valorDistribuir: number = 0;

  headerModalGastoLocal: boolean = false;
  modalAddGastoLocal: boolean = false;
  listTipoDocumentos: string[] = ['FAC', 'COM']
  listProveedor: AdministracionProveedorInterface[] = [];
  idGastoLocal: number = 0;
  loadingProveedor: boolean = false;
  loadingGastosLocales: boolean = false;
  totalGastosLocales: number = 0;

  listOrdenesCompra: AdquisicionOrdenCompraCabeceraInterface[] = [];
  listDetalleOrdenesCompra: AdquisicionOrdenCompraDetalleInterface[] = [];
  listConsolidadoOrdenesCompra: AdquisicionOrdenCompraDetalleInterface[] = [];

  modalOrdComImp: boolean = false;
  loadingOrdComImp: boolean = false;
  listOCI: any[] = [];

  modalDistribucion: boolean = false;
  listDistribuir: any[] = [];

  constructor() {
    this.myFormImportacion = new FormGroup({
      "arancelAdvalorem": new FormControl('', [Validators.required]),
      "arancelEspecifico": new FormControl('', [Validators.required]),
      "antidumping": new FormControl(0, [Validators.required]),
      "fondinfa": new FormControl('', [Validators.required]),
      "iceAdvalorem": new FormControl('', [Validators.required]),
      "iceEspecifico": new FormControl('', [Validators.required]),
      "iva": new FormControl('', [Validators.required]),
      "tasaVigenciaAduanera": new FormControl('', [Validators.required]),
      "salvaguardia": new FormControl('', [Validators.required]),
      "salvaguardiaEspecifica": new FormControl('', [Validators.required]),
      "interes": new FormControl('', [Validators.required]),
      "multas": new FormControl('', [Validators.required]),
      "otros": new FormControl('', [Validators.required]),
    });
    this.myFormGastoLocales = new FormGroup({
      "proveedor": new FormControl('', [Validators.required]),
      "fechaEmision": new FormControl('', [Validators.required]),
      "tipoDocumento": new FormControl('', [Validators.required]),
      "numeroDocumento": new FormControl('', [Validators.required]),
      "total": new FormControl('', [Validators.required]),
    });
    this.myFormSearch = new FormGroup({
      "fechaIni": new FormControl('', [Validators.required]),
      "fechaFin": new FormControl('', [Validators.required]),
    });
    this.myFormOrdCom = new FormGroup({
      "selectOC": new FormControl('', [Validators.required]),
    });
    this.myFormDistribucion = new FormGroup({
      "porcentaje": new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.onGetParams();
  }

  onGetParams() {
    this.apiActivateRoute.queryParamMap.subscribe(params => {
      const idImportacion = params.get('id');
      if (idImportacion !== null) {
        this.onGetAllProveedor();
        this.onGetDetalleImportacion(Number(idImportacion));
        this.onGetAllOrdenCompra();
      } else {
        this.sweetService.viewWarning(
          'Para acceder a esta funcionalidad lo debe hacer desde el listado de importaciones',
          'Redirigir',
          (result: any) => {
            if (result.isConfirmed)
              this.apiRouter.navigate(['/adquisiciones/importaciones/listado']);
          });
      }
    });
  }

  onGetDetalleImportacion(id: number) {
    this.blockedPanelGet = true;
    const parametros = {
      codigo: 1080,
      parametros: {
        IdImportacion: id,
      },
      tablas: ['TablaImportacion', 'TablaImportacionDocumentosLocales', 'TablaCompra', 'TablaDetalleCompra', 'TablaDetalleCompraAgrupado']
    };
    this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          if (resp.data[0].TablaImportacion.length !== 0) {
            if (resp.data[0].TablaImportacion[0].FechaCierre === null) {
              this.infoImportacion = { ...resp.data[0].TablaImportacion[0] };
              this.listGastosLocales = [...resp.data[0].TablaImportacionDocumentosLocales];
              this.listOrdenesCompra = [...resp.data[0].TablaCompra];
              this.listDetalleOrdenesCompra = [...resp.data[0].TablaDetalleCompra];
              this.listConsolidadoOrdenesCompra = [...resp.data[0].TablaDetalleCompraAgrupado];

              this.onCalcularTotalGastosLocales();
            } else {
              this.sweetService.viewWarning('Esta importacion ya se encuentra cerrada', 'Salir', () => {
                this.apiRouter.navigateByUrl('/home');
              });
            }
          } else {
            this.sweetService.viewWarning('No existe la importacion', 'Salir', () => {
              this.apiRouter.navigateByUrl('/home');
            });
          }
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.blockedPanelGet = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.blockedPanelGet = false;
      }
    });
  }

  onEditInfoImportacion() {
    this.modalInfoImportacion = true;
    this.myFormImportacion.patchValue({
      "arancelAdvalorem": this.infoImportacion.ArancelAdvaloren,
      "arancelEspecifico": this.infoImportacion.ArancelEspecifico,
      "antidumping": this.infoImportacion.Antiduping,
      "fondinfa": this.infoImportacion.Fodinfa,
      "iceAdvalorem": this.infoImportacion.IceAdvaloren,
      "iceEspecifico": this.infoImportacion.IceEspecifico,
      "iva": this.infoImportacion.Iva,
      "tasaVigenciaAduanera": this.infoImportacion.TasaAduanera,
      "salvaguardia": this.infoImportacion.Salvaguardia,
      "salvaguardiaEspecifica": this.infoImportacion.SalvaguardiaEspecifica,
      "interes": this.infoImportacion.Intereses,
      "multas": this.infoImportacion.Multas,
      "otros": this.infoImportacion.Otros,
    });
    this.valorLiquidado = this.infoImportacion.ValorLiquidado ?? 0;
    this.valorDistribuir = this.infoImportacion.GastosDistribuir ?? 0;
  }

  onChangeValoresImportacion() {
    const arancelAdvalorem = this.myFormImportacion.value.arancelAdvalorem ?? 0;
    const arancelEspecifico = this.myFormImportacion.value.arancelEspecifico ?? 0;
    const antidumping = this.myFormImportacion.value.antidumping ?? 0;
    const fondinfa = this.myFormImportacion.value.fondinfa ?? 0;
    const iceAdvalorem = this.myFormImportacion.value.iceAdvalorem ?? 0;
    const iceEspecifico = this.myFormImportacion.value.iceEspecifico ?? 0;
    const iva = this.myFormImportacion.value.iva ?? 0;
    const tasaVigenciaAduanera = this.myFormImportacion.value.tasaVigenciaAduanera ?? 0;
    const salvaguardia = this.myFormImportacion.value.salvaguardia ?? 0;
    const salvaguardiaEspecifica = this.myFormImportacion.value.salvaguardiaEspecifica ?? 0;
    const interes = this.myFormImportacion.value.interes ?? 0;
    const multas = this.myFormImportacion.value.multas ?? 0;
    const otros = this.myFormImportacion.value.otros ?? 0;

    this.valorLiquidado = (arancelAdvalorem + arancelEspecifico + antidumping + fondinfa + iceAdvalorem + iceEspecifico + iva + tasaVigenciaAduanera + salvaguardia + salvaguardiaEspecifica + interes + multas + otros);
    this.valorDistribuir = this.valorLiquidado - iva;
  }

  onSaveInfoImportacion() {
    if (this.formService.validForm(this.myFormImportacion)) {
      this.blockedPanelSend = true;
      const parametros = {
        codigo: 1072,
        parametros: {
          "IdImportacion": this.infoImportacion.IdImportacion,
          "FechaImportacion": null,
          "Referencia": null,
          "ArancelAdvaloren": this.myFormImportacion.value.arancelAdvalorem,
          "ArancelEspecifico": this.myFormImportacion.value.arancelEspecifico,
          "Antiduping": this.myFormImportacion.value.antidumping,
          "Fodinfa": this.myFormImportacion.value.fondinfa,
          "IceAdvaloren": this.myFormImportacion.value.iceAdvalorem,
          "IceEspecifico": this.myFormImportacion.value.iceEspecifico,
          "Iva": this.myFormImportacion.value.iva,
          "TasaAduanera": this.myFormImportacion.value.tasaVigenciaAduanera,
          "Salvaguardia": this.myFormImportacion.value.salvaguardia,
          "SalvaguardiaEspecifica": this.myFormImportacion.value.salvaguardiaEspecifica,
          "Intereses": this.myFormImportacion.value.interes,
          "Multas": this.myFormImportacion.value.multas,
          "Otros": this.myFormImportacion.value.otros,
          "ValorLiquidado": this.valorLiquidado,
          "GastosDistribuir": this.valorDistribuir,
          "Observacion": null,
          "Usuario": this.loginService.usuario.UserName,
          "FechaCierre": null
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'update', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.onGetDetalleImportacion(this.infoImportacion.IdImportacion ?? 0);
            this.modalInfoImportacion = false;
          } else {
            this.sweetService.viewDanger(parametros.codigo, resp.message);
          }
          this.blockedPanelSend = false;
        }, error: (err) => {
          this.sweetService.viewDanger(parametros.codigo, err.error);
          this.blockedPanelSend = false;
        }
      });
    } else {
      this.sweetService.toastWarning('Ingrese todos los campos');
    }
  }

  onGetAllProveedor() {
    this.loadingProveedor = true;
    const parametros = {
      codigo: 1013,
      parametros: {
        'IdentificacionProveedor': null
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listProveedor = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingProveedor = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingProveedor = false;
      }
    });
  }

  onOpenAddGastoLocal() {
    this.idGastoLocal = 0;
    this.modalAddGastoLocal = true;
    this.myFormGastoLocales.reset();
  }

  onEditGastoLocal(infoGastoLocal: AdquisicionesImportacionesDocumentosLocalesInterface) {
    this.idGastoLocal = infoGastoLocal.IdImportacionDocumentosLocales ?? 0;
    const fecha = new Date(infoGastoLocal.FechaEmision ?? new Date());
    this.myFormGastoLocales.patchValue({
      "proveedor": infoGastoLocal.Proveedor,
      "fechaEmision": fecha,
      "tipoDocumento": infoGastoLocal.TipoDocumento,
      "numeroDocumento": infoGastoLocal.NumeroDocumento,
      "total": infoGastoLocal.Total,
    });
    this.modalAddGastoLocal = true;
  }

  onInsertGastoLocal() {
    this.blockedPanelSend = true;
    const parametros = {
      codigo: 1076,
      parametros: {
        "Usuario": this.loginService.usuario.UserName,
        "IdImportacion": this.infoImportacion.IdImportacion,
        "FechaEmision": this.myFormGastoLocales.value.fechaEmision,
        "TipoDocumento": this.myFormGastoLocales.value.tipoDocumento,
        "NumeroDocumento": this.myFormGastoLocales.value.numeroDocumento,
        "Proveedor": this.myFormGastoLocales.value.proveedor,
        "Total": this.myFormGastoLocales.value.total
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'insert', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.onGetGastoLocales(this.infoImportacion.IdImportacion ?? 0);
          this.modalAddGastoLocal = false;
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.blockedPanelSend = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.blockedPanelSend = false;
      }
    });
  }

  onUpdateGastoLocal() {
    this.blockedPanelSend = true;
    const parametros = {
      codigo: 1078,
      parametros: {
        "IdImportacionDocumentosLocales": this.idGastoLocal,
        "Usuario": this.loginService.usuario.UserName,
        "IdImportacion": null,
        "FechaEmision": this.myFormGastoLocales.value.fechaEmision,
        "TipoDocumento": this.myFormGastoLocales.value.tipoDocumento,
        "NumeroDocumento": this.myFormGastoLocales.value.numeroDocumento,
        "Proveedor": this.myFormGastoLocales.value.proveedor,
        "Total": this.myFormGastoLocales.value.total
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'update', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.onGetGastoLocales(this.infoImportacion.IdImportacion ?? 0);
          this.modalAddGastoLocal = false;
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.blockedPanelSend = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.blockedPanelSend = false;
      }
    });
  }

  onSaveGastoLocal() {
    if (this.formService.validForm(this.myFormGastoLocales)) {
      if (this.idGastoLocal === 0) {
        this.onInsertGastoLocal();
      } else {
        this.onUpdateGastoLocal();
      }
    } else {
      this.sweetService.toastWarning('Ingrese todos los campos');
    }
  }

  onGetGastoLocales(id: number) {
    this.loadingGastosLocales = true;
    const parametros = {
      codigo: 1077,
      parametros: {
        "IdImportacion": id,
      },
    };
    this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listGastosLocales = [...resp.data];
          this.onCalcularTotalGastosLocales();
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingGastosLocales = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingGastosLocales = false;
      }
    });
  }

  onCalcularTotalGastosLocales() {
    this.totalGastosLocales = this.listGastosLocales.reduce((acum, value) => acum + (value.Total ?? 0), 0);
  }

  onDeleteImpOC(infoImpOrdCom: AdquisicionOrdenCompraCabeceraInterface) {
    this.blockedPanelSend = true;
    const parametros = {
      codigo: 1074,
      parametros: {
        'IdImportacion': this.infoImportacion.IdImportacion
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          const idDelete = resp.data.find((item: any) => item.IdCompra === infoImpOrdCom.IdCompra).IdImportacionCompra;
          const parametros2 = {
            codigo: 1075,
            parametros: {
              'IdImportacionCompra': idDelete
            }
          };
          this.apiService.onGetApiExecuteNew(parametros2, 'adquisiciones', 'delete', parametros2.codigo).subscribe({
            next: (resp: any) => {
              if (resp.success) {
                this.onGetDetalleImportacion(this.infoImportacion.IdImportacion ?? 0);
                this.blockedPanelSend = false;
              } else {
                this.sweetService.viewDanger(parametros2.codigo, resp.message);
                this.blockedPanelSend = false;
              }
            }, error: (err) => {
              this.sweetService.viewDanger(parametros2.codigo, err.error);
              this.blockedPanelSend = false;
            }
          });
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
          this.blockedPanelSend = false;
        }
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.blockedPanelSend = false;
      }
    });
  }

  onGetAllOrdenCompra() {
    this.loadingOrdComImp = true;
    const parametros = {
      codigo: 1079,
      parametros: {
        "EstadoCompra": 3
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listOCI = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingOrdComImp = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingOrdComImp = false;
      }
    });
  }

  onOpenOrdComImp() {
    this.myFormOrdCom.reset();
    this.modalOrdComImp = true;
  }

  onAddOrdenesCompra() {
    if (this.formService.validForm(this.myFormOrdCom)) {
      this.blockedPanelSend = true;
      const parametros = {
        codigo: 1073,
        parametros: this.myFormOrdCom.value.selectOC.map((item: any) => { return { "IdImportacion": this.infoImportacion.IdImportacion ?? 0, "IdCompra": item } }),
      };
      this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'insertOrdComImp', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.onGetDetalleImportacion(this.infoImportacion.IdImportacion ?? 0);
            this.modalOrdComImp = false;
          } else {
            this.sweetService.viewDanger(parametros.codigo, resp.message);
          }
          this.blockedPanelSend = false;
        }, error: (err) => {
          this.sweetService.viewDanger(parametros.codigo, err.error);
          this.blockedPanelSend = false;
        }
      });
    } else {
      this.sweetService.toastWarning('Ingrese todos los campos');
    }
  }

  onOpenDistribucion() {
    this.modalDistribucion = true;
    this.myFormDistribucion.patchValue({
      porcentaje: 0
    });
  }

  onRedistribuir() {
    if (this.formService.validForm(this.myFormDistribucion)) {
      const totalOrdCom = this.listDetalleOrdenesCompra.reduce((acum, value) => acum + (value.ValorTotalDetalleCompra ?? 0), 0);
      const totalDistribuir = this.infoImportacion.GastosDistribuir ?? 0;
      const totalGastosLocales = this.listGastosLocales.reduce((acum, value) => acum + (value.Total ?? 0), 0);

      this.listDistribuir = [...this.listConsolidadoOrdenesCompra].map(item => {
        const costImportacion = (((item.ValorTotalDetalleCompra ?? 0) / totalOrdCom) * (totalDistribuir + totalGastosLocales));
        const totalImportacion = (item.ValorTotalDetalleCompra ?? 0) + costImportacion;
        const precioVenta = totalImportacion * (1 + (this.myFormDistribucion.value.porcentaje / 100));

        return {
          IdImportacion: this.infoImportacion.IdImportacion,
          Compra: this.listOrdenesCompra.find(item2 => item2.IdCompra === item.IdCompra)?.OrdenCompra,
          CodigoInterno: item.CodigoInternoSustrato,
          IdentificacionProveedor: this.listOrdenesCompra.find(item2 => item2.IdCompra === item.IdCompra)?.IdentificacionProveedor,
          RazonSocialProveedor: this.listOrdenesCompra.find(item2 => item2.IdCompra === item.IdCompra)?.RazonSocialProveedor,
          Descripcion: item.DescripcionDetalleCompra,
          Cantidad: item.CantidadDetalleCompra,
          PrecioUnitario: item.ValorDetalleCompra,
          TotalItem: item.ValorTotalDetalleCompra,
          CostoImportacion: costImportacion,
          TotalImportacion: totalImportacion,
          UtilidadImportacion: this.myFormDistribucion.value.porcentaje,
          PrecioTotalVenta: precioVenta,
          PrecioUnitarioVenta: precioVenta / (item.CantidadDetalleCompra ?? 0),
          FechaRegistro: new Date(),
          Usuario: this.loginService.usuario.UserName,
        };
      });

      this.modalDistribucion = false;
    } else {
      this.sweetService.toastWarning('Ingrese todos los campos');
    }
  }

  onSaveDistribucion() {
    if (this.listDistribuir.length !== 0) {
      this.blockedPanelSend = true;
      const parametros = {
        codigo: 1081,
        parametros: this.listDistribuir,
        parametros2: {
          "IdImportacion": Number(this.infoImportacion.IdImportacion),
          "FechaImportacion": null,
          "Referencia": null,
          "ArancelAdvaloren": null,
          "ArancelEspecifico": null,
          "Antiduping": null,
          "Fodinfa": null,
          "IceAdvaloren": null,
          "IceEspecifico": null,
          "Iva": null,
          "TasaAduanera": null,
          "Salvaguardia": null,
          "SalvaguardiaEspecifica": null,
          "Intereses": null,
          "Multas": null,
          "Otros": null,
          "ValorLiquidado": null,
          "GastosDistribuir": null,
          "Observacion": null,
          "Usuario": this.loginService.usuario.UserName,
          "FechaCierre": new Date(),
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'insertImpDistribucion', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.sweetService.viewSuccess('Los datos se guardaron correctamente', () => {
              this.apiRouter.navigate(['/adquisiciones/importaciones/listado']);
            });
          } else {
            this.sweetService.viewDanger(parametros.codigo, resp.message);
          }
          this.blockedPanelSend = false;
        }, error: (err) => {
          this.sweetService.viewDanger(parametros.codigo, err.error);
          this.blockedPanelSend = false;
        }
      });
    } else {
      this.sweetService.toastWarning('Primero debe hacer la distribución de gastos');
    }
  }
}
