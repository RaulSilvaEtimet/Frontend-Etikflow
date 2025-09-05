import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { AdministracionProveedoresListadoComponent } from '../listado/listado.component';

@NgModule({
   imports: [RouterModule.forChild([
      {
         path: 'listaproveedores',
         data: { breadcrumb: 'Listado' },
         component: AdministracionProveedoresListadoComponent,
         canActivate: [permisosGuard],
      },
   ])],
   exports: [RouterModule],
})
export class AdministracionProveedoresRoutingModule { }