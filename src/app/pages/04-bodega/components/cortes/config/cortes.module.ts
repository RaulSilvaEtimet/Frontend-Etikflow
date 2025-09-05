import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { BodegaCortesOrdencorteComponent } from '../components/ordencorte/ordencorte.component';
import { BodegaCortesModuleRoutingModule } from './cortes-routing.module';
import { BodegaCortesListadoComponent } from '../components/listado/listado.component';
import { BodegaCortesCerrarComponent } from '../components/cerrar/cerrar.component';
import { SharedComponentModule } from 'src/app/shared/components/config/shared.module';

@NgModule({
  declarations: [
    BodegaCortesOrdencorteComponent,
    BodegaCortesListadoComponent,
    BodegaCortesCerrarComponent,
  ],
  imports: [
    CommonModule,
    BodegaCortesModuleRoutingModule,
    PrimeNgModule,
    SharedComponentModule,
  ]
})
export class BodegaCortesModule { }
