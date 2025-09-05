import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Table } from "primeng/table";
import { LoginService } from "src/app/pages/00-login/services/login.service";
import { AdministracionComercialClientesInterface } from "src/app/pages/02-administracion/interfaces/comercial.interface";
import { AdministracionDisenioCirelInterface } from "src/app/pages/02-administracion/interfaces/disenio.interface";
import { ComercialCotizacionesCabeceraInterface, ComercialCotizacionesDetalleInterface } from "src/app/pages/05-comercial/interfaces/cotizaciones.interface";
import { ProduccionProductoTerminadoInterface } from "src/app/pages/06-produccion/interfaces/producto_terminado.interface";
import { ApiService } from "src/app/shared/services/api.service";
import { ReactiveFormsService } from "src/app/shared/services/forms.service";
import { SweetAlertService } from "src/app/shared/services/sweet-alert.service";


@Component({
    selector: 'app-comercial-listados-producto-terminado',
    templateUrl: './producto_terminado.component.html',
})
export class ComercialListadosProductoTerminadoComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);
    apiRouter = inject(Router);

    blockedGet: boolean = false;

    loadingProdTerm: boolean = false;
    listProdTerm: ProduccionProductoTerminadoInterface[] = [];
    searchValue: string | undefined;

    modalInfoProdTerm: boolean = false;
    infoProdTerm: ProduccionProductoTerminadoInterface | undefined;
    infoCirel: AdministracionDisenioCirelInterface | undefined;


    ngOnInit() {
        this.onGetAllProdTerm();
    }

    onGetAllProdTerm() {
        this.blockedGet = true;
        const parametros = {
            codigo: 1147,
            parametros: {
                "CodigoFinalProductoTerminado": null,
            },
            tablas: ['TablaProductoTerminado', 'TablaCirel']
        };
        this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listProdTerm = [...resp.data[0].TablaProductoTerminado];
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

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    //PRODUCTO TERMINADO
    onOpenInfoProdTerm(info: ProduccionProductoTerminadoInterface) {
        this.blockedGet = true;
        const parametros = {
            codigo: 1147,
            parametros: {
                "CodigoFinalProductoTerminado": info.CodigoFinalProductoTerminado ,
            },
            tablas: ['TablaProductoTerminado', 'TablaCirel']
        };
        this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.infoProdTerm = resp.data[0].TablaProductoTerminado[0];
                    this.infoCirel = resp.data[0].TablaCirel[0];
                    this.modalInfoProdTerm = true;
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
