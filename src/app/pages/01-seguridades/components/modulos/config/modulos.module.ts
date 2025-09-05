import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeguridadesModulosRoutingModule } from './modulos-routing.module';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { SeguridadesModulosMenusComponent } from '../menus/menus.component';
import { SeguridadesModulosAsignacionComponent } from '../asignacion/asignacion.component';
import { SharedComponentModule } from 'src/app/shared/components/config/shared.module';


@NgModule({
  declarations: [
    SeguridadesModulosMenusComponent,
    SeguridadesModulosAsignacionComponent
  ],
  imports: [
    CommonModule,
    SeguridadesModulosRoutingModule,
    PrimeNgModule,
    SharedComponentModule,
  ]
})
export class SeguridadesModulosModule { }
