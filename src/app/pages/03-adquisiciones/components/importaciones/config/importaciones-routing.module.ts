import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { AdquisicionesImportacionesCrearComponent } from '../components/crear/crear.component';
import { AdquisicionesImportacionesListadoComponent } from '../components/listado/listado.component';

@NgModule({
   imports: [RouterModule.forChild([
      {
         path: 'crear',
         data: { breadcrumb: 'Crear' },
         component: AdquisicionesImportacionesCrearComponent,
         canActivate: [permisosGuard],
      }, {
         path: 'listado',
         data: { breadcrumb: 'Listado' },
         component: AdquisicionesImportacionesListadoComponent,
         canActivate: [permisosGuard],
      },
   ])],
   exports: [RouterModule],
})
export class AdquisicionesImportacionesRoutingModule { }