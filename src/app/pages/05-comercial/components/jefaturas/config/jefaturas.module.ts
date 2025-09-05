import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { SharedComponentModule } from "../../../../../shared/components/config/shared.module";
import { ComercialJefaturasRoutingModule } from './jefaturas-routing.module';
import { ComercialJefaturasCotizacionesComponent } from '../components/cotizaciones/cotizaciones.component';

@NgModule({
  declarations: [
    ComercialJefaturasCotizacionesComponent
  ],
  imports: [
    CommonModule,
    ComercialJefaturasRoutingModule,
    PrimeNgModule,
    FormsModule,
    SharedComponentModule
  ]
})
export class ComercialJefaturasModule { }
