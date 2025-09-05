import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Table } from "primeng/table";
import { LoginService } from "src/app/pages/00-login/services/login.service";
import { AdministracionComercialClientesInterface } from "src/app/pages/02-administracion/interfaces/comercial.interface";
import { ComercialCotizacionesCabeceraInterface, ComercialCotizacionesDetalleInterface } from "src/app/pages/05-comercial/interfaces/cotizaciones.interface";
import { ApiService } from "src/app/shared/services/api.service";
import { ReactiveFormsService } from "src/app/shared/services/forms.service";
import { SweetAlertService } from "src/app/shared/services/sweet-alert.service";


@Component({
    selector: 'app-comercial-jefaturas-cotizaciones',
    templateUrl: './cotizaciones.component.html',
})
export class ComercialJefaturasCotizacionesComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);
    apiRouter = inject(Router);

    blockedSend: boolean = false;
    blockedGet: boolean = false;

    myFormSearch: FormGroup;
    loadingCotizaciones: boolean = false;
    listCotizaciones: any[] = [];
    searchValue: string | undefined;

    modalInfoCotizacion: boolean = false;
    infoCabeceraCotizacion: ComercialCotizacionesCabeceraInterface | undefined;
    listDetalleCotizacion: ComercialCotizacionesDetalleInterface[] = [];

    constructor() {
        this.myFormSearch = new FormGroup({
            "fechaIni": new FormControl('', [Validators.required]),
            "fechaFin": new FormControl('', [Validators.required]),
        });
    }

    ngOnInit() {
        const fechaIni = new Date()
        fechaIni.setDate(fechaIni.getDate() - 10);
        const fechaFin = new Date();
        fechaFin.setDate(fechaFin.getDate() + 1);
        this.onGetAllCotizaciones(fechaIni, fechaFin);
    }

    onGetAllCotizaciones(fechaIni: Date, fechaFin: Date) {
        this.loadingCotizaciones = true;
        const parametros = {
            codigo: 1131,
            parametros: {
                "IdCabeceraCotizacion": null,
                "FechaInicio": fechaIni,
                "FechaFin": fechaFin,
                "IdentificacionCliente": null,
                "IdentificacionAsesor": null,
                "SecuencialCotizacion": null,
                "Estado": null
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'comercial', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listCotizaciones = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingCotizaciones = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingCotizaciones = false;
            }
        });
    }

    onSearchCotizacion() {
        if (this.formService.validForm(this.myFormSearch)) {
            const fechaIni = new Date(this.myFormSearch.value.fechaIni);
            const fechaFin = new Date(this.myFormSearch.value.fechaFin);
            if (fechaIni.getTime() < fechaFin.getTime()) {
                this.onGetAllCotizaciones(fechaIni, fechaFin);
            } else {
                this.sweetService.toastWarning('La fecha de inicio debe ser menor a la fecha fin');
            }
        } else {
            this.sweetService.toastWarning('Ingrese las fechas de busqueda');
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    //VER COTIZACION
    onGetInfoCotizacion(infoCotizacion: ComercialCotizacionesCabeceraInterface) {
        const parametros = {
            codigo: 1136,
            parametros: {
                "IdCabeceraCotizacion": infoCotizacion.IdCabeceraCotizacion,
            },
            tablas: ['TablaCabeceraCotizacion', 'TablaDetalleCotizacion']
        };
        this.apiService.onGetApiExecuteNew(parametros, 'comercial', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.infoCabeceraCotizacion = { ...resp.data[0].TablaCabeceraCotizacion[0] };
                    this.listDetalleCotizacion = [...resp.data[0].TablaDetalleCotizacion];
                    this.modalInfoCotizacion = true;
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
