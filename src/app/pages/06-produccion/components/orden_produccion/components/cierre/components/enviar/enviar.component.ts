import { Component, inject } from '@angular/core';
import { ListMpEnvioInterface, ProduccionOrdenProduccionCierreService } from '../../services/cierre.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';

@Component({
  selector: 'app-produccion-orden-produccion-cierre-enviar',
  templateUrl: './enviar.component.html',
})
export class ProduccionOrdenProduccionCierreCalcularComponent {
  cierreService = inject(ProduccionOrdenProduccionCierreService);
  formService = inject(ReactiveFormsService);
  sweetService = inject(SweetAlertService);
  loginService = inject(LoginService);

  modalEditarEnvio: boolean = false;
  modalMp: boolean = false;

  myFormEditar: FormGroup;
  myFormMp: FormGroup;
  codIntMpEnvio: string = '';

  listUnidadMedida: any[] = ['MILLAR', 'ROLLO', 'UNIDAD'];

  constructor() {
    this.myFormEditar = new FormGroup({
      "fechaInicio": new FormControl('', [Validators.required]),
      "fechaFin": new FormControl('', [Validators.required]),
      "aplicaIva": new FormControl('', [Validators.required]),
      "unidadMedida": new FormControl('', [Validators.required]),
      "cantidadSolicitada": new FormControl('', [Validators.required]),
      "cantidadProducida": new FormControl('', [Validators.required]),
      "numeroHoras": new FormControl('', [Validators.required]),
      "numeroEmpleados": new FormControl('', [Validators.required]),
      "observacion": new FormControl('', [Validators.required]),
    });
    this.myFormMp = new FormGroup({
      "producido": new FormControl('', [Validators.required]),
      "desperdicio": new FormControl('', [Validators.required]),
    });
  }

  onOpenEditarEnvio() {
    this.myFormEditar.reset();
    this.modalEditarEnvio = true;
    if (this.cierreService.infoJSON) {
      this.myFormEditar.patchValue({
        fechaInicio: this.cierreService.infoJSON.OpFechaInicio,
        fechaFin: this.cierreService.infoJSON.OpFechaTerminado,
        aplicaIva: this.cierreService.infoJSON.AplicaIva,
        unidadMedida: this.cierreService.infoJSON.UnidadMedida,
        cantidadSolicitada: this.cierreService.infoJSON.OpCantidadSolicitada,
        cantidadProducida: this.cierreService.infoJSON.OpCantidadProducida,
        numeroHoras: this.cierreService.infoJSON.OpNumeroHoras,
        numeroEmpleados: this.cierreService.infoJSON.OpNumeroEmpleados,
        observacion: this.cierreService.infoJSON.OpObservaciones,
      });
    }
  }

  onSaveEditarEnvio() {
    if (this.formService.validForm(this.myFormEditar)) {
      if (this.cierreService.infoJSON) {
        this.cierreService.infoJSON.OpFechaInicio = this.myFormEditar.value.fechaInicio;
        this.cierreService.infoJSON.OpFechaTerminado = this.myFormEditar.value.fechaFin;
        this.cierreService.infoJSON.AplicaIva = this.myFormEditar.value.aplicaIva;
        this.cierreService.infoJSON.UnidadMedida = this.myFormEditar.value.unidadMedida;
        this.cierreService.infoJSON.OpCantidadSolicitada = this.myFormEditar.value.cantidadSolicitada;
        this.cierreService.infoJSON.OpCantidadProducida = this.myFormEditar.value.cantidadProducida;
        this.cierreService.infoJSON.OpCantidadDesperdicio = (this.myFormEditar.value.cantidadSolicitada - this.myFormEditar.value.cantidadProducida > 0) ? this.myFormEditar.value.cantidadSolicitada - this.myFormEditar.value.cantidadProducida : 0;
        this.cierreService.infoJSON.OpNumeroHoras = this.myFormEditar.value.numeroHoras;
        this.cierreService.infoJSON.OpNumeroEmpleados = this.myFormEditar.value.numeroEmpleados;
        this.cierreService.infoJSON.OpObservaciones = this.myFormEditar.value.observacion;
        this.modalEditarEnvio = false;
      } else {
        this.sweetService.toastWarning('No se ha encontrado la información de la OP');
      }
    } else {
      this.sweetService.toastWarning('Ingrese todos los campos');
    }
  }

  onVerificarDatos(): boolean {
    if (this.cierreService.infoJSON && this.cierreService.infoProdTerm && this.cierreService.infoOP) {
      if (this.cierreService.infoJSON.OpFechaInicio > this.cierreService.infoJSON.OpFechaTerminado) {
        this.sweetService.toastWarning('La fecha de inicio no puede ser mayor o igual a la fecha de terminado');
        return false;
      }

      if (this.cierreService.infoJSON.OpCantidadSolicitada <= 0) {
        this.sweetService.toastWarning('La cantidad solicitada no puede ser menor o igual a 0');
        return false;
      }

      if (this.cierreService.infoJSON.OpCantidadProducida <= 0) {
        this.sweetService.toastWarning('La cantidad producida no puede ser menor o igual a 0');
        return false;
      }

      if (this.cierreService.infoJSON.OpNumeroHoras <= 0) {
        this.sweetService.toastWarning('El numero de horas no puede ser menor o igual a 0');
        return false;
      }

      if (this.cierreService.infoJSON.OpNumeroEmpleados <= 0) {
        this.sweetService.toastWarning('El numero de empleados no puede ser menor o igual a 0');
        return false;
      }

      if (this.cierreService.infoJSON.OpCantidadSolicitada < this.cierreService.infoJSON.OpCantidadProducida) {
        this.sweetService.toastWarning('La cantidad producida no puede ser mayor a la cantidad solicitada');
        return false;
      }

      return true;
    } else {
      this.sweetService.toastWarning('No se ha encontrado la información de la OP');
      return false;
    }

  }

  onEnviarParcial() {
    if (this.onVerificarDatos() && this.cierreService.infoJSON && this.cierreService.infoProdTerm && this.cierreService.infoOP) {
      this.cierreService.blockedSend = true;
      const parametros = {
        codigo: 1169,
        parametros: {
          "FechaRegistro": new Date(),
          "OrdenProduccionRef": this.cierreService.infoOP.SecuencialOrdenProduccion,
          "OrdenProduccion": null,
          "CodigoFinalProductoTerminado": this.cierreService.infoProdTerm.CodigoFinalProductoTerminado,
          "NombreProductoEtimet": this.cierreService.infoProdTerm.NombreProductoEtimet,
          "NumeroLote": `OP-E-${this.cierreService.infoOP.SecuencialOrdenProduccion}`,
          "UnidadMedida": this.cierreService.infoJSON.UnidadMedida,
          "CantidadSolicitada": this.cierreService.infoJSON.OpCantidadSolicitada,
          "OpCantidadProducida": this.cierreService.infoJSON.OpCantidadProducida,
          "FechaInicio": this.cierreService.infoJSON.OpFechaInicio,
          "FechaTerminado": this.cierreService.infoJSON.OpFechaTerminado,
          "CantidadDesperdicio": this.cierreService.infoJSON.OpCantidadDesperdicio,
          "NumeroHoras": this.cierreService.infoJSON.OpNumeroHoras,
          "NumeroEmpleados": this.cierreService.infoJSON.OpNumeroEmpleados,
          "Observaciones": this.cierreService.infoJSON.OpObservaciones,
          "ManoObra": 0,
          "CostoIndirecto": 0,
          "CostoUnitario": 0,
          "AplicaIva": this.cierreService.infoJSON.AplicaIva,
          "OrdenProduccionTaurus": null,
          "FechaEnvio": null,
          "Estado": 1,
          "Cierre": false,
        },
        listValidaciones:
          this.cierreService.listValoresProduccion.filter(item => item.Estado !== 0 && item.IdOrdenProducionCargaInventario === null).map(item => Number(item.IdOrdenProduccionValidacion))
        ,
      };
      this.cierreService.apiService.onGetApiExecuteNew(parametros, 'taurus', 'insertParcialOp', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.sweetService.viewSuccess('Se guardo la información correctamente, en pocos minutos se enviara la información a Taurus', () => {
              window.location.reload();
            });
          } else {
            this.sweetService.viewDanger(parametros.codigo, resp.message);
            this.cierreService.blockedSend = false;
          }
        }, error: (err) => {
          this.sweetService.viewDanger(parametros.codigo, err.error);
          this.cierreService.blockedSend = false;
        }
      });
    }
  }

  onOpenMpEnvio(item: ListMpEnvioInterface) {
    this.myFormMp.reset();
    this.modalMp = true;
    this.codIntMpEnvio = item.CodigoInterno;
    this.myFormMp.patchValue({
      "producido": item.Producido,
      "desperdicio": item.Desperdicio,
    });
  }

  onSaveEditarMp() {
    if (this.formService.validForm(this.myFormMp)) {
      this.cierreService.listMpEnvio.find(item => item.CodigoInterno === this.codIntMpEnvio)!.Producido = this.myFormMp.value.producido;
      this.cierreService.listMpEnvio.find(item => item.CodigoInterno === this.codIntMpEnvio)!.Desperdicio = this.myFormMp.value.desperdicio;
      this.modalMp = false;
    } else {
      this.sweetService.toastWarning('Ingrese todos los datos');
    }
  }

  onEnviarTotal() {
    if (this.onVerificarDatos() && this.cierreService.infoJSON && this.cierreService.infoProdTerm && this.cierreService.infoOP) {
      const checkMp = this.cierreService.listMpEnvio.every(item =>
        Math.abs(item.Liberado - (item.Producido + item.Desperdicio)) < 0.01
      );

      if (checkMp) {
        this.cierreService.blockedSend = true;
        const parametros = {
          codigo: 1169,
          parametros: {
            "FechaRegistro": new Date(),
            "OrdenProduccionRef": this.cierreService.infoOP.SecuencialOrdenProduccion,
            "OrdenProduccion": null,
            "CodigoFinalProductoTerminado": this.cierreService.infoProdTerm.CodigoFinalProductoTerminado,
            "NombreProductoEtimet": this.cierreService.infoProdTerm.NombreProductoEtimet,
            "NumeroLote": `OP-E-${this.cierreService.infoOP.SecuencialOrdenProduccion}`,
            "UnidadMedida": this.cierreService.infoJSON.UnidadMedida,
            "CantidadSolicitada": this.cierreService.infoJSON.OpCantidadSolicitada,
            "OpCantidadProducida": this.cierreService.infoJSON.OpCantidadProducida,
            "FechaInicio": this.cierreService.infoJSON.OpFechaInicio,
            "FechaTerminado": this.cierreService.infoJSON.OpFechaTerminado,
            "CantidadDesperdicio": this.cierreService.infoJSON.OpCantidadDesperdicio,
            "NumeroHoras": this.cierreService.infoJSON.OpNumeroHoras,
            "NumeroEmpleados": this.cierreService.infoJSON.OpNumeroEmpleados,
            "Observaciones": this.cierreService.infoJSON.OpObservaciones,
            "ManoObra": 0,
            "CostoIndirecto": 0,
            "CostoUnitario": 0,
            "AplicaIva": this.cierreService.infoJSON.AplicaIva,
            "OrdenProduccionTaurus": null,
            "FechaEnvio": null,
            "Estado": 1,
            "Cierre": true,
          },
          listValidaciones:
            this.cierreService.listValoresProduccion.filter(item => item.Estado !== 0 && item.IdOrdenProducionCargaInventario === null).map(item => Number(item.IdOrdenProduccionValidacion))
          , extra: {
            'IdOrdenProduccion': this.cierreService.infoOP.IdOrdenProduccion,
            'FechaRegistro': new Date(),
            'Usuario': this.loginService.usuario.UserName
          },
          material: this.cierreService.listMpEnvio,
          paramLog: {
            "FechaRegistro": new Date(),
            "EstadoOP": 6,
            "Observacion": 'Cambio de estado',
            "Usuario": this.loginService.usuario.UserName,
            "IdMaquina": null,
            "IdOrdenProduccion": this.cierreService.infoOP.IdOrdenProduccion,
          }
        };
        this.cierreService.apiService.onGetApiExecuteNew(parametros, 'taurus', 'insertCierreOp', parametros.codigo).subscribe({
          next: (resp: any) => {
            if (resp.success) {
              this.sweetService.viewSuccess('Se guardo la información correctamente, en pocos minutos se enviara la información a Taurus', () => {
                window.location.reload();
              });
            } else {
              this.sweetService.viewDanger(parametros.codigo, resp.message);
              this.cierreService.blockedSend = false;
            }
          }, error: (err) => {
            this.sweetService.viewDanger(parametros.codigo, err.error);
            this.cierreService.blockedSend = false;
          }
        });

      } else {
        this.sweetService.toastWarning('El valor Liberador debe ser la suma del producido más el desperdicio');
      }
    }
  }
}
