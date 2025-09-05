import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicioTecnicoOrdenComponent } from '../components/orden-servicio-tecnico/orden-servicio-tecnico.component';
import { ServicioTecnicoRoutingModule } from './servicio-tecnico-routing.module';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { ServicioTecnicoOrdenConsultaClienteComponent } from '../components/orden-servicio-tecnico/components/consulta-cliente/consulta-cliente.component';
import { ServicioTecnicoOrdenSeleccionarClienteComponent } from '../components/orden-servicio-tecnico/components/seleccionar-cliente/seleccionar-cliente.component';
import { ServicioTecnicoOrdenFormularioComponent } from '../components/orden-servicio-tecnico/components/formulario/formulario.component';
import { ServicioTecnicoOrdenEvidenciasComponent } from '../components/orden-servicio-tecnico/components/evidencias/evidencias.component';
import { ServicioTecnicoOrdenFirmaComponent } from '../components/orden-servicio-tecnico/components/firma/firma.component';

@NgModule({
  declarations: [
    ServicioTecnicoOrdenComponent,
    ServicioTecnicoOrdenConsultaClienteComponent,
    ServicioTecnicoOrdenSeleccionarClienteComponent,
    ServicioTecnicoOrdenFormularioComponent,
    ServicioTecnicoOrdenEvidenciasComponent,
    ServicioTecnicoOrdenFirmaComponent,
  ],
  imports: [
    CommonModule,
    ServicioTecnicoRoutingModule,
    PrimeNgModule,
  ]
})
export class ServicioTecnicoModule { }
