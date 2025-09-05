import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { AdquisicionesOrdenCompraRoutingModule } from './orden_compra-routing.module';
import { AdquisicionesOrdenCompraPackingListComponent } from '../components/packing_list/packing_list.component';
import { AdquisicionesOrdenCompraMateriaPrimaComponent } from '../components/materia_prima/materia_prima.component';
import { AdquisicionesOrdenCompraListadoComponent } from '../components/listado/listado.component';
import { SharedComponentModule } from 'src/app/shared/components/config/shared.module';

@NgModule({
  declarations: [
    AdquisicionesOrdenCompraMateriaPrimaComponent,
    AdquisicionesOrdenCompraListadoComponent,
    AdquisicionesOrdenCompraPackingListComponent,
  ],
  imports: [
    CommonModule,
    AdquisicionesOrdenCompraRoutingModule,
    PrimeNgModule,
    SharedComponentModule,
  ]
})
export class AdquisicionesOrdenCompraModule { }
