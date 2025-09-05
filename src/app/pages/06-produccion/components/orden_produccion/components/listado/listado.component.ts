import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Table } from "primeng/table";
import { LoginService } from "src/app/pages/00-login/services/login.service";
import { ConfiguracionesExtrasDocumentosPDFService } from "src/app/pages/01-configuraciones-extras/components/documentos_pdf/services/documentos-pddf.service";
import { AdministracionDisenioCirelInterface } from "src/app/pages/02-administracion/interfaces/disenio.interface";
import { AdministracionProduccionTroquelesInterface } from "src/app/pages/02-administracion/interfaces/produccion.interface";
import { ComercialCotizacionesCabeceraInterface, ComercialCotizacionesDetalleInterface } from "src/app/pages/05-comercial/interfaces/cotizaciones.interface";
import { ProduccionMateriaPrimaLiberadaInterface, ProduccionMateriaPrimaLiberadaTipoInventarioInterface, ProduccionOrdenProduccionBitacoraInterface, ProduccionOrdenProduccionInterface, ProduccionValoresProduccionInterface } from "src/app/pages/06-produccion/interfaces/orden_produccion.interface";
import { ProduccionProcesoFabricacionInterface } from "src/app/pages/06-produccion/interfaces/proceso_fabricacion.interface";
import { ProduccionProductoTerminadoInterface } from "src/app/pages/06-produccion/interfaces/producto_terminado.interface";
import { ApiService } from "src/app/shared/services/api.service";
import { ReactiveFormsService } from "src/app/shared/services/forms.service";
import { SweetAlertService } from "src/app/shared/services/sweet-alert.service";

@Component({
    selector: 'app-produccion-orden-produccion-listado',
    templateUrl: './listado.component.html',
    styles: [`
        .txtObservacion {  
            white-space: pre-line; line-height: 1;
        }
    `]
})
export class ProduccionOrdenProduccionListadoComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);
    pdfService = inject(ConfiguracionesExtrasDocumentosPDFService);

    blockedSend: boolean = false;
    blockedGet: boolean = false;

    loadingOP: boolean = false;
    listOP: ProduccionOrdenProduccionInterface[] = [];
    searchValue: string | undefined;

    infoOP: ProduccionOrdenProduccionInterface | undefined;
    infoProdTerm: ProduccionProductoTerminadoInterface | undefined;
    infoProcFabr: ProduccionProcesoFabricacionInterface | undefined;
    infoCirel: AdministracionDisenioCirelInterface | undefined;
    infoTroquel: AdministracionProduccionTroquelesInterface | undefined;
    infoCabecera: ComercialCotizacionesCabeceraInterface | undefined;
    infoDetalle: ComercialCotizacionesDetalleInterface | undefined;
    listMPLiberada: ProduccionMateriaPrimaLiberadaInterface[] = [];
    listMPLiberadoTipInv: ProduccionMateriaPrimaLiberadaTipoInventarioInterface[] = [];
    listMPFinal: any[] = [];

    modalInfoAllOP: boolean = false;

    modalInfoBitacora: boolean = false;
    listBitacora: ProduccionOrdenProduccionBitacoraInterface[] = [];
    listValoresProduccion: ProduccionValoresProduccionInterface[] = [];


    modalAddObs: boolean = false;
    myFormObs: FormGroup;

    constructor() {
        this.myFormObs = new FormGroup({
            "observacion": new FormControl('', [Validators.required]),
        });
    }

    ngOnInit() {
        this.onGetAllOrdenProduccion();
    }

    onGetAllOrdenProduccion() {
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

    //OBTENER 
    onGetInfoAllOP(info: ProduccionOrdenProduccionInterface) {
        this.blockedGet = true;
        const parametros = {
            codigo: 1161,
            parametros: {
                "IdOrdenProduccion": info.IdOrdenProduccion,
            },
            tablas: ['TablaOrdenProduccion', 'TablaCabeceraCotizacion', 'TablaDetalleCotizacion', 'TablaProductoTerminado', 'TablaCirel', 'TablaProcesoFabricacion', 'TablaMaterialKardexOrdenProduccion', 'TablaTroquel', 'TablaMPLiberado', 'TablaGlobalRegistroOperador']
        };
        this.infoOP = undefined;
        this.infoProdTerm = undefined;
        this.infoProcFabr = undefined;
        this.infoCirel = undefined;
        this.infoTroquel = undefined;
        this.infoCabecera = undefined;
        this.listMPLiberadoTipInv = [];
        this.infoDetalle = undefined;
        this.listMPLiberada = [];
        this.listValoresProduccion = [];
        this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.infoOP = { ...resp.data[0].TablaOrdenProduccion[0] };
                    this.infoProdTerm = { ...resp.data[0].TablaProductoTerminado[0] };
                    this.infoProcFabr = { ...resp.data[0].TablaProcesoFabricacion[0] };
                    this.infoCirel = { ...resp.data[0].TablaCirel[0] };
                    this.infoTroquel = { ...resp.data[0].TablaTroquel[0] };
                    this.infoCabecera = { ...resp.data[0].TablaCabeceraCotizacion[0] };
                    this.infoDetalle = { ...resp.data[0].TablaDetalleCotizacion[0] };
                    this.listMPLiberadoTipInv = [...resp.data[0].TablaMPLiberado];
                    this.listMPLiberada = [...resp.data[0].TablaMaterialKardexOrdenProduccion];
                    this.listValoresProduccion = [...resp.data[0].TablaGlobalRegistroOperador];
                    this.listMPLiberada = [...this.listMPLiberada.sort((a, b) => a.TipoRegistro - b.TipoRegistro)];

                    console.log(this.infoProdTerm);



                    this.onGetConsolidado();
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

    onPrintOP() {
        let rolloProd = 0;
        if (this.infoProdTerm?.UnidadMedida === 'ETIQUETA') {
            rolloProd = (this.infoOP?.Cantidad || 0) / (this.infoOP?.UnidadesRollo || 1);
        } else if (this.infoProdTerm?.UnidadMedida === 'ROLLO') {
            rolloProd = (this.infoOP?.Cantidad || 0);
        }

        this.pdfService.pdfOrdenProduccion(
            this.infoOP!.RazonSocialCliente,
            this.infoCabecera!.NombreAsesor,
            this.infoOP!.NombreTrabajo,
            this.infoOP!.SecuencialOrdenProduccion,
            this.infoOP!.CodigoTrabajo,
            this.infoProdTerm!.CodigoAntiguo,
            this.infoProdTerm!.TipoTrabajo,
            this.infoOP!.FechaRegistro.toString(),
            this.infoOP!.Cantidad,
            this.infoOP!.UnidadesRollo,
            this.infoProdTerm!.UnidadMedida,
            this.infoOP!.Troquel,
            this.infoTroquel!.DescripcionTroquel, //descripcion troquel
            this.infoProdTerm!.GapAvance,
            this.infoTroquel!.ZetaTroquel, //cilindro 
            Number((this.infoTroquel!.ZetaTroquel * 3.175).toFixed(2)), //desarrollo del cilindro, 
            this.infoOP!.UnidadesAncho,
            "", //corte de seguridad, 
            this.infoProdTerm!.FilasPorRollo,
            this.infoProdTerm!.DescripcionAcabado ?? "NINGUNO",
            this.infoProdTerm!.AvanceEtiqueta,
            this.infoProdTerm!.AnchoEtiqueta,
            this.infoProdTerm!.Cono,
            this.infoProdTerm!.TipoCorte,
            this.infoOP!.MetrosLinealesVariable,
            this.infoOP!.Metros2Fijos,
            rolloProd,
            this.infoProcFabr!.NombreMaquina1,
            this.infoProcFabr!.NombreMaquina2,
            this.infoProcFabr!.NombreMaquina3,
            this.infoProcFabr!.NombreMaquina4,
            `${this.infoProcFabr!.CodigoMaterial} - ${this.infoProcFabr!.NombreMaterial}`,
            this.infoProcFabr!.AnchoMaterial,
            this.infoOP!.Rebobinado,
            "", //cajas 
            this.infoCirel!.CodigoArte,
            this.infoCirel!.Color1,
            this.infoCirel!.Color2,
            this.infoCirel!.Color3,
            this.infoCirel!.Color4,
            this.infoCirel!.Color5,
            this.infoCirel!.Color6,
            this.infoCirel!.Color7,
            this.infoCirel!.Color8,
            this.infoDetalle!.ObservacionTrabajo
        );

    }

    onChangeEstado(idEstado: number) {
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

    //MATERIA PRIMA
    onGetPosPadreKardex(info: ProduccionMateriaPrimaLiberadaInterface) {
        let resp = '';
        this.listMPLiberada.forEach((item, key) => {
            if (item.IdMaterialKardexOrdenProduccion === info.IdPadreKardex)
                resp = (key + 1).toString();
        });
        return resp;
    }

    onGetConsolidado() {
        this.listMPFinal = [];
        this.listMPLiberadoTipInv.forEach(item => {
            const tipCod = this.listMPLiberada.filter(item2 => item2.CodigoBarras.indexOf(item.CodigoInterno) !== -1);

            const liberado = tipCod.reduce((acc, item2) => {
                if (item2.TipoRegistro === 1) acc += item2.TotalM2;
                return acc
            }, 0);

            const devuelto = tipCod.reduce((acc, item2) => {
                if (item2.TipoRegistro === 2 && item2.IdPadreKardex !== null) acc += item2.TotalM2;
                return acc;
            }, 0);

            const producido = tipCod.reduce((acc, item2) => {
                if (item2.TipoRegistro === 3) acc += item2.TotalM2;
                return acc;
            }, 0);

            const desperdicio = tipCod.reduce((acc, item2) => {
                if (item2.TipoRegistro === 4) acc += item2.TotalM2;
                return acc;
            }, 0);

            this.listMPFinal.push({
                CodigoInterno: item.CodigoInterno,
                MateriaPrima: item.NombreTipoInventario,
                Liberado: liberado,
                Devuelto: devuelto,
                Producido: producido,
                Desperdicio: desperdicio,
            });
        });
    }

}
