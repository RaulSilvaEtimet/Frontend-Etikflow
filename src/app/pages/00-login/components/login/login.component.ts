import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  apiService = inject(ApiService);
  apiRouter = inject(Router);
  loginService = inject(LoginService);
  sweetService = inject(SweetAlertService);
  formService = inject(ReactiveFormsService);

  version: string = environment.version;

  search: boolean = false;
  myformLogin: FormGroup;

  constructor() {
    this.myformLogin = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'userpass': new FormControl('', [Validators.required]),
    });
  }

  onSendLogin() {
    if (this.formService.validForm(this.myformLogin)) {
      const parametros = {
        "codigo": 1,
        "parametros": {
          "usuario": this.myformLogin.value.username,
          "clave": this.myformLogin.value.userpass
        }
      }
      this.search = true;
      this.apiService.onGetApiUser(parametros, 'loginUser').subscribe({
        next: (resp) => {
          if (resp.success) {
            if (resp.data[0].RoleName) {
              localStorage.setItem('token', resp.data[0].Token);
              this.loginService.usuario = { ...resp.data[0] };
              this.apiRouter.navigateByUrl('home');
            } else {
              this.sweetService.viewDanger(parametros.codigo, 'USUARIO SIN ROL ASIGNADO');
            }
          } else {
            this.search = false;
            this.sweetService.viewDanger(parametros.codigo, resp.message);
          }
        }, error: (err) => {
          this.search = false;
          this.sweetService.viewDanger(parametros.codigo, err.error);
        }
      });
    } else {
      this.sweetService.toastWarning('Ingrese todos los campos');
    }
  }
}
