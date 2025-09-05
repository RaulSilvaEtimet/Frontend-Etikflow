import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { BodegaOrdenCorteDescripcionInterface, BodegaOrdenCorteKardexInterface, BodegaOrderCorteCabeceraInterface } from 'src/app/pages/04-bodega/interfaces/order-corte';
import { ApiService } from 'src/app/shared/services/api.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';

@Component({
    selector: 'app-bodega-cortes-cerrar',
    templateUrl: './cerrar.component.html',
})
export class BodegaCortesCerrarComponent {
    loginService = inject(LoginService);
    apiService = inject(ApiService);
    apiRouter = inject(Router);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);
    apiActivateRoute = inject(ActivatedRoute);

    blockedGetInfo: boolean = false;
    blockedSendInfo: boolean = false;
    modalChangeMedidas: boolean = false;
    modalEditCorte: boolean = false;
    modalAddCorte: boolean = false;
    modalCalibracion: boolean = false;
    modalAjuste: boolean = false;

    m2Reales: number = 0;
    m2Distribuidos: number = 0;

    infoCabecera: BodegaOrderCorteCabeceraInterface = {
        IdOrdenCorte: null,
        Secuencial: null,
        FechaRegistroOrdenCorte: null,
        Usuario: null,
        Estado: null,
        DescripcionEstado: null,
    };
    infoDetalle: BodegaOrdenCorteKardexInterface | undefined;
    infoParadas: BodegaOrdenCorteDescripcionInterface[] = [];
    listNuevosCortes: any[] = [];
    listCalibracionAjustes: any[] = [];

    myFormMedidas: FormGroup;
    myFormAddCorte: FormGroup;
    myFormEditCorte: FormGroup;
    myFormAjuste: FormGroup;
    myFormCalibracion: FormGroup;
    posCorte: number = 0;

    constructor() {
        this.myFormMedidas = new FormGroup({
            "largoBobina": new FormControl('', [Validators.required]),
        });
        this.myFormEditCorte = new FormGroup({
            "nuevoLargo": new FormControl('', [Validators.required]),
            "nuevoPeso": new FormControl('', [Validators.required]),
            "existeFalla": new FormControl(false),
        });
        this.myFormAddCorte = new FormGroup({
            "nuevoLargo": new FormControl('', [Validators.required]),
            "nuevoAncho": new FormControl('', [Validators.required]),
            "nuevoPeso": new FormControl('', [Validators.required]),
            "existeFalla": new FormControl(false),
        });
        this.myFormCalibracion = new FormGroup({
            "largoCalibracion": new FormControl('', [Validators.required]),
        });
        this.myFormAjuste = new FormGroup({
            "listCortes": new FormControl([], [Validators.required]),
            "largoAjuste": new FormControl('', [Validators.required]),
        });
    }

    ngOnInit() {
        this.onGetParams();
    }

    onGetParams() {
        this.apiActivateRoute.queryParamMap.subscribe(params => {
            const idOrdCor = params.get('id');
            const idOrdCorKardex = params.get('id2');
            if (idOrdCor !== null && idOrdCorKardex !== null) {
                this.onGetInfoOrdCor(Number(idOrdCor), Number(idOrdCorKardex));
            } else {
                this.sweetService.viewWarning(
                    'Para acceder a esta funcionalidad lo debe hacer desde el listado de ordenes de compra',
                    'Redirigir',
                    (result: any) => {
                        if (result.isConfirmed)
                            this.apiRouter.navigate(['/bodega/cortes/listado']);
                    });
            }
        });
    }

    onGetInfoOrdCor(idOrdCor: number, idOrdCorKardex: number) {
        this.blockedGetInfo = true;
        const parametros = {
            codigo: 1061,
            parametros: {
                "IdOrdenCorte": idOrdCor,
            },
            tablas: ['TablaOrdenCorte', 'TablaOrdenCorteKardex', 'TablaDescripcionOrdenCorte', 'TablaResultadoOrdenCorte'],
        };
        this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    const check: BodegaOrdenCorteKardexInterface = resp.data[0].TablaOrdenCorteKardex.find(
                        (item: BodegaOrdenCorteKardexInterface) => `${item.IdOrdenCorteKardex}` === `${idOrdCorKardex}`
                    );
                    if (check.Estado === 14) {
                        this.infoCabecera = { ...resp.data[0].TablaOrdenCorte[0] };
                        this.infoDetalle = { ...check };
                        this.infoParadas = [...resp.data[0].TablaDescripcionOrdenCorte];
                        this.onGeneratePosiblesCortes();
                        this.m2Reales = (this.infoDetalle.Ancho ?? 0) / 1000 * (this.infoDetalle.Largo ?? 0);
                        this.onCalcularMetrosReales();
                    } else {
                        this.sweetService.viewWarning('Esta bobina o corte esta en un estado diferente', 'Salir', () => { this.apiRouter.navigateByUrl('/home') });
                    }
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.blockedGetInfo = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.blockedGetInfo = false;
            }
        });
    }

    onGeneratePosiblesCortes() {
        if (this.infoDetalle !== undefined) {
            const gramos = this.infoDetalle.Peso ?? 0;
            if (gramos === 0) {
                this.sweetService.viewWarning('El peso del sustrato es 0, informar al Dep. Sistemas para su corrección y realizar la toma fisica del gramaje del sustrato', 'Salir', () => {
                    this.apiRouter.navigateByUrl('/home');
                });
            } else {
                this.infoParadas.forEach(item => {
                    const anchos = item.AnchoCorte?.split(',');
                    anchos!.forEach(item2 => {
                        this.listNuevosCortes.push({
                            Id: this.listNuevosCortes.length + 1,
                            Parada: item.Parada,
                            Largo: item.LargoCorte,
                            Ancho: Number(item2),
                            PesoReal: 0,
                            PesoTeorico: (((item.LargoCorte ?? 0) * Number(item2)) / 1000) * (gramos / 1000),
                            Falla: false,
                            Ajuste: false,
                        });
                    });
                });
            }
        }
    }

    onChangeMedidas() {
        if (this.infoDetalle !== undefined) {
            this.modalChangeMedidas = true;
            this.myFormMedidas.patchValue({
                "largoBobina": this.infoDetalle.LargoMedido,
            });
        }
    }

    onSaveMedidas() {
        if (this.infoDetalle !== undefined) {
            if (this.formService.validForm(this.myFormMedidas)) {
                const oldLargo = this.infoDetalle.Largo ?? 0;
                const newLargo = this.myFormMedidas.value.largoBobina;
                if (oldLargo * 1.10 >= newLargo && oldLargo * 0.90 <= newLargo) {
                    this.infoDetalle.LargoMedido = newLargo;
                    this.infoDetalle.AnchoMedido = this.infoDetalle.Ancho;
                    this.modalChangeMedidas = false;
                    this.m2Reales = (this.infoDetalle.AnchoMedido ?? 0) / 1000 * (this.infoDetalle.LargoMedido ?? 0);
                } else {
                    this.sweetService.toastWarning('El nuevo largo no puede ser mas o menos que el 10% del antiguo largo');
                }
            } else {
                this.sweetService.toastWarning('Ingrese todos los campos');
            }
        }
    }

    onAddAjuste() {
        this.modalAjuste = true;
        this.myFormAjuste.reset();
    }

    onSaveAjuste() {
        if (this.formService.validForm(this.myFormAjuste)) {
            this.myFormAjuste.value.listCortes.forEach((item: any) => {
                if (!this.listCalibracionAjustes.some(option => option.Corte === item.Id)) {
                    this.listCalibracionAjustes.push({
                        Largo: this.myFormAjuste.value.largoAjuste,
                        Ancho: item.Ancho,
                        Corte: item.Id,
                        Tipo: 'Ajuste',
                    });
                }
                this.listNuevosCortes.find(option => option.Id === item.Id).Ajuste = true;
            });
            this.onCalcularMetrosReales();
            this.modalAjuste = false;
        } else {
            this.sweetService.toastWarning('Ingrese todos los datos');
        }
    }

    onAddCalibracion() {
        this.myFormCalibracion.reset();
        this.modalCalibracion = true;
    }

    onSaveCalibracion() {
        if (this.infoDetalle !== undefined) {
            if (this.formService.validForm(this.myFormCalibracion)) {
                this.listCalibracionAjustes.push({
                    Largo: this.myFormCalibracion.value.largoCalibracion,
                    Ancho: this.infoDetalle.AnchoMedido ?? this.infoDetalle.Ancho ?? 0,
                    Corte: null,
                    Tipo: 'Calibración',
                });
                this.onCalcularMetrosReales();
                this.modalCalibracion = false;
            } else {
                this.sweetService.toastWarning('Ingrese todos los datos');
            }
        }
    }

    onDeleteCalibracionAjuste(info: any, key: number) {
        if (info.Corte !== null)
            this.listNuevosCortes.find(item => item.Id === info.Corte).Ajuste = false;
        this.listCalibracionAjustes.splice(key, 1);
    }

    onDeleteCorte(corte: any) {
        this.listNuevosCortes = [... this.listNuevosCortes.filter(item => item.Id !== corte.Id)];
        this.onCalcularMetrosReales();
    }

    onEditCorte(corte: any) {
        this.posCorte = corte.Id;
        this.myFormEditCorte.patchValue({
            "nuevoLargo": corte.Largo,
            "nuevoPeso": corte.PesoReal,
            "existeFalla": corte.Falla,
        });
        this.modalEditCorte = true;
    }

    onSaveEditCorte() {
        if (this.formService.validForm(this.myFormEditCorte)) {
            if (this.myFormEditCorte.value.nuevoPeso !== 0 && this.myFormEditCorte.value.nuevoLargo !== 0) {
                const newCorte = this.listNuevosCortes.find(item => item.Id === this.posCorte);
                //TODO: CAMBAIAR SI ES NECESARIO
                if (
                    newCorte.PesoTeorico * 1.05 >= this.myFormEditCorte.value.nuevoPeso &&
                    newCorte.PesoTeorico * 0.95 <= this.myFormEditCorte.value.nuevoPeso
                ) {
                    newCorte.Largo = this.myFormEditCorte.value.nuevoLargo;
                    newCorte.PesoReal = this.myFormEditCorte.value.nuevoPeso;
                    newCorte.Falla = this.myFormEditCorte.value.existeFalla;

                    this.modalEditCorte = false;
                    this.onCalcularMetrosReales();
                } else {
                    this.sweetService.toastWarning('El peso real no puede superar en + o - el 5% al peso teorico');
                }
            } else {
                this.sweetService.toastWarning('El peso y largo no puede ser 0');
            }
        } else {
            this.sweetService.toastWarning('Ingrese todos los campos');
        }
    }

    onCalcularMetrosReales() {
        const valNuevosCortes = this.listNuevosCortes.reduce((total, item) => {
            return total + ((item.Ancho * item.Largo) / 1000);
        }, 0);
        const valCalibracion = this.listCalibracionAjustes.reduce((total, item) => {
            if (item.Tipo === "Calibración") return total + ((item.Largo * item.Ancho) / 1000);
            else return total + 0;
        }, 0);
        this.m2Distribuidos = valNuevosCortes + valCalibracion;
    }

    onAddCorte() {
        this.modalAddCorte = true;
        this.myFormAddCorte.reset();
    }

    onSaveAddCorte() {
        if (this.formService.validForm(this.myFormAddCorte)) {
            if (this.myFormAddCorte.value.nuevoPeso !== 0) {
                this.listNuevosCortes.push({
                    Id: this.listNuevosCortes.length + 1,
                    Largo: this.myFormAddCorte.value.nuevoLargo,
                    Ancho: this.myFormAddCorte.value.nuevoAncho,
                    PesoTeorico: this.myFormAddCorte.value.nuevoPeso,
                    PesoReal: this.myFormAddCorte.value.nuevoPeso,
                    Falla: this.myFormAddCorte.value.existeFalla,
                });
                this.modalAddCorte = false;
                this.onCalcularMetrosReales();
            } else {
                this.sweetService.toastWarning('El peso no puede ser 0');
            }
        } else {
            this.sweetService.toastWarning('Ingrese todos los campos');
        }
    }

    onCheckMetrosTotales() {
        if (this.blockedSendInfo) return;

        if (this.infoDetalle !== undefined) {
            const valAjustes = this.listCalibracionAjustes.reduce((total, item) => {
                if (item.Tipo === 'Ajuste') return total + (item.Largo * (item.Ancho / 1000));
                else return total + 0;
            }, 0);
            const m2Antiguos = ((this.infoDetalle.Ancho ?? 0) * (this.infoDetalle.Largo ?? 0)) / 1000;

            if (this.m2Reales.toFixed(3) === this.m2Distribuidos.toFixed(3)) {
                if ((m2Antiguos + valAjustes).toFixed(3) == this.m2Distribuidos.toFixed(3)) {
                    if (!this.listNuevosCortes.some(item => item.PesoReal === 0)) {
                        this.onFinalizar();
                    } else {
                        this.sweetService.viewWarning(
                            'Se debe asiganr un valor a los pesos reales en todos los cortes generados, ninguno puede ser 0',
                            'Ok', () => { }
                        );
                    }
                } else {
                    this.sweetService.viewWarning(
                        'El metraje de la bobina o corte no se igual al valor sumando los ajustes',
                        'Ok', () => { }
                    );
                }
            } else {
                this.sweetService.viewWarning(
                    'El metraje cuadrado real es diferente al metraje cuadrado distribuido',
                    'Ok', () => { }
                );
            }
        } else {
            this.sweetService.viewWarning(
                'No se ha podido obtener la información de la bobina o corte',
                'Ok', () => { }
            );
            this.blockedSendInfo = false;
        }
    }

    onFinalizar() {
        if (this.infoDetalle !== undefined) {

            let dataFinalCortes: any[] = [];
            this.listNuevosCortes.forEach(item => {
                if (item.Ajuste) {
                    const ajuste = this.listCalibracionAjustes.find(item2 => item2.Corte === item.Id);
                    dataFinalCortes.push({
                        Corte: {
                            "Ancho": item.Ancho,
                            "Largo": item.Largo - ajuste.Largo,
                            "TotalM2": (((item.Ancho * item.Largo) / 1000) - ((ajuste.Largo * ajuste.Ancho) / 1000)),
                            "PesoMaterial": item.PesoReal,
                            "PesoCono": 0,
                            "PesoTotal": item.PesoReal,
                            "Tipo": "C"
                        },
                        Ajuste: {
                            "Ancho": ajuste.Ancho,
                            "Largo": ajuste.Largo,
                            "TotalM2": ((ajuste.Largo * ajuste.Ancho) / 1000),
                            "PesoMaterial": item.PesoReal,
                            "PesoCono": 0,
                            "PesoTotal": item.PesoReal,
                            "Tipo": "A"
                        },
                        Nuevo: {
                            "Ancho": item.Ancho,
                            "Largo": item.Largo,
                            "TotalM2": ((item.Ancho * item.Largo) / 1000),
                            "PesoMaterial": item.PesoReal,
                            "PesoCono": 0,
                            "PesoTotal": item.PesoReal,
                            "Tipo": "C"
                        },
                    });
                } else {
                    dataFinalCortes.push({
                        Corte: {
                            "Ancho": item.Ancho,
                            "Largo": item.Largo,
                            "TotalM2": ((item.Ancho * item.Largo) / 1000),
                            "PesoMaterial": item.PesoReal,
                            "PesoCono": 0,
                            "PesoTotal": item.PesoReal,
                            "Tipo": "C"
                        },
                        Ajuste: null,
                        Nuevo: null,
                    });
                }
            });
            this.listCalibracionAjustes.forEach(item => {
                if (item.Tipo === 'Calibración') {
                    dataFinalCortes.push({
                        Corte: {
                            "Ancho": item.Ancho,
                            "Largo": item.Largo,
                            "TotalM2": ((item.Ancho * item.Largo) / 1000),
                            "PesoMaterial": 0,
                            "PesoCono": 0,
                            "PesoTotal": 0,
                            "Tipo": "K",
                        },
                        Ajuste: null,
                        Nuevo: null,
                    });
                }
            });
            this.blockedSendInfo = true;
            const parametros = {
                codigo: 1062,
                parametros: {
                    "IdKardex": Number(this.infoDetalle.IdKardex),
                    "Usuario": this.loginService.usuario.UserName,
                    "IdOrdenCorteKardex": Number(this.infoDetalle.IdOrdenCorteKardex),
                    "Cortes": dataFinalCortes,
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'cerrarCorte', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.sweetService.viewSuccess(
                            'Los datos se guardaron correctamente',
                            () => this.apiRouter.navigateByUrl('/home')
                        );
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                        this.blockedSendInfo = false;
                    }
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                    this.blockedSendInfo = false;
                }
            });
        }
    }
}
