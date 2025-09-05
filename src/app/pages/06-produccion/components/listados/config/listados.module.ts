import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { SharedComponentModule } from "../../../../../shared/components/config/shared.module";
import { ProduccionListadosRoutingModule } from './listados-routing.module';
import { ProduccionListadosArtesComponent } from '../components/artes/artes.component';
import { ProduccionListadosProductoTerminadoComponent } from '../components/producto_terminado/producto_terminado.component';


@NgModule({
  declarations: [
    ProduccionListadosArtesComponent,
    ProduccionListadosProductoTerminadoComponent,
  ],
  imports: [
    CommonModule,
    ProduccionListadosRoutingModule,
    PrimeNgModule,
    FormsModule,
    SharedComponentModule
  ]
})
export class ProduccionListadosModule { }
