import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Table } from "primeng/table";
import { ApiService } from "src/app/shared/services/api.service";
import { ReactiveFormsService } from "src/app/shared/services/forms.service";
import { SweetAlertService } from "src/app/shared/services/sweet-alert.service";
import Swal from "sweetalert2";
import { SeguridadesAdministracionRolInterface, SeguridadesAdministracionUsuarioInterface } from "../../../interfaces/administracion";
import { LoginService } from "src/app/pages/00-login/services/login.service";


@Component({
    selector: 'app-seguridades-administracion-usuarios',
    templateUrl: './usuarios.component.html'
})
export class SeguridadesAdministracionUsuariosComponent {
    apiService = inject(ApiService);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);
    loginService = inject(LoginService);

    blockedPanel: boolean = false;

    loadingUser: boolean = false;
    modalCreateUser: boolean = false;
    modalEditUser: boolean = false;
    listUser: SeguridadesAdministracionUsuarioInterface[] = [];
    myFormCreateUser: FormGroup;
    myFormEditUser: FormGroup;
    searchValue: string | undefined;
    userName: string = "";

    loadingRol: boolean = false;
    listRol: SeguridadesAdministracionRolInterface[] = [];
    appName: string = "";
    modalAsigancion: boolean = false;
    myFormRol: FormGroup;

    constructor() {
        this.myFormCreateUser = new FormGroup({
            "usuario": new FormControl('', [Validators.required]),
            "email": new FormControl('', [Validators.required]),
        });
        this.myFormEditUser = new FormGroup({
            "email": new FormControl('', [Validators.required]),
            "bloqueado": new FormControl('', [Validators.required]),
            "aprobado": new FormControl('', [Validators.required]),
        });
        this.myFormRol = new FormGroup({
            "rol": new FormControl('', [Validators.required]),
        });
    }

    ngOnInit(): void {
        this.onGetAllUser();
        this.onGetAllRol();
    }

    onGetAllUser() {
        this.loadingUser = true;
        const parametros = {
            codigo: 16,
            parametros: {
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'seguridades', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listUser = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingUser = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingUser = false;
            }
        });
    }

    onGetAllRol() {
        this.loadingRol = true;
        const parametros = {
            codigo: 7,
            parametros: {
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'seguridades', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listRol = [...resp.data];
                    this.appName = this.listRol[0].RoleName.split('.')[0];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingRol = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingRol = false;
            }
        });
    }

    onCreateUser() {
        this.myFormCreateUser.reset();
        this.modalCreateUser = true;
    }

    onInsertUser() {
        if (this.formService.validForm(this.myFormCreateUser)) {
            this.blockedPanel = true;
            const parametros = {
                codigo: 20,
                parametros: {
                    "username": this.myFormCreateUser.value.usuario,
                    "email": this.myFormCreateUser.value.email
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'seguridades', 'create', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.sweetService.viewSuccess('Usuario creado correctamente', () => { });
                        this.modalCreateUser = false;
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
            this.sweetService.toastWarning('Ingrese todos los parametros');
        }
    }

    onEditUser(user: SeguridadesAdministracionUsuarioInterface) {
        this.modalEditUser = true;
        this.userName = user.UserName;
        this.myFormEditUser.patchValue({
            "email": user.Email,
            "bloqueado": user.IsLockedOut,
            "aprobado": user.IsApproved,
        });
    }

    onUpdateUser() {
        if (this.formService.validForm(this.myFormEditUser)) {
            this.blockedPanel = true;
            const parametros = {
                codigo: 6,
                parametros: {
                    "username": this.userName,
                    "isapproved": this.myFormEditUser.value.aprobado,
                    "islockedout": this.myFormEditUser.value.bloqueado,
                    "email": this.myFormEditUser.value.email,
                },
                infoLog: {
                    "Fecha": new Date(),
                    "Usuario": this.loginService.usuario.UserName,
                    "Evento": "Update",
                    "Referencia": "User",
                    "Detalle": null,
                    "ServerName": null,
                    "UserHostAddress": null,
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'seguridades', 'update', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.sweetService.viewSuccess('Se modifico el usuario correctamente', () => { });
                        this.modalEditUser = false;
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
            this.sweetService.toastWarning('Ingrese todos los parametros');
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onSetPassUser(userName: string) {
        Swal.fire({
            title: "Estas seguro de reiniciar la contraseña",
            showDenyButton: true,
            confirmButtonText: "Si",
            denyButtonText: "No",
            confirmButtonColor: "green",
        }).then((result) => {
            if (result.isConfirmed) {
                this.blockedPanel = true;
                const parametros = {
                    codigo: 4,
                    parametros: {
                        "usuario": userName
                    }
                }
                this.apiService.onGetApiExecuteNew(parametros, 'seguridades', 'set', parametros.codigo).subscribe({
                    next: (resp: any) => {
                        if (resp.success) {
                            this.sweetService.viewSuccess('La clave se modifico correctamente', () => { });
                            this.blockedPanel = false;
                        } else {
                            this.sweetService.viewDanger(parametros.codigo, resp.message);
                            this.blockedPanel = false;
                        }
                    }, error: (err) => {
                        this.sweetService.viewDanger(parametros.codigo, err.error);
                        this.blockedPanel = false;
                    }
                });
            }
        });
    }

    onAsignarRol(user: SeguridadesAdministracionUsuarioInterface) {
        this.modalAsigancion = true;
        this.userName = user.UserId;
        this.myFormRol.patchValue({
            rol: user.RoleId,
        });
    }

    onInsertAsignacion() {
        if (this.formService.validForm(this.myFormRol)) {
            this.blockedPanel = true;
            const parametros = {
                codigo: 17,
                parametros: {
                    "userid": this.userName,
                    "roleid": this.myFormRol.value.rol,
                },
                infoLog: {
                    "Fecha": new Date(),
                    "Usuario": this.loginService.usuario.UserName,
                    "Evento": "Insert",
                    "Referencia": "User",
                    "Detalle": null,
                    "ServerName": null,
                    "UserHostAddress": null,
                }
            }
            this.apiService.onGetApiExecuteNew(parametros, 'seguridades', 'execute', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.modalAsigancion = false;
                        this.sweetService.viewSuccess('Rol Asignado', () => { });
                        this.myFormRol.reset();
                        this.ngOnInit();
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                    }
                    this.blockedPanel = false;
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                }
            });
        } else {
            this.sweetService.toastWarning('Ingrese todos los parametros');
        }
    }
}
