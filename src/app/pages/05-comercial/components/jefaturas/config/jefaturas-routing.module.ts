import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { ComercialJefaturasCotizacionesComponent } from '../components/cotizaciones/cotizaciones.component';

@NgModule({
    imports: [RouterModule.forChild([{
        path: 'cotizaciones',
        data: { breadcrumb: 'Cotizaciones' },
        component: ComercialJefaturasCotizacionesComponent,
        canActivate: [permisosGuard],
    },
    ])],
    exports: [RouterModule],
})
export class ComercialJefaturasRoutingModule { }