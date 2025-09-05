import { Component, inject, OnInit } from '@angular/core';
import { LoginSearchInterfaceData } from 'src/app/pages/00-login/interfaces/login.interface';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { MenuSearchInterfaceData } from '../../interfaces/modulos.interface';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',

})
export class HomeComponent implements OnInit {
  sweetService = inject(SweetAlertService);

  usuario!: LoginSearchInterfaceData;
  modulos: MenuSearchInterfaceData[] = [];
  apiService = inject(ApiService);
  apiRouter = inject(Router);
  url: string = environment.apiRest;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.usuario = this.loginService.usuario;
    this.onGetModulos();
  }

  onGetModulos() {

    const parametros = {
      codigo: 3,
      parametros: {
        "rol": this.usuario.RoleName,
        "url": null
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'home', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modulos = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
      }, error: (err: any) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
      }
    });
  }

  seleccionarModulo(modulo: MenuSearchInterfaceData) {
    this.apiRouter.navigateByUrl(modulo.Url);
  }

  onCerrarSesion() {
    localStorage.clear();
    this.apiRouter.navigateByUrl('/');
  }
}
