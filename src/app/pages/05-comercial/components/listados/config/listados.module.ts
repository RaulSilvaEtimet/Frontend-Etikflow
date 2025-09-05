import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { ComercialListadosRoutingModule as ComercialProductoTerminadoRoutingModule } from './listados-routing.module';
import { SharedComponentModule } from "../../../../../shared/components/config/shared.module";
import { ComercialListadosProductoTerminadoComponent } from '../components/producto_terminado/producto_terminado.component';
import { ComercialListadosTroquelesComponent } from '../components/troqueles/troqueles.component';
import { ComercialListadoOrdenProduccionComponent } from '../components/orden_produccion/orden_produccion.component';

@NgModule({
  declarations: [
    ComercialListadosProductoTerminadoComponent,
    ComercialListadosTroquelesComponent,
    ComercialListadoOrdenProduccionComponent,
  ],
  imports: [
    CommonModule,
    ComercialProductoTerminadoRoutingModule,
    PrimeNgModule,
    FormsModule,
    SharedComponentModule
  ]
})
export class ComercialListadosModule { }
