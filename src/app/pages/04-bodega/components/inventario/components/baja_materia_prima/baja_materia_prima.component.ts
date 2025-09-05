import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "src/app/pages/00-login/services/login.service";
import { BodegaInventarioKardexInterface } from "src/app/pages/04-bodega/interfaces/inventario";
import { ApiService } from "src/app/shared/services/api.service";
import { ReactiveFormsService } from "src/app/shared/services/forms.service";
import { SweetAlertService } from "src/app/shared/services/sweet-alert.service";
import Swal from "sweetalert2";

@Component({
    selector: 'app-bodega-inventario-baja-materia-prima',
    templateUrl: './baja_materia_prima.component.html',
})
export class BodegaInventarioBajaMPComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);
    apiRouter = inject(Router);

    blockedSend: boolean = false;
    blockedGet: boolean = false;

    myFormSearchMp: FormGroup;

    infoKardex: BodegaInventarioKardexInterface | undefined;

    modalOpTaurus: boolean = false;
    myFormTaurus: FormGroup;

    constructor() {
        this.myFormSearchMp = new FormGroup({
            "codigoBarras": new FormControl('', [Validators.required]),
        });
        this.myFormTaurus = new FormGroup({
            "numOP": new FormControl('', [Validators.required]),
        });
    }

    onSearchInfoKardex() {
        this.blockedGet = true;
        if (this.formService.validForm(this.myFormSearchMp)) {
            const parametros = {
                codigo: 1046,
                parametros: {
                    "FechaInicio": null,
                    "FechaFin": null,
                    "CodigoInterno": null,
                    "CodigoBarras": this.myFormSearchMp.value.codigoBarras,
                    "IdInventario": null,
                    "IdCompra": null,
                    "TipoKardex": null,
                    "IdEstado": 9,
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'get', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        if (resp.data.length === 1) {
                            this.infoKardex = { ...resp.data[0] };
                        } else {
                            this.sweetService.viewWarning('El código de barras ya no esta disponible para dar de baja', 'Ok', () => { });
                        }
                        this.blockedGet = false;
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                        this.blockedGet = false;
                    }
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                    this.blockedGet = false;
                }
            });
        } else {
            this.sweetService.toastWarning('Ingrese todos los campos');
            this.blockedGet = false;
        }

    }

    onBajaMP(idEstado: number) {
        if (this.infoKardex !== undefined) {
            Swal.fire({
                title: "Estas seguro de dar de baja a este codigo de barras",
                showDenyButton: true,
                confirmButtonText: "Si",
                denyButtonText: "No",
                confirmButtonColor: "green",
            }).then((result) => {
                if (result.isConfirmed) {
                    this.blockedSend = true;
                    const parametros = {
                        codigo: 1164,
                        parametros: {
                            "CodigoBarras": this.infoKardex?.CodigoBarras ?? '',
                            "IdEstado": idEstado,
                        }, infoLog: {
                            "Fecha": new Date(),
                            "Usuario": this.loginService.usuario.UserName,
                            "Evento": "Baja MP",
                            "Referencia": "Baja MP",
                            "Detalle": this.infoKardex?.CodigoBarras ?? '',
                            "ServerName": null,
                            "UserHostAddress": null,
                        }
                    };
                    this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'insertInfoLog', parametros.codigo).subscribe({
                        next: (resp: any) => {
                            if (resp.success) {
                                this.sweetService.viewSuccess('Código de barras dado de baja', () => {
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
                }
            });
        } else {
            this.sweetService.toastWarning('La información del kardex esta vacia');
        }
    }

    onBajaOpTaurus() {
        this.myFormTaurus.reset();
        this.modalOpTaurus = true;
    }

    onSaveOpTaurus(idEstado: number) {
        if (this.formService.validForm(this.myFormTaurus)) {
            Swal.fire({
                title: "Estas seguro de dar de baja a este codigo de barras",
                showDenyButton: true,
                confirmButtonText: "Si",
                denyButtonText: "No",
                confirmButtonColor: "green",
            }).then((result) => {
                if (result.isConfirmed) {
                    this.blockedSend = true;
                    const parametros = {
                        codigo: 1164,
                        parametros: {
                            "CodigoBarras": this.infoKardex?.CodigoBarras ?? '',
                            "IdEstado": idEstado,
                        }, infoLog: {
                            "Fecha": new Date(),
                            "Usuario": this.loginService.usuario.UserName,
                            "Evento": "Baja MP Taurus",
                            "Referencia": "Baja MP Taurus",
                            "Detalle": `${this.infoKardex?.CodigoBarras ?? ''}-${this.myFormTaurus.value.numOP}`,
                            "ServerName": null,
                            "UserHostAddress": null,
                        }
                    };
                    this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'insertInfoLog', parametros.codigo).subscribe({
                        next: (resp: any) => {
                            if (resp.success) {
                                this.sweetService.viewSuccess('Código de barras dado de baja', () => {
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
                }
            });
        } else {
            this.sweetService.toastWarning('Ingrese todos los campos');
        }
    }
}
