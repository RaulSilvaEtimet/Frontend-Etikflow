import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {
  private toastService = inject(MessageService);

  viewSuccess(sms: string, funcion: Function) {
    Swal.fire({
      title: 'Correcto',
      text: sms,
      icon: 'success',
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonColor: 'green'
    }).then((result) => {
      funcion(result);
    });
  }

  viewWarning(sms: string, btn: string, funcion: Function) {
    Swal.fire({
      title: 'Alerta',
      text: sms,
      titleText: `Atención`,
      icon: 'warning',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: true,
      confirmButtonText: btn,
    }).then((result) => {
      funcion(result);
    });
  }

  viewDanger(codigo: number, sms: string = 'Problemas al conectar con la API') {
    Swal.fire({
      title: 'Error',
      text: sms,
      titleText: `Error #${codigo}`,
      icon: 'error',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonColor: '#dc3741',
      cancelButtonText: 'Salir'
    });
  }

  toastWarning(sms: string) {
    this.toastService.add({
      severity: 'warn',
      summary: 'Alerta',
      detail: sms,
    });
  }

  toastSuccess(sms: string) {
    this.toastService.add({
      severity: 'success',
      summary: 'Correcto',
      detail: sms,
    });
  }
}
