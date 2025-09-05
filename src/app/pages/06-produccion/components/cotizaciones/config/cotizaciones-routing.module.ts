import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { ProduccionCotizacionesPendientesComponent } from '../components/pendientes/pendientes.component';


@NgModule({
    imports: [RouterModule.forChild([{
        path: 'pendientes',
        data: { breadcrumb: 'Pendientes' },
        component: ProduccionCotizacionesPendientesComponent,
        canActivate: [permisosGuard],
    },
    ])],
    exports: [RouterModule],
})
export class ComercialCotizacionesRoutingModule { }