import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { AdquisicionesOrdenCompraPackingListComponent } from '../components/packing_list/packing_list.component';
import { AdquisicionesOrdenCompraMateriaPrimaComponent } from '../components/materia_prima/materia_prima.component';
import { AdquisicionesOrdenCompraListadoComponent } from '../components/listado/listado.component';

@NgModule({
   imports: [RouterModule.forChild([
      {
         path: 'materia_prima',
         data: { breadcrumb: 'Materia Prima' },
         component: AdquisicionesOrdenCompraMateriaPrimaComponent,
         canActivate: [permisosGuard],
      }, {
         path: 'listado',
         data: { breadcrumb: 'Listado' },
         component: AdquisicionesOrdenCompraListadoComponent,
         canActivate: [permisosGuard],
      }, {
         path: 'packing_list',
         data: { breadcrumb: 'Packing List' },
         component: AdquisicionesOrdenCompraPackingListComponent,
         canActivate: [permisosGuard],
      },
   ])],
   exports: [RouterModule],
})
export class AdquisicionesOrdenCompraRoutingModule { }