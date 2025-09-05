import { Component, inject } from "@angular/core";
import { Table } from "primeng/table";
import { LoginService } from "src/app/pages/00-login/services/login.service";
import { ApiService } from "src/app/shared/services/api.service";

import { SweetAlertService } from "src/app/shared/services/sweet-alert.service";
import { Router } from "@angular/router";
import { AdquisicionOrdenCompraCabeceraInterface } from "../../../../interface/adquisicion-cabecera";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ReactiveFormsService } from "src/app/shared/services/forms.service";
import { AdquisicionOrdenCompraDetalleInterface } from "src/app/pages/03-adquisiciones/interface/adquisicion-detalle";

@Component({
    selector: 'app-adquisiciones-compras-pendientes',
    templateUrl: './pendientes.component.html',
})
export class AdquisicionesComprasPendientesComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    apiRouter = inject(Router);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);

    myFormSearch: FormGroup;

    loadingOC: boolean = false;
    visibleModalView: boolean = false;
    listOrdenesCompra: AdquisicionOrdenCompraCabeceraInterface[] = [];
    searchValue: string | undefined;

    cabecera: AdquisicionOrdenCompraCabeceraInterface = {
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
    detalles: AdquisicionOrdenCompraDetalleInterface[] = [];

    constructor() {
        this.myFormSearch = new FormGroup({
            "fechaIni": new FormControl('', [Validators.required]),
            "fechaFin": new FormControl('', [Validators.required]),
        });
    }

    ngOnInit(): void {
        const fechaIni = new Date()
        fechaIni.setDate(fechaIni.getDate() - 10);
        const fechaFin = new Date();
        fechaFin.setDate(fechaFin.getDate() + 1);
        this.onGetAllOrdenCompra(fechaIni, fechaFin);
    }

    onSearchOrdenCompra() {
        if (this.formService.validForm(this.myFormSearch)) {
            const fechaIni = new Date(this.myFormSearch.value.fechaIni);
            const fechaFin = new Date(this.myFormSearch.value.fechaFin);
            if (fechaIni.getTime() < fechaFin.getTime()) {
                this.onGetAllOrdenCompra(fechaIni, fechaFin);
            } else {
                this.sweetService.toastWarning('La fecha de inicio debe ser menor a la fecha fin');
            }
        } else {
            this.sweetService.toastWarning('Ingrese las fechas de busqueda');
        }
    }

    onGetAllOrdenCompra(fechaIni: Date, fechaFin: Date) {
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
        }
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

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onGetDetalleCompra(compra: AdquisicionOrdenCompraCabeceraInterface) {
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
                    this.cabecera = { ...resp.data[0].TablaCabecera[0] };
                    this.detalles = [...resp.data[0].TablaDetalle];
                    this.visibleModalView = true;
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

    onGetFile(index: number) {
        const rutas = this.cabecera.Adjuntos!.split(',');
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

    onCancelCompra() {
        const parametros = {
            codigo1: 1035,
            codigo2: 1036,
            parametros1: {
                "IdCompra": this.cabecera.IdCompra,
                "EstadoCompra": 8,
                "Adjuntos": null,
            }, parametros2: {
                "IdTipoDocumento": 1,
                "SecuencialDocumento": this.cabecera.SecuencialOrdenCompra,
                "IdEstado": 8,
                "Usuario": this.loginService.usuario.UserName,
            },
        };
        this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'changeState', parametros.codigo1).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.sweetService.viewSuccess('Se cambio el estado correctamente', () => { });
                    this.ngOnInit();
                    this.visibleModalView = false;
                } else {
                    this.sweetService.viewDanger(parametros.codigo1, resp.message);
                }
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo1, err.error);
            }
        });
    }

    onAceptCompra() {
        const parametros = {
            codigo1: 1035,
            codigo2: 1036,
            parametros1: {
                "IdCompra": Number(this.cabecera.IdCompra),
                "EstadoCompra": 5,
                "Adjuntos": null,
            }, parametros2: {
                "IdTipoDocumento": 1,
                "SecuencialDocumento": this.cabecera.SecuencialOrdenCompra,
                "IdEstado": 5,
                "Usuario": this.loginService.usuario.UserName,
            },
        };

        this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'changeState', parametros.codigo1).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.sweetService.viewSuccess('Se cambio el estado correctamente', () => { });
                    this.ngOnInit();
                    this.visibleModalView = false;
                } else {
                    this.sweetService.viewDanger(parametros.codigo1, resp.message);
                }
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo1);
            }
        });
    }

    onGenerateInventario() {

    }

    onGenerateLotes(idCompra: number) {
        this.apiRouter.navigate(['/adquisiciones/compras/ingreso_lotes'], { queryParams: { id: idCompra } });
    }
}

