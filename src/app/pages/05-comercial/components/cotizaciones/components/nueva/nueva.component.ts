import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginService } from "src/app/pages/00-login/services/login.service";
import { AdministracionComercialClientesInterface, AdministracionComercialTipoTrabajoInterface, AdministracionComercialTipTraTipInvInterface } from "src/app/pages/02-administracion/interfaces/comercial.interface";
import { AdministracionDisenioCirelInterface, AdministracionDisenioPantoneInterface } from "src/app/pages/02-administracion/interfaces/disenio.interface";
import { AdministracionProduccionAcabadoInterface, AdministracionProduccionConoInterface, AdministracionProduccionRebobinadoInterface, AdministracionProduccionTroquelesInterface } from "src/app/pages/02-administracion/interfaces/produccion.interface";
import { ComercialCotizacionesCabeceraInterface, ComercialCotizacionesDetalleInterface } from "src/app/pages/05-comercial/interfaces/cotizaciones.interface";
import { ProduccionProductoTerminadoInterface } from "src/app/pages/06-produccion/interfaces/producto_terminado.interface";
import { ApiService } from "src/app/shared/services/api.service";
import { ReactiveFormsService } from "src/app/shared/services/forms.service";
import { SweetAlertService } from "src/app/shared/services/sweet-alert.service";

interface TipoCorteInterface {
    codigo: string;
    descripcion: string;
    descripcion2: string;
    siglas: string;
}

interface ProdTermByCliente {
    CodigoTrabajo: string;
    IdentificacionCliente: string;
    NombreTrabajo: string;
    RazonSocialCliente: string;
}

@Component({
    selector: 'app-comercial-cotizaciones-nueva',
    templateUrl: './nueva.component.html',
})
export class ComercialCotizacionesNuevaComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);
    apiActivateRoute = inject(ActivatedRoute);
    apiRouter = inject(Router);

    blockedGet: boolean = false;
    blockedSend: boolean = false;

    infoCabeceraCotizacion: ComercialCotizacionesCabeceraInterface | undefined;
    listDetalleCotizacion: ComercialCotizacionesDetalleInterface[] = [];
    infoDetalleCotizacion: ComercialCotizacionesDetalleInterface | undefined;
    idDetalleCotizacion: number = 0;

    modalProdNew = false;
    myFormCotizador: FormGroup;
    listTipoTrabajo: AdministracionComercialTipoTrabajoInterface[] = [];
    loadingTipoTrabajo = false;
    listTipTraTipInv: AdministracionComercialTipTraTipInvInterface[] = [];
    loadingTipTraTipInv = false;
    listUnidad: string[] = ['ETIQUETA', 'ROLLO'];
    listTipoCorte: TipoCorteInterface[] = [
        { codigo: '01', descripcion: 'TROQUELADA', siglas: 'TR', descripcion2: 'TROQUELADA' },
        { codigo: '02', descripcion: 'CORTE RECTO (CORTE MARCA)', siglas: 'CR', descripcion2: 'CR CM' },
        { codigo: '02', descripcion: 'CORTE RECTO (MARCA CORTE)', siglas: 'CR', descripcion2: 'CR MC' },
        { codigo: '02', descripcion: 'CORTE RECTO (CORTE SIN MARCA)', siglas: 'CR', descripcion2: 'CR CSM' },
        { codigo: '02', descripcion: 'CORTE RECTO (MARCA SIN CORTE)', siglas: 'CR', descripcion2: 'CR MSC' },
        { codigo: '02', descripcion: 'CORTE RECTO (CORTE MEDIO)', siglas: 'CR', descripcion2: 'CR CMD' },
        { codigo: '03', descripcion: 'CONTINUO', siglas: 'CN', descripcion2: 'CONTINUO' },
    ];
    listFormatoTroquel: String[] = ['NO APLICA', 'RECTANGULAR', 'CIRCULAR', 'OVALADO', 'CUADRADO', 'ESPECIAL', 'JABA MEDIA LUNA', 'JABA ORIFICIOS'];
    listCono: AdministracionProduccionConoInterface[] = [];
    loadingCono: boolean = false;
    listRebobinados: AdministracionProduccionRebobinadoInterface[] = [];
    loadingRebobinados: boolean = false;
    listAcabados: AdministracionProduccionAcabadoInterface[] = [];
    loadingAcabado: boolean = false;
    loadingTroquel: boolean = false;
    listTroquel: AdministracionProduccionTroquelesInterface[] = [];
    listPantone: AdministracionDisenioPantoneInterface[] = [];
    loadingPantone: boolean = false;
    listClientes: AdministracionComercialClientesInterface[] = [];
    loadingClientes: boolean = false;
    infoCirel: AdministracionDisenioCirelInterface | undefined;
    loadingCirel: boolean = false;

    listDevueltos: any[] = [];
    loadingDevueltos: boolean = false;

    myFormProdTerm: FormGroup;
    listProdTerm: ProdTermByCliente[] = [];
    loadingProdTerm: boolean = false;
    infoProdTerm: ProduccionProductoTerminadoInterface | undefined;
    precioMpProdTerm: number = 0;
    modalProdTerm: boolean = false;

    constructor() {
        this.myFormCotizador = new FormGroup({
            "codigoAntiguo": new FormControl('', [Validators.required]),
            "descripcion": new FormControl('', [Validators.required]),
            "tipoTrabajo": new FormControl('', [Validators.required]),
            "tipoInventario": new FormControl('', [Validators.required]),
            "unidad": new FormControl('', [Validators.required]),
            "cantidadFabricar": new FormControl('', [Validators.required]),
            "unidadesXRollo": new FormControl('', [Validators.required]),
            "conos": new FormControl('', [Validators.required]),
            "rebobinado": new FormControl('', [Validators.required]),
            "tipoCorte": new FormControl('', [Validators.required]),
            "formatoTroquel": new FormControl('', [Validators.required]),
            "avance": new FormControl('', [Validators.required]),
            "ancho": new FormControl('', [Validators.required]),
            "numFilas": new FormControl('', [Validators.required]),
            "prepicado": new FormControl('', [Validators.required]),
            "corteSeguridad": new FormControl('', [Validators.required]),
            "distribuidor": new FormControl('', [Validators.required]),
            "acabados": new FormControl(''),
            "color1": new FormControl(''),
            "porc1": new FormControl(''),
            "color2": new FormControl(''),
            "porc2": new FormControl(''),
            "color3": new FormControl(''),
            "porc3": new FormControl(''),
            "color4": new FormControl(''),
            "porc4": new FormControl(''),
            "color5": new FormControl(''),
            "porc5": new FormControl(''),
            "color6": new FormControl(''),
            "porc6": new FormControl(''),
            "color7": new FormControl(''),
            "porc7": new FormControl(''),
            "color8": new FormControl(''),
            "porc8": new FormControl(''),
            "observacion": new FormControl(''),
        });
        this.myFormProdTerm = new FormGroup({
            "cliente": new FormControl(''),
            "prodTerm": new FormControl('', [Validators.required]),
            "cantidadFabricar": new FormControl('', [Validators.required]),
            "observacion": new FormControl(''),
        });
    }

    ngOnInit() {
        this.onGetParams();
        this.onGetAllTipoTrabajo();
        this.onGetAllCono();
        this.onGetAllRebobinado();
        this.onGetAllAcabado();
        this.onGetAllTroquel();
        this.onGetAllPantone();
        this.onGetAllProdTermByCliente(null);
        this.onGetAllCliente();
    }

    onGetParams() {
        this.apiActivateRoute.queryParamMap.subscribe(params => {
            this.blockedGet = true;
            const idCotizacion = params.get('id');
            if (idCotizacion !== null) {
                this.onGetInfoCotizacion(Number(idCotizacion));
            } else {
                this.sweetService.viewWarning(
                    'Para acceder a esta funcionalidad lo debe hacer desde el listado de cotizaciones',
                    'Redirigir',
                    (result: any) => {
                        if (result.isConfirmed)
                            this.apiRouter.navigate(['/comercial/cotizaciones/listado']);
                    });
                this.blockedGet = false;
            }
        });
    }

    onGetInfoCotizacion(id: number) {
        const parametros = {
            codigo: 1136,
            parametros: {
                "IdCabeceraCotizacion": id,
            },
            tablas: ['TablaCabeceraCotizacion', 'TablaDetalleCotizacion']
        };
        this.apiService.onGetApiExecuteNew(parametros, 'comercial', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    if (resp.data[0].TablaCabeceraCotizacion.length !== 0) {
                        if (resp.data[0].TablaCabeceraCotizacion[0].NombreAsesor === this.loginService.usuario.UserName) {
                            if (resp.data[0].TablaCabeceraCotizacion[0].Estado === 1 || resp.data[0].TablaCabeceraCotizacion[0].Estado === 4) {
                                this.infoCabeceraCotizacion = { ...resp.data[0].TablaCabeceraCotizacion[0] };
                                this.listDetalleCotizacion = [...resp.data[0].TablaDetalleCotizacion];
                            } else {
                                this.sweetService.viewWarning('Esta cotización no se puede editar', 'Salir', (result: any) => {
                                    if (result.isConfirmed)
                                        this.apiRouter.navigate(['/comercial/cotizaciones/listado']);
                                });
                            }
                        } else {
                            this.sweetService.viewWarning('No tienes permisos sobre esta cotización', 'Salir', (result: any) => {
                                if (result.isConfirmed)
                                    this.apiRouter.navigate(['/comercial/cotizaciones/listado']);
                            });
                        }
                    } else {
                        this.sweetService.viewWarning('Esta cotización no existe', 'Salir', (result: any) => {
                            if (result.isConfirmed)
                                this.apiRouter.navigate(['/comercial/cotizaciones/listado']);
                        });
                    }
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

    onGetAllTipoTrabajo() {
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

    onGetAllRebobinado() {
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

    onGetAllAcabado() {
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

    //COTIZADOR
    onOpenCotizador() {
        this.myFormCotizador.reset();
        this.modalProdNew = true;
        this.infoDetalleCotizacion = undefined;
        this.idDetalleCotizacion = 0;
    }

    onEditCotizacion(info: ComercialCotizacionesDetalleInterface) {
        this.infoDetalleCotizacion = { ...info }
        this.idDetalleCotizacion = Number(this.infoDetalleCotizacion.IdDetalleCotizacion);

        if (info.CodigoProductoTerminado !== null) {
            this.myFormProdTerm.reset();
            this.onGetAllDevueltos();

            this.myFormProdTerm.patchValue({
                "prodTerm": this.listProdTerm.find(item => item.CodigoTrabajo === info.CodigoProductoTerminado),
                "cantidadFabricar": info.CantidadPorFabricar,
                "observacion": info.ObservacionTrabajo,
            });
            this.modalProdTerm = true;
        } else {
            this.myFormCotizador.reset();
            this.onGetAllDevueltos();

            const tipoCorte = this.listTipoCorte.find(item => item.descripcion === info.TipoCorte.split('-')[1]) ?? null;

            this.myFormCotizador.patchValue({
                "descripcion": info.DescripcionTrabajo,
                "tipoTrabajo": this.listTipoTrabajo.find(item => item.DescripcionTrabajo === info.TipoTrabajo),
                "unidad": info.UnidadMedida,
                "cantidadFabricar": info.CantidadPorFabricar,
                "unidadesXRollo": info.UnidadesPorRollo,
                "conos": this.listCono.find(item => item.SiglaCono === info.Cono),
                "rebobinado": this.listRebobinados.find(item => item.DescripcionRebobinado === info.Rebobinado),
                "tipoCorte": tipoCorte,
                "avance": info.Avance,
                "ancho": info.Ancho,
                "numFilas": info.FilasPorRollo,
                "acabados": this.listAcabados.find(item => item.DescripcionAcabado === info.DescripcionAcabado) ?? null,
                "color1": this.listPantone.find(item => item.CodigoDescripcionPantone === info.Color1) ?? null,
                "porc1": info.PorcentajeColor1,
                "color2": this.listPantone.find(item => item.CodigoDescripcionPantone === info.Color2) ?? null,
                "porc2": info.PorcentajeColor2,
                "color3": this.listPantone.find(item => item.CodigoDescripcionPantone === info.Color3) ?? null,
                "porc3": info.PorcentajeColor3,
                "color4": this.listPantone.find(item => item.CodigoDescripcionPantone === info.Color4) ?? null,
                "porc4": info.PorcentajeColor4,
                "color5": this.listPantone.find(item => item.CodigoDescripcionPantone === info.Color5) ?? null,
                "porc5": info.PorcentajeColor5,
                "color6": this.listPantone.find(item => item.CodigoDescripcionPantone === info.Color6) ?? null,
                "porc6": info.PorcentajeColor6,
                "color7": this.listPantone.find(item => item.CodigoDescripcionPantone === info.Color7) ?? null,
                "porc7": info.PorcentajeColor7,
                "color8": this.listPantone.find(item => item.CodigoDescripcionPantone === info.Color8) ?? null,
                "porc8": info.PorcentajeColor8,
                "observacion": info.ObservacionTrabajo,
                "codigoAntiguo": info.CodigoAntiguo,
                "formatoTroquel": info.FormatoTroquel,
                "prepicado": info.Prepicado,
                "corteSeguridad": info.CorteSeguridad,
                "distribuidor": info.Distribuidor,
            });
            this.modalProdNew = true;
        }
    }

    onChangeTipoTrabajo(info: AdministracionComercialTipoTrabajoInterface) {
        if (info !== null && info !== undefined) {
            let id = 0;
            if (typeof (info) === 'string') {
                id = this.listTipoTrabajo.find(item => item.DescripcionTrabajo === info)!.IdTipoTrabajo;
            } else {
                id = info.IdTipoTrabajo;
            }

            this.myFormCotizador.patchValue({ tipoInventario: null });
            this.loadingTipTraTipInv = true;
            const parametros = {
                codigo: 1118,
                parametros: {
                    "IdTipoTrabajo": id,
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.listTipTraTipInv = [...resp.data];
                        if (this.infoDetalleCotizacion !== undefined) {
                            this.myFormCotizador.patchValue({
                                "tipoInventario": this.listTipTraTipInv.find(item => item.NombreTipoInventario === this.infoDetalleCotizacion!.TipoInventario.substring(7,)),
                            });
                            this.infoDetalleCotizacion = undefined;
                        }
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                    }
                    this.loadingTipTraTipInv = false;
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                    this.loadingTipTraTipInv = false;
                }
            });
        }
    }

    onInsertCotizacionDetalle(
        troque: string, gapAvance: number, gapAncho: number, m2Eti: number, m2Tot: number, precioM2: number, precioTotM2: number, precioEti: number, precioMil: number, precioCot: number, descAcabado: string, precioAcabado: number, tipoBFD: string, codigoBFD: string,
    ) {
        this.blockedSend = true;
        const tc = `${this.myFormCotizador.value.tipoCorte.codigo}-${this.myFormCotizador.value.tipoCorte.descripcion2}-${this.myFormCotizador.value.tipoCorte.siglas}`

        const parametros = {
            codigo: 1133,
            parametros: {
                "IdCabeceraCotizacion": Number(this.infoCabeceraCotizacion!.IdCabeceraCotizacion),
                "TipoTrabajo": this.myFormCotizador.value.tipoTrabajo.DescripcionTrabajo,
                "TipoInventario": `${this.myFormCotizador.value.tipoInventario.Codigo}-${this.myFormCotizador.value.tipoInventario.NombreTipoInventario}`,
                "DescripcionTrabajo": this.myFormCotizador.value.descripcion.toUpperCase(),
                "ObservacionTrabajo": this.myFormCotizador.value.observacion,
                "CantidadPorFabricar": this.myFormCotizador.value.cantidadFabricar,
                "UnidadMedida": this.myFormCotizador.value.unidad,
                "UnidadesPorRollo": this.myFormCotizador.value.unidadesXRollo,
                "Rebobinado": this.myFormCotizador.value.rebobinado.DescripcionRebobinado,
                "Cono": this.myFormCotizador.value.conos.SiglaCono,
                "TipoCorte": tc,
                "Avance": this.myFormCotizador.value.avance,
                "Ancho": this.myFormCotizador.value.ancho,
                "FilasPorRollo": this.myFormCotizador.value.numFilas,
                "Troquel": troque,
                "GapAvance": gapAvance,
                "GapAncho": gapAncho,
                "Totalm2Etiqueta": m2Eti,
                "Totalm2": m2Tot,
                "PrecioM2Mp": precioM2,
                "PrecioTotalM2Mp": precioTotM2,
                "ValorHoraMaquina": null,
                "ValorTotalMaquina": null,
                "Color1": this.myFormCotizador.value.color1 ? this.myFormCotizador.value.color1.CodigoDescripcionPantone : null,
                "PorcentajeColor1": this.myFormCotizador.value.porc1,
                "Color2": this.myFormCotizador.value.color2 ? this.myFormCotizador.value.color2.CodigoDescripcionPantone : null,
                "PorcentajeColor2": this.myFormCotizador.value.porc2,
                "Color3": this.myFormCotizador.value.color3 ? this.myFormCotizador.value.color3.CodigoDescripcionPantone : null,
                "PorcentajeColor3": this.myFormCotizador.value.porc3,
                "Color4": this.myFormCotizador.value.color4 ? this.myFormCotizador.value.color4.CodigoDescripcionPantone : null,
                "PorcentajeColor4": this.myFormCotizador.value.porc4,
                "Color5": this.myFormCotizador.value.color5 ? this.myFormCotizador.value.color5.CodigoDescripcionPantone : null,
                "PorcentajeColor5": this.myFormCotizador.value.porc5,
                "Color6": this.myFormCotizador.value.color6 ? this.myFormCotizador.value.color6.CodigoDescripcionPantone : null,
                "PorcentajeColor6": this.myFormCotizador.value.porc6,
                "Color7": this.myFormCotizador.value.color7 ? this.myFormCotizador.value.color7.CodigoDescripcionPantone : null,
                "PorcentajeColor7": this.myFormCotizador.value.porc7,
                "Color8": this.myFormCotizador.value.color8 ? this.myFormCotizador.value.color8.CodigoDescripcionPantone : null,
                "PorcentajeColor8": this.myFormCotizador.value.porc8,
                "Color9": null,
                "PorcentajeColor9": null,
                "Color10": null,
                "PorcentajeColor10": null,
                "Color11": null,
                "PorcentajeColor11": null,
                "Color12": null,
                "PorcentajeColor12": null,
                "ValorTotalEtiqueta": precioEti,
                "ValorTotalMillar": precioMil,
                "ValorTotalItem": precioCot,
                "Estado": 1,
                "ConfigurarOp": 1,
                "DescripcionAcabado": descAcabado,
                "PrecioAcabado": precioAcabado,
                "CodigoProductoTerminado": null,
                "EspecificacionTipoBFD": tipoBFD,
                "CodigoEspecificacionTipoBFD": codigoBFD,
                "CodigoAntiguo": this.myFormCotizador.value.codigoAntiguo,
                "FormatoTroquel": this.myFormCotizador.value.formatoTroquel,
                "Prepicado": this.myFormCotizador.value.prepicado,
                "CorteSeguridad": this.myFormCotizador.value.corteSeguridad,
                "Distribuidor": this.myFormCotizador.value.distribuidor,
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'comercial', 'insert', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.modalProdNew = false;
                    this.ngOnInit();
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

    onUpdateCotizacionDetalle(
        troque: string, gapAvance: number, gapAncho: number, m2Eti: number, m2Tot: number, precioM2: number, precioTotM2: number, precioEti: number, precioMil: number, precioCot: number, descAcabado: string, precioAcabado: number, tipoBFD: string, codigoBFD: string,
    ) {
        const tc = `${this.myFormCotizador.value.tipoCorte.codigo}-${this.myFormCotizador.value.tipoCorte.descripcion2}-${this.myFormCotizador.value.tipoCorte.siglas}`

        this.blockedSend = true;
        const parametros = {
            codigo: 1135,
            parametros: {
                "IdDetalleCotizacion": this.idDetalleCotizacion,
                "IdCabeceraCotizacion": null,
                "TipoTrabajo": this.myFormCotizador.value.tipoTrabajo.DescripcionTrabajo,
                "TipoInventario": `${this.myFormCotizador.value.tipoInventario.Codigo}-${this.myFormCotizador.value.tipoInventario.NombreTipoInventario}`,
                "DescripcionTrabajo": this.myFormCotizador.value.descripcion.toUpperCase(),
                "ObservacionTrabajo": this.myFormCotizador.value.observacion,
                "CantidadPorFabricar": this.myFormCotizador.value.cantidadFabricar,
                "UnidadMedida": this.myFormCotizador.value.unidad,
                "UnidadesPorRollo": this.myFormCotizador.value.unidadesXRollo,
                "Rebobinado": this.myFormCotizador.value.rebobinado.DescripcionRebobinado,
                "Cono": this.myFormCotizador.value.conos.SiglaCono,
                "TipoCorte": tc,
                "Avance": this.myFormCotizador.value.avance,
                "Ancho": this.myFormCotizador.value.ancho,
                "FilasPorRollo": this.myFormCotizador.value.numFilas,
                "Troquel": troque,
                "GapAvance": gapAvance,
                "GapAncho": gapAncho,
                "Totalm2Etiqueta": m2Eti,
                "Totalm2": m2Tot,
                "PrecioM2Mp": precioM2,
                "PrecioTotalM2Mp": precioTotM2,
                "ValorHoraMaquina": null,
                "ValorTotalMaquina": null,
                "Color1": this.myFormCotizador.value.color1 ? this.myFormCotizador.value.color1.CodigoDescripcionPantone : null,
                "PorcentajeColor1": this.myFormCotizador.value.porc1,
                "Color2": this.myFormCotizador.value.color2 ? this.myFormCotizador.value.color2.CodigoDescripcionPantone : null,
                "PorcentajeColor2": this.myFormCotizador.value.porc2,
                "Color3": this.myFormCotizador.value.color3 ? this.myFormCotizador.value.color3.CodigoDescripcionPantone : null,
                "PorcentajeColor3": this.myFormCotizador.value.porc3,
                "Color4": this.myFormCotizador.value.color4 ? this.myFormCotizador.value.color4.CodigoDescripcionPantone : null,
                "PorcentajeColor4": this.myFormCotizador.value.porc4,
                "Color5": this.myFormCotizador.value.color5 ? this.myFormCotizador.value.color5.CodigoDescripcionPantone : null,
                "PorcentajeColor5": this.myFormCotizador.value.porc5,
                "Color6": this.myFormCotizador.value.color6 ? this.myFormCotizador.value.color6.CodigoDescripcionPantone : null,
                "PorcentajeColor6": this.myFormCotizador.value.porc6,
                "Color7": this.myFormCotizador.value.color7 ? this.myFormCotizador.value.color7.CodigoDescripcionPantone : null,
                "PorcentajeColor7": this.myFormCotizador.value.porc7,
                "Color8": this.myFormCotizador.value.color8 ? this.myFormCotizador.value.color8.CodigoDescripcionPantone : null,
                "PorcentajeColor8": this.myFormCotizador.value.porc8,
                "Color9": null,
                "PorcentajeColor9": null,
                "Color10": null,
                "PorcentajeColor10": null,
                "Color11": null,
                "PorcentajeColor11": null,
                "Color12": null,
                "PorcentajeColor12": null,
                "ValorTotalEtiqueta": precioEti,
                "ValorTotalMillar": precioMil,
                "ValorTotalItem": precioCot,
                "Estado": null,
                "ConfigurarOp": 1,
                "DescripcionAcabado": descAcabado,
                "PrecioAcabado": precioAcabado,
                "CodigoProductoTerminado": null,
                "EspecificacionTipoBFD": tipoBFD,
                "CodigoEspecificacionTipoBFD": codigoBFD,
                "CodigoAntiguo": this.myFormCotizador.value.codigoAntiguo,
                "FormatoTroquel": this.myFormCotizador.value.formatoTroquel,
                "Prepicado": this.myFormCotizador.value.prepicado,
                "CorteSeguridad": this.myFormCotizador.value.corteSeguridad,
                "Distribuidor": this.myFormCotizador.value.distribuidor,
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'comercial', 'update', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.modalProdNew = false;
                    this.ngOnInit();
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

    onSaveCotizador() {
        if (this.formService.validForm(this.myFormCotizador)) {
            let avance = this.myFormCotizador.value.avance * 10;
            const ancho = this.myFormCotizador.value.ancho * 10;

            //SELECCIONAR EL TIPO DE TRABAJO PARA GAPS
            let gapAvance = 0;
            let gapAncho = 0;
            let troquel = '';

            const tipoTrab = this.myFormCotizador.value.tipoTrabajo;
            if (tipoTrab.DescripcionTrabajo.toLowerCase().indexOf('etiqueta') !== -1) {
                const tipCor = this.myFormCotizador.value.tipoCorte.descripcion;

                if (tipCor.indexOf('TROQUELADA') !== -1) {
                    const infoTroquel = this.listTroquel.find(item => item.DesarrolloEtiqueta === avance && item.AnchoEtiqueta === ancho);
                    if (infoTroquel) {
                        gapAvance = infoTroquel.GapDesarrollo;
                        gapAncho = infoTroquel.GapEntreEtiquetas !== 0 ? (infoTroquel.GapEntreEtiquetas * 2) : 6;
                        troquel = infoTroquel.CodigoInternoTroquel;
                    } else {
                        gapAvance = 4;
                        gapAncho = 8;
                        troquel = "";
                        this.sweetService.viewWarning(
                            'No existe el troquel adecuado para esas medidas, la cotización se evaluara en base a un GAP generico',
                            'Continuar', () => { }
                        );
                    }
                } else if (tipCor.indexOf('CORTE RECTO') !== -1) {
                    const infoTroquel = this.listTroquel.find(item => item.DesarrolloEtiqueta === avance);
                    if (infoTroquel) {
                        gapAvance = infoTroquel.GapDesarrollo;
                        gapAncho = 0;
                        troquel = infoTroquel.CodigoInternoTroquel;
                    } else {
                        gapAvance = 1;
                        gapAncho = 0;
                        troquel = "";
                        this.sweetService.viewWarning(
                            'No existe el troquel adecuado para esas medidas, la cotización se evaluara en base a un GAP generico',
                            'Continuar', () => { }
                        );
                    }
                } else if (tipCor.indexOf('CONTINUO')) {
                    gapAvance = 0;
                    gapAncho = 0;
                    troquel = "";
                }
            } else if (tipoTrab.DescripcionTrabajo.toLowerCase().indexOf('rollo') !== -1) {
                avance = avance * 100;
                gapAvance = 0;
                gapAncho = 2;
                troquel = "";
            } else if (tipoTrab.DescripcionTrabajo.toLowerCase().indexOf('termoencogible') !== -1) {
                //TODO: controlar
            }

            //OBTENER COLORES
            let listColor: string[] = [];
            for (let i = 1; i <= 8; i++) {
                if (this.myFormCotizador.value['color' + i]) {
                    const color = `${this.myFormCotizador.value['color' + i].IdPantone}-${this.myFormCotizador.value['color' + i].CodigoDescripcionPantone}`;
                    listColor.push(color);
                }
            }
            let tipoBFD = "";
            let codigoBFD = "";

            if (this.myFormCotizador.value.tipoTrabajo.TrabajoImpreso) {
                if (listColor.length === 1 && this.myFormCotizador.value.porc1 === 100) {
                    tipoBFD = "F";
                    codigoBFD = listColor[0].split('-')[0].padStart(4, '0');
                }
                else {
                    tipoBFD = "D";
                    codigoBFD = "";
                }
            } else {
                tipoBFD = "B";
                codigoBFD = "0000";
            }

            //CANTIDAD A FABRICAR
            const tipoUnidad = this.myFormCotizador.value.unidad;
            const cantFabricar = this.myFormCotizador.value.cantidadFabricar;
            const uniRollo = this.myFormCotizador.value.unidadesXRollo;
            const cantTotal = tipoUnidad === 'ETIQUETA' ? cantFabricar : cantFabricar * uniRollo;

            //PORCENTAJE EXTRA DE MATERIAL POR IMPRESION
            let porcExtra = 1.05;
            if (this.myFormCotizador.value.tipoTrabajo.TrabajoImpreso) {
                porcExtra = listColor.length >= 4 ? 1.16 : 1.10;
            }

            //VALORES DE METRAJE
            const m2Etiqueta = (((avance + gapAvance) / 1000) * ((ancho + gapAncho) / 1000)) * porcExtra;
            const m2Cotizacion = m2Etiqueta * cantTotal;
            const valorM2 = this.myFormCotizador.value.tipoInventario.ValorVentaMPm2;
            const precioMpEti = m2Etiqueta * valorM2;
            const precioMpTotal = m2Cotizacion * valorM2;

            //VALORES DE ACABADOS
            const descriAcabado = this.myFormCotizador.value.acabados !== null ? this.myFormCotizador.value.acabados.DescripcionAcabado : null;
            let precioAcabadoM2 = 0;
            if (this.myFormCotizador.value.acabados !== null) {
                precioAcabadoM2 = this.myFormCotizador.value.acabados.PrecioMillar;
            }
            const precioAcabadoEtiqueta = m2Etiqueta * precioAcabadoM2;

            //VALORES FINALES
            const precioFinalEtiqueta = precioMpEti + precioAcabadoEtiqueta;
            const precioFinalMillar = precioFinalEtiqueta * 1000;
            const precioFinalCotizacion = precioFinalEtiqueta * cantTotal;

            if (this.idDetalleCotizacion === 0) {
                this.onInsertCotizacionDetalle(troquel, gapAvance, gapAncho, m2Etiqueta, m2Cotizacion, valorM2, precioMpTotal, precioFinalEtiqueta, precioFinalMillar, precioFinalCotizacion, descriAcabado, precioAcabadoM2, tipoBFD, codigoBFD);
            } else {
                this.onUpdateCotizacionDetalle(troquel, gapAvance, gapAncho, m2Etiqueta, m2Cotizacion, valorM2, precioMpTotal, precioFinalEtiqueta, precioFinalMillar, precioFinalCotizacion, descriAcabado, precioAcabadoM2, tipoBFD, codigoBFD);
            }
        } else {
            this.sweetService.toastWarning('Ingrese todos los parametros');
        }
    }

    //REVISION
    onSendRevision() {
        if (this.listDetalleCotizacion.length !== 0) {
            this.blockedSend = true;
            const parametros = {
                codigo: 1132,
                parametros: {
                    "IdCabeceraCotizacion": Number(this.infoCabeceraCotizacion!.IdCabeceraCotizacion),
                    "RazonSocialCliente": null,
                    "IdentificacionCliente": null,
                    "Direccioncliente": null,
                    "CiudadCliente": null,
                    "ContactoCliente": null,
                    "TelefonoCliente": null,
                    "IdentificacionAsesor": null,
                    "NombreAsesor": null,
                    "FechaPedido": new Date(),
                    "SecuencialCotizacion": this.infoCabeceraCotizacion!.SecuencialCotizacion,
                    "TotalItems": null,
                    "ValorTotalCotizacion": null,
                    "Estado": 2
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'comercial', 'pendienteToRevision', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        const paramEmail = {
                            cotizacion: resp.data[0].Cotizacion,
                            usuario: this.infoCabeceraCotizacion?.NombreAsesor ?? '',
                        }
                        this.apiService.onSendEmail(paramEmail, 3).subscribe({
                            next: (resp: any) => {

                            }, error: (err) => {
                                this.sweetService.viewDanger(0, err.error);
                                this.blockedSend = false;
                            }
                        });
                        this.sweetService.viewSuccess('Se envio la cotización a revisión del Area de Producción', () => {
                            this.apiRouter.navigate(['/comercial/cotizaciones/listado']);
                        });
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
            this.sweetService.viewWarning('Debe al menos tener un item', 'Ok', () => { });
        }
    }

    //OBTENER OBSERVACIONES DE CAMBIOS
    onGetAllDevueltos() {
        this.loadingDevueltos = true;
        const parametros = {
            codigo: 1139,
            parametros: {
                "IdDetalleCotizacion": this.idDetalleCotizacion,
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'comercial', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listDevueltos = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingDevueltos = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingDevueltos = false;
            }
        });
    }

    //REPETIDOS
    onGetAllCliente() {
        this.loadingClientes = true;
        const parametros = {
            codigo: 1010,
            parametros: {
                "nombreusuario": null,
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listClientes = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingClientes = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingClientes = false;
            }
        });
    }

    onOpenRepetidor() {
        this.modalProdTerm = true;
        this.myFormProdTerm.reset();
        this.infoProdTerm = undefined;
        this.precioMpProdTerm = 0;
        this.onGetAllProdTermByCliente(null);
    }

    onGetAllProdTermByCliente(info: AdministracionComercialClientesInterface | null) {
        this.myFormProdTerm.patchValue({
            prodTerm: null,
        });
        this.infoProdTerm = undefined;

        this.loadingProdTerm = true;
        const parametros = {
            codigo: 1165,
            parametros: {
                "IdentificacionCliente": info !== null ? info.IdentificacionCliente : null,
            },
        };
        this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listProdTerm = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingProdTerm = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingProdTerm = false;
            }
        });
    }

    onGetInfoProdTermStep1(info: ProdTermByCliente) {
        if (info !== null && info !== undefined) {
            this.blockedGet = true;
            const parametros = {
                codigo: 1147,
                parametros: {
                    "CodigoFinalProductoTerminado": info.CodigoTrabajo,
                },
                tablas: ['TablaProductoTerminado', 'TablaCirel']
            };
            this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'get', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.onGetInfoProdTermStep2(resp.data[0].TablaProductoTerminado[0]);
                        this.infoCirel = { ...resp.data[0].TablaCirel[0] };
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                    }
                    this.blockedGet = false;
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                    this.blockedGet = false;
                }
            });
        } else {
            this.infoProdTerm = undefined;
        }
    }

    onGetInfoProdTermStep2(info: ProduccionProductoTerminadoInterface) {
        this.blockedGet = true;
        const parametros = {
            codigo: 1118,
            parametros: {
                "IdTipoTrabajo": Number(this.listTipoTrabajo.find(item => item.DescripcionTrabajo === info.TipoTrabajo)!.IdTipoTrabajo),
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.infoProdTerm = { ...info };
                    this.precioMpProdTerm = resp.data.find((item: any) => item.NombreTipoInventario === info.TipoInventario).ValorVentaMPm2;
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

    onGetColoresProdTerm(): string[] {
        if (this.infoProdTerm !== undefined && this.infoCirel !== undefined) {
            let listColor: string[] = [];

            if (this.infoProdTerm.EspecificacionTipoBFD === 'B' || this.infoProdTerm.EspecificacionTipoBFD === 'F') {
                listColor[0] = this.infoProdTerm.CodigoEspecificacionTipoBFD;
            } else if (this.infoProdTerm.EspecificacionTipoBFD === 'D') {
                listColor.push(this.infoCirel.Color1);
                listColor.push(this.infoCirel.Color2);
                listColor.push(this.infoCirel.Color3);
                listColor.push(this.infoCirel.Color4);
                listColor.push(this.infoCirel.Color5);
                listColor.push(this.infoCirel.Color6);
                listColor.push(this.infoCirel.Color7);
                listColor.push(this.infoCirel.Color8);
                listColor.push(this.infoCirel.Color9);
                listColor.push(this.infoCirel.Color10);
                listColor.push(this.infoCirel.Color11);
                listColor.push(this.infoCirel.Color12);
            }

            return listColor;
        } else {
            this.sweetService.toastWarning('Error interno al obtener los colores');
            return [];
        }
    }

    onInsertProdTerm() {
        if (this.infoProdTerm !== undefined) {
            this.blockedSend = true;
            const tc1 = this.listTipoCorte.find(item => item.descripcion2 === this.infoProdTerm!.TipoCorte);
            const tc2 = `${tc1!.codigo}-${tc1!.descripcion2}-${tc1!.siglas}`
            const precioAcabadoM2ProdTerm = this.listAcabados.find(item => item.DescripcionAcabado === this.infoProdTerm!.DescripcionAcabado)?.PrecioMillar ?? 0;
            const listColor = this.onGetColoresProdTerm();

            const parametros = {
                codigo: 1133,
                parametros: {
                    "IdCabeceraCotizacion": Number(this.infoCabeceraCotizacion!.IdCabeceraCotizacion),
                    "TipoTrabajo": this.infoProdTerm.TipoTrabajo,
                    "TipoInventario": `MP${this.infoProdTerm.CodigoMaterial}-${this.infoProdTerm.TipoInventario}`,
                    "DescripcionTrabajo": this.infoProdTerm.NombreProductoEtimet,
                    "ObservacionTrabajo": this.myFormProdTerm.value.observacion,
                    "CantidadPorFabricar": this.myFormProdTerm.value.cantidadFabricar,
                    "UnidadMedida": this.infoProdTerm.UnidadMedida,
                    "UnidadesPorRollo": this.infoProdTerm.UnidadesPorRollo,
                    "Rebobinado": this.infoProdTerm.Rebobinado,
                    "Cono": this.infoProdTerm.Cono,
                    "TipoCorte": tc2,
                    "Avance": this.infoProdTerm.AvanceEtiqueta,
                    "Ancho": this.infoProdTerm.AnchoEtiqueta,
                    "FilasPorRollo": this.infoProdTerm.FilasPorRollo,
                    "Troquel": this.infoProdTerm.Troquel,
                    "GapAvance": this.infoProdTerm.GapAvance,
                    "GapAncho": this.infoProdTerm.Gapancho,
                    "Totalm2Etiqueta": this.infoProdTerm.M2Etiqueta,
                    "Totalm2": (this.infoProdTerm.M2Etiqueta * this.myFormProdTerm.value.cantidadFabricar),
                    "PrecioM2Mp": this.precioMpProdTerm,
                    "PrecioTotalM2Mp": (this.precioMpProdTerm * this.infoProdTerm.M2Etiqueta * this.myFormProdTerm.value.cantidadFabricar),
                    "ValorHoraMaquina": null,
                    "ValorTotalMaquina": null,
                    "Color1": listColor[0] ?? null,
                    "PorcentajeColor1": null,
                    "Color2": listColor[1] ?? null,
                    "PorcentajeColor2": null,
                    "Color3": listColor[2] ?? null,
                    "PorcentajeColor3": null,
                    "Color4": listColor[3] ?? null,
                    "PorcentajeColor4": null,
                    "Color5": listColor[4] ?? null,
                    "PorcentajeColor5": null,
                    "Color6": listColor[5] ?? null,
                    "PorcentajeColor6": null,
                    "Color7": listColor[6] ?? null,
                    "PorcentajeColor7": null,
                    "Color8": listColor[7] ?? null,
                    "PorcentajeColor8": null,
                    "Color9": listColor[8] ?? null,
                    "PorcentajeColor9": null,
                    "Color10": listColor[9] ?? null,
                    "PorcentajeColor10": null,
                    "Color11": listColor[10] ?? null,
                    "PorcentajeColor11": null,
                    "Color12": listColor[11] ?? null,
                    "PorcentajeColor12": null,
                    "ValorTotalEtiqueta": (this.precioMpProdTerm * this.infoProdTerm.M2Etiqueta) + (precioAcabadoM2ProdTerm * this.infoProdTerm.M2Etiqueta),
                    "ValorTotalMillar": ((this.precioMpProdTerm * this.infoProdTerm.M2Etiqueta) + (precioAcabadoM2ProdTerm * this.infoProdTerm.M2Etiqueta)) * 1000,
                    "ValorTotalItem": ((this.precioMpProdTerm * this.infoProdTerm.M2Etiqueta) + (precioAcabadoM2ProdTerm * this.infoProdTerm.M2Etiqueta)) * this.myFormProdTerm.value.cantidadFabricar,
                    "Estado": 1,
                    "ConfigurarOp": 1,
                    "DescripcionAcabado": this.infoProdTerm.DescripcionAcabado,
                    "PrecioAcabado": precioAcabadoM2ProdTerm,
                    "CodigoProductoTerminado": this.infoProdTerm.CodigoFinalProductoTerminado,
                    "EspecificacionTipoBFD": this.infoProdTerm.EspecificacionTipoBFD,
                    "CodigoEspecificacionTipoBFD": this.infoProdTerm.CodigoEspecificacionTipoBFD,
                    "CodigoAntiguo": this.infoProdTerm.CodigoAntiguo,
                    "FormatoTroquel": this.infoProdTerm.FormatoTroquel ?? null,
                    "Prepicado": this.infoProdTerm.Prepicado ?? null,
                    "CorteSeguridad": this.infoProdTerm.CorteSeguridad ?? null,
                    "Distribuidor": this.infoProdTerm.Distribuidor ?? null,
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'comercial', 'insert', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.modalProdTerm = false;
                        this.ngOnInit();
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

    onUpdateProdTerm() {
        if (this.infoProdTerm !== undefined) {
            this.blockedSend = true;
            const tc1 = this.listTipoCorte.find(item => item.descripcion2 === this.infoProdTerm!.TipoCorte);
            const tc2 = `${tc1!.codigo}-${tc1!.descripcion2}-${tc1!.siglas}`
            const precioAcabadoM2ProdTerm = this.listAcabados.find(item => item.DescripcionAcabado === this.infoProdTerm!.DescripcionAcabado)?.PrecioMillar ?? 0;
            const listColor = this.onGetColoresProdTerm();

            const parametros = {
                codigo: 1135,
                parametros: {
                    "IdDetalleCotizacion": this.idDetalleCotizacion,
                    "IdCabeceraCotizacion": null,
                    "TipoTrabajo": this.infoProdTerm.TipoTrabajo,
                    "TipoInventario": `MP${this.infoProdTerm.CodigoMaterial}-${this.infoProdTerm.TipoInventario}`,
                    "DescripcionTrabajo": this.infoProdTerm.NombreProductoEtimet,
                    "ObservacionTrabajo": this.myFormProdTerm.value.observacion,
                    "CantidadPorFabricar": this.myFormProdTerm.value.cantidadFabricar,
                    "UnidadMedida": this.infoProdTerm.UnidadMedida,
                    "UnidadesPorRollo": this.infoProdTerm.UnidadesPorRollo,
                    "Rebobinado": this.infoProdTerm.Rebobinado,
                    "Cono": this.infoProdTerm.Cono,
                    "TipoCorte": tc2,
                    "Avance": this.infoProdTerm.AvanceEtiqueta,
                    "Ancho": this.infoProdTerm.AnchoEtiqueta,
                    "FilasPorRollo": this.infoProdTerm.FilasPorRollo,
                    "Troquel": this.infoProdTerm.Troquel,
                    "GapAvance": this.infoProdTerm.GapAvance,
                    "GapAncho": this.infoProdTerm.Gapancho,
                    "Totalm2Etiqueta": this.infoProdTerm.M2Etiqueta,
                    "Totalm2": (this.infoProdTerm.M2Etiqueta * this.myFormProdTerm.value.cantidadFabricar),
                    "PrecioM2Mp": this.precioMpProdTerm,
                    "PrecioTotalM2Mp": (this.precioMpProdTerm * this.infoProdTerm.M2Etiqueta * this.myFormProdTerm.value.cantidadFabricar),
                    "ValorHoraMaquina": null,
                    "ValorTotalMaquina": null,
                    "Color1": listColor[0] ?? null,
                    "PorcentajeColor1": null,
                    "Color2": listColor[1] ?? null,
                    "PorcentajeColor2": null,
                    "Color3": listColor[2] ?? null,
                    "PorcentajeColor3": null,
                    "Color4": listColor[3] ?? null,
                    "PorcentajeColor4": null,
                    "Color5": listColor[4] ?? null,
                    "PorcentajeColor5": null,
                    "Color6": listColor[5] ?? null,
                    "PorcentajeColor6": null,
                    "Color7": listColor[6] ?? null,
                    "PorcentajeColor7": null,
                    "Color8": listColor[7] ?? null,
                    "PorcentajeColor8": null,
                    "Color9": listColor[8] ?? null,
                    "PorcentajeColor9": null,
                    "Color10": listColor[9] ?? null,
                    "PorcentajeColor10": null,
                    "Color11": listColor[10] ?? null,
                    "PorcentajeColor11": null,
                    "Color12": listColor[11] ?? null,
                    "PorcentajeColor12": null,
                    "ValorTotalEtiqueta": (this.precioMpProdTerm * this.infoProdTerm.M2Etiqueta) + (precioAcabadoM2ProdTerm * this.infoProdTerm.M2Etiqueta),
                    "ValorTotalMillar": ((this.precioMpProdTerm * this.infoProdTerm.M2Etiqueta) + (precioAcabadoM2ProdTerm * this.infoProdTerm.M2Etiqueta)) * 1000,
                    "ValorTotalItem": ((this.precioMpProdTerm * this.infoProdTerm.M2Etiqueta) + (precioAcabadoM2ProdTerm * this.infoProdTerm.M2Etiqueta)) * this.myFormProdTerm.value.cantidadFabricar,
                    "Estado": 1,
                    "ConfigurarOp": 1,
                    "DescripcionAcabado": this.infoProdTerm.DescripcionAcabado,
                    "PrecioAcabado": precioAcabadoM2ProdTerm,
                    "CodigoProductoTerminado": this.infoProdTerm.CodigoFinalProductoTerminado,
                    "EspecificacionTipoBFD": this.infoProdTerm.EspecificacionTipoBFD,
                    "CodigoEspecificacionTipoBFD": this.infoProdTerm.CodigoEspecificacionTipoBFD,
                    "CodigoAntiguo": this.infoProdTerm.CodigoAntiguo,
                    "FormatoTroquel": this.infoProdTerm.FormatoTroquel ?? null,
                    "Prepicado": this.infoProdTerm.Prepicado ?? null,
                    "CorteSeguridad": this.infoProdTerm.CorteSeguridad ?? null,
                    "Distribuidor": this.infoProdTerm.Distribuidor ?? null,
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'comercial', 'update', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.modalProdTerm = false;
                        this.ngOnInit();
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

    onSaveProdTerm() {
        if (this.formService.validForm(this.myFormProdTerm)) {
            if (this.idDetalleCotizacion === 0) {
                this.onInsertProdTerm();
            } else {
                this.onUpdateProdTerm();
            }
        } else {
            this.sweetService.toastWarning('Ingrese todos los campos');
        }
    }
}
