
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { ConfiguracionesExtrasDocumentosPDFService } from 'src/app/pages/01-configuraciones-extras/components/documentos_pdf/services/documentos-pddf.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GestionInventarioProductoInventarioInterface } from 'src/app/pages/02-administracion/interfaces/gestion-inventario.interface';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';

@Component({
    selector: 'app-bodega-inventario-agregar',
    templateUrl: './agregar.component.html',
})
export class BodegaInventarioAgregarComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    apiRouter = inject(Router);
    sweetService = inject(SweetAlertService);
    pdfService = inject(ConfiguracionesExtrasDocumentosPDFService);
    formService = inject(ReactiveFormsService);

    loadingProductosInventario: boolean = false;
    listProductoInventario: GestionInventarioProductoInventarioInterface[] = [];

    myForm: FormGroup;
    blockedSend: boolean = false;

    constructor() {
        this.myForm = new FormGroup({
            "productoInventario": new FormControl('', [Validators.required]),
            "ancho": new FormControl('', [Validators.required]),
            "largo": new FormControl('', [Validators.required]),
            "peso": new FormControl('', [Validators.required]),
            "lote": new FormControl('', [Validators.required]),
            'tipo': new FormControl('', [Validators.required]),
            'cantidad': new FormControl('', [Validators.required]),
        });
    }

    ngOnInit(): void {
        this.onGetProductoInventario();
    }

    onGetProductoInventario() {
        this.loadingProductosInventario = true;
        const parametros = {
            codigo: 1022,
            parametros: {
                'GrupoInventario': null,
                'CodigoTipoInventario': null,
                'CodigoInternoSustrato': null,
                'IdentificacionProveedor': null,
                "CodigoLineaInventario": null,
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listProductoInventario = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingProductosInventario = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingProductosInventario = false;
            }
        });
    }

    onAddInventario() {
        this.blockedSend = true;
        if (this.formService.validForm(this.myForm)) {
            const parametros = {
                codigo: 1050,
                parametros: {
                    "CodigoInterno": this.myForm.value.productoInventario.CodigoInternoSustrato,
                    "Descripcion": this.myForm.value.productoInventario.DescripcionSustrato,
                    "CodigoTipoInventario": this.myForm.value.productoInventario.CodigoTipoInventario,
                    "GrupoInventario": this.myForm.value.productoInventario.GrupoInventario,
                    "IdProveedor": this.myForm.value.productoInventario.IdProveedor,
                    'Ancho': this.myForm.value.ancho,
                    'Largo': this.myForm.value.largo,
                    'TotalM2': (this.myForm.value.ancho / 1000) * this.myForm.value.largo,
                    'Peso': this.myForm.value.peso,
                    'Lote': this.myForm.value.lote,
                    'Tipo': this.myForm.value.tipo,
                    'Fecha': new Date(),
                    'Usuario': this.loginService.usuario.UserName,
                    'Cantidad': this.myForm.value.cantidad,
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'addInventario', 1050).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.myForm.reset();
                        this.onImprimirEtiqueta(resp.data[0].ListKardex);
                        this.sweetService.viewSuccess('Datos guardado correctament', () => {
                            window.location.reload();
                        });
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
            this.sweetService.toastWarning('Ingrese todos los parametros');
            this.blockedSend = false;
        }
    }

    onImprimirEtiqueta(kardex: number[]) {
        const parametros = {
            codigo: 1051,
            parametros: {
                "IdKardex": kardex,
                "IdCompra": null,
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    const jsonData = [...resp.data];
                    this.pdfService.pdfEtiquetaKardex(jsonData, true);
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
            }
        });
    }
}
