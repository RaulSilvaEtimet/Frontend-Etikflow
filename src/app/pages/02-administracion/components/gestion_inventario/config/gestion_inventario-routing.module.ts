import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { AdministracionGestionInventarioGrupoInventarioComponent } from '../components/grupo_inventario/grupo_inventario.component';
import { AdministracionGestionInventarioProductosInventarioComponent } from '../components/producto_invetario/producto_inventario.component';
import { AdministracionGestionInventarioLineaInventarioComponent } from '../components/linea_inventario/linea_inventario.component';
import { AdministracionGestionInventarioTipoInventarioComponent } from '../components/tipo_inventario/tipo_inventario.component';

@NgModule({
   imports: [RouterModule.forChild([
      {
         path: 'linea_inventario',
         data: { breadcrumb: 'Linea de inventario' },
         component: AdministracionGestionInventarioLineaInventarioComponent,
         canActivate: [permisosGuard],
      }, {
         path: 'grupo_inventario',
         data: { breadcrumb: 'Grupo de inventario' },
         component: AdministracionGestionInventarioGrupoInventarioComponent,
         canActivate: [permisosGuard],
      }, {
         path: 'tipo_inventario',
         data: { breadcrumb: 'Tipos de inventario' },
         component: AdministracionGestionInventarioTipoInventarioComponent,
         canActivate: [permisosGuard],
      }, {
         path: 'productos',
         data: { breadcrumb: 'Productos' },
         component: AdministracionGestionInventarioProductosInventarioComponent,
         canActivate: [permisosGuard],
      },
   ])],
   exports: [RouterModule],
})
export class AdministracionGestionInventarioRoutingModule { }