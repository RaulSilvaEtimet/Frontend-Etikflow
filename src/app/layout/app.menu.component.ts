import { inject, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LoginService } from '../pages/00-login/services/login.service';
import { ApiService } from '../shared/services/api.service';
import { Router } from '@angular/router';
import { SweetAlertService } from '../shared/services/sweet-alert.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {
    apiService = inject(ApiService);
    apiRouter = inject(Router);
    loginService = inject(LoginService);
    sweetService = inject(SweetAlertService);
    menus: any[] = [];

    ngOnInit() {
        this.onGetSubMenu();
    }

    onGetSubMenu() {
        const rutas = this.apiRouter.url.split('/');
        const parametros = {
            codigo: 3,
            parametros: {
                "rol": this.loginService.usuario.RoleName,
                "url": rutas[1]
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'home', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    if (resp.data.length !== 0)
                        this.onConvertModulo(resp.data);
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
            }
        });
    }

    onConvertModulo(data: any[]) {
        data.map(item => {
            delete item.Habilitado;
            delete item.MenuId;
            delete item.Posicion;
        })
        const separator: any = { separator: true };
        const lvlUp = data.reduce((previous, current) => {
            return current.IdPadre < previous.IdPadre ? current : previous;
        });
        data.map(item => {
            item.label = item.Descripcion;
            item.icon = item.Icono;
            item.routerLink = item.Url;
            delete item.Descripcion;
            delete item.Icono;
            delete item.Url;
        });
        data.forEach(item => {
            if (item.IdPadre === lvlUp.IdPadre) {
                item.items = [];
                this.menus.push(item);
                this.menus.push(separator);
            }
        });
        this.menus.forEach(item => {
            if (!item.hasOwnProperty("separator")) {
                const lvl2 = data.filter(element => element.IdPadre === item.Id);
                lvl2.map(element => element.routerLink = `${item.routerLink}/${element.routerLink}`);
                item.items = [...lvl2];
            }
        });
    }

    onCheckPermisos(rutas: string[], data: any[]) {
        rutas.forEach((item, key) => {
            if (key > 1) {
                const op = data.filter(elem => elem.routerLink === item);
                if (op.length === 0)
                    this.apiRouter.navigate(['/home']);
            }
        });
    }
}
