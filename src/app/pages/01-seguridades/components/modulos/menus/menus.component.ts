import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TreeNode } from "primeng/api";
import { ApiService } from "src/app/shared/services/api.service";
import { SweetAlertService } from "src/app/shared/services/sweet-alert.service";
import { SeguridadesModulosMenusInterface } from "../../../interfaces/modulos";
import { ReactiveFormsService } from "src/app/shared/services/forms.service";
import { LoginService } from "src/app/pages/00-login/services/login.service";

@Component({
    selector: 'app-seguridades-modulos-menus',
    templateUrl: './menus.component.html',
})
export class SeguridadesModulosMenusComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);

    blocked: boolean = false;

    loadingMenus: boolean = false;
    listMenus: SeguridadesModulosMenusInterface[] = [];
    dataTreeOld: TreeNode[] = [];
    dataTreeNew: TreeNode[] = [];

    modalMenu: boolean = false;
    headerModalCrear: boolean = false;
    myForm: FormGroup;
    idMenu: number = 0;
    idPadre: number = 0;

    constructor() {
        this.myForm = new FormGroup({
            "nombre": new FormControl('', [Validators.required]),
            "icono": new FormControl('', [Validators.required]),
            "ruta": new FormControl('', [Validators.required]),
            "estado": new FormControl('', [Validators.required]),
        });
    }

    ngOnInit() {
        this.onGetAllMenus();
    }

    onGetAllMenus() {
        this.loadingMenus = true;
        const parametros = {
            codigo: 11,
            parametros: {
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'seguridades', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.dataTreeOld = [];
                    this.dataTreeNew = [];
                    this.listMenus = [...resp.data];

                    this.onCreateTreeStep1();
                    this.onCreateTreeStep2(this.dataTreeOld);
                    this.dataTreeNew = this.dataTreeOld;
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingMenus = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingMenus = false;
            }
        });
    }

    onCreateTreeStep1() {
        const lvlUp = [...this.listMenus.filter(item => item.IdPadre === 1)];
        lvlUp.forEach(item => {
            this.dataTreeOld.push({
                data: item,
                children: [],
            });
        });
    }

    onCreateTreeStep2(tree: any[]) {
        tree.map((item: any) => {
            const lvlUp = [...this.listMenus.filter(elem => elem.IdPadre === item.data.Id)];
            lvlUp.forEach(item2 => {
                item.children.push({
                    data: item2,
                    children: [],
                });
            });
            this.onCreateTreeStep2(item.children);
        });

    }

    onOpenModalCreate(menu: any) {
        this.modalMenu = true;
        this.headerModalCrear = true;
        this.myForm.reset();
        if (menu.hasOwnProperty('Id'))
            this.idPadre = menu.Id;
        else
            this.idPadre = 1;
    }

    onOpenModalEdit(menu: any) {
        this.modalMenu = true;
        this.headerModalCrear = false;
        this.idMenu = menu.Id;
        this.myForm.patchValue({
            nombre: menu.Descripcion,
            icono: menu.Icono,
            ruta: menu.Url,
            estado: menu.Habilitado ? 'Activado' : 'Desactivado',
        });
    }

    onSaveOrEdit() {
        if (this.idMenu === 0) {
            this.onSaveMenu();
        } else {
            this.onEditmenu();
        }
    }

    onSaveMenu() {
        if (this.formService.validForm(this.myForm)) {
            this.blocked = true;
            const parametros = {
                codigo: 10,
                parametros: {
                    "idpadre": this.idPadre,
                    "descripcion": this.myForm.value.nombre,
                    "icono": this.myForm.value.icono,
                    "habilitado": this.myForm.value.estado === "Activado" ? true : false,
                    "url": this.myForm.value.ruta,
                },
                infoLog: {
                    "Fecha": new Date(),
                    "Usuario": this.loginService.usuario.UserName,
                    "Evento": "Insert",
                    "Referencia": "Menu",
                    "Detalle": null,
                    "ServerName": null,
                    "UserHostAddress": null,
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'seguridades', 'insert', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.blocked = false;
                        this.sweetService.viewSuccess('Se creo el menú correctamente', () => { });
                        this.modalMenu = false;
                    } else {
                        this.blocked = false;
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                    }
                }, error: (err) => {
                    this.blocked = false;
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                }
            });
        } else {
            this.sweetService.toastWarning('Ingrese todos los parametros');
        }
    }

    onEditmenu() {
        if (this.formService.validForm(this.myForm)) {
            const parametros = {
                codigo: 12,
                parametros: {
                    "id": this.idMenu,
                    "descripcion": this.myForm.value.nombre,
                    "icono": this.myForm.value.icono,
                    "habilitado": this.myForm.value.estado === "Activado" ? true : false,
                    "url": this.myForm.value.ruta,
                },
                infoLog: {
                    "Fecha": new Date(),
                    "Usuario": this.loginService.usuario.UserName,
                    "Evento": "Update",
                    "Referencia": "Menu",
                    "Detalle": null,
                    "ServerName": null,
                    "UserHostAddress": null,
                }
            };
            this.apiService.onGetApiExecuteNew(parametros, 'seguridades', 'update', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.sweetService.viewSuccess('Se modificaron los datos correctamente', () => { });
                        this.onGetAllMenus();
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                        this.loadingMenus = false;
                    }
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                    this.loadingMenus = false;
                }
            });
        } else {
            this.sweetService.toastWarning('Ingrese todos los parametros');
        }
    }
}
