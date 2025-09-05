import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Table } from "primeng/table";
import { LoginService } from "src/app/pages/00-login/services/login.service";
import { ApiService } from "src/app/shared/services/api.service";
import { SweetAlertService } from "src/app/shared/services/sweet-alert.service";
import { AdministracionPersonalCargosInterface } from "../../../interfaces/personal.interface";
import { ReactiveFormsService } from "src/app/shared/services/forms.service";

@Component({
    selector: 'app-administracion-personal-cargos',
    templateUrl: './cargos.component.html',
})
export class AdministracionPersonalCargosComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);

    blocked: boolean = false;

    loadingCargos: boolean = false;
    headerModalCrear: boolean = false;
    modalCargos: boolean = false;
    idCargo: number = 0;
    listCargos: AdministracionPersonalCargosInterface[] = [];
    myForm: FormGroup;
    searchValue: string | undefined;

    constructor() {
        this.myForm = new FormGroup({
            "cargos": new FormControl('', [Validators.required])
        });
    }

    ngOnInit(): void {
        this.onGetAllCargos();
    }

    onGetAllCargos() {
        this.loadingCargos = true;
        const parametros = {
            codigo: 1002,
            parametros: {
                "idcargo": null,
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listCargos = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingCargos = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingCargos = false;
            }
        });
    }

    onOpenModalCreate() {
        this.modalCargos = true;
        this.headerModalCrear = true;
        this.idCargo = 0;
        this.myForm.reset();
    }

    onOpenModalEdit(cargo: any) {
        this.modalCargos = true;
        this.headerModalCrear = false;
        this.idCargo = Number(cargo.IdCargo);
        this.myForm.patchValue({
            cargos: cargo.NombreCargo,
        });
    }

    onSaveOrEdit() {
        if (this.idCargo === 0) {
            this.onSaveCargo();
        } else {
            this.onEditCargo();
        }
    }

    onSaveCargo() {
        if (this.formService.validForm(this.myForm)) {
            this.blocked = true;
            const parametros = {
                codigo: 1001,
                parametros: {
                    "nombrecargo": this.myForm.value.cargos.toUpperCase(),
                },
                infoLog: {
                    "Fecha": new Date(),
                    "Usuario": this.loginService.usuario.UserName,
                    "Evento": "Insert",
                    "Referencia": "Cargo",
                    "Detalle": null,
                    "ServerName": null,
                    "UserHostAddress": null,
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.modalCargos = false;
                        this.sweetService.viewSuccess('Se creo el cargo correctamente', () => { });
                        this.onGetAllCargos();
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                    }
                    this.blocked = false;
                }, error: (err) => {
                    this.blocked = false;
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                }
            });
        } else {
            this.sweetService.toastWarning('Ingrese todos los parametros');
        }
    }

    onEditCargo() {
        if (this.formService.validForm(this.myForm)) {
            this.blocked = true;
            const parametros = {
                codigo: 1003,
                parametros: {
                    "idcargo": this.idCargo,
                    "nombrecargo": this.myForm.value.cargos.toUpperCase(),
                },
                infoLog: {
                    "Fecha": new Date(),
                    "Usuario": this.loginService.usuario.UserName,
                    "Evento": "Update",
                    "Referencia": "Cargo",
                    "Detalle": this.idCargo,
                    "ServerName": null,
                    "UserHostAddress": null,
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.modalCargos = false;
                        this.sweetService.viewSuccess('Se modifico el cargo correctamente', () => { });
                        this.onGetAllCargos();
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                    }
                    this.blocked = false;
                }, error: (err) => {
                    this.blocked = false;
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                }
            });
        } else {
            this.sweetService.toastWarning('Ingrese todos los parametros');
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
