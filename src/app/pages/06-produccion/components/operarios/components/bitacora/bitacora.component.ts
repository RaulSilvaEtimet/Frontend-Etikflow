import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "src/app/pages/00-login/services/login.service";
import { ConfiguracionesExtrasDocumentosPDFService } from "src/app/pages/01-configuraciones-extras/components/documentos_pdf/services/documentos-pddf.service";
import { ProduccionOrdenProduccionBitacoraInterface, ProduccionOrdenProduccionInterface } from "src/app/pages/06-produccion/interfaces/orden_produccion.interface";
import { ProduccionProcesoFabricacionInterface } from "src/app/pages/06-produccion/interfaces/proceso_fabricacion.interface";
import { ApiService } from "src/app/shared/services/api.service";
import { ReactiveFormsService } from "src/app/shared/services/forms.service";
import { SweetAlertService } from "src/app/shared/services/sweet-alert.service";

@Component({
    selector: 'app-produccion-operarios-bitacora',
    templateUrl: './bitacora.component.html',
    styles: [`
        .txtObservacion {  white-space: pre-line; line-height: 1;}
    `]
})
export class ProduccionOperariosBitacoraComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);
    pdfService = inject(ConfiguracionesExtrasDocumentosPDFService);

    blockedSend: boolean = false;
    blockedGet: boolean = false;

    myFormOp: FormGroup;

    infoOP: ProduccionOrdenProduccionInterface | undefined;
    infoProcFabr: ProduccionProcesoFabricacionInterface | undefined;
    listBitacora: ProduccionOrdenProduccionBitacoraInterface[] = [];
    loadingBitacora: boolean = false;

    listMaquina: any[] = [];
    myFormMaquina: FormGroup;

    modalAddObs: boolean = false;
    myFormObs: FormGroup;

    constructor() {
        this.myFormOp = new FormGroup({
            "numOp": new FormControl('', [Validators.required]),
        });
        this.myFormMaquina = new FormGroup({
            "maquina": new FormControl('', [Validators.required]),
        });
        this.myFormObs = new FormGroup({
            "observacion": new FormControl('', [Validators.required]),
        });
    }

    onSearchOP() {
        if (this.formService.validForm(this.myFormOp)) {
            this.blockedGet = true;
            const parametros = {
                codigo: 1152,
                parametros: {
                    "IdOrdenProduccion": null,
                    "SecuencialOrdenProduccion": this.myFormOp.value.numOp,
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
                            if (resp.data[0].IdEstadoOrdenProduccion === 4 || resp.data[0].IdEstadoOrdenProduccion === 5) {
                                this.onGetInfoAllOP(resp.data[0]);
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

    //OBTENER INFO OP
    onGetInfoAllOP(info: ProduccionOrdenProduccionInterface) {
        this.blockedGet = true;
        const parametros = {
            codigo: 1161,
            parametros: {
                "IdOrdenProduccion": info.IdOrdenProduccion,
            },
            tablas: ['TablaOrdenProduccion', 'TablaProcesoFabricacion', 'TablaBitacoraOrdenProduccion']
        };
        this.infoOP = undefined;
        this.infoProcFabr = undefined;
        this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listMaquina = [];
                    this.infoOP = { ...resp.data[0].TablaOrdenProduccion[0] };
                    this.infoProcFabr = { ...resp.data[0].TablaProcesoFabricacion[0] };
                    this.listBitacora = [...resp.data[0].TablaBitacoraOrdenProduccion];

                    this.listBitacora.sort((a, b) => new Date(b.FechaRegistro).getTime() - new Date(a.FechaRegistro).getTime());

                    if (this.infoProcFabr!.NombreMaquina1)
                        this.listMaquina.push({ codigo: this.infoProcFabr!.CodigoMaquina1, nombre: this.infoProcFabr!.NombreMaquina1 });
                    if (this.infoProcFabr!.NombreMaquina2)
                        this.listMaquina.push({ codigo: this.infoProcFabr!.CodigoMaquina2, nombre: this.infoProcFabr!.NombreMaquina2 });
                    if (this.infoProcFabr!.NombreMaquina3)
                        this.listMaquina.push({ codigo: this.infoProcFabr!.CodigoMaquina3, nombre: this.infoProcFabr!.NombreMaquina3 });
                    if (this.infoProcFabr!.NombreMaquina4)
                        this.listMaquina.push({ codigo: this.infoProcFabr!.CodigoMaquina4, nombre: this.infoProcFabr!.NombreMaquina4 });
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

    //AGREGAR BITACORA
    onAddBitacora(txtObservacion: string) {
        if (this.formService.validForm(this.myFormMaquina)) {
            this.blockedSend = true;
            const parametros = {
                codigo: 1156,
                parametros: {
                    "FechaRegistro": new Date(),
                    "EstadoOP": this.infoOP!.IdEstadoOrdenProduccion,
                    "Observacion": txtObservacion,
                    "Usuario": this.loginService.usuario.UserName,
                    "IdMaquina": Number(this.myFormMaquina.value.maquina.codigo),
                    "IdOrdenProduccion": Number(this.infoOP!.IdOrdenProduccion)
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'checkEstadoProduccionPost', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.onGetInfoAllOP(this.infoOP!);
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
            this.sweetService.toastWarning('Ingrese la maquina de su proceso');
        }
    }

    //OBSERVACION DE ORDEN DE PRODUCCION
    onOpenObservacion() {
        this.modalAddObs = true;
        this.myFormObs.reset();
    }

    onSaveObservacion() {
        if (this.formService.validForm(this.myFormMaquina)) {
            if (this.formService.validForm(this.myFormObs)) {
                this.blockedSend = true;
                const parametros = {
                    codigo: 1156,
                    parametros: {
                        "FechaRegistro": new Date(),
                        "EstadoOP": this.infoOP!.IdEstadoOrdenProduccion,
                        "Observacion": this.myFormObs.value.observacion,
                        "Usuario": this.loginService.usuario.UserName,
                        "IdMaquina": Number(this.myFormMaquina.value.maquina.codigo),
                        "IdOrdenProduccion": Number(this.infoOP!.IdOrdenProduccion)
                    }
                };
                this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'insert', parametros.codigo).subscribe({
                    next: (resp: any) => {
                        if (resp.success) {
                            this.onGetInfoAllOP(this.infoOP!);
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
        } else {
            this.sweetService.toastWarning('Ingrese la maquina de su proceso');
        }
    }

    //ETIQUETA TRAZABILIDAD
    onPrintEtiTrazabilidad() {
        if (this.infoOP) {
            this.pdfService.pdfEtiquetaTrazabilidad(
                this.infoOP.NombreTrabajo, new Date(), '', this.infoOP.SecuencialOrdenProduccion, this.loginService.usuario.UserName, this.infoOP.CodigoTrabajo, true
            );
        }

    }
}
