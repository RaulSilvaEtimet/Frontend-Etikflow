import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { ComercialCotizacionesRoutingModule } from './cotizaciones-routing.module';
import { ComercialCotizacionesNuevaComponent } from '../components/nueva/nueva.component';
import { ComercialCotizacionesListadoComponent } from '../components/listado/listado.component';
import { SharedComponentModule } from "../../../../../shared/components/config/shared.module";

@NgModule({
  declarations: [
    ComercialCotizacionesNuevaComponent,
    ComercialCotizacionesListadoComponent
  ],
  imports: [
    CommonModule,
    ComercialCotizacionesRoutingModule,
    PrimeNgModule,
    FormsModule,
    SharedComponentModule
  ]
})
export class ComercialCotizacionesModule { }
