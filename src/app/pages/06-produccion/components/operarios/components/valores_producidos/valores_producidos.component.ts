import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "src/app/pages/00-login/services/login.service";
import { ConfiguracionesExtrasDocumentosPDFService } from "src/app/pages/01-configuraciones-extras/components/documentos_pdf/services/documentos-pddf.service";
import { AdministracionProduccionMaquinaInterface } from "src/app/pages/02-administracion/interfaces/produccion.interface";
import { ProduccionMateriaPrimaLiberadaTipoInventarioInterface, ProduccionOrdenProduccionInterface, ProduccionValoresProduccionInterface } from "src/app/pages/06-produccion/interfaces/orden_produccion.interface";
import { ProduccionProductoTerminadoInterface } from "src/app/pages/06-produccion/interfaces/producto_terminado.interface";
import { ApiService } from "src/app/shared/services/api.service";
import { ReactiveFormsService } from "src/app/shared/services/forms.service";
import { SweetAlertService } from "src/app/shared/services/sweet-alert.service";

@Component({
    selector: 'app-produccion-operarios-valores-producidos',
    templateUrl: './valores_producidos.component.html',
    styles: [`
        .txtObservacion {  white-space: pre-line; line-height: 1;}
    `]
})
export class ProduccionOperariosValoresProducidosComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);
    pdfService = inject(ConfiguracionesExtrasDocumentosPDFService);

    blockedSend: boolean = false;
    blockedGet: boolean = false;

    loadingMaquinas: boolean = false;
    listMaquina: AdministracionProduccionMaquinaInterface[] = [];

    infoOP: ProduccionOrdenProduccionInterface | undefined;
    infoProdTerm: ProduccionProductoTerminadoInterface | undefined;
    listMPLiberadoTipInv: ProduccionMateriaPrimaLiberadaTipoInventarioInterface[] = [];
    listValores: ProduccionValoresProduccionInterface[] = [];
    myFormOp: FormGroup;
    myFormValores: FormGroup;

    modalValores: boolean = false;
    idValoresEdit: number = 0;
    myFormValoresEdit: FormGroup;


    constructor() {
        this.myFormOp = new FormGroup({
            "numOp": new FormControl('', [Validators.required]),
        });
        this.myFormValores = new FormGroup({
            "maquina": new FormControl('', [Validators.required]),
            "materiaPrima": new FormControl('', [Validators.required]),
            "calibracion": new FormControl('', [Validators.required]),
            "metrosMP": new FormControl('', [Validators.required]),
            "anchoMP": new FormControl('', [Validators.required]),
            "cantProducida": new FormControl(''),
        });
        this.myFormValoresEdit = new FormGroup({
            "materiaPrima": new FormControl('', [Validators.required]),
            "calibracion": new FormControl('', [Validators.required]),
            "metrosMP": new FormControl('', [Validators.required]),
            "anchoMP": new FormControl('', [Validators.required]),
            "cantProducida": new FormControl(''),
        });
    }

    ngOnInit() {
        this.onGetAllMaquina();
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
                    this.listMaquina = [...resp.data];
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

    //Buscar OP
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

            this.infoOP = undefined;
            this.infoProdTerm = undefined;
            this.listMPLiberadoTipInv = [];
            this.listValores = [];

            this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'get', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        if (resp.data.length === 1) {
                            if (resp.data[0].IdEstadoOrdenProduccion === 5) {
                                this.infoOP = { ...resp.data[0] };
                                this.onGetInfoAllOP();
                                this.myFormValores.reset();
                            } else {
                                this.infoOP = undefined
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

    onGetInfoAllOP() {
        if (this.infoOP !== undefined) {
            this.blockedGet = true;
            const parametros = {
                codigo: 1161,
                parametros: {
                    "IdOrdenProduccion": this.infoOP.IdOrdenProduccion,
                },
                tablas: ['TablaOrdenProduccion', 'TablaProductoTerminado', 'TablaMPLiberado', 'TablaGlobalRegistroOperador']
            };
            this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'get', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.infoProdTerm = { ...resp.data[0].TablaProductoTerminado[0] }
                        this.listMPLiberadoTipInv = [...resp.data[0].TablaMPLiberado];
                        this.listValores = [...resp.data[0].TablaGlobalRegistroOperador];
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
            this.sweetService.toastWarning('No se ha seleccionado ninguna OP');
        }
    }

    onSelectMaquina(maquina: AdministracionProduccionMaquinaInterface) {
        if (maquina) {
            if (
                maquina.Nombre === 'MARK ANDY' || maquina.Nombre === 'WEIGANG' ||
                maquina.Nombre === 'DEPAI' || maquina.Nombre === 'TROQUELADORA PLANA 1' ||
                maquina.Nombre === 'TROQUELADORA PLANA 2') {
                this.myFormValores.get('cantProducida')?.clearValidators();
            } else {
                this.myFormValores.get('cantProducida')?.setValidators([Validators.required]);
            }
            this.myFormValores.get('cantProducida')?.updateValueAndValidity();
        }
    }

    onSaveValores() {
        this.blockedSend = true;
        if (this.formService.validForm(this.myFormValores)) {
            const parametros = {
                codigo: 1166,
                parametros: {
                    "FechaRegistro": new Date(),
                    "IdMaquina": Number(this.myFormValores.value.maquina.IdMaquina),
                    "IdOrdenProduccion": Number(this.infoOP!.IdOrdenProduccion),
                    "CodigoMaterial": this.myFormValores.value.materiaPrima.CodigoInterno,
                    "DescripcionMaterial": this.myFormValores.value.materiaPrima.NombreTipoInventario,
                    "Usuario": this.loginService.usuario.UserName,
                    "MetroLineal": this.myFormValores.value.metrosMP,
                    "Ancho": this.myFormValores.value.anchoMP,
                    "M2": this.myFormValores.value.metrosMP * (this.myFormValores.value.anchoMP / 1000),
                    "ValorMetrosCalibracion": this.myFormValores.value.calibracion,
                    "CantidadProduccion": this.myFormValores.value.cantProducida,
                    "Estado": 0,
                    "IdOrdenProducionCargaInventario": null
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'insert', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.sweetService.viewSuccess('Los datos se guardaron correctamente', () => {
                            this.myFormValores.reset();
                            this.onGetInfoAllOP();
                        });
                        this.blockedSend = false;
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
            this.sweetService.toastWarning('Complete todos los campos obligatorios');
            this.blockedSend = false;

        }
    }

    //EDIT VALORES
    onOpenEditValores(info: ProduccionValoresProduccionInterface) {
        this.modalValores = true;
        this.idValoresEdit = Number(info.IdOrdenProduccionValidacion);
        this.myFormValoresEdit.patchValue({
            "materiaPrima": this.listMPLiberadoTipInv.find(item => item.CodigoInterno === info.CodigoMaterial),
            "calibracion": info.ValorMetrosCalibracion,
            "metrosMP": info.MetroLineal,
            "anchoMP": info.Ancho,
            "cantProducida": info.CantidadProduccion,
        });
    }

    onEditValores() {
        this.blockedSend = true;
        if (this.formService.validForm(this.myFormValoresEdit)) {
            const parametros = {
                codigo: 1168,
                parametros: {
                    "IdOrdenProduccionValidacion": this.idValoresEdit,
                    "FechaRegistro": null,
                    "IdMaquina": null,
                    "IdOrdenProduccion": null,
                    "CodigoMaterial": this.myFormValoresEdit.value.materiaPrima.CodigoInterno,
                    "DescripcionMaterial": this.myFormValoresEdit.value.materiaPrima.NombreTipoInventario,
                    "Usuario": null,
                    "MetroLineal": this.myFormValoresEdit.value.metrosMP,
                    "Ancho": this.myFormValoresEdit.value.anchoMP,
                    "M2": (this.myFormValoresEdit.value.metrosMP * (this.myFormValoresEdit.value.anchoMP / 1000)),
                    "ValorMetrosCalibracion": this.myFormValoresEdit.value.calibracion,
                    "CantidadProduccion": this.myFormValoresEdit.value.cantProducida,
                    "Estado": null,
                    "IdOrdenProducionCargaInventario": null
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'update', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.sweetService.toastSuccess('Se actualizo correctamente');
                        this.modalValores = false;
                        this.onGetInfoAllOP();
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
            this.sweetService.toastWarning('Ingrese todos los campos requeridos');
            this.blockedSend = false;
        }
    }
}
