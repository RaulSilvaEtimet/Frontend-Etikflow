import { Component } from '@angular/core';
import { ServicioTecnicoOrdenClientesInterface } from '../../interfaces/interfaces';

@Component({
  selector: 'app-servicio-tecnico-orden-seleccionar-cliente',
  templateUrl: './seleccionar-cliente.component.html',
  styleUrl: './seleccionar-cliente.component.scss'
})
export class ServicioTecnicoOrdenSeleccionarClienteComponent {
  clientes: ServicioTecnicoOrdenClientesInterface[] = [{
    codigo: '001',
    creador: 'Pedro Jibaja',
    fecha: new Date(),
  }];


}
