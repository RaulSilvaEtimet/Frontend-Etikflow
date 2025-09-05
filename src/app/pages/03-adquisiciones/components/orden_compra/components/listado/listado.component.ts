import { Component, inject, ViewChild } from "@angular/core";
import { Table } from "primeng/table";
import { LoginService } from "src/app/pages/00-login/services/login.service";
import { ApiService } from "src/app/shared/services/api.service";
import { Router } from "@angular/router";
import { SweetAlertService } from "src/app/shared/services/sweet-alert.service";
import { FileUpload } from "primeng/fileupload";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ReactiveFormsService } from "src/app/shared/services/forms.service";
import { AdquisicionOrdenCompraCabeceraInterface } from "../../../../interface/adquisicion-cabecera";
import { AdquisicionOrdenCompraDetalleInterface } from "../../../../interface/adquisicion-detalle";
import { AdquisicionOrdenCompraLogInterface } from "../../../../interface/adquisicion-log";
import { AdquisicionOrdenCompraEstadoInterface } from "../../../../interface/adquisicion-estado.";
import { ConfiguracionesExtrasDocumentosPDFService } from "src/app/pages/01-configuraciones-extras/components/documentos_pdf/services/documentos-pddf.service";

@Component({
    selector: 'app-administracion-personal-cargos',
    templateUrl: './listado.component.html',
})
export class AdquisicionesOrdenCompraListadoComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    apiRouter = inject(Router);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);
    pdfService = inject(ConfiguracionesExtrasDocumentosPDFService)

    myFormSearch: FormGroup;
    myFormObservacion: FormGroup;
    loadingOC: boolean = false;

    modalInformacion: boolean = false;
    listOrdenesCompra: AdquisicionOrdenCompraCabeceraInterface[] = [];
    searchValue: string | undefined;

    infoCabecera: AdquisicionOrdenCompraCabeceraInterface = {
        Adjuntos: null,
        CiudadProveedor: null,
        Comentario: null,
        Compra: null,
        DirecionProveedor: null,
        EstadoCompra: null,
        FacturaRemision: null,
        FechaEntrega: null,
        FechaPago: null,
        FechaRegistroOrdenCompra: null,
        FechaRegistroRecepcionCompra: null,
        IdCompra: null,
        IdentificacionProveedor: null,
        IdProveedor: null,
        NumeroFactura: null,
        NumeroItems: null,
        OrdenCompra: null,
        Plazo: null,
        RazonSocialProveedor: null,
        SecuencialCompra: null,
        SecuencialOrdenCompra: null,
        TarifaIva: null,
        TelefonoProveedor: null,
        UsuarioRegistroOrdenCompra: null,
        ValorBaseImponibleIva: null,
        ValorBruto: null,
        ValorCree: null,
        ValorDescuento: null,
        ValorIva: null,
        ValorNetoCalculado: null,
        ValorRetencionFuente: null,
        ValorRetencionIva: null,
        ValorTotal: null,
    };
    ListDetalle: AdquisicionOrdenCompraDetalleInterface[] = [];
    listLogs: AdquisicionOrdenCompraLogInterface[] = [];
    listEstados: AdquisicionOrdenCompraEstadoInterface[] = [];

    modalAddObservacion: boolean = false;

    files1: File | null = null;
    @ViewChild('fileUpload1') fileUpload1!: FileUpload;
    loadingUpload: boolean = false;

    constructor() {
        this.myFormSearch = new FormGroup({
            "fechaIni": new FormControl('', [Validators.required]),
            "fechaFin": new FormControl('', [Validators.required]),
        });
        this.myFormObservacion = new FormGroup({
            "eta": new FormControl('', [Validators.required]),
            "etd": new FormControl('', [Validators.required]),
            "observacion": new FormControl('', [Validators.required]),
        });
    }

    ngOnInit() {
        const fechaIni = new Date()
        fechaIni.setDate(fechaIni.getDate() - 10);
        const fechaFin = new Date();
        fechaFin.setDate(fechaFin.getDate() + 1);
        this.onGetOrdenCompra(fechaIni, fechaFin);
        this.onGetEstados();
    }

    onSearchOrdenCompra() {
        if (this.formService.validForm(this.myFormSearch)) {
            const fechaIni = new Date(this.myFormSearch.value.fechaIni);
            const fechaFin = new Date(this.myFormSearch.value.fechaFin);
            if (fechaIni.getTime() < fechaFin.getTime()) {
                this.onGetOrdenCompra(fechaIni, fechaFin);
            } else {
                this.sweetService.toastWarning('La fecha de inicio debe ser menor a la fecha fin');
            }
        } else {
            this.sweetService.toastWarning('Ingrese las fechas de busqueda');
        }
    }

    onGetOrdenCompra(fechaIni: Date, fechaFin: Date) {
        this.loadingOC = true;
        const parametros = {
            codigo: 1028,
            parametros: {
                "IdentificacionProveedor": null,
                "SecuencialOrdenCompra": null,
                "FechaRegistroOrdenCompraInicio": fechaIni,
                "FechaRegistroOrdenCompraFin": fechaFin,
                "SecuencialCompra": null,
                "EstadoCompra": null
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listOrdenesCompra = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingOC = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingOC = false;
            }
        });
    }

    onGetEstados() {
        const parametros = {
            codigo: 1040,
            parametros: {
                "IdTipoDocumento": 1,
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listEstados = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingOC = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingOC = false;
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onGetInfoCompra(compra: AdquisicionOrdenCompraCabeceraInterface) {
        const parametros = {
            codigo: 1034,
            parametros: {
                "IdCompra": compra.IdCompra,
            },
            tablas: ['TablaCabecera', 'TablaDetalle', 'TablaLog'],
        };

        this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.infoCabecera = { ...resp.data[0].TablaCabecera[0] };
                    this.ListDetalle = [...resp.data[0].TablaDetalle];
                    this.listLogs = [...resp.data[0].TablaLog];
                    this.listLogs.map(item => {
                        if (item.Observacion)
                            item.Observacion = JSON.parse(item.Observacion.toString());
                    });
                    this.modalInformacion = true;
                    if (this.infoCabecera.EstadoCompra === 2 || this.infoCabecera.EstadoCompra === 3) {
                        if (this.files1 !== null)
                            this.fileUpload1.clear();
                        this.files1 = null;
                    }
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingOC = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingOC = false;
            }
        });
    }

    onOpenOrdenCompra(compra: AdquisicionOrdenCompraCabeceraInterface) {
        this.apiRouter.navigate(['/adquisiciones/orden_compra/materia_prima'], { queryParams: { id: compra.IdCompra } });
    }

    onChangeEstado(idEstado: number) {
        let changeEstado: boolean = false;
        if (this.infoCabecera.EstadoCompra === 1 || this.infoCabecera.EstadoCompra === 2 || this.infoCabecera.EstadoCompra === 8) {
            changeEstado = true;
        } else if (this.infoCabecera.EstadoCompra === 3) {
            if (this.infoCabecera.SecuencialCompra !== null && this.infoCabecera.SecuencialOrdenCompra !== null) {
                changeEstado = true;
            }
        }

        if (changeEstado) {
            const parametros = {
                codigo1: 1035,
                codigo2: 1036,
                parametros1: {
                    "IdCompra": Number(this.infoCabecera.IdCompra),
                    "EstadoCompra": idEstado === 8 ? 4 : idEstado,
                    "Adjuntos": null,
                }, parametros2: {
                    "IdTipoDocumento": 1,
                    "SecuencialDocumento": this.infoCabecera.SecuencialOrdenCompra,
                    "IdEstado": idEstado === 8 ? 4 : idEstado,
                    "Usuario": this.loginService.usuario.UserName,
                },
            };
            this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'changeState', parametros.codigo1).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.sweetService.viewSuccess('Se cambio el estado correctamente', () => { });
                        this.ngOnInit();
                        this.modalInformacion = false;
                    } else {
                        this.sweetService.viewDanger(parametros.codigo1, resp.message);
                    }
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo1);
                }
            });
        } else {
            this.sweetService.viewWarning('Primero debe generar un Packing List', 'Cerrar', () => { });
        }
    }

    onRenameFile(file: File, newFileName: string): File {
        const newFile = new File([file], newFileName, { type: file.type });
        return newFile;
    }

    onFileSelect(event: any, opcion: number) {
        const originalFile = event.files[0];
        if (opcion === 1) {
            this.files1 = this.onRenameFile(originalFile, 'PackingList.pdf');
        }
    }

    onUploadFiles() {
        const allFiles = [this.files1];
        if (allFiles.length === 1 && this.files1) {
            this.loadingUpload = true;
            const formData = new FormData();
            allFiles.forEach((file: File | null) => {
                formData.append('files', file!);
                formData.append('data', `/Adquisiciones/${this.infoCabecera.OrdenCompra}`);
            });
            const parametros = {
                codigo: 1035,
                parametros: {
                    "IdCompra": this.infoCabecera.IdCompra,
                    "EstadoCompra": null,
                    "Adjuntos": null,
                },
                infoLog: {
                    "Fecha": new Date(),
                    "Usuario": this.loginService.usuario.UserName,
                    "Evento": "UploadPdf",
                    "Referencia": "Adquisiciones",
                    "Detalle": this.infoCabecera.IdCompra,
                    "ServerName": null,
                    "UserHostAddress": null,
                }
            };
            formData.append('SP', JSON.stringify(parametros));
            this.apiService.onGetApiExecuteNew(formData, 'adquisiciones', 'uploadPdf', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.sweetService.viewSuccess('Los archivos se subieron satisfactoriamente', () => { });
                        this.modalInformacion = false;
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                    }
                    this.loadingUpload = false;
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                    this.loadingUpload = false;
                }
            });
        } else {
            this.sweetService.toastWarning('Ingrese los dos archivos');
        }
    }

    onGetFile(index: number) {
        const rutas = this.infoCabecera.Adjuntos!.split(',');
        this.apiService.onGetApiFile(rutas[index]).subscribe({
            next: (resp) => {
                if (resp instanceof Blob) {
                    const url = window.URL.createObjectURL(resp);
                    window.open(url, '_blank',);
                    window.URL.revokeObjectURL(url);
                } else {
                    this.sweetService.toastWarning('La respuesta no es un archivo');
                }
            }, error: (err) => {
                this.sweetService.toastWarning('Error en la API');
            }
        });
    }

    onMovePackingList(idCompra: number) {
        this.apiRouter.navigate(['/adquisiciones/orden_compra/packing_list'], { queryParams: { id: idCompra } });
    }

    onAddObservacion() {
        this.modalAddObservacion = true;
        this.myFormObservacion.reset();
    }

    onSaveObservacion() {
        if (this.formService.validForm(this.myFormObservacion)) {
            const etd = this.myFormObservacion.value.etd;
            const eta = this.myFormObservacion.value.eta;
            const obs = this.myFormObservacion.value.observacion;

            const aux = { etd, eta, fecha: new Date(), obs };

            let listObj = [];
            this.listLogs.forEach(item => {
                if (item.IdEstado === 3 && item.Observacion)
                    listObj = [...item.Observacion];

            });
            listObj.push(aux);

            const parametros = {
                codigo: 1038,
                parametros: {
                    "IdTipoDocumento": 1,
                    "SecuencialDocumento": this.infoCabecera.SecuencialOrdenCompra,
                    "Observacion": listObj,
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'insert', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.sweetService.toastSuccess('Información almacenada');
                        this.modalAddObservacion = false;

                    } else {
                        this.sweetService.toastWarning(resp.message);
                    }
                }, error: (err) => {
                    this.sweetService.toastWarning('Problemas al conectar con la API');
                }
            });
        } else {
            this.sweetService.toastWarning('Ingrese todos los campos');
        }
    }

    onImprimirOC() {
        this.pdfService.pdfOrdenCompra(this.infoCabecera, this.ListDetalle);
    }
}

