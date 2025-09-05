import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([{
        path: 'cotizaciones',
        data: { breadcrumb: 'Cotizaciones' },
        loadChildren: () => import('../components/cotizaciones/config/cotizaciones.module').then(m => m.ComercialCotizacionesModule),
    }, {
        path: 'listados',
        data: { breadcrumb: 'Listados' },
        loadChildren: () => import('../components/listados/config/listados.module').then(m => m.ComercialListadosModule),
    }, {
        path: 'jefaturas',
        data: { breadcrumb: 'Jefaturas' },
        loadChildren: () => import('../components/jefaturas/config/jefaturas.module').then(m => m.ComercialJefaturasModule),
    },
    ])],
    exports: [RouterModule],
})
export class ComercialRoutingModule { }