import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'administracion',
            data: { breadcrumb: 'Administración' },
            loadChildren: () => import('../components/administracion/config/administracion.module').then(m => m.SeguridadesAdministracionModule),
        },
        {
            path: 'modulos',
            data: { breadcrumb: 'Modulos' },
            loadChildren: () => import('../components/modulos/config/modulos.module').then(m => m.SeguridadesModulosModule)
        },

    ])],
    exports: [RouterModule],
})
export class SeguridadesRoutingModule { }