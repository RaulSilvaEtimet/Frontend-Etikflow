import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdministracionPersonalColaboradoresComponent } from '../colaboradores/colaboradores.component';
import { AdministracionPersonalCargosComponent } from '../cargos/cargos.component';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';

@NgModule({
   imports: [RouterModule.forChild([
      {
         path: 'colaboradores',
         data: { breadcrumb: 'Colaboradores' },
         component: AdministracionPersonalColaboradoresComponent,
         canActivate: [permisosGuard],
      },
      {
         path: 'cargos',
         data: { breadcrumb: 'Cargos' },
         component: AdministracionPersonalCargosComponent,
         canActivate: [permisosGuard],
      },
   ])],
   exports: [RouterModule],
})
export class AdministracionPersonalRoutingModule { }