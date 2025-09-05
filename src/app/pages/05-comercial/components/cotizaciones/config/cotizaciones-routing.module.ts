import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { ComercialCotizacionesNuevaComponent } from '../components/nueva/nueva.component';
import { ComercialCotizacionesListadoComponent } from '../components/listado/listado.component';

@NgModule({
    imports: [RouterModule.forChild([{
        path: 'nueva_cotizacion',
        data: { breadcrumb: 'Nueva cotización' },
        component: ComercialCotizacionesNuevaComponent,
        canActivate: [permisosGuard],
    }, {
        path: 'listado',
        data: { breadcrumb: 'Listado' },
        component: ComercialCotizacionesListadoComponent,
        canActivate: [permisosGuard],
    },
    ])],
    exports: [RouterModule],
})
export class ComercialCotizacionesRoutingModule { }