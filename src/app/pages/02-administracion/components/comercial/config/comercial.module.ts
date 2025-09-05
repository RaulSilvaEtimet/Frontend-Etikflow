import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { AdministracionComercialRoutingModule } from './comercial-routing.module';
import { AdministracionComercialClientesComponent } from '../clientes/clientes.component';
import { AdministracionComercialTipoTrabajosComponent } from '../tipos_trabajo/tipos_trabajos.component';
import { SharedComponentModule } from 'src/app/shared/components/config/shared.module';

@NgModule({
  declarations: [
    AdministracionComercialClientesComponent,
    AdministracionComercialTipoTrabajosComponent,
  ],
  imports: [
    CommonModule,
    AdministracionComercialRoutingModule,
    PrimeNgModule,
    SharedComponentModule,
  ]
})
export class AdministracionClientesModule { }
