import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { ProduccionOrdenProduccionCierreService } from './services/cierre.service';



@Component({
  selector: 'app-produccion-orden-produccion-cierre',
  templateUrl: './cierre.component.html',
})
export class ProduccionOrdenProduccionCierreComponent {
  apiService = inject(ApiService);
  loginService = inject(LoginService);
  sweetService = inject(SweetAlertService);
  formService = inject(ReactiveFormsService);
  cierreService = inject(ProduccionOrdenProduccionCierreService);

  myFormOp: FormGroup;

  constructor() {
    this.myFormOp = new FormGroup({
      "numOp": new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.cierreService.onResetService();
  }

  onSearchOP() {
    this.cierreService.blockedGet = true;
    if (this.formService.validForm(this.myFormOp)) {
      this.cierreService.onResetService();
      this.cierreService.onGetOrdenProduccion(this.myFormOp.value.numOp);
    } else {
      this.sweetService.toastWarning('Ingrese el numero de OP');
      this.cierreService.blockedGet = false;
    }
  }
}
