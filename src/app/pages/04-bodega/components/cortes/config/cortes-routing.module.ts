import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { BodegaCortesOrdencorteComponent } from '../components/ordencorte/ordencorte.component';
import { BodegaCortesListadoComponent } from '../components/listado/listado.component';
import { BodegaCortesCerrarComponent } from '../components/cerrar/cerrar.component';

@NgModule({
   imports: [RouterModule.forChild([
      {
         path: 'ordencorte',
         data: { breadcrumb: 'Orden de corte' },
         component: BodegaCortesOrdencorteComponent,
         canActivate: [permisosGuard],
      }, {
         path: 'listado',
         data: { breadcrumb: 'Listado' },
         component: BodegaCortesListadoComponent,
         canActivate: [permisosGuard],
      }, {
         path: 'cerrar',
         data: { breadcrumb: 'Cerrar corte' },
         component: BodegaCortesCerrarComponent,
         canActivate: [permisosGuard],
      }
   ])],
   exports: [RouterModule],
})
export class BodegaCortesModuleRoutingModule { }