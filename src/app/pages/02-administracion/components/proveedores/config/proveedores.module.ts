import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { AdministracionProveedoresRoutingModule } from './proveedores-routing.module';
import { AdministracionProveedoresListadoComponent } from '../listado/listado.component';


@NgModule({
  declarations: [
    AdministracionProveedoresListadoComponent
  ],
  imports: [
    CommonModule,
    AdministracionProveedoresRoutingModule,
    PrimeNgModule
  ]
})
export class AdministracionProveedoresModule { }
