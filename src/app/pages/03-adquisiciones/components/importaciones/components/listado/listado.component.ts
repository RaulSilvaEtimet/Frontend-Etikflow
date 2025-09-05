import { Component, inject } from "@angular/core";
import { Table } from "primeng/table";
import { LoginService } from "src/app/pages/00-login/services/login.service";
import { ApiService } from "src/app/shared/services/api.service";
import { SweetAlertService } from "src/app/shared/services/sweet-alert.service";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ReactiveFormsService } from "src/app/shared/services/forms.service";
import { AdquisicionesImportacionesImportacionInterface } from "src/app/pages/03-adquisiciones/interface/importaciones";

@Component({
    selector: 'app-adquisiciones-importaciones-listado',
    templateUrl: './listado.component.html',
})
export class AdquisicionesImportacionesListadoComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    apiRouter = inject(Router);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);

    myFormSearch: FormGroup;
    myFormCreateImportacion: FormGroup;

    modalCreateImportacion: boolean = false;
    loadingOCI: boolean = false;
    listOCI: any[] = [];

    blockedSendData: boolean = false;
    blockedGetData: boolean = false;

    loadingImportaciones: boolean = false;
    modalInfoImportacion: boolean = false;
    listImportaciones: AdquisicionesImportacionesImportacionInterface[] = [];
    searchValue: string | undefined;


    constructor() {
        this.myFormSearch = new FormGroup({
            "fechaIni": new FormControl('', [Validators.required]),
            "fechaFin": new FormControl('', [Validators.required]),
        });
        this.myFormCreateImportacion = new FormGroup({
            "referencia": new FormControl('', [Validators.required]),
            "selectOC": new FormControl('', [Validators.required]),
        });
    }

    ngOnInit(): void {
        const fechaIni = new Date()
        fechaIni.setDate(fechaIni.getDate() - 10);
        const fechaFin = new Date();
        fechaFin.setDate(fechaFin.getDate() + 1);
        this.onGetAllImportaciones(fechaIni, fechaFin);
    }

    onSearchImportaciones() {
        if (this.formService.validForm(this.myFormSearch)) {
            const fechaIni = new Date(this.myFormSearch.value.fechaIni);
            const fechaFin = new Date(this.myFormSearch.value.fechaFin);
            if (fechaIni.getTime() < fechaFin.getTime()) {
                this.onGetAllImportaciones(fechaIni, fechaFin);
            } else {
                this.sweetService.toastWarning('La fecha de inicio debe ser menor a la fecha fin');
            }
        } else {
            this.sweetService.toastWarning('Ingrese las fechas de busqueda');
        }
    }

    onGetAllImportaciones(fechaIni: Date, fechaFin: Date) {
        this.loadingImportaciones = true;
        const parametros = {
            codigo: 1071,
            parametros: {
                "FechaInicio": fechaIni,
                "FechaFin": fechaFin,
                "Usuario": null,
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listImportaciones = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingImportaciones = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingImportaciones = false;
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onOpenOCI() {
        this.modalCreateImportacion = true;
        this.loadingOCI = true;
        const parametros = {
            codigo: 1079,
            parametros: {
                "EstadoCompra": null,
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listOCI = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingOCI = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingOCI = false;
            }
        });
    }

    onCreateimportacion() {
        if (this.formService.validForm(this.myFormCreateImportacion)) {
            this.blockedSendData = true;
            const parametros = {
                codigo: 1070,
                parametros: {
                    "FechaImportacion": new Date(),
                    "Referencia": this.myFormCreateImportacion.value.referencia,
                    "ArancelAdvaloren": 0,
                    "ArancelEspecifico": 0,
                    "Antiduping": 0,
                    "Fodinfa": 0,
                    "IceAdvaloren": 0,
                    "IceEspecifico": 0,
                    "Iva": 0,
                    "TasaAduanera": 0,
                    "Salvaguardia": 0,
                    "SalvaguardiaEspecifica": 0,
                    "Intereses": 0,
                    "Multas": 0,
                    "Otros": 0,
                    "ValorLiquidado": 0,
                    "GastosDistribuir": 0,
                    "Observacion": null,
                    "Usuario": this.loginService.usuario.UserName,
                    "FechaCierre": null
                },
                listOC: this.myFormCreateImportacion.value.selectOC,
            };
            this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'createImportacion', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.apiRouter.navigate(['/adquisiciones/importaciones/crear'], { queryParams: { id: resp.data[0] } });
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                        this.blockedSendData = false;
                    }
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                    this.blockedSendData = false;
                }
            });
        } else {
            this.sweetService.toastWarning('Ingrese todos los campos');
        }
    }

    onEditImportacion(infoImportacion: AdquisicionesImportacionesImportacionInterface) {
        this.apiRouter.navigate(['/adquisiciones/importaciones/crear'], { queryParams: { id: infoImportacion.IdImportacion } });
    }

    onGetDetalleImportacion(id: number) {
        this.blockedGetData = true;
        const parametros = {
            codigo: 1080,
            parametros: {
                IdImportacion: id,
            },
            tablas: ['TablaImportacion', 'TablaImportacionDocumentosLocales', 'TablaCompra', 'TablaDetalleCompra', 'TablaDetalleCompraAgrupado', 'TablaImportacionDetalle']
        };
        this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    console.log(resp.data[0]);
                    /*
                    this.infoImportacion = { ...resp.data[0].TablaImportacion[0] };
                    this.listGastosLocales = [...resp.data[0].TablaImportacionDocumentosLocales];
                    this.listOrdenesCompra = [...resp.data[0].TablaCompra];
                    this.listDetalleOrdenesCompra = [...resp.data[0].TablaDetalleCompra];
                    this.listConsolidadoOrdenesCompra = [...resp.data[0].TablaDetalleCompraAgrupado];
                    */
                    this.modalInfoImportacion = true;
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.blockedGetData = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.blockedGetData = false;
            }
        });
    }
}

