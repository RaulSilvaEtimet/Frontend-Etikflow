import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { SeguridadesModulosMenusComponent } from '../menus/menus.component';
import { SeguridadesModulosAsignacionComponent } from '../asignacion/asignacion.component';


@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'menus',
            data: { breadcrumb: 'Menus' },
            component: SeguridadesModulosMenusComponent,
            canActivate: [permisosGuard]
        },
        {
            path: 'asignacion',
            data: { breadcrumb: 'Asignación' },
            component: SeguridadesModulosAsignacionComponent,
            canActivate: [permisosGuard]
        },
    ])],
    exports: [RouterModule],
})
export class SeguridadesModulosRoutingModule { }