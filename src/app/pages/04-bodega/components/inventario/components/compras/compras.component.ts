
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { AdquisicionOrdenCompraCabeceraInterface } from 'src/app/pages/03-adquisiciones/interface/adquisicion-cabecera';
import { ApiService } from 'src/app/shared/services/api.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { AdquisicionOrdenCompraDetalleInterface } from 'src/app/pages/03-adquisiciones/interface/adquisicion-detalle';
import { BodegaPrintKardexInterface } from 'src/app/pages/04-bodega/interfaces/print-kardex.';
import { ConfiguracionesExtrasDocumentosPDFService } from 'src/app/pages/01-configuraciones-extras/components/documentos_pdf/services/documentos-pddf.service';

@Component({
    selector: 'app-bodega-inventario-compras',
    templateUrl: './compras.component.html',
})
export class BodegaInventarioComprasComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    apiRouter = inject(Router);
    sweetService = inject(SweetAlertService);
    pdfService = inject(ConfiguracionesExtrasDocumentosPDFService);

    loadingOC: boolean = false;
    visibleModalView: boolean = false;
    ordenesCompra: AdquisicionOrdenCompraCabeceraInterface[] = [];
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
    jsonData: BodegaPrintKardexInterface[] = [];
    loadingEtiquetas: boolean = false;

    ngOnInit(): void {
        this.onGetAllOrdenCompra();
    }

    onGetAllOrdenCompra() {
        const fechaFin = new Date(2025, 11, 31);
        //fechaFin.setDate(fechaFin.getDate() + 1);
        const fechaIni = new Date(2025, 0, 1)
        //fechaIni.setDate(fechaIni.getDate() - 30);
        this.loadingOC = true;
        const parametros = {
            codigo: 1028,
            parametros: {
                "IdentificacionProveedor": null,
                "SecuencialOrdenCompra": null,
                "FechaRegistroOrdenCompraInicio": fechaIni,
                "FechaRegistroOrdenCompraFin": fechaFin,
                "SecuencialCompra": null,
                "EstadoCompra": [6]
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.ordenesCompra = [...resp.data];
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

    onImprimirEtiquetas() {
        const parametros = {
            codigo: 1051,
            parametros: {
                "IdKardex": null,
                "IdCompra": Number(this.cabecera.IdCompra),
            }
        }
        this.loadingEtiquetas = true;
        this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.jsonData = [...resp.data];
                    this.pdfService.pdfEtiquetaKardex(this.jsonData, true);
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingEtiquetas = false;
            }, error: (err) => {
                this.loadingEtiquetas = false;
                this.sweetService.viewDanger(parametros.codigo, err.error);
            }
        });
    }


}
