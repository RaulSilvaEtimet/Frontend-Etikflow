import { Component, inject } from "@angular/core";
import { TreeNode } from "primeng/api";
import { ApiService } from "src/app/shared/services/api.service";
import { SweetAlertService } from "src/app/shared/services/sweet-alert.service";
import { SeguridadesAdministracionRolInterface } from "../../../interfaces/administracion";
import { SeguridadesModulosAsignacionInterface } from "../../../interfaces/modulos";
import { LoginService } from "src/app/pages/00-login/services/login.service";


@Component({
    selector: 'app-seguridades-modulos-asignacion',
    templateUrl: './asignacion.component.html',
})
export class SeguridadesModulosAsignacionComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    sweetService = inject(SweetAlertService);

    loadingRoles: boolean = false;
    listRoles: SeguridadesAdministracionRolInterface[] = [];
    selectedRol: any | undefined;

    loadingAsignacion: boolean = false;
    listAsiganciones: SeguridadesModulosAsignacionInterface[] = [];
    dataTree: TreeNode[] = [];
    selectedAsignacion: TreeNode<any> | TreeNode<any>[] | any[] | any = [];
    roleId: string = "";

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
                    this.listRoles.map(item => item.RoleName = item.RoleName.substring(14));
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

    onChangeSelectedRol(rol: any) {
        if (rol) {
            this.roleId = rol.RoleId;
            this.loadingRoles = true;
            const parametros = {
                codigo: 13,
                parametros: {
                    "roleid": this.roleId,
                }
            }
            this.apiService.onGetApiExecuteNew(parametros, 'seguridades', 'get', parametros.codigo).subscribe({
                next: (resp: any) => {
                    if (resp.success) {
                        this.listAsiganciones = [...resp.data];
                        this.onCreateTreeStep1();
                        this.onCreateTreeStep2(this.dataTree);
                        this.selectedAsignacion = this.getSelectedNodes(this.dataTree);
                    } else {
                        this.sweetService.viewDanger(parametros.codigo, resp.message);
                    }
                    this.loadingRoles = false;
                }, error: (err) => {
                    this.sweetService.viewDanger(parametros.codigo, err.error);
                    this.loadingRoles = false;
                }
            });
        } else {
            this.listAsiganciones = [];
            this.dataTree = [];
        }
    }

    onCreateTreeStep1() {
        this.listAsiganciones.map((item: any) => {
            item.label = item.Descripcion;
            item.icon = item.Icono;
            item.checked = item.Habilitado;
            item.expanded = true;
            delete item.Descripcion;
            delete item.Icono;
        });
        this.dataTree = [...this.listAsiganciones.filter(elem => elem.IdPadre === 1)];
    }

    onCreateTreeStep2(tree: any[]) {
        tree.map(item => {
            item.children = [...this.listAsiganciones.filter(elem => elem.IdPadre === item.Id)];
            this.onCreateTreeStep2(item.children);
        });
    }

    getSelectedNodes(nodes: TreeNode[]): TreeNode[] {
        let selected: TreeNode[] = [];
        nodes.forEach((node: any) => {
            if (node.checked) {
                selected.push(node);
            }
            if (node.children) {
                selected = selected.concat(this.getSelectedNodes(node.children));
            }
        });
        return selected;
    }

    onSelectedNode(node: any) {
        this.onInsertAsignacion(node.MenuId);
        node.children.forEach((item: any) => {
            this.onInsertAsignacion(item.MenuId);
            this.onSelectedNode(item);
        });
    }

    onInsertAsignacion(menuId: string) {
        const parametros = {
            codigo: 14,
            parametros: {
                "menuid": menuId,
                "roleid": this.roleId,
            },
            infoLog: {
                "Fecha": new Date(),
                "Usuario": this.loginService.usuario.UserName,
                "Evento": "Asignar",
                "Referencia": "Menu",
                "Detalle": null,
                "ServerName": null,
                "UserHostAddress": null,
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'seguridades', 'insert', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {

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

    onUnselectedNode(node: any) {
        this.onDeleteAsignacion(node.MenuId);
        node.children.forEach((item: any) => {
            this.onDeleteAsignacion(item.MenuId);
            this.onUnselectedNode(item);
        });
    }

    onDeleteAsignacion(menuId: string) {
        const parametros = {
            codigo: 15,
            parametros: {
                "menuid": menuId,
                "roleid": this.roleId,
            },
            infoLog: {
                "Fecha": new Date(),
                "Usuario": this.loginService.usuario.UserName,
                "Evento": "Quitar",
                "Referencia": "Menu",
                "Detalle": null,
                "ServerName": null,
                "UserHostAddress": null,
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'seguridades', 'update', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {

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
}
