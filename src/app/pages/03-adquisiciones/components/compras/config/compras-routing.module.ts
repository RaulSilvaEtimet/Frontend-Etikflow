import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { AdquisicionesComprasPendientesComponent } from '../components/pendientes/pendientes.component';
import { AdquisicionesComprasIngresoLotesComponent } from '../components/ingresar_lotes/ingresar_lotes.component';


@NgModule({
   imports: [RouterModule.forChild([
      {
         path: 'pendientes',
         data: { breadcrumb: 'Pendientes' },
         component: AdquisicionesComprasPendientesComponent,
         canActivate: [permisosGuard],
      }, {
         path: 'ingreso_lotes',
         data: { breadcrumb: 'Ingreso de lotes' },
         component: AdquisicionesComprasIngresoLotesComponent,
         canActivate: [permisosGuard],
      },
   ])],
   exports: [RouterModule],
})
export class AdquisicionesComprasRoutingModule { }