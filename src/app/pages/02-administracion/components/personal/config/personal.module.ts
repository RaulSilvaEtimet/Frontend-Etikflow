import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { AdministracionPersonalRoutingModule } from './personal-routing.module';
import { AdministracionPersonalColaboradoresComponent } from '../colaboradores/colaboradores.component';
import { AdministracionPersonalCargosComponent } from '../cargos/cargos.component';
import { SharedComponentModule } from 'src/app/shared/components/config/shared.module';

@NgModule({
  declarations: [
    AdministracionPersonalColaboradoresComponent,
    AdministracionPersonalCargosComponent,
  ],
  imports: [
    CommonModule,
    AdministracionPersonalRoutingModule,
    PrimeNgModule,
    SharedComponentModule,
  ]
})
export class AdministracionPersonalModule { }
