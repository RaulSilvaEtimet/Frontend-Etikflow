import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { BodegaInventarioComprasComponent } from '../components/compras/compras.component';
import { BodegaInventarioKardexComponent } from '../components/kardex/kardex.component';
import { BodegaInventarioTotalizadoComponent } from '../components/totalizado/totalizado.component';
import { BodegaInventarioAgregarComponent } from '../components/agregar/agregar.component';
import { BodegaInventarioBajaMPComponent } from '../components/baja_materia_prima/baja_materia_prima.component';


@NgModule({
   imports: [RouterModule.forChild([
      {
         path: 'compras',
         data: { breadcrumb: 'Compras' },
         component: BodegaInventarioComprasComponent,
         canActivate: [permisosGuard],
      }, {
         path: 'kardex',
         data: { breadcrumb: 'Kardex' },
         component: BodegaInventarioKardexComponent,
         canActivate: [permisosGuard],
      }, {
         path: 'totalizado',
         data: { breadcrumb: 'Totalizado' },
         component: BodegaInventarioTotalizadoComponent,
         canActivate: [permisosGuard],
      }, {
         path: 'agregar',
         data: { breadcrumb: 'Agregar' },
         component: BodegaInventarioAgregarComponent,
         canActivate: [permisosGuard],
      }, {
         path: 'baja_mp',
         data: { breadcrumb: 'Baja de materia prima' },
         component: BodegaInventarioBajaMPComponent,
         canActivate: [permisosGuard],
      },
   ])],
   exports: [RouterModule],
})
export class BodegaInventarioModuleRoutingModule { }