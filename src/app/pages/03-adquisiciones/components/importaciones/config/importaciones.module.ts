import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { AdquisicionesImportacionesRoutingModule } from './importaciones-routing.module';
import { AdquisicionesImportacionesCrearComponent } from '../components/crear/crear.component';
import { SharedComponentModule } from 'src/app/shared/components/config/shared.module';
import { AdquisicionesImportacionesListadoComponent } from '../components/listado/listado.component';

@NgModule({
  declarations: [
    AdquisicionesImportacionesCrearComponent,
    AdquisicionesImportacionesListadoComponent,
  ],
  imports: [
    CommonModule,
    AdquisicionesImportacionesRoutingModule,
    PrimeNgModule,
    SharedComponentModule,
  ]
})
export class AdquisicionesImportacionesModule { }
