import { Component, inject } from '@angular/core';
import { ProduccionOrdenProduccionCierreService } from '../../services/cierre.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProduccionValoresProduccionInterface } from 'src/app/pages/06-produccion/interfaces/orden_produccion.interface';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-produccion-orden-produccion-cierre-valores-generados',
  templateUrl: './valores_generados.component.html',
})
export class ProduccionOrdenProduccionCierreValoresGeneradosComponent {
  cierreService = inject(ProduccionOrdenProduccionCierreService);
  formService = inject(ReactiveFormsService);
  sweetService = inject(SweetAlertService);
  apiService = inject(ApiService);

  idValorGenerado: number = 0;
  idEstado: number = 0;

  modalValores: boolean = false;
  myFormValores: FormGroup;
  modalEstado: boolean = false;
  myFormEstado: FormGroup;

  constructor() {
    this.myFormValores = new FormGroup({
      "materiaPrima": new FormControl('', [Validators.required]),
      "calibracion": new FormControl('', [Validators.required]),
      "metrosMP": new FormControl('', [Validators.required]),
      "anchoMP": new FormControl('', [Validators.required]),
      "cantProducida": new FormControl(''),
    });
    this.myFormEstado = new FormGroup({
      "estado": new FormControl('', [Validators.required]),
    });
  }

  onOpenValores(info: ProduccionValoresProduccionInterface) {
    this.idValorGenerado = Number(info.IdOrdenProduccionValidacion);
    this.modalValores = true;
    this.onSelectMaquina(info.Maquina);
    this.myFormValores.patchValue({
      "materiaPrima": this.cierreService.listMPLiberadoTipInv.find(item => item.CodigoInterno === info.CodigoMaterial),
      "calibracion": info.ValorMetrosCalibracion,
      "metrosMP": info.MetroLineal,
      "anchoMP": info.Ancho,
      "cantProducida": info.CantidadProduccion,
    });
  }

  onSelectMaquina(maquina: string) {
    if (
      maquina === 'MARK ANDY' || maquina === 'WEIGANG' ||
      maquina === 'DEPAI' || maquina === 'TROQUELADORA PLANA 1' ||
      maquina === 'TROQUELADORA PLANA 2') {
      this.myFormValores.get('cantProducida')?.clearValidators();
    } else {
      this.myFormValores.get('cantProducida')?.setValidators([Validators.required]);
    }
    this.myFormValores.get('cantProducida')?.updateValueAndValidity();
  }

  onEditValores() {
    this.cierreService.blockedSend = true;
    if (this.formService.validForm(this.myFormValores)) {
      const parametros = {
        codigo: 1168,
        parametros: {
          "IdOrdenProduccionValidacion": this.idValorGenerado,
          "FechaRegistro": null,
          "IdMaquina": null,
          "IdOrdenProduccion": null,
          "CodigoMaterial": this.myFormValores.value.materiaPrima.CodigoInterno,
          "DescripcionMaterial": this.myFormValores.value.materiaPrima.NombreTipoInventario,
          "Usuario": null,
          "MetroLineal": this.myFormValores.value.metrosMP,
          "Ancho": this.myFormValores.value.anchoMP,
          "M2": (this.myFormValores.value.metrosMP * (this.myFormValores.value.anchoMP / 1000)),
          "ValorMetrosCalibracion": this.myFormValores.value.calibracion,
          "CantidadProduccion": this.myFormValores.value.cantProducida,
          "Estado": null,
          "IdOrdenProducionCargaInventario": null
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'update', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.sweetService.toastSuccess('Se actualizo correctamente');
            this.modalValores = false;
            this.cierreService.onGetInfoAllOP(this.cierreService.infoOP!.IdOrdenProduccion);
          } else {
            this.sweetService.viewDanger(parametros.codigo, resp.message);
          }
          this.cierreService.blockedSend = false;
        }, error: (err) => {
          this.sweetService.viewDanger(parametros.codigo, err.error);
          this.cierreService.blockedSend = false;
        }
      });
    } else {
      this.sweetService.toastWarning('Ingrese todos los campos requeridos');
      this.cierreService.blockedSend = false;
    }
  }

  onOpenEstado(info: ProduccionValoresProduccionInterface) {
    this.modalEstado = true;
    this.myFormEstado.reset();
    this.idEstado = Number(info.IdOrdenProduccionValidacion);
  }

  onEditEstado() {
    this.cierreService.blockedSend = true;
    if (this.formService.validForm(this.myFormEstado)) {
      const parametros = {
        codigo: 1168,
        parametros: {
          "IdOrdenProduccionValidacion": this.idEstado,
          "FechaRegistro": null,
          "IdMaquina": null,
          "IdOrdenProduccion": null,
          "CodigoMaterial": null,
          "DescripcionMaterial": null,
          "Usuario": null,
          "MetroLineal": null,
          "Ancho": null,
          "M2": null,
          "ValorMetrosCalibracion": null,
          "CantidadProduccion": null,
          "Estado": this.myFormEstado.value.estado,
          "IdOrdenProducionCargaInventario": null
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'update', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.sweetService.toastSuccess('Se actualizo correctamente');
            this.modalEstado = false;
            this.cierreService.onGetInfoAllOP(this.cierreService.infoOP!.IdOrdenProduccion);
          } else {
            this.sweetService.viewDanger(parametros.codigo, resp.message);
          }
          this.cierreService.blockedSend = false;
        }, error: (err) => {
          this.sweetService.viewDanger(parametros.codigo, err.error);
          this.cierreService.blockedSend = false;
        }
      });
    } else {
      this.sweetService.toastWarning('Ingrese todos los campos requeridos');
      this.cierreService.blockedSend = false;
    }
  }
}
