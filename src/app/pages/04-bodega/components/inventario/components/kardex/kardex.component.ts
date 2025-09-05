
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { ConfiguracionesExtrasDocumentosPDFService } from 'src/app/pages/01-configuraciones-extras/components/documentos_pdf/services/documentos-pddf.service';
import { BodegaInventarioKardexInterface } from 'src/app/pages/04-bodega/interfaces/inventario';
import { BodegaPrintKardexInterface } from 'src/app/pages/04-bodega/interfaces/print-kardex.';
import { ApiService } from 'src/app/shared/services/api.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';

@Component({
    selector: 'app-bodega-inventario-kardex',
    templateUrl: './kardex.component.html',
})
export class BodegaInventarioKardexComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    apiRouter = inject(Router);
    sweetService = inject(SweetAlertService);
    pdfService = inject(ConfiguracionesExtrasDocumentosPDFService);
    formService = inject(ReactiveFormsService);

    loadingKardex: boolean = false;
    visibleModalView: boolean = false;
    listKardex: BodegaInventarioKardexInterface[] = [];
    searchValue: string | undefined;

    blockedSend: boolean = false;
    blockedGet: boolean = false;
    jsonData: BodegaPrintKardexInterface[] = [];

    modalEditLote: boolean = false;
    infoKardex: BodegaInventarioKardexInterface | undefined;
    myFormLote: FormGroup;

    myFormSearch: FormGroup;

    modalInfoKardex: boolean = false;
    listKardexDesc: BodegaInventarioKardexInterface[] = [];
    loadingDesc: boolean = false;
    listKardexAsc: BodegaInventarioKardexInterface[] = [];
    loadingAsc: boolean = false;


    constructor() {
        this.myFormLote = new FormGroup({
            'lote': new FormControl('', Validators.required),
            'peso': new FormControl('', Validators.required),
        });
        this.myFormSearch = new FormGroup({
            "fechaIni": new FormControl('', [Validators.required]),
            "fechaFin": new FormControl('', [Validators.required]),
        });
    }

    ngOnInit(): void {
        const fechaFin = new Date();
        fechaFin.setDate(fechaFin.getDate() + 1);
        const fechaIni = new Date()
        fechaIni.setDate(fechaIni.getDate() - 30);
        this.onGetAllKardex(fechaIni, fechaFin);
    }

    onSearchCotizacion() {
        if (this.formService.validForm(this.myFormSearch)) {
            const fechaIni = new Date(this.myFormSearch.value.fechaIni);
            const fechaFin = new Date(this.myFormSearch.value.fechaFin);
            if (fechaIni.getTime() < fechaFin.getTime()) {
                this.onGetAllKardex(fechaIni, fechaFin);
            } else {
                this.sweetService.toastWarning('La fecha de inicio debe ser menor a la fecha fin');
            }
        } else {
            this.sweetService.toastWarning('Ingrese las fechas de busqueda');
        }
    }

    onGetAllKardex(fechaIni: Date, fechaFin: Date) {
        this.loadingKardex = true;
        const parametros = {
            "codigo": 1046,
            "parametros": {
                "FechaInicio": fechaIni,
                "FechaFin": fechaFin,
                "CodigoInterno": null,
                "CodigoBarras": null,
                "IdInventario": null,
                "IdCompra": null,
                "TipoKardex": null,
                "IdEstado": null,
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listKardex = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingKardex = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingKardex = false;
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onImprimirEtiqueta(info: BodegaInventarioKardexInterface) {
        const parametros = {
            codigo: 1051,
            parametros: {
                "IdKardex": [Number(info.IdKardex)],
                "IdCompra": null,
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.jsonData = [...resp.data];
                    this.pdfService.pdfEtiquetaKardex(this.jsonData, true);
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
            }
        });
    }

    //TRAZABILIDAD
    onOpenInfoKardex(info: BodegaInventarioKardexInterface) {
        this.modalInfoKardex = true;
        this.infoKardex = { ...info };
    }

    onGetTrazabilidad() {
        this.onGetTrazabilidadDesc();
        this.onGetTrazabilidadAsc();
    }

    onGetTrazabilidadDesc() {
        if (this.infoKardex) {
            this.loadingDesc = true;
            const parametros = {
                codigo: 1048,
                parametros: {
                    "IdKardex": this.infoKardex.IdKardex
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'get', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.listKardexDesc = [...resp.data];
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                    }
                    this.loadingDesc = false;
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                    this.loadingDesc = false;
                }
            });
        }
    }

    onGetTrazabilidadAsc() {
        if (this.infoKardex) {
            this.loadingAsc = true;
            const parametros = {
                codigo: 1049,
                parametros: {
                    "IdKardex": this.infoKardex.IdKardex
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'get', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.listKardexAsc = [...resp.data];
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                    }
                    this.loadingAsc = false;
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                    this.loadingAsc = false;
                }
            });
        }
    }

    //LOTES Y PESOS
    onOpenLote() {
        if (this.infoKardex !== undefined) {
            this.modalEditLote = true;
            this.myFormLote.patchValue({
                lote: this.infoKardex.Lote,
                peso: this.infoKardex.PesoMaterial,
            });
        }
    }

    onInsertLote() {
        if (this.infoKardex !== undefined) {
            this.blockedSend = true
            const parametros = {
                codigo: 1047,
                parametros: {
                    "IdKardex": Number(this.infoKardex.IdKardex),
                    "IdEstado": null,
                    "Lote": this.myFormLote.value.lote,
                    "PesoMaterial": this.myFormLote.value.peso,
                    "PesoTotal": this.myFormLote.value.peso,
                }, infoLog: {
                    "Fecha": new Date(),
                    "Usuario": this.loginService.usuario.UserName,
                    "Evento": "Update",
                    "Referencia": "Lote Peso",
                    "Detalle": null,
                    "ServerName": null,
                    "UserHostAddress": null,
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'update', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.sweetService.toastSuccess('Lote actualizado');
                        this.modalEditLote = false;
                        this.ngOnInit();
                    } else {
                        this.sweetService.toastWarning(resp.message);
                    }
                    this.blockedSend = false
                }, error: (err) => {
                    this.sweetService.toastWarning(err.error);
                    this.blockedSend = false
                }
            });

        }
    }

    onSaveLote() {
        if (this.formService.validForm(this.myFormLote)) {
            if (this.infoKardex !== undefined) {
                this.onInsertLote();
            } else {
                this.sweetService.toastWarning('No existe informacion del Kardex');
            }
        } else {
            this.sweetService.toastWarning('Ingrese todos los parametros');
        }
    }
}
