import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { BodegaInventarioComprasComponent } from '../components/compras/compras.component';
import { BodegaInventarioKardexComponent } from '../components/kardex/kardex.component';
import { BodegaInventarioModuleRoutingModule } from './inventario-routing.module';
import { BodegaInventarioTotalizadoComponent } from '../components/totalizado/totalizado.component';
import { BodegaInventarioAgregarComponent } from '../components/agregar/agregar.component';
import { SharedComponentModule } from 'src/app/shared/components/config/shared.module';
import { BodegaInventarioBajaMPComponent } from '../components/baja_materia_prima/baja_materia_prima.component';


@NgModule({
  declarations: [
    BodegaInventarioComprasComponent,
    BodegaInventarioKardexComponent,
    BodegaInventarioTotalizadoComponent,
    BodegaInventarioAgregarComponent,
    BodegaInventarioBajaMPComponent,
  ],
  imports: [
    CommonModule,
    BodegaInventarioModuleRoutingModule,
    PrimeNgModule,
    SharedComponentModule,
  ]
})
export class BodegaInventarioModule { }
