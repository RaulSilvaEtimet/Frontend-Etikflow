import { Injectable, signal, WritableSignal } from '@angular/core';
import { ServicioTecnicoOrdenEquiposInterface } from '../interfaces/interfaces';
import { WebcamImage } from 'ngx-webcam';

@Injectable({
  providedIn: 'root'
})
export class OrdenServicioTecnicoService {
  listaVerificacion: string[] = ['Platen Roller', 'Cabezal', 'Sensor de etiquetas', 'Conexión eléctrico', 'Sensor de cinta', 'Sistema de manejo', ' Panel de Control'];

  dataEquipos: WritableSignal<ServicioTecnicoOrdenEquiposInterface[]> = signal([{
    id: 1,
    modelo: 'Modelo 1',
    marca: 'Marca 1',
    serial: 'Serial 1',
    ubicacion: 'Ubicacion 1',
    pgLinealesRecibidos: 'pg Recividos',
    pgLinealesEntregados: '',
    observaciones: '',
  }]);

  dataVerificacion: WritableSignal<string[]> = signal([]);

  dataEvidencias: WritableSignal<WebcamImage[]> = signal([]);
}
