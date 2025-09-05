import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { AdministracionProduccionRoutingModule } from './produccion-routing.module';
import { SharedComponentModule } from 'src/app/shared/components/config/shared.module';
import { AdministracionProduccionMaquinasComponent } from '../maquinas/maquinas.component';
import { AdministracionProduccionCargoConsumoComponent } from '../cargo-consumos/cargo-consumo.component';
import { AdministracionProduccionCilindrosComponent } from '../cilindros/cilindros.component';
import { AdministracionProduccionTroquelesComponent } from '../troqueles/troqueles.component';
import { AdministracionProduccionConosComponent } from '../conos/conos.component';
import { AdministracionProduccionRebobinadosComponent } from '../rebobinados/rebobinados.component';
import { AdministracionProduccionAcabadosComponent } from '../acabados/acabados.component';

@NgModule({
  declarations: [
    AdministracionProduccionMaquinasComponent,
    AdministracionProduccionCargoConsumoComponent,
    AdministracionProduccionCilindrosComponent,
    AdministracionProduccionTroquelesComponent,
    AdministracionProduccionConosComponent,
    AdministracionProduccionRebobinadosComponent,
    AdministracionProduccionAcabadosComponent,
  ],
  imports: [
    CommonModule,
    AdministracionProduccionRoutingModule,
    PrimeNgModule,
    SharedComponentModule,
  ]
})
export class AdministracionProduccionModule { }
