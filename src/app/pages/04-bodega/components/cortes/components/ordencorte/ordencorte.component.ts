import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { BodegaInventarioKardexInterface } from 'src/app/pages/04-bodega/interfaces/inventario';
import { ApiService } from 'src/app/shared/services/api.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';

@Component({
    selector: 'app-bodega-cortes-ordencorte',
    templateUrl: './ordencorte.component.html',
})
export class BodegaCortesOrdencorteComponent {
    loginService = inject(LoginService);
    apiService = inject(ApiService);
    apiRouter = inject(Router);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);

    blockedPanel: boolean = false;

    loadingInventario: boolean = false;
    listSustratos: any[] = [];
    myForm: FormGroup;

    loadingKardex: boolean = false;
    listkardex: BodegaInventarioKardexInterface[] = [];
    listSelectKardex: BodegaInventarioKardexInterface[] = [];

    disabledElements: boolean = false;
    listParadas: any[] = [];
    listAnchos: any[] = [];
    anchoKardex: number = 0;
    largoKardex: number = 0;
    modalAddParada: boolean = false;
    myFormParada: FormGroup;

    constructor() {
        this.myForm = new FormGroup({
            "idInventario": new FormControl('', [Validators.required]),
            "anchoMin": new FormControl('', [Validators.required]),
            "anchoMax": new FormControl('',),
            "largoMin": new FormControl('',),
            "largoMax": new FormControl('',),
        });
        this.myFormParada = new FormGroup({
            "largoParada": new FormControl('', [Validators.required]),
        });
    }

    ngOnInit() {
        this.onGetInventarioDisponible();
    }

    onGetInventarioDisponible() {
        const parametros = {
            codigo: 1043,
            parametros: {
                "CodigoInternoInventario": null,
                "CodigoTipoInventario": null,
                "GrupoInventario": null,
                "IdProveedor": null,
            }
        };
        this.loadingInventario = true;
        this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listSustratos = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingInventario = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
            }
        });
    }

    onSearchKardex() {
        if (this.formService.validForm(this.myForm)) {
            const idInventario = this.myForm.value.idInventario.IdInventario;
            const anchoMin = this.myForm.value.anchoMin;
            const anchoMax = this.myForm.value.anchoMax === "" ? null : this.myForm.value.anchoMax;
            const largoMin = this.myForm.value.largoMin === "" ? null : this.myForm.value.largoMin;
            const largoMax = this.myForm.value.largoMax === "" ? null : this.myForm.value.largoMax;

            const parametros = {
                codigo: 1052,
                parametros: {
                    "IdInventario": idInventario,
                    "AnchoMin": anchoMin,
                    "AnchoMax": anchoMax,
                    "LargoMin": largoMin,
                    "LargoMax": largoMax
                }
            };
            this.loadingKardex = true;
            this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'get', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.listkardex = [...resp.data];
                        this.listSelectKardex = [];
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                    }
                    this.loadingKardex = false;
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                }
            });
        } else {
            this.sweetService.toastWarning('Ingrese todos los campos');
        }
    }

    onEscogerKardex() {
        if (this.listSelectKardex.length !== 0) {
            const checkLote = this.listSelectKardex.find(item => item.Lote === null || item.Lote === "" || item.Lote === 'NO PROPORCIONADO');
            const checkPeso = this.listSelectKardex.find(item => item.PesoMaterial === 0 || item.PesoTotal === 0);
            if (checkLote === undefined && !checkPeso) {
                this.anchoKardex = this.listSelectKardex[0].Ancho ?? 0;
                this.largoKardex = this.listSelectKardex[0].Largo ?? 0;

                const checkTamaños = this.listSelectKardex.filter(item => item.Ancho === this.anchoKardex && item.Largo === this.largoKardex);
                if (checkTamaños.length === this.listSelectKardex.length) {
                    this.disabledElements = true;
                } else {
                    this.sweetService.toastWarning('Todos los seleccionados deben tener las mismas dimensiones');
                }
            } else {
                this.sweetService.toastWarning('Uno de los kardex seleccionados no tiene lote o el peso es 0');
            }
        } else {
            this.sweetService.toastWarning('Seleccione al menos un corte o bobina');
        }
    }

    onAddParada() {
        this.modalAddParada = true;
        this.myFormParada.reset();
        this.listAnchos = [];
    }

    onAddMedida() {
        this.listAnchos.push({ Medida: 0, Cantidad: 0 });
    }

    onSaveMedida() {
        if (this.listAnchos.some(item => item.Medida === 0)) {
            this.sweetService.toastWarning('Los anchos no deben ser 0');
        } else {
            const newAncho = this.listAnchos.reduce((total, item) => {
                return total + (item.Medida * item.Cantidad);
            }, 0);
            if (newAncho !== this.anchoKardex) {
                this.sweetService.toastWarning('La suma de los anchos debe ser el ancho de la bobina o corte');
            } else {
                if (!this.formService.validForm(this.myFormParada)) {
                    this.sweetService.toastWarning('Ingrese la medida del largo de la parada');
                } else {
                    if (this.myFormParada.value.largoParada === 0) {
                        this.sweetService.toastWarning('El valor del largo de la parada no puede ser 0');
                    } else {
                        const newLargo = this.listParadas.reduce((total, item) => {
                            return total + item.Largo;
                        }, 0) + this.myFormParada.value.largoParada;
                        if (newLargo > this.largoKardex) {
                            this.sweetService.toastWarning('Este valor execede el largo de la bobina o corte');
                        } else {
                            this.listParadas.push({
                                Largo: this.myFormParada.value.largoParada,
                                Anchos: this.listAnchos.map(m => {
                                    let txt = "";
                                    for (let i = 1; i <= m.Cantidad; i++)
                                        txt = txt + m.Medida + ',';
                                    return txt.slice(0, -1);
                                }).join(','),
                                Parada: this.listParadas.length + 1,
                            });
                            this.modalAddParada = false;
                        }
                    }
                }
            }
        }
    }

    onFinalizar() {
        if (this.blockedPanel) return;

        const newLargo = this.listParadas.reduce((total, item) => {
            return total + item.Largo;
        }, 0);
        if (newLargo === this.largoKardex && this.largoKardex !== 0) {
            this.blockedPanel = true;
            const numParadas = this.listParadas.reduce((total, item) => {
                return total + item.Anchos.split(',').length;
            }, 0);
            const parametros = {
                codigo: 1053,
                parametros: {
                    "FechaRegistroOrdenCorte": new Date(),
                    "Usuario": this.loginService.usuario.UserName,
                    "Estado": 11,
                    "CortesIguales": null,
                    "NumeroCortes": numParadas,
                    "MedidasDiferentes": null,
                    "IdKardex": this.listSelectKardex.map(item => Number(item.IdKardex)),
                    "Cortes": this.listParadas,
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'ordenCorte', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.sweetService.viewSuccess(
                            'Los datos se guardaron correctamente',
                            () => this.apiRouter.navigateByUrl('/home')
                        );
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                        this.blockedPanel = false;
                    }
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                    this.blockedPanel = false;
                }
            });
        } else {
            this.sweetService.toastWarning('Debe utilizar todo el largo de la bobina');
        }
    }
}
