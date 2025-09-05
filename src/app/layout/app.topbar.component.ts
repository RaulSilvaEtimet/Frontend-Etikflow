import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AppSidebarComponent } from './app.sidebar.component';
import { LoginService } from '../pages/00-login/services/login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../shared/services/api.service';
import { Router } from '@angular/router';
import { SweetAlertService } from '../shared/services/sweet-alert.service';
import { ReactiveFormsService } from '../shared/services/forms.service';


@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopbarComponent implements OnInit {
    apiService = inject(ApiService);
    apiRouter = inject(Router);
    loginService = inject(LoginService);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);

    modalChangePassword: boolean = false;
    myForm: FormGroup;
    loadingChangepass: boolean = false;
    usuarioLogeado: string = "";

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;

    constructor(
        public layoutService: LayoutService,
        public el: ElementRef,
    ) {
        this.myForm = new FormGroup({
            "changePassOld": new FormControl('', [Validators.required]),
            "changePassNew": new FormControl('', [Validators.required]),
            "changePassRep": new FormControl('', [Validators.required]),
        });
    }

    ngOnInit(): void {
        this.onGetUserName();
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onProfileButtonClick() {
        this.layoutService.showRightMenu();
    }

    onSearchClick() {
        this.layoutService.toggleSearchBar();
    }

    onRightMenuClick() {
        this.layoutService.showRightMenu();
    }

    get logo() {
        const logo =
            this.layoutService.config().menuTheme === 'white' ||
                this.layoutService.config().menuTheme === 'orange'
                ? 'dark'
                : 'white';
        return logo;
    }

    onOpenDialogChangePass() {
        this.myForm.reset();
        this.modalChangePassword = true;
    }

    onCloseDialogChangePass() {
        this.myForm.reset();
        this.modalChangePassword = false;
    }

    onSaveChangePass() {
        if (this.formService.validForm(this.myForm)) {
            if (this.myForm.value.changePassNew === this.myForm.value.changePassRep) {
                this.loadingChangepass = true;
                const parametros = {
                    codigo: 5,
                    parametros: {
                        "usuario": this.loginService.usuario.UserName,
                        "claveOld": this.myForm.value.changePassOld,
                        "claveNew": this.myForm.value.changePassNew,
                    }
                }
                this.apiService.onGetApiExecuteNew(parametros, "home", 'reset', parametros.codigo).subscribe({
                    next: (resp: any) => {
                        if (resp.success) {
                            this.sweetService.viewSuccess('La contraseña se modifico correctamente', () => { });
                            setTimeout(() => {
                                localStorage.clear();
                                this.apiRouter.navigateByUrl('/');
                            }, 1500);
                        } else {
                            this.sweetService.viewDanger(parametros.codigo, resp.message);
                            this.loadingChangepass = false;
                        }

                    }, error: (err) => {
                        this.sweetService.viewDanger(parametros.codigo, err.error);
                        this.loadingChangepass = false;
                    }
                });
            } else {
                this.sweetService.toastWarning('La contraseña de verificacion no es igual');
            }
        } else {
            this.sweetService.toastWarning('Ingrese todos los parametros');
        }
    }

    onCerrarSesion() {
        localStorage.clear();
        this.apiRouter.navigateByUrl('/');
    }

    onGetUserName() {
        const parametros = {
            codigo: 1008,
            parametros: {
                "usuario": this.loginService.usuario.UserName,
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'home', 'userName', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    if (resp.data.length !== 0)
                        this.usuarioLogeado = resp.data[0].UsuarioLogueado;
                    else
                        this.usuarioLogeado = this.loginService.usuario.UserName;
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
            }
        });
    }
}
