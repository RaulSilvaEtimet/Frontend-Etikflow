import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { ComercialCotizacionesRoutingModule } from './cotizaciones-routing.module';
import { SharedComponentModule } from "../../../../../shared/components/config/shared.module";
import { ProduccionCotizacionesPendientesComponent } from '../components/pendientes/pendientes.component';

@NgModule({
  declarations: [
    ProduccionCotizacionesPendientesComponent,
  ],
  imports: [
    CommonModule,
    ComercialCotizacionesRoutingModule,
    PrimeNgModule,
    FormsModule,
    SharedComponentModule
  ]
})
export class ProduccionCotizacionesModule { }
