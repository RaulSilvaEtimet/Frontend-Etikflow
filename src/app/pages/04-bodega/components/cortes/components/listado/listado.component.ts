import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { BodegaOrdenCorteDescripcionInterface, BodegaOrdenCorteKardexInterface, BodegaOrdenCorteResultadoInterface, BodegaOrderCorteCabeceraInterface } from 'src/app/pages/04-bodega/interfaces/order-corte';
import { ApiService } from 'src/app/shared/services/api.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { BodegaPrintKardexInterface } from 'src/app/pages/04-bodega/interfaces/print-kardex.';
import { ConfiguracionesExtrasDocumentosPDFService } from 'src/app/pages/01-configuraciones-extras/components/documentos_pdf/services/documentos-pddf.service';

@Component({
    selector: 'app-bodega-cortes-listado',
    templateUrl: './listado.component.html',
})
export class BodegaCortesListadoComponent {
    loginService = inject(LoginService);
    apiService = inject(ApiService);
    apiRouter = inject(Router);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);
    pdfService = inject(ConfiguracionesExtrasDocumentosPDFService);

    myFormSearch: FormGroup;
    blockedPanel: boolean = false;

    loadingOrdCor: boolean = false;
    modalInformacion: boolean = false;
    listOrdenCorte: BodegaOrderCorteCabeceraInterface[] = [];
    searchValue: string | undefined;

    modalKardex1: boolean = false;
    modalKardex2: boolean = false;
    myFormKardex1: FormGroup;
    myFormKardex2: FormGroup;
    initCorte: number = 0;

    ordCorCabecera: BodegaOrderCorteCabeceraInterface = {
        IdOrdenCorte: null,
        Secuencial: null,
        FechaRegistroOrdenCorte: null,
        Usuario: null,
        Estado: null,
        DescripcionEstado: null,
    };
    listOrdCorKardex: BodegaOrdenCorteKardexInterface[] = [];
    listOrdCorDetalle: BodegaOrdenCorteDescripcionInterface[] = [];
    listOrdCorResultado: BodegaOrdenCorteResultadoInterface[] = [];

    jsonData: BodegaPrintKardexInterface[] = [];
    loadingEtiquetas: boolean = false;

    modalBitacora: boolean = false;
    codBarraBitacora: string = "";
    idOrdCorKardexBitacora: number = 0;
    viewAddBitacora: boolean = false;
    listBitacora: any[] = [];
    loadingBitacora: boolean = false;
    myFormBitacora: FormGroup;
    modalAddBitacora: boolean = false;
    listOpciones: string[] = ['Iniciar Setup', 'Fin setup', 'Inicio corte', 'Fin Corte', 'Observacion'];

    constructor() {
        this.myFormSearch = new FormGroup({
            "fechaIni": new FormControl('', [Validators.required]),
            "fechaFin": new FormControl('', [Validators.required]),
        });
        this.myFormKardex1 = new FormGroup({
            "idKardex": new FormControl('', [Validators.required]),
        });
        this.myFormKardex2 = new FormGroup({
            "idKardex": new FormControl('', [Validators.required]),
            "observacion": new FormControl('', [Validators.required]),
        });
        this.myFormBitacora = new FormGroup({
            "menu": new FormControl('', [Validators.required]),
            "observacion": new FormControl({ value: '', disabled: true }, [Validators.required]),
        });
    }

    ngOnInit() {
        const fechaIni = new Date()
        fechaIni.setDate(fechaIni.getDate() - 10);
        const fechaFin = new Date();
        fechaFin.setDate(fechaFin.getDate() + 1);
        this.onGetOrdenCorte(fechaIni, fechaFin);
    }

    onSearchOrdenCorte() {
        if (this.formService.validForm(this.myFormSearch)) {
            const fechaIni = new Date(this.myFormSearch.value.fechaIni);
            const fechaFin = new Date(this.myFormSearch.value.fechaFin);
            if (fechaIni.getTime() < fechaFin.getTime()) {
                this.onGetOrdenCorte(fechaIni, fechaFin);
            } else {
                this.sweetService.toastWarning('La fecha de inicio debe ser menor a la fecha fin');
            }
        } else {
            this.sweetService.toastWarning('Ingrese las fechas de busqueda');
        }
    }

    onGetOrdenCorte(fechaIni: Date, fechaFin: Date) {
        this.loadingOrdCor = true;
        const parametros = {
            "codigo": 1054,
            "parametros": {
                "Secuencial": null,
                "FechaInicio": fechaIni,
                "FechaFin": fechaFin,
                "Estado": null
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listOrdenCorte = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingOrdCor = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingOrdCor = false;
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onOpenOrdenCorte(ordenCorte: BodegaOrderCorteCabeceraInterface) {
        const parametros = {
            codigo: 1061,
            parametros: {
                "IdOrdenCorte": ordenCorte.IdOrdenCorte,
            },
            tablas: ['TablaOrdenCorte', 'TablaOrdenCorteKardex', 'TablaDescripcionOrdenCorte', 'TablaResultadoOrdenCorte'],
        };
        this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.ordCorCabecera = { ...resp.data[0].TablaOrdenCorte[0] };
                    this.listOrdCorKardex = [...resp.data[0].TablaOrdenCorteKardex];
                    this.listOrdCorDetalle = [...resp.data[0].TablaDescripcionOrdenCorte];
                    this.listOrdCorResultado = [...resp.data[0].TablaResultadoOrdenCorte];
                    this.modalInformacion = true;
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
            }
        });
    }

    onOpenCorte(tipoSelecion: number) {
        this.myFormKardex1.reset();
        this.initCorte = tipoSelecion;
        if (this.initCorte === 1 || this.initCorte === 2)
            this.modalKardex1 = true;
        else if (this.initCorte === 3)
            this.modalKardex2 = true;
    }

    onSelectKardex1() {
        if (this.formService.validForm(this.myFormKardex1)) {
            const codBarras = this.myFormKardex1.value.idKardex;
            if (this.listOrdCorKardex.some(item => item.CodigoBarras === codBarras)) {
                const infoKardex = this.listOrdCorKardex.find(item => item.CodigoBarras === codBarras)!;
                if (this.initCorte === 1) {
                    if (infoKardex.Estado === 11) {
                        this.onIniciarCorte(infoKardex);
                    } else {
                        this.sweetService.viewWarning('Esta corte o bobina no esta en el estado PENDIENTE', 'Salir', () => { });
                    }
                } else if (this.initCorte === 2) {
                    if (infoKardex.Estado === 14) {
                        this.onCerrarCorte(infoKardex);
                    } else {
                        this.sweetService.viewWarning('Esta corte o bobina no esta en el estado EN PROCESO', 'Salir', () => { });
                    }
                } else if (this.initCorte === 3) {
                    if (infoKardex.Estado === 11) {
                        this.onDevolverCorte(infoKardex);
                    } else {
                        this.sweetService.viewWarning('Esta corte o bobina no esta en el estado PENDIENTE', 'Salir', () => { });
                    }
                }
            } else {
                this.sweetService.viewWarning('Esta corte o bobina no se encuentra en la orden de corte', 'Salir', () => { });
            }
        } else {
            this.sweetService.toastWarning('Ingrese todos los parametros');
        }
    }

    onSelectKardex2() {
        if (this.formService.validForm(this.myFormKardex2)) {
            const codBarras = this.myFormKardex2.value.idKardex;
            if (this.listOrdCorKardex.some(item => item.CodigoBarras === codBarras)) {
                const infoKardex = this.listOrdCorKardex.find(item => item.CodigoBarras === codBarras)!;
                if (this.initCorte === 3) {
                    if (infoKardex.Estado === 11) {
                        this.onDevolverCorte(infoKardex);
                    } else {
                        this.sweetService.viewWarning('Esta corte o bobina no esta en el estado PENDIENTE', 'Salir', () => { });
                    }
                }
            } else {
                this.sweetService.viewWarning('Esta corte o bobina no se encuentra en la orden de corte', 'Salir', () => { });
            }
        } else {
            this.sweetService.toastWarning('Ingrese todos los parametros');
        }
    }

    onIniciarCorte(infoOrdCorKardex: BodegaOrdenCorteKardexInterface) {
        this.blockedPanel = true;
        const parametros = {
            codigos: [1057, 1068],
            parametros: [{
                "IdOrdenCorteKardex": Number(infoOrdCorKardex.IdOrdenCorteKardex),
                "FechaHoraInicio": new Date(),
                "FechaHoraFin": null,
                "UsuarioInicio": this.loginService.usuario.UserName,
                "UsuarioFin": null,
                "Estado": 14,
                "Observacion": null,
            }, {
                "IdOrdenCorteKardex": Number(infoOrdCorKardex.IdOrdenCorteKardex),
                "FechaRegistro": new Date(),
                "Usuario": this.loginService.usuario.UserName,
                "Observacion": "Iniciar Setup"
            }]
        };
        this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'event', parametros.codigos[0]).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.sweetService.viewSuccess('Datos registrados', () => { });
                    this.modalInformacion = false;
                    this.modalKardex1 = false;
                } else {
                    this.sweetService.viewDanger(parametros.codigos[0], resp.message);
                }
                this.blockedPanel = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigos[0]);
                this.blockedPanel = false;
            }
        });
    }

    onCerrarCorte(infoOrdCorKardex: BodegaOrdenCorteKardexInterface) {
        this.apiRouter.navigate(['/bodega/cortes/cerrar'], { queryParams: { id: infoOrdCorKardex.IdOrdenCorte, id2: infoOrdCorKardex.IdOrdenCorteKardex } });
    }

    onDevolverCorte(infoOrdCorKardex: BodegaOrdenCorteKardexInterface) {
        this.blockedPanel = true;
        const parametros = {
            codigos: [1057, 1047],
            parametros: [{
                "IdOrdenCorteKardex": Number(infoOrdCorKardex.IdOrdenCorteKardex),
                "FechaHoraInicio": new Date(),
                "FechaHoraFin": null,
                "Estado": 13,
                "UsuarioInicio": this.loginService.usuario.UserName,
                "UsuarioFin": null,
                "Observacion": this.myFormKardex2.value.observacion,
            }, {
                "IdKardex": Number(infoOrdCorKardex.IdKardex),
                "PesoMaterial": null,
                "PesoTotal": null,
                "IdEstado": 9,
                "Lote": null,
            }],
        };
        this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'event', parametros.codigos[0]).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.sweetService.viewSuccess('Datos registrados', () => { });
                    this.modalInformacion = false;
                    this.modalKardex2 = false;
                } else {
                    this.sweetService.viewDanger(parametros.codigos[0], resp.message);
                }
                this.blockedPanel = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigos[0]);
                this.blockedPanel = false;
            }
        });
    }

    onPrintEtiquetas(infoOrdCorKardex: BodegaOrdenCorteKardexInterface) {
        const listIds = this.listOrdCorResultado.filter(item => item.IdOrdenCorteKardex === infoOrdCorKardex.IdOrdenCorteKardex).map(item => Number(item.IdKardex));
        const parametros = {
            codigo: 1051,
            parametros: {
                "IdKardex": listIds,
                "IdCompra": null,
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

    onCerrarOrdenCorte() {
        if (this.listOrdCorKardex.every(item => item.Estado === 12 || item.Estado === 13)) {
            this.blockedPanel = true;
            const parametros = {
                codigo: 1055,
                parametros: {
                    "IdOrdenCorte": this.ordCorCabecera.IdOrdenCorte,
                    "Estado": 12,
                }, infoLog: {
                    "Fecha": new Date(),
                    "Usuario": this.loginService.usuario.UserName,
                    "Evento": "Update",
                    "Referencia": "Orden Corte",
                    "Detalle": this.ordCorCabecera.IdOrdenCorte,
                    "ServerName": null,
                    "UserHostAddress": null,
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'update', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.sweetService.viewSuccess('Datos registrados', () => { });
                        this.modalInformacion = false;
                        this.modalKardex1 = false;
                        this.ngOnInit();
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                    }
                    this.blockedPanel = false;
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                    this.blockedPanel = false;
                }
            });
        } else {
            this.sweetService.viewWarning('No deben existir bobinas o cortes en estado PENDIENTE', 'Ok', () => { });
        }
    }

    onViewBitacora(idOrdCorKardex: number, codBarra: string, estadoOrdCorKardex: number) {
        if (estadoOrdCorKardex === 14)
            this.viewAddBitacora = true;
        else
            this.viewAddBitacora = false;
        this.loadingBitacora = true;
        this.codBarraBitacora = codBarra;
        this.idOrdCorKardexBitacora = idOrdCorKardex;
        const parametros = {
            codigo: 1069,
            parametros: {
                "IdOrdenCorteKardex": idOrdCorKardex,
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listBitacora = [...resp.data];
                    this.modalBitacora = true;
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingBitacora = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingBitacora = false;
            }
        });
    }

    onAddBitacora() {
        this.modalAddBitacora = true;
        this.myFormBitacora.reset();
    }

    onChangeMenu(info: string) {
        if (info === "Observacion") {
            this.myFormBitacora.get('observacion')?.enable();
        } else {
            this.myFormBitacora.get('observacion')?.disable();
        }
    }

    onSaveBitacora() {
        if (this.formService.validForm(this.myFormBitacora)) {
            const parametros = {
                codigo: 1068,
                parametros: {
                    "IdOrdenCorteKardex": this.idOrdCorKardexBitacora,
                    "FechaRegistro": new Date(),
                    "Usuario": this.loginService.usuario.UserName,
                    "Observacion": this.myFormBitacora.value.menu === 'Observacion' ? this.myFormBitacora.value.observacion : this.myFormBitacora.value.menu,
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'insert', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.sweetService.viewSuccess('Datos registrados', () => { });
                        this.modalAddBitacora = false;
                        this.onViewBitacora(this.idOrdCorKardexBitacora, this.codBarraBitacora, 14);
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                    }
                    this.blockedPanel = false;
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                    this.blockedPanel = false;
                }
            });
        } else {
            this.sweetService.toastWarning('Ingrese todos los parametros');
        }
    }

    async onImprimirOrdenCorte() {
        const pdf = await this.pdfService.pdfOrdenCorte(this.ordCorCabecera, this.listOrdCorKardex, this.listOrdCorDetalle);
    }
}
