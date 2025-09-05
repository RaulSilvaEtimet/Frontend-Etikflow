import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Table } from "primeng/table";
import { ApiService } from "src/app/shared/services/api.service";
import { SweetAlertService } from "src/app/shared/services/sweet-alert.service";
import { SeguridadesAdministracionRolInterface } from "../../../interfaces/administracion";
import { ReactiveFormsService } from "src/app/shared/services/forms.service";
import { LoginService } from "src/app/pages/00-login/services/login.service";

@Component({
    selector: 'app-seguridades-administracion-roles',
    templateUrl: './roles.component.html'
})
export class SeguridadesAdministracionRolesComponent {
    apiService = inject(ApiService);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);
    loginService = inject(LoginService);

    blocked: boolean = false;

    loadingRoles: boolean = false;
    headerModal: boolean = false;
    modalRol: boolean = false;
    idRol: string = "";
    appName: string = "";
    listRoles: SeguridadesAdministracionRolInterface[] = [];
    myForm: FormGroup;
    searchValue: string | undefined;

    constructor() {
        this.myForm = new FormGroup({
            "rol": new FormControl('', [Validators.required])
        });
    }

    ngOnInit(): void {
        this.onGetAllRoles();
    }

    onGetAllRoles() {
        this.loadingRoles = true;
        const parametros = {
            codigo: 7,
            parametros: {
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'seguridades', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listRoles = [...resp.data];
                    this.appName = this.listRoles[0].RoleName.split('.')[0];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingRoles = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingRoles = false;
            }
        });
    }

    onOpenModalCreate() {
        this.modalRol = true;
        this.headerModal = true;
        this.idRol = "";
        this.myForm.reset();
    }

    onOpenModalEdit(rol: any) {
        this.modalRol = true;
        this.headerModal = false;
        this.idRol = rol.RoleId,
            this.myForm.patchValue({
                rol: rol.RoleName.split('.')[1],
            });
    }

    onSaveOrEdit() {
        if (this.idRol === "") {
            this.onSaveRol();
        } else {
            this.onEditRol();
        }
    }

    onSaveRol() {
        if (this.formService.validForm(this.myForm)) {
            this.blocked = true;
            const parametros = {
                codigo: 8,
                parametros: {
                    "rolename": this.myForm.value.rol,
                },
                infoLog: {
                    "Fecha": new Date(),
                    "Usuario": this.loginService.usuario.UserName,
                    "Evento": "Insert",
                    "Referencia": "Rol",
                    "Detalle": null,
                    "ServerName": null,
                    "UserHostAddress": null,
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'seguridades', 'insert', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.blocked = false;
                        this.sweetService.viewSuccess('Se creo el rol correctamente', () => { });
                        this.modalRol = false;
                        this.onGetAllRoles();
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                        this.blocked = false;
                    }
                }, error: (err) => {
                    this.blocked = false;
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                }
            });
        } else {
            this.sweetService.toastWarning('Ingrese todos los campos');
        }
    }

    onEditRol() {
        if (this.formService.validForm(this.myForm)) {
            this.blocked = true;
            const parametros = {
                codigo: 9,
                parametros: {
                    "roleid": this.idRol,
                    "rolename": this.appName + '.' + this.myForm.value.rol,
                },
                infoLog: {
                    "Fecha": new Date(),
                    "Usuario": this.loginService.usuario.UserName,
                    "Evento": "Update",
                    "Referencia": "Rol",
                    "Detalle": null,
                    "ServerName": null,
                    "UserHostAddress": null,
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'seguridades', 'update', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.blocked = false;
                        this.sweetService.viewSuccess('Se modifico el rol correctamente', () => { });
                        this.modalRol = false;
                        this.onGetAllRoles();
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.data);
                        this.blocked = false;
                    }
                }, error: (err) => {
                    this.blocked = false;
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                }
            });
        } else {
            this.sweetService.toastWarning('Ingrese todos los campos');
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
