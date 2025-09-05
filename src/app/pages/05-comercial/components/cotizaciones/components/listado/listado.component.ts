import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Table } from "primeng/table";
import { LoginService } from "src/app/pages/00-login/services/login.service";
import { ConfiguracionesExtrasDocumentosPDFService } from "src/app/pages/01-configuraciones-extras/components/documentos_pdf/services/documentos-pddf.service";
import { AdministracionComercialClientesInterface } from "src/app/pages/02-administracion/interfaces/comercial.interface";
import { ComercialCotizacionesCabeceraInterface, ComercialCotizacionesDetalleInterface } from "src/app/pages/05-comercial/interfaces/cotizaciones.interface";
import { ProduccionOrdenProduccionInterface } from "src/app/pages/06-produccion/interfaces/orden_produccion.interface";
import { ApiService } from "src/app/shared/services/api.service";
import { ReactiveFormsService } from "src/app/shared/services/forms.service";
import { SweetAlertService } from "src/app/shared/services/sweet-alert.service";


@Component({
    selector: 'app-comercial-cotizaciones-listado',
    templateUrl: './listado.component.html',
})
export class ComercialCotizacionesListadoComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);
    apiRouter = inject(Router);
    pdfService = inject(ConfiguracionesExtrasDocumentosPDFService);

    blockedSend: boolean = false;
    blockedGet: boolean = false;
    radioClientes: boolean = false;

    myFormSearch: FormGroup;
    loadingCotizaciones: boolean = false;
    listCotizaciones: any[] = [];
    searchValue: string | undefined;

    modalCreateCotizacion: boolean = false;
    myFormClientes: FormGroup;

    loadingClientes: boolean = false;
    listClientes: AdministracionComercialClientesInterface[] = [];
    selectCliente: AdministracionComercialClientesInterface[] = [];
    checkAllClientes: boolean = false;

    modalInfoCotizacion: boolean = false;
    infoCabeceraCotizacion: ComercialCotizacionesCabeceraInterface | undefined;
    listDetalleCotizacion: ComercialCotizacionesDetalleInterface[] = [];

    infoOP: ProduccionOrdenProduccionInterface | undefined;

    constructor() {
        this.myFormSearch = new FormGroup({
            "fechaIni": new FormControl('', [Validators.required]),
            "fechaFin": new FormControl('', [Validators.required]),
        });
        this.myFormClientes = new FormGroup({
            "cliente": new FormControl('', [Validators.required]),
        });
    }

    ngOnInit() {
        const fechaIni = new Date()
        fechaIni.setDate(fechaIni.getDate() - 10);
        const fechaFin = new Date();
        fechaFin.setDate(fechaFin.getDate() + 1);
        this.onGetAllCotizaciones(fechaIni, fechaFin);
        this.onGetAllClientes(false);
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
                "IdentificacionAsesor": this.loginService.usuario.UserName,
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

    //CREAR COTIZACION
    onOpenModalCotizacion() {
        this.selectCliente = [];
        this.modalCreateCotizacion = true;
        this.myFormClientes.reset();
        this.radioClientes = false;
    }

    onGetAllClientes(all: boolean) {
        this.myFormClientes.reset();
        this.selectCliente = [];
        this.loadingClientes = true;
        const parametros = {
            codigo: 1010,
            parametros: {
                "nombreusuario": all ? null : this.loginService.usuario.UserName,
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listClientes = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingClientes = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingClientes = false;
            }
        });

    }

    onSelectCliente(infoCliente: AdministracionComercialClientesInterface) {
        this.selectCliente[0] = { ...infoCliente };
    }

    onInsertCotizacion() {
        const parametros = {
            codigo: 1130,
            parametros: {
                "FechaRegistro": new Date,
                "RazonSocialCliente": this.selectCliente[0].RazonSocial.replace(/'/g, "’"),
                "IdentificacionCliente": this.selectCliente[0].IdentificacionCliente,
                "Direccioncliente": this.selectCliente[0].Direccion,
                "CiudadCliente": this.selectCliente[0].Ciudad,
                "ContactoCliente": this.selectCliente[0].Celular,
                "TelefonoCliente": this.selectCliente[0].Telefono,
                "IdentificacionAsesor": this.loginService.usuario.UserName,
                "NombreAsesor": this.loginService.usuario.UserName,
                "FechaPedido": null,
                "SecuencialCotizacion": null,
                "TotalItems": 0,
                "ValorTotalCotizacion": 0,
                "Estado": 1
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'comercial', 'insert', parametros.codigo).subscribe({
            next: (resp: any) => {
                this.modalCreateCotizacion = false;
                this.sweetService.viewSuccess('Se ejecuto correctamente', () => {
                    this.apiRouter.navigate(['/comercial/cotizaciones/nueva_cotizacion'], { queryParams: { id: resp.data } });
                });
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingClientes = false;
            },
        });
    }

    onSaveCotizacion() {
        if (this.formService.validForm(this.myFormClientes)) {
            this.onInsertCotizacion();
        } else {
            this.sweetService.toastWarning('Ingrese todos los datos');
        }
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

    onOpenCotizacion() {
        this.apiRouter.navigate(['/comercial/cotizaciones/nueva_cotizacion'], { queryParams: { id: this.infoCabeceraCotizacion!.IdCabeceraCotizacion } });
    }

    onPrintCotizacion(info: ComercialCotizacionesDetalleInterface) {
        this.blockedGet = true;
        const parametros = {
            codigo: 1152,
            parametros: {
                "IdOrdenProduccion": null,
                "SecuencialOrdenProduccion": null,
                "SecuencialCotizacion": null,
                "OrdenCompra": null,
                "IdentificacionCliente": null,
                "CodigoTrabajo": info.CodigoProductoTerminado,
                "IdEstadoOrdenProduccion": null,
                "NombreAsesor": null,
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    if (resp.data.length === 1)
                        this.pdfService.pdfCotizacionItem(this.infoCabeceraCotizacion!, info, resp.data[0]);
                    else
                        this.pdfService.pdfCotizacionItem(this.infoCabeceraCotizacion!, info, null);
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
