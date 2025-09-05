import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { AdministracionComercialClientesComponent } from '../clientes/clientes.component';
import { AdministracionComercialTipoTrabajosComponent } from '../tipos_trabajo/tipos_trabajos.component';

@NgModule({
    imports: [RouterModule.forChild([{
        path: 'clientes',
        data: { breadcrumb: 'Clientes' },
        component: AdministracionComercialClientesComponent,
        canActivate: [permisosGuard],
    }, {
        path: 'tipos_trabajos',
        data: { breadcrumb: 'Tipos Trabajos' },
        component: AdministracionComercialTipoTrabajosComponent,
        canActivate: [permisosGuard],
    },
    ])],
    exports: [RouterModule],
})
export class AdministracionComercialRoutingModule { }