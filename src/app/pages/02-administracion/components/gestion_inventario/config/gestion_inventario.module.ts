import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { AdministracionGestionInventarioRoutingModule } from './gestion_inventario-routing.module';
import { SharedComponentModule } from 'src/app/shared/components/config/shared.module';
import { AdministracionGestionInventarioLineaInventarioComponent } from '../components/linea_inventario/linea_inventario.component';
import { AdministracionGestionInventarioGrupoInventarioComponent } from '../components/grupo_inventario/grupo_inventario.component';
import { AdministracionGestionInventarioProductosInventarioComponent } from '../components/producto_invetario/producto_inventario.component';
import { AdministracionGestionInventarioTipoInventarioComponent } from '../components/tipo_inventario/tipo_inventario.component';

@NgModule({
  declarations: [
    AdministracionGestionInventarioLineaInventarioComponent,
    AdministracionGestionInventarioGrupoInventarioComponent,
    AdministracionGestionInventarioTipoInventarioComponent,
    AdministracionGestionInventarioProductosInventarioComponent,
  ],
  imports: [
    CommonModule,
    AdministracionGestionInventarioRoutingModule,
    PrimeNgModule,
    SharedComponentModule,
  ]
})
export class AdministracionGestionInventarioModule { }
