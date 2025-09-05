import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { AdquisicionesComprasRoutingModule } from './compras-routing.module';
import { AdquisicionesComprasPendientesComponent } from '../components/pendientes/pendientes.component';
import { AdquisicionesComprasIngresoLotesComponent } from '../components/ingresar_lotes/ingresar_lotes.component';
import { SharedComponentModule } from 'src/app/shared/components/config/shared.module';

@NgModule({
  declarations: [
    AdquisicionesComprasPendientesComponent,
    AdquisicionesComprasIngresoLotesComponent,
  ],
  imports: [
    CommonModule,
    AdquisicionesComprasRoutingModule,
    PrimeNgModule,
    SharedComponentModule,
  ]
})
export class AdquisicionesComprasModule { }
