import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { AdquisicionesGestionInventarioProductosInventarioComponent } from '../components/producto_invetario/producto_inventario.component';
import { AdquisicionesGestionInventarioTipoInventarioComponent } from '../components/tipo_inventario/tipo_inventario.component';

@NgModule({
   imports: [RouterModule.forChild([
      {
         path: 'tipo_inventario',
         data: { breadcrumb: 'Tipos de inventario' },
         component: AdquisicionesGestionInventarioTipoInventarioComponent,
         canActivate: [permisosGuard],
      }, {
         path: 'productos',
         data: { breadcrumb: 'Productos' },
         component: AdquisicionesGestionInventarioProductosInventarioComponent,
         canActivate: [permisosGuard],
      },
   ])],
   exports: [RouterModule],
})
export class AdquisicionesGestionInventarioRoutingModule { }