import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "src/app/pages/00-login/services/login.service";
import { ConfiguracionesExtrasDocumentosPDFService } from "src/app/pages/01-configuraciones-extras/components/documentos_pdf/services/documentos-pddf.service";
import { BodegaInventarioKardexInterface } from "src/app/pages/04-bodega/interfaces/inventario";
import { ProduccionMateriaPrimaLiberadaInterface, ProduccionOrdenProduccionInterface } from "src/app/pages/06-produccion/interfaces/orden_produccion.interface";
import { ApiService } from "src/app/shared/services/api.service";
import { ReactiveFormsService } from "src/app/shared/services/forms.service";
import { SweetAlertService } from "src/app/shared/services/sweet-alert.service";

@Component({
    selector: 'app-bodega-materia-prima-devolucion',
    templateUrl: './devolucion.component.html',
})
export class BodegaMateriaPrimaDevolucionComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);
    apiRouter = inject(Router);
    pdfService = inject(ConfiguracionesExtrasDocumentosPDFService);

    blockedSend: boolean = false;
    blockedGet: boolean = false;

    myFormSearchOp: FormGroup;
    myFormPeso: FormGroup;

    infoKardex: BodegaInventarioKardexInterface | undefined;
    infoKardexLiberada: ProduccionMateriaPrimaLiberadaInterface | undefined;

    newMetrosLineales: number = 0;

    constructor() {
        this.myFormSearchOp = new FormGroup({
            "numOp": new FormControl('', [Validators.required]),
            "codigoBarras": new FormControl('', [Validators.required]),
        });
        this.myFormPeso = new FormGroup({
            "peso": new FormControl('', [Validators.required]),
        });
    }

    onSearchOP() {
        if (this.formService.validForm(this.myFormSearchOp)) {
            this.blockedGet = true;
            const parametros = {
                codigo: 1152,
                parametros: {
                    "IdOrdenProduccion": null,
                    "SecuencialOrdenProduccion": this.myFormSearchOp.value.numOp,
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
                        if (resp.data.length === 1) {
                            if (
                                resp.data[0].IdEstadoOrdenProduccion === 2 ||
                                resp.data[0].IdEstadoOrdenProduccion === 4 ||
                                resp.data[0].IdEstadoOrdenProduccion === 5) {
                                this.onGetAllMateriaPrimaLiberada(resp.data[0]);
                            } else {
                                this.sweetService.toastWarning('La OP no se encuentra en un estado disponible');
                                this.blockedGet = false;
                            }
                        } else {
                            this.sweetService.toastWarning('La OP que esta buscando no existe');
                            this.blockedGet = false;
                        }
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                        this.blockedGet = false;
                    }
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                    this.blockedGet = false;
                }
            });
        } else {
            this.sweetService.toastWarning('Ingrese el numero de OP');
        }
    }

    onGetAllMateriaPrimaLiberada(info: ProduccionOrdenProduccionInterface) {
        const parametros = {
            codigo: 1160,
            parametros: {
                "IdOrdenProduccion": info.IdOrdenProduccion,
            },
        };
        this.infoKardexLiberada = undefined;
        this.infoKardex = undefined;
        this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    const infoKardex = resp.data.find((item: BodegaInventarioKardexInterface) => item.CodigoBarras === this.myFormSearchOp.value.codigoBarras);
                    if (infoKardex) {
                        this.infoKardexLiberada = { ...infoKardex };
                        this.onGetInfoKardex();
                    } else {
                        this.sweetService.viewWarning('El código de barras no corresponde a la OP', 'Ok', () => { });
                        this.blockedGet = false;
                    }
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                    this.blockedGet = false;
                }
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.blockedGet = false;
            }
        });
    }

    onGetInfoKardex() {
        this.blockedGet = true;
        const parametros = {
            codigo: 1046,
            parametros: {
                "FechaInicio": null,
                "FechaFin": null,
                "CodigoInterno": null,
                "CodigoBarras": this.infoKardexLiberada!.CodigoBarras,
                "IdInventario": null,
                "IdCompra": null,
                "TipoKardex": null,
                "IdEstado": 19,
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    if (resp.data.length === 1) {
                        this.infoKardex = { ...resp.data[0] };
                        if ((this.infoKardex?.PesoSustrato ?? 0) === 0) {
                            this.sweetService.viewWarning('El peso del sustrato es 0, informar al Dep. Sistemas para su corrección y realizar la toma fisica del gramaje del sustrato', 'Salir', () => {
                                this.apiRouter.navigateByUrl('/home');
                            });
                        }
                    } else {
                        this.sweetService.viewWarning('El código de barras ya no esta disponible para retorno', 'Ok', () => { });
                    }
                    this.blockedGet = false;
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                    this.blockedGet = false;
                }
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.blockedGet = false;
            }
        });
    }

    onCalculateMetros() {
        if (this.infoKardex !== undefined) {
            this.newMetrosLineales = (this.myFormPeso.value.peso * 1000 * 1000) / (this.infoKardex.Ancho * this.infoKardex.PesoSustrato);
        } else {
            this.sweetService.toastWarning('La información del kardex no se encuentra');
        }
    }

    onInsertDevolucion() {
        if (this.infoKardex !== undefined && this.infoKardexLiberada !== undefined) {
            this.blockedSend = true;
            const parametros = {
                codigo: 1045,
                parametros: {
                    "IdPadreKardex": Number(this.infoKardex.IdKardex),
                    "FechaRegistro": new Date(),
                    "CodigoInterno": this.infoKardex.CodigoInterno,
                    "CodigoBarras": null,
                    "SecuencialKardex": null,
                    "IdInventario": Number(this.infoKardex.IdInventario),
                    "Ancho": this.infoKardex.Ancho,
                    "Largo": this.newMetrosLineales,
                    "TotalM2": (this.infoKardex.Ancho / 1000) * (this.newMetrosLineales),
                    "PesoMaterial": this.myFormPeso.value.peso,
                    "PesoCono": null,
                    "PesoTotal": this.myFormPeso.value.peso,
                    "IdCompra": null,
                    "TipoKardex": "C",
                    "IdEstado": 9,
                    "PesoNetoAnterior": null,
                    "PesoNetoActual": null,
                    "TotalM2Anterior": null,
                    "TotalM2Actual": null,
                    "Lote": this.infoKardex.Lote,
                    "Usuario": this.loginService.usuario.UserName,
                },
                extras: {
                    "IdOrdenProduccion": Number(this.infoKardexLiberada.IdOrdenProduccion),
                    "IdPadreMpLiberada": Number(this.infoKardexLiberada.IdMaterialKardexOrdenProduccion)
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'devolucionMateriaPrima', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.blockedSend = false;
                        this.sweetService.viewSuccess('Proceso ejecutado correctamente', () => {
                            this.onPrintEtiquetas(resp.data[0].IdKardex);
                        });
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                        this.blockedSend = false;
                    }
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                    this.blockedSend = false;
                }
            });
        }
    }

    onSaveDevolucion() {
        if (this.formService.validForm(this.myFormPeso)) {
            if (this.infoKardex !== undefined && this.infoKardexLiberada !== undefined) {
                if (this.newMetrosLineales <= this.infoKardexLiberada.Largo) {
                    this.onInsertDevolucion();
                } else {
                    this.sweetService.toastWarning('El valor nuevo no puede ser superior al valor antiguo');
                }
            } else {
                this.sweetService.toastWarning('Error al buscar la información');
            }
        } else {
            this.sweetService.toastWarning('Ingrese todos los campos');
        }
    }

    onPrintEtiquetas(idKardex: number) {
        this.blockedGet = true;
        const parametros = {
            codigo: 1051,
            parametros: {
                "IdKardex": [idKardex],
                "IdCompra": null,
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.pdfService.pdfEtiquetaKardex(resp.data, true);
                    this.apiRouter.navigate(['/home']);
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
            }
        });
    }
}
