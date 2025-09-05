import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeguridadesAdministracionRolesComponent } from '../roles/roles.component';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { SeguridadesAdministracionUsuariosComponent } from '../usuarios/usuarios.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'roles',
            data: { breadcrumb: 'Roles' },
            component: SeguridadesAdministracionRolesComponent,
            canActivate: [permisosGuard]
        }, {
            path: 'usuarios',
            data: { breadcrumb: 'Usuarios' },
            component: SeguridadesAdministracionUsuariosComponent,
            canActivate: [permisosGuard]
        },

    ])],
    exports: [RouterModule],
})
export class SeguridadesAdministracionRoutingModule { }