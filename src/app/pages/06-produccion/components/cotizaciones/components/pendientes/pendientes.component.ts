import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Table } from "primeng/table";
import { LoginService } from "src/app/pages/00-login/services/login.service";
import { AdministracionDisenioCirelInterface, AdministracionDisenioPantoneInterface } from "src/app/pages/02-administracion/interfaces/disenio.interface";
import { GestionInventarioProductoInventarioInterface } from "src/app/pages/02-administracion/interfaces/gestion-inventario.interface";
import { AdministracionProduccionConoInterface, AdministracionProduccionMaquinaInterface, AdministracionProduccionTroquelesInterface } from "src/app/pages/02-administracion/interfaces/produccion.interface";
import { ComercialCotizacionesDetalleInterface } from "src/app/pages/05-comercial/interfaces/cotizaciones.interface";
import { ProduccionProcesoFabricacionInterface } from "src/app/pages/06-produccion/interfaces/proceso_fabricacion.interface";
import { ProduccionProductoTerminadoInterface } from "src/app/pages/06-produccion/interfaces/producto_terminado.interface";
import { ApiService } from "src/app/shared/services/api.service";
import { ReactiveFormsService } from "src/app/shared/services/forms.service";
import { SweetAlertService } from "src/app/shared/services/sweet-alert.service";


@Component({
    selector: 'app-produccion-cotizaciones-pendientes',
    templateUrl: './pendientes.component.html',
    styles: [`
        .txtObservacion {  white-space: pre-line; line-height: 1;}
    `]
})
export class ProduccionCotizacionesPendientesComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);

    blockedSend: boolean = false;
    blockedGet: boolean = false;

    loadingPendientes: boolean = false;
    listPendientes: any[] = [];
    searchValue: string | undefined;

    infoDetalleCotizacion: ComercialCotizacionesDetalleInterface | undefined;
    myFormRechazo: FormGroup;
    modalInfoCotizacion: boolean = false;

    listTroquel: AdministracionProduccionTroquelesInterface[] = [];
    loadingTroquel: boolean = false;
    listPantone: AdministracionDisenioPantoneInterface[] = [];
    loadingPantone: boolean = false;
    listCono: AdministracionProduccionConoInterface[] = [];
    loadingCono: boolean = false;
    listCirel: AdministracionDisenioCirelInterface[] = [];
    loadingCirel: boolean = false;
    listMaquina: AdministracionProduccionMaquinaInterface[] = [];
    loadingMaquina: boolean = false;
    listProductoInventario: GestionInventarioProductoInventarioInterface[] = [];
    loadingProductoInventario: boolean = false;

    modalAddCirelTroquel: boolean = false;
    myFormCirel: FormGroup;

    modalAddTroquel: boolean = false;
    myFormTroquel: FormGroup;

    infoProdTerm: ProduccionProductoTerminadoInterface | undefined;
    infoCirel: AdministracionDisenioCirelInterface | undefined;
    listProcFabr: ProduccionProcesoFabricacionInterface[] = [];
    loadingProcFabr: boolean = false;
    modalInfoProcFabr: boolean = false;
    modalAddProcFabr: boolean = false;
    myFormAddProcFabr: FormGroup;
    myFormProcFabr: FormGroup;


    constructor() {
        this.myFormRechazo = new FormGroup({
            "observacion": new FormControl('', [Validators.required]),
        });
        this.myFormCirel = new FormGroup({
            "cirel": new FormControl('', [Validators.required]),
            "troquel": new FormControl('', [Validators.required]),
            "referencia": new FormControl(''),
        });
        this.myFormTroquel = new FormGroup({
            "troquel": new FormControl('', [Validators.required]),
            "referencia": new FormControl(''),
        });
        this.myFormAddProcFabr = new FormGroup({
            "materiaPrima": new FormControl('', [Validators.required]),
            "ancho": new FormControl('', [Validators.required]),
            "maquina1": new FormControl('', [Validators.required]),
            "maquina2": new FormControl(''),
            "maquina3": new FormControl(''),
            "maquina4": new FormControl(''),
        });
        this.myFormProcFabr = new FormGroup({
            "proceso": new FormControl('', [Validators.required]),
        });
    }

    ngOnInit() {
        this.onGetAllCono();
        this.onGetAllCirel();
        this.onGetAllTroquel();
        this.onGetAllMaquina();
        this.onGetProductoInventario();
        this.onGetAllCotiRevisionPendiente();
    }

    onGetAllCotiRevisionPendiente() {
        this.loadingPendientes = true;
        const parametros = {
            codigo: 1137,
            parametros: {
                "EstadoCabecera": 2,
                "EstadoDetalle": 1
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'comercial', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listPendientes = [...resp.data];
                    this.onGetAllCotiDevueltoPendiente();
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                    this.loadingPendientes = false;
                }
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingPendientes = false;
            }
        });
    }

    onGetAllCotiDevueltoPendiente() {
        this.loadingPendientes = true;
        const parametros = {
            codigo: 1137,
            parametros: {
                "EstadoCabecera": 4,
                "EstadoDetalle": 1
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'comercial', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listPendientes = this.listPendientes.concat(resp.data);
                    this.onGetAllCotiRevisionDevuelto();
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                    this.loadingPendientes = false;
                }
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingPendientes = false;
            }
        });
    }

    onGetAllCotiRevisionDevuelto() {
        this.loadingPendientes = true;
        const parametros = {
            codigo: 1137,
            parametros: {
                "EstadoCabecera": 2,
                "EstadoDetalle": 3
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'comercial', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listPendientes = this.listPendientes.concat(resp.data);
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingPendientes = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingPendientes = false;
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onGetAllCono() {
        this.loadingCono = true;
        const parametros = {
            codigo: 1122,
            parametros: {
                "IdCono": null,
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listCono = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingCono = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingCono = false;
            }
        });
    }

    onGetAllCirel() {
        this.loadingCirel = true;
        const parametros = {
            codigo: 1144,
            parametros: {
                "CodigoArte": null,
                "Cliente": null,
                "Diseniador": null,
                "Estado": 1
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listCirel = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingCirel = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingCirel = false;
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
                "Estado": 1,
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

    onGetAllMaquina() {
        this.loadingMaquina = true;
        const parametros = {
            codigo: 1084,
            parametros: {
                'IdMaquina': null
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listMaquina = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingMaquina = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingMaquina = false;
            }
        });
    }

    onGetProductoInventario() {
        this.loadingProductoInventario = true;
        const parametros = {
            codigo: 1022,
            parametros: {
                'GrupoInventario': null,
                'CodigoTipoInventario': null,
                'CodigoInternoSustrato': null,
                'IdentificacionProveedor': null,
                "CodigoLineaInventario": null,
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listProductoInventario = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingProductoInventario = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingProductoInventario = false;
            }
        });
    }

    //VER PENDIENTE
    onGetInfoDetalleCotizacion(idDetalleCotizacion: number) {
        this.blockedGet = true;
        const parametros = {
            codigo: 1134,
            parametros: {
                "IdDetalleCotizacion": idDetalleCotizacion,
                "IdCabeceraCotizacion": null,
                "TipoTrabajo": null,
                "TipoInventario": null,
                "Estado": null,
                "ConfigurarOp": null
            },
        };
        this.infoDetalleCotizacion = undefined;
        this.apiService.onGetApiExecuteNew(parametros, 'comercial', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.infoDetalleCotizacion = { ...resp.data[0] };
                    this.modalInfoCotizacion = true;
                    this.myFormRechazo.reset();
                    this.myFormCirel.reset();
                    this.myFormTroquel.reset();
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.blockedGet = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.blockedGet = false;
            }
        });
    }

    onRechazarCotizacion() {
        if (this.formService.validForm(this.myFormRechazo)) {
            const parametros = {
                codigo: 1138,
                parametros: {
                    "IdDetalleCotizacion": Number(this.infoDetalleCotizacion!.IdDetalleCotizacion),
                    "ObservacionDevuelto": this.myFormRechazo.value.observacion
                },
                paramDetalle: {
                    "IdDetalleCotizacion": Number(this.infoDetalleCotizacion!.IdDetalleCotizacion),
                    "IdCabeceraCotizacion": null,
                    "TipoTrabajo": null,
                    "TipoInventario": null,
                    "DescripcionTrabajo": null,
                    "ObservacionTrabajo": null,
                    "CantidadPorFabricar": null,
                    "UnidadMedida": null,
                    "UnidadesPorRollo": null,
                    "Rebobinado": null,
                    "Cono": null,
                    "TipoCorte": null,
                    "Avance": null,
                    "Ancho": null,
                    "FilasPorRollo": null,
                    "Troquel": null,
                    "GapAvance": null,
                    "GapAncho": null,
                    "Totalm2Etiqueta": null,
                    "Totalm2": null,
                    "PrecioM2Mp": null,
                    "PrecioTotalM2Mp": null,
                    "ValorHoraMaquina": null,
                    "ValorTotalMaquina": null,
                    "Color1": null,
                    "PorcentajeColor1": null,
                    "Color2": null,
                    "PorcentajeColor2": null,
                    "Color3": null,
                    "PorcentajeColor3": null,
                    "Color4": null,
                    "PorcentajeColor4": null,
                    "Color5": null,
                    "PorcentajeColor5": null,
                    "Color6": null,
                    "PorcentajeColor6": null,
                    "Color7": null,
                    "PorcentajeColor7": null,
                    "Color8": null,
                    "PorcentajeColor8": null,
                    "Color9": null,
                    "PorcentajeColor9": null,
                    "Color10": null,
                    "PorcentajeColor10": null,
                    "Color11": null,
                    "PorcentajeColor11": null,
                    "Color12": null,
                    "PorcentajeColor12": null,
                    "ValorTotalEtiqueta": null,
                    "ValorTotalMillar": null,
                    "ValorTotalItem": null,
                    "Estado": 3,
                    "ConfigurarOp": null,
                    "DescripcionAcabado": null,
                    "PrecioAcabado": null,
                    "CodigoProductoTerminado": null,
                    "EspecificacionTipoBFD": null,
                    "CodigoEspecificacionTipoBFD": null,
                    "CodigoAntiguo": null,
                    "FormatoTroquel": null,
                    "Prepicado": null,
                    "CorteSeguridad": null,
                    "Distribuidor": null,
                },
                paramCabecera: {
                    "IdCabeceraCotizacion": Number(this.infoDetalleCotizacion!.IdCabeceraCotizacion),
                    "RazonSocialCliente": null,
                    "IdentificacionCliente": null,
                    "Direccioncliente": null,
                    "CiudadCliente": null,
                    "ContactoCliente": null,
                    "TelefonoCliente": null,
                    "IdentificacionAsesor": null,
                    "NombreAsesor": null,
                    "FechaPedido": null,
                    "SecuencialCotizacion": null,
                    "TotalItems": null,
                    "ValorTotalCotizacion": null,
                    "Estado": 4
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'comercial', 'revisionToDevuelto', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        const info = this.listPendientes.find(item => item.IdDetalleCotizacion === this.infoDetalleCotizacion?.IdDetalleCotizacion);
                        const paramEmail = {
                            cotizacion: info.SecuencialCotizacion ?? '',
                            usuario: this.loginService.usuario.UserName,
                            trabajo: this.infoDetalleCotizacion?.DescripcionTrabajo ?? '',
                            comercial: info.NombreAsesor ?? ''
                        }
                        this.apiService.onSendEmail(paramEmail, 4).subscribe({
                            next: (resp: any) => {

                            }, error: (err) => {
                                this.sweetService.viewDanger(0, err.error);
                                this.blockedSend = false;
                            }
                        });
                        this.ngOnInit();
                        this.modalInfoCotizacion = false;
                        this.sweetService.viewSuccess('Se rechazo la solicitud de Cotización', () => { });
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                    }
                    this.blockedSend = false;
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                    this.blockedSend = false;
                }
            });
        } else {
            this.sweetService.toastWarning('Ingrese la observación del rechazo');
        }
    }

    onAprobarCotizacion() {
        if (this.infoDetalleCotizacion) {
            const codDis = this.infoDetalleCotizacion.CodigoProductoTerminado;
            const tipDis = this.infoDetalleCotizacion.EspecificacionTipoBFD;

            if (codDis === null || codDis === "") {
                if (tipDis === "D") {
                    this.myFormCirel.patchValue({
                        troquel: this.listTroquel.find(item => item.CodigoInternoTroquel === this.infoDetalleCotizacion!.Troquel) ?? null,
                    });
                    this.modalAddCirelTroquel = true;
                } else {
                    this.myFormTroquel.patchValue({
                        troquel: this.listTroquel.find(item => item.CodigoInternoTroquel === this.infoDetalleCotizacion!.Troquel) ?? null,
                    });
                    this.modalAddTroquel = true;
                }
            } else {
                this.modalInfoCotizacion = false;
                this.onGetAllProdTerm(this.infoDetalleCotizacion.CodigoProductoTerminado);
            }
        }
    }

    onInsertProdTerm(codProdTerm: string, tipInve: string, codDise: string, nomProd: string, codCirel: string | null, codTroquel: string) {
        if (this.infoDetalleCotizacion) {
            this.blockedSend = true;
            const parametros = {
                codigo: 1146,
                parametros: {
                    "CodigoProductoTerminado": codProdTerm,
                    "UnidadesPorRollo": this.infoDetalleCotizacion.UnidadesPorRollo,
                    "TipoCorte": this.infoDetalleCotizacion.TipoCorte2.split('-')[1],
                    "AvanceEtiqueta": this.infoDetalleCotizacion.Avance,
                    "AnchoEtiqueta": this.infoDetalleCotizacion.Ancho,
                    "FilasPorRollo": this.infoDetalleCotizacion.FilasPorRollo,
                    "EspecificacionTipoBFD": this.infoDetalleCotizacion.EspecificacionTipoBFD,
                    "CodigoEspecificacionTipoBFD": codDise,
                    "DescripcionAcabado": this.infoDetalleCotizacion.DescripcionAcabado,
                    "FormatoTroquel": this.infoDetalleCotizacion.FormatoTroquel,
                    "Prepicado": this.infoDetalleCotizacion.Prepicado,
                    "CorteSeguridad": this.infoDetalleCotizacion.CorteSeguridad
                },
                paramProTer: {
                    "FechaRegistro": new Date(),
                    "CodigoProductoTerminado": codProdTerm,
                    "SecuencialProductoTerminado": null,
                    "CodigoFinalProductoTerminado": null,
                    "CodigoProductoTerminadoAnterior": null,
                    "NombreProductoEtimet": nomProd,
                    "NombreProductoComercial": this.infoDetalleCotizacion.DescripcionTrabajo,
                    "TipoTrabajo": this.infoDetalleCotizacion.TipoTrabajo,
                    "TipoInventario": this.infoDetalleCotizacion.TipoInventario.split('-')[1],
                    "UnidadMedida": this.infoDetalleCotizacion.UnidadMedida,
                    "UnidadesPorRollo": this.infoDetalleCotizacion.UnidadesPorRollo,
                    "Rebobinado": this.infoDetalleCotizacion.Rebobinado,
                    "Cono": this.infoDetalleCotizacion.Cono,
                    "TipoCorte": this.infoDetalleCotizacion.TipoCorte2.split('-')[1],
                    "AvanceEtiqueta": this.infoDetalleCotizacion.Avance,
                    "AnchoEtiqueta": this.infoDetalleCotizacion.Ancho,
                    "FilasPorRollo": this.infoDetalleCotizacion.FilasPorRollo,
                    "Troquel": codTroquel,
                    "GapAvance": this.infoDetalleCotizacion.GapAvance,
                    "Gapancho": this.infoDetalleCotizacion.GapAncho,
                    "M2Etiqueta": this.infoDetalleCotizacion.Totalm2Etiqueta,
                    "M2EtiquetaConGap": this.infoDetalleCotizacion.Totalm2Etiqueta,
                    "CodigoMaterial": tipInve,
                    "EspecificacionTipoBFD": this.infoDetalleCotizacion.EspecificacionTipoBFD,
                    "CodigoEspecificacionTipoBFD": codDise,
                    "DescripcionAcabado": this.infoDetalleCotizacion.DescripcionAcabado,
                    "ConfigurarOp": this.infoDetalleCotizacion.ConfigurarOp,
                    "Estado": 1,
                    "CodigoAntiguo": this.infoDetalleCotizacion.CodigoAntiguo,
                    "FormatoTroquel": this.infoDetalleCotizacion.FormatoTroquel,
                    "Prepicado": this.infoDetalleCotizacion.Prepicado,
                    "CorteSeguridad": this.infoDetalleCotizacion.CorteSeguridad,
                    "Distribuidor": this.infoDetalleCotizacion.Distribuidor,
                },
                paramDetalle: {
                    "IdDetalleCotizacion": Number(this.infoDetalleCotizacion.IdDetalleCotizacion),
                    "IdCabeceraCotizacion": null,
                    "TipoTrabajo": null,
                    "TipoInventario": null,
                    "DescripcionTrabajo": null,
                    "ObservacionTrabajo": null,
                    "CantidadPorFabricar": null,
                    "UnidadMedida": null,
                    "UnidadesPorRollo": null,
                    "Rebobinado": null,
                    "Cono": null,
                    "TipoCorte": null,
                    "Avance": null,
                    "Ancho": null,
                    "FilasPorRollo": null,
                    "Troquel": codTroquel,
                    "GapAvance": null,
                    "GapAncho": null,
                    "Totalm2Etiqueta": null,
                    "Totalm2": null,
                    "PrecioM2Mp": null,
                    "PrecioTotalM2Mp": null,
                    "ValorHoraMaquina": null,
                    "ValorTotalMaquina": null,
                    "Color1": null,
                    "PorcentajeColor1": null,
                    "Color2": null,
                    "PorcentajeColor2": null,
                    "Color3": null,
                    "PorcentajeColor3": null,
                    "Color4": null,
                    "PorcentajeColor4": null,
                    "Color5": null,
                    "PorcentajeColor5": null,
                    "Color6": null,
                    "PorcentajeColor6": null,
                    "Color7": null,
                    "PorcentajeColor7": null,
                    "Color8": null,
                    "PorcentajeColor8": null,
                    "Color9": null,
                    "PorcentajeColor9": null,
                    "Color10": null,
                    "PorcentajeColor10": null,
                    "Color11": null,
                    "PorcentajeColor11": null,
                    "Color12": null,
                    "PorcentajeColor12": null,
                    "ValorTotalEtiqueta": null,
                    "ValorTotalMillar": null,
                    "ValorTotalItem": null,
                    "Estado": null,
                    "ConfigurarOp": null,
                    "DescripcionAcabado": null,
                    "PrecioAcabado": null,
                    "CodigoProductoTerminado": null,
                    "EspecificacionTipoBFD": null,
                    "CodigoEspecificacionTipoBFD": codCirel,
                    "CodigoAntiguo": null,
                    "FormatoTroquel": null,
                    "Prepicado": null,
                    "CorteSeguridad": null,
                    "Distribuidor": null,
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'createProductoTerminado', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.modalInfoCotizacion = false;
                        this.modalAddCirelTroquel = false;
                        this.modalAddTroquel = false;
                        this.myFormCirel.reset();
                        this.myFormTroquel.reset();
                        this.onGetAllProdTerm(resp.data[0].CodigoProductoTerminado);
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                    }
                    this.blockedSend = false;
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                    this.blockedSend = false;
                }
            });
        }
    }

    onSaveProdTermiCirel() {
        if (this.formService.validForm(this.myFormCirel)) {
            if (this.infoDetalleCotizacion) {
                const tipInv = this.infoDetalleCotizacion.TipoInventario.split('-')[0].substring(2);
                const cono = this.listCono.find(item => item.SiglaCono === this.infoDetalleCotizacion!.Cono)?.IdCono.toString().padStart(2, '0');
                const tipCor = this.infoDetalleCotizacion.TipoCorte.split('-')[0];
                const tipDis = this.infoDetalleCotizacion.EspecificacionTipoBFD;
                const codDis = this.myFormCirel.value.cirel.CodigoArte;

                const codProTer = tipInv + cono + tipCor + tipDis + codDis;
                const txtDisenio = `D${codDis}`;

                let nomInit = "";
                if (this.infoDetalleCotizacion.TipoTrabajo.indexOf("ETIQUETA") !== -1) {
                    nomInit = "ETIQ";
                }
                else if (this.infoDetalleCotizacion.TipoTrabajo.indexOf("ROLLO") !== -1) {
                    nomInit = "ROLLO";
                }

                const referencia = this.myFormCirel.value.referencia ? ` ${this.myFormCirel.value.referencia} ` : ' ';

                const nomPro = `${nomInit}${referencia}${this.infoDetalleCotizacion.TipoInventario.split('-')[1]} ${this.infoDetalleCotizacion.Cono} ${this.infoDetalleCotizacion.TipoCorte.split('-')[2]} ${this.infoDetalleCotizacion.Avance} X ${this.infoDetalleCotizacion.Ancho} ${this.infoDetalleCotizacion.UnidadesPorRollo}UR ${this.infoDetalleCotizacion.FilasPorRollo}F ${txtDisenio} ${this.infoDetalleCotizacion.DescripcionAcabado ?? ''}`.toUpperCase().trim();

                const codTro = this.myFormCirel.value.troquel.CodigoInternoTroquel;

                this.onInsertProdTerm(codProTer, tipInv, codDis, nomPro, codDis, codTro);
            }
        } else {
            this.sweetService.toastWarning('Ingrese todos los campos');
        }
    }

    onSaveProdTermiTroquel() {
        if (this.formService.validForm(this.myFormTroquel)) {
            if (this.infoDetalleCotizacion) {
                const tipInv = this.infoDetalleCotizacion.TipoInventario.split('-')[0].substring(2);
                const cono = this.listCono.find(item => item.SiglaCono === this.infoDetalleCotizacion!.Cono)?.IdCono.toString().padStart(2, '0');
                const tipCor = this.infoDetalleCotizacion.TipoCorte.split('-')[0];
                const tipDis = this.infoDetalleCotizacion.EspecificacionTipoBFD;
                const codDis = this.infoDetalleCotizacion.CodigoEspecificacionTipoBFD;

                const codProTer = tipInv + cono + tipCor + tipDis + codDis;

                let txtDisenio = "";
                if (tipDis === "B") txtDisenio = "BLANCO"
                else if (tipDis === "F") txtDisenio = this.infoDetalleCotizacion.Color1;

                let nomInit = "";
                if (this.infoDetalleCotizacion.TipoTrabajo.indexOf("ETIQUETA") !== -1) {
                    nomInit = "ETIQ";
                }
                else if (this.infoDetalleCotizacion.TipoTrabajo.indexOf("ROLLO") !== -1) {
                    nomInit = "ROLLO";
                }

                const referencia = this.myFormTroquel.value.referencia ? ` ${this.myFormTroquel.value.referencia} ` : ' ';

                const nomPro = `${nomInit}${referencia}${this.infoDetalleCotizacion.TipoInventario.split('-')[1]} ${this.infoDetalleCotizacion.Cono} ${this.infoDetalleCotizacion.TipoCorte.split('-')[2]} ${this.infoDetalleCotizacion.Avance} X ${this.infoDetalleCotizacion.Ancho} ${this.infoDetalleCotizacion.UnidadesPorRollo}UR ${this.infoDetalleCotizacion.FilasPorRollo}F ${txtDisenio} ${this.infoDetalleCotizacion.DescripcionAcabado ?? ''}`.toUpperCase().trim();

                const codTro = this.myFormTroquel.value.troquel.CodigoInternoTroquel;

                this.onInsertProdTerm(codProTer, tipInv, codDis, nomPro, null, codTro);
            }
        } else {
            this.sweetService.toastWarning('Ingrese todos los campos');
        }
    }

    //SELECCIONAR PROCESO FABRICACION
    onGetAllProdTerm(codProTer: string) {
        this.blockedGet = true;
        const parametros = {
            codigo: 1147,
            parametros: {
                "CodigoFinalProductoTerminado": codProTer ,
            },
            tablas: ['TablaProductoTerminado', 'TablaCirel']
        };
        this.infoProdTerm = undefined;
        this.infoCirel = undefined;
        this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.infoProdTerm = { ...resp.data[0].TablaProductoTerminado[0] };
                    this.infoCirel = { ...resp.data[0].TablaCirel[0] }
                    this.onGetAllProcFabr();
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.blockedGet = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.blockedGet = false;
            }
        });
    }

    onGetAllProcFabr() {
        if (this.infoProdTerm) {
            this.blockedGet = true;
            const parametros = {
                codigo: 1150,
                parametros: {
                    "IdProcesoFabricacion": null,
                    "IdProductoTerminado": this.infoProdTerm.IdProductoTerminado ? this.infoProdTerm.IdProductoTerminado : 0,
                }
            }
            this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'get', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.modalInfoProcFabr = true;
                        this.listProcFabr = [...resp.data]
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                    }
                    this.blockedGet = false;
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                    this.blockedGet = false;
                }
            });
        }
    }

    onCreateProcFabr() {
        this.modalAddProcFabr = true;
        this.myFormAddProcFabr.reset();
    }

    onSaveProcFabr() {
        if (this.formService.validForm(this.myFormAddProcFabr)) {
            if (this.infoProdTerm) {
                const parametros = {
                    codigo: 1149,
                    parametros: {
                        "IdProductoTerminado": Number(this.infoProdTerm.IdProductoTerminado),
                        "CodigoMaterial": this.myFormAddProcFabr.value.materiaPrima.CodigoInternoSustrato,
                        "NombreMaterial": this.myFormAddProcFabr.value.materiaPrima.DescripcionSustrato,
                        "AnchoMaterial": this.myFormAddProcFabr.value.ancho,
                        "CodigoMaquina1": this.myFormAddProcFabr.value.maquina1 ? Number(this.myFormAddProcFabr.value.maquina1.IdMaquina) : null,
                        "NombreMaquina1": this.myFormAddProcFabr.value.maquina1 ? this.myFormAddProcFabr.value.maquina1.Nombre : null,
                        "CodigoMaquina2": this.myFormAddProcFabr.value.maquina2 ? Number(this.myFormAddProcFabr.value.maquina2.IdMaquina) : null,
                        "NombreMaquina2": this.myFormAddProcFabr.value.maquina2 ? this.myFormAddProcFabr.value.maquina2.Nombre : null,
                        "CodigoMaquina3": this.myFormAddProcFabr.value.maquina3 ? Number(this.myFormAddProcFabr.value.maquina3.IdMaquina) : null,
                        "NombreMaquina3": this.myFormAddProcFabr.value.maquina3 ? this.myFormAddProcFabr.value.maquina3.Nombre : null,
                        "CodigoMaquina4": this.myFormAddProcFabr.value.maquina4 ? Number(this.myFormAddProcFabr.value.maquina4.IdMaquina) : null,
                        "NombreMaquina4": this.myFormAddProcFabr.value.maquina4 ? this.myFormAddProcFabr.value.maquina4.Nombre : null,
                        "CodigoMaquina5": null,
                        "NombreMaquina5": null,
                        "CodigoMaquina6": null,
                        "NombreMaquina6": null
                    }
                };
                this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'insert', parametros.codigo).subscribe({
                    next: (resp: any) => {
                        if (resp.success) {
                            this.myFormAddProcFabr.reset();

                            this.modalAddProcFabr = false;
                            this.onGetAllProdTerm(this.infoProdTerm!.CodigoFinalProductoTerminado);
                        } else {
                            this.sweetService.viewDanger(parametros.codigo, resp.message);
                        }
                        this.blockedSend = false;
                    }, error: (err) => {
                        this.sweetService.viewDanger(parametros.codigo, err.error);
                        this.blockedSend = false;
                    }
                });
            }
        } else {
            this.sweetService.toastWarning('Ingrese todos los parametros');
        }
    }

    //ORDEN PRODUCCION
    onCreateOrdenProduccion() {
        if (this.listProcFabr.length !== 0) {
            if (this.formService.validForm(this.myFormProcFabr)) {
                if (this.infoDetalleCotizacion !== undefined && this.infoProdTerm !== undefined && this.infoCirel !== undefined) {
                    this.blockedSend = true;
                    //METRO LINEALES
                    let avance = this.infoProdTerm.AvanceEtiqueta;
                    const ancho = this.infoProdTerm.AnchoEtiqueta;
                    let gapAvance = this.infoProdTerm.GapAvance;
                    const anchoMateriaPrima = this.myFormProcFabr.value.proceso.AnchoMaterial;

                    let cantFabr = 0;
                    let repAvance = 0;

                    const repAncho = Math.trunc(anchoMateriaPrima / (ancho * 10));
                    if (this.infoProdTerm.TipoTrabajo.indexOf('ETIQUETA') !== -1) {
                        avance = avance / 100;
                        gapAvance = gapAvance / 1000;
                        repAvance = this.listTroquel.find(item => item.CodigoInternoTroquel === this.infoProdTerm!.Troquel)?.RepeticionesDesarrollo ?? 1
                    } else if (this.infoProdTerm.TipoTrabajo.indexOf('ROLLO') !== -1) {
                        gapAvance = gapAvance / 1000;
                        repAvance = 1;
                    }

                    if (this.infoDetalleCotizacion.UnidadMedida.indexOf('ETIQUETA') !== -1) {
                        cantFabr = this.infoDetalleCotizacion.CantidadPorFabricar;
                    } else if (this.infoDetalleCotizacion.UnidadMedida.indexOf('ROLLO') !== -1) {
                        cantFabr = this.infoDetalleCotizacion.CantidadPorFabricar * this.infoDetalleCotizacion.UnidadesPorRollo;
                    }

                    let porcExtra = 1;
                    if (this.infoProdTerm.EspecificacionTipoBFD === "B") porcExtra = 1.05;
                    else if (this.infoProdTerm.EspecificacionTipoBFD === "F") porcExtra = 1.10;
                    else if (this.infoProdTerm.EspecificacionTipoBFD === "D") {
                        porcExtra = 1.10;
                        if (this.infoCirel.CantidadColores > 3) {
                            porcExtra = 1.15;
                        }
                    }

                    if (repAncho === 0) {
                        this.sweetService.viewWarning('El ancho del materia debe estar especificado en milimetros', 'OK', () => { });
                        return;
                    }

                    const metrosLineales = (avance + gapAvance) * cantFabr / repAncho;

                    const parametros = {
                        codigo: 1151,
                        parametros: {
                            "FechaRegistro": new Date(),
                            "FechaPedido": null,
                            "FechaEntrega": null,
                            "SecuencialOrdenProduccion": null,
                            "SecuencialCotizacion": this.listPendientes.find(item => item.IdDetalleCotizacion === this.infoDetalleCotizacion?.IdDetalleCotizacion).SecuencialCotizacion ?? null,
                            "OrdenCompra": null,
                            "IdDetalleCotizacion": Number(this.infoDetalleCotizacion.IdDetalleCotizacion),
                            "RazonSocialCliente": null,
                            "IdentificacionCliente": null,
                            "ContactoCliente": null,
                            "Telefonocliente": null,
                            "Direccioncliente": null,
                            "CiudadCliente": null,
                            "CodigoTrabajo": this.infoProdTerm.CodigoFinalProductoTerminado,
                            "NombreTrabajo": this.infoProdTerm.NombreProductoEtimet,
                            "ClaseTrabajo": null,
                            "Rebobinado": this.infoProdTerm.Rebobinado,
                            "Cantidad": this.infoDetalleCotizacion.CantidadPorFabricar,
                            "Metros2Netos": (metrosLineales * (anchoMateriaPrima / 1000)),
                            "Metros2Fijos": (metrosLineales * porcExtra * (anchoMateriaPrima / 1000)),
                            "Diferencia": (metrosLineales * porcExtra * (anchoMateriaPrima / 1000)) - (metrosLineales * (anchoMateriaPrima / 1000)),
                            "MetrosLinealesFijos": metrosLineales,
                            "MetrosLinealesVariable": (metrosLineales * porcExtra),
                            "AnchoMaterial": anchoMateriaPrima,
                            "UnidadesAncho": repAncho,
                            "UnidadesAvance": repAvance,
                            "GapAvance": gapAvance,
                            "CodigoArte": this.infoProdTerm.CodigoEspecificacionTipoBFD,
                            "IdProcesoFabricacion": Number(this.myFormProcFabr.value.proceso.IdProcesoFabricacion),
                            "UnidadZ": null,
                            "TipoTroquel": null,
                            "Troquel": this.infoProdTerm.Troquel,
                            "GapLateral": null,
                            "Maquina": this.myFormProcFabr.value.proceso.NombreMaquina1,
                            "UnidadesRollo": this.infoProdTerm.UnidadesPorRollo,
                            "DiametroCore": this.infoProdTerm.Cono,
                            "FilasRollo": this.infoProdTerm.FilasPorRollo,
                            "IdEstadoOrdenProduccion": 1,
                        }
                    };
                    this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'createOrdenProduccion', parametros.codigo).subscribe({
                        next: (resp: any) => {
                            if (resp.success) {
                                const info = this.listPendientes.find(item => item.IdDetalleCotizacion === this.infoDetalleCotizacion?.IdDetalleCotizacion);
                                const paramEmail = {
                                    cotizacion: info.SecuencialCotizacion ?? '',
                                    usuario: this.loginService.usuario.UserName,
                                    trabajo: this.infoProdTerm!.NombreProductoEtimet,
                                    OP: resp.data[0].OrdenProduccion,
                                    codigo: this.infoProdTerm!.CodigoFinalProductoTerminado,
                                    comercial: info.NombreAsesor ?? ''
                                }
                                this.apiService.onSendEmail(paramEmail, 5).subscribe({
                                    next: (resp: any) => {

                                    }, error: (err) => {
                                        this.sweetService.viewDanger(0, err.error);
                                        this.blockedSend = false;
                                    }
                                });
                                this.sweetService.viewSuccess(`Se acabo de crear la OP ${resp.data[0].OrdenProduccion}`, () => {
                                    location.reload();
                                });
                                this.modalInfoProcFabr = false;
                            } else {
                                this.sweetService.viewDanger(parametros.codigo, resp.message);
                            }
                            this.blockedSend = false;
                        }, error: (err) => {
                            this.sweetService.viewDanger(parametros.codigo, err.error);
                            this.blockedSend = false;
                        }
                    });
                }
            } else {
                this.sweetService.toastWarning('Ingrese todos los parametros');
            }
        } else {
            this.sweetService.toastWarning('Ingrese al menos un proceso de fabricación');
        }
    }
}
