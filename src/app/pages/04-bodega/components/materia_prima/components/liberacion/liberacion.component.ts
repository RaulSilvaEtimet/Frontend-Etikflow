import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Table } from "primeng/table";
import { LoginService } from "src/app/pages/00-login/services/login.service";
import { AdministracionDisenioCirelInterface } from "src/app/pages/02-administracion/interfaces/disenio.interface";
import { BodegaInventarioKardexInterface } from "src/app/pages/04-bodega/interfaces/inventario";
import { ComercialCotizacionesCabeceraInterface, ComercialCotizacionesDetalleInterface } from "src/app/pages/05-comercial/interfaces/cotizaciones.interface";
import { ProduccionMateriaPrimaLiberadaInterface, ProduccionOrdenProduccionBitacoraInterface, ProduccionOrdenProduccionInterface } from "src/app/pages/06-produccion/interfaces/orden_produccion.interface";
import { ProduccionProcesoFabricacionInterface } from "src/app/pages/06-produccion/interfaces/proceso_fabricacion.interface";
import { ProduccionProductoTerminadoInterface } from "src/app/pages/06-produccion/interfaces/producto_terminado.interface";
import { ApiService } from "src/app/shared/services/api.service";
import { ReactiveFormsService } from "src/app/shared/services/forms.service";
import { SweetAlertService } from "src/app/shared/services/sweet-alert.service";
import Swal from "sweetalert2";

@Component({
    selector: 'app-bodega-materia-prima-liberacion',
    templateUrl: './liberacion.component.html',
    styles: [`
        .txtObservacion {  white-space: pre-line; line-height: 1;}
    `]
})
export class BodegaMateriaPrimaLiberacionComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);

    blockedSend: boolean = false;
    blockedGet: boolean = false;

    loadingOP: boolean = false;
    listOP: ProduccionOrdenProduccionInterface[] = [];
    searchValue: string | undefined;

    infoOP: ProduccionOrdenProduccionInterface | undefined;
    infoProdTerm: ProduccionProductoTerminadoInterface | undefined;
    infoProcFabr: ProduccionProcesoFabricacionInterface | undefined;
    infoCirel: AdministracionDisenioCirelInterface | undefined;
    infoCabecera: ComercialCotizacionesCabeceraInterface | undefined;
    infoDetalle: ComercialCotizacionesDetalleInterface | undefined;
    listMPLiberada: ProduccionMateriaPrimaLiberadaInterface[] = [];
    loadingMPLiberada: boolean = false;

    modalInfoAllOP: boolean = false;

    modalInfoBitacora: boolean = false;
    listBitacora: ProduccionOrdenProduccionBitacoraInterface[] = [];

    modalAddMP: boolean = false;
    myFormMP: FormGroup;
    listNewMP: any[] = [];

    modalAddObs: boolean = false;
    myFormObs: FormGroup;

    constructor() {
        this.myFormMP = new FormGroup({
            "codigoBarras": new FormControl('', [Validators.required]),
        });
        this.myFormObs = new FormGroup({
            "observacion": new FormControl('', [Validators.required]),
        });
    }

    ngOnInit() {
        this.onGetAllCotiRevisionPendiente();
    }

    onGetAllCotiRevisionPendiente() {
        this.loadingOP = true;
        const parametros = {
            codigo: 1152,
            parametros: {
                "IdOrdenProduccion": null,
                "SecuencialOrdenProduccion": null,
                "SecuencialCotizacion": null,
                "OrdenCompra": null,
                "IdentificacionCliente": null,
                "CodigoTrabajo": null,
                "IdEstadoOrdenProduccion": null,
                "NombreAsesor": null,
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listOP = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingOP = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingOP = false;
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    //OBTENER INFORMACION DE LA ORDEN DE PRODUCCION
    onGetInfoAllOP(info: ProduccionOrdenProduccionInterface) {
        this.blockedGet = true;
        const parametros = {
            codigo: 1161,
            parametros: {
                "IdOrdenProduccion": info.IdOrdenProduccion,
            },
            tablas: ['TablaOrdenProduccion', 'TablaCabeceraCotizacion', 'TablaDetalleCotizacion', 'TablaProductoTerminado', 'TablaCirel', 'TablaProcesoFabricacion', 'TablaMaterialKardexOrdenProduccion']
        };
        this.infoOP = undefined;
        this.infoProdTerm = undefined;
        this.infoProcFabr = undefined;
        this.infoCirel = undefined;
        this.infoCabecera = undefined;
        this.infoDetalle = undefined;
        this.listMPLiberada = [];
        this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.infoOP = { ...resp.data[0].TablaOrdenProduccion[0] };
                    this.infoProdTerm = { ...resp.data[0].TablaProductoTerminado[0] };
                    this.infoProcFabr = { ...resp.data[0].TablaProcesoFabricacion[0] };
                    this.infoCirel = { ...resp.data[0].TablaCirel[0] };
                    this.infoCabecera = { ...resp.data[0].TablaCabeceraCotizacion[0] };
                    this.infoDetalle = { ...resp.data[0].TablaDetalleCotizacion[0] };
                    this.listMPLiberada = [...resp.data[0].TablaMaterialKardexOrdenProduccion];

                    this.modalInfoAllOP = true;
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

    onChangeEstado(idEstado: number) {
        //TODO: REVISAR
        //if (this.listMPLiberada.length > 0) {
        const parametros = {
            codigo: 1158,
            parametros: {
                "IdOrdenProduccion": Number(this.infoOP!.IdOrdenProduccion),
                "IdEstadoOrdenProduccion": idEstado
            },
            paramLog: {
                "FechaRegistro": new Date(),
                "EstadoOP": idEstado,
                "Observacion": 'Cambio de estado',
                "Usuario": this.loginService.usuario.UserName,
                "IdMaquina": null,
                "IdOrdenProduccion": Number(this.infoOP!.IdOrdenProduccion),
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'changeEstadoOrdenProduccion', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.modalInfoAllOP = false;
                    this.ngOnInit();
                    this.sweetService.viewSuccess('Cambio ejecutado correctamente', () => { });
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.blockedGet = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.blockedGet = false;
            }
        });
        /*
        } else {
            this.sweetService.toastWarning('No se puede cambiar el estado si no se ha liberado materia prima');
        }
        */
    }

    onGetBitacora() {
        this.blockedGet = true;
        const parametros = {
            codigo: 1157,
            parametros: {
                "EstadoOP": null,
                "Usuario": null,
                "IdMaquina": null,
                "IdOrdenProduccion": this.infoOP!.IdOrdenProduccion
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listBitacora = [...resp.data];
                    this.modalInfoBitacora = true;
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.blockedGet = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.blockedGet = false;
            }
        })
    }

    onOpenMateriaPrima() {
        this.modalAddMP = true;
        this.myFormMP.reset();
        this.listNewMP = [];
    }

    onAddMpLiberada() {
        if (this.formService.validForm(this.myFormMP)) {
            this.blockedGet = true;
            const parametros = {
                codigo: 1046,
                parametros: {
                    "FechaInicio": null,
                    "FechaFin": null,
                    "CodigoInterno": null,
                    "CodigoBarras": this.myFormMP.value.codigoBarras,
                    "IdInventario": null,
                    "IdCompra": null,
                    "TipoKardex": null,
                    "IdEstado": 9,
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'get', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        if (resp.data.length !== 0) {
                            const check = this.listNewMP.find(item => item.IdKardex === resp.data[0].IdKardex);
                            if (check) {
                                this.sweetService.toastWarning('La materia prima ya fue agregada');
                                this.blockedGet = false;
                                return;
                            }
                            if (resp.data.length === 1) {
                                this.listNewMP.push({
                                    "IdKardex": resp.data[0].IdKardex,
                                    "IdOrdenProduccion": this.infoOP!.IdOrdenProduccion,
                                    "CodigoBarras": resp.data[0].CodigoBarras,
                                    "Ancho": resp.data[0].Ancho,
                                    "Largo": resp.data[0].Largo,
                                    "TotalM2": resp.data[0].TotalM2,
                                    "Peso": resp.data[0].PesoTotal,
                                    "TipoRegistro": 1,
                                    "Usuario": this.loginService.usuario.UserName,
                                    "FechaRegistro": new Date(),
                                    "IdPadreKardex": null,
                                });
                                this.myFormMP.reset();
                            } else {
                                this.sweetService.toastWarning('No se encontró la materia prima');
                            }
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
        } else {
            this.sweetService.toastWarning('Ingrese todos los campos');
        }
    }

    onSaveMpLiberada() {
        if (this.listNewMP.length > 0) {
            const parametros = {
                codigo: 1159,
                parametros: this.listNewMP
            };
            this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'addMPOrdenProduccionPost', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.modalAddMP = false;
                        this.onGetAllMPLiberada();
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
            this.sweetService.toastWarning('Ingrese al menos un registro');
        }
    }

    onGetAllMPLiberada() {
        this.blockedGet = true;
        const parametros = {
            codigo: 1160,
            parametros: {
                "IdOrdenProduccion": this.infoOP!.IdOrdenProduccion
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listMPLiberada = [...resp.data];
                    this.modalAddMP = false;
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

    //OBSERVACION DE ORDEN DE PRODUCCION
    onOpenObservacion() {
        this.modalAddObs = true;
        this.myFormObs.reset();
    }

    onSaveObservacion() {
        if (this.formService.validForm(this.myFormObs)) {
            this.blockedSend = true;
            const parametros = {
                codigo: 1156,
                parametros: {
                    "FechaRegistro": new Date(),
                    "EstadoOP": this.infoOP!.IdEstadoOrdenProduccion,
                    "Observacion": this.myFormObs.value.observacion,
                    "Usuario": this.loginService.usuario.UserName,
                    "IdMaquina": null,
                    "IdOrdenProduccion": Number(this.infoOP!.IdOrdenProduccion)
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'insert', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.modalAddObs = false;
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
            this.sweetService.toastWarning('Ingrese todos los campos');
        }
    }

    //DEVOLVER MP 
    onVerificarDevolucion(info: ProduccionMateriaPrimaLiberadaInterface) {
        if (info.TipoRegistro === 2) return false;
        if (this.listMPLiberada.find(item => item.IdPadreKardex === info.IdMaterialKardexOrdenProduccion)) return false;
        return true;
    }

    onDevolverMpLiberado(info: ProduccionMateriaPrimaLiberadaInterface) {
        Swal.fire({
            title: '¿Está seguro de devolver el código de barras?',
            text: "Este código de barras será devuelto a inventario",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        }).then((result: any) => {
            if (result.isConfirmed) {
                this.blockedSend = true;
                const parametros = {
                    codigo: 1167,
                    parametros: {
                        "IdMaterialKardexOrdenProduccion": Number(info.IdMaterialKardexOrdenProduccion),
                        "TipoRegistro": 2,
                    },
                    extra: {
                        "IdKardex": Number(info.IdKardex),
                    }
                };
                this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'devolverMpLiberada', parametros.codigo).subscribe({
                    next: (resp: any) => {
                        if (resp.success) {
                            this.sweetService.viewSuccess('Devolución realizada correctamente', () => {
                                this.onGetAllMPLiberada();
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
            }
        });
    }
}
