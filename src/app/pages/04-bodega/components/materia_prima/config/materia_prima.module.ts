import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { SharedComponentModule } from "../../../../../shared/components/config/shared.module";
import { BodegaMateriaPrimaRoutingModule } from './materia_prima-routing.module';
import { BodegaMateriaPrimaLiberacionComponent } from '../components/liberacion/liberacion.component';
import { BodegaMateriaPrimaDevolucionComponent } from '../components/devolucion/devolucion.component';

@NgModule({
  declarations: [
    BodegaMateriaPrimaLiberacionComponent,
    BodegaMateriaPrimaDevolucionComponent,
  ],
  imports: [
    CommonModule,
    BodegaMateriaPrimaRoutingModule,
    PrimeNgModule,
    FormsModule,
    SharedComponentModule
  ]
})
export class BodegaMateriaPrimaModule { }
