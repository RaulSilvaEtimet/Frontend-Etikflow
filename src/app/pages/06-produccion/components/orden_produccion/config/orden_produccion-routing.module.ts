import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { ProduccionOrdenProduccionListadoComponent } from '../components/listado/listado.component';
import { ProduccionOrdenProduccionCierreComponent } from '../components/cierre/cierre.component';
import { ProduccionOrdenProduccionTaurusComponent } from '../components/taurus/taurus.component';


@NgModule({
    imports: [RouterModule.forChild([{
        path: 'listado',
        data: { breadcrumb: 'Listado' },
        component: ProduccionOrdenProduccionListadoComponent,
        canActivate: [permisosGuard],
    }, {
        path: 'cierre',
        data: { breadcrumb: 'Cierre' },
        component: ProduccionOrdenProduccionCierreComponent,
        canActivate: [permisosGuard],
    }, {
        path: 'taurus',
        data: { breadcrumb: 'Taurus' },
        component: ProduccionOrdenProduccionTaurusComponent,
        canActivate: [permisosGuard],
    },
    ])],
    exports: [RouterModule],
})
export class ComercialOrdenProduccionRoutingModule { }