import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { AdquisicionesGestionInventarioRoutingModule } from './gestion_inventario-routing.module';
import { SharedComponentModule } from 'src/app/shared/components/config/shared.module';
import { AdquisicionesGestionInventarioProductosInventarioComponent } from '../components/producto_invetario/producto_inventario.component';
import { AdquisicionesGestionInventarioTipoInventarioComponent } from '../components/tipo_inventario/tipo_inventario.component';

@NgModule({
  declarations: [
    AdquisicionesGestionInventarioTipoInventarioComponent,
    AdquisicionesGestionInventarioProductosInventarioComponent,
  ],
  imports: [
    CommonModule,
    AdquisicionesGestionInventarioRoutingModule,
    PrimeNgModule,
    SharedComponentModule,
  ]
})
export class AdquisicionesGestionInventarioModule { }
