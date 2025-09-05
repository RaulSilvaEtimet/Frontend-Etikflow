import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([{
        path: 'cotizaciones',
        data: { breadcrumb: 'Cotizaciones' },
        loadChildren: () => import('../components/cotizaciones/config/cotizaciones.module').then(m => m.ProduccionCotizacionesModule),
    }, {
        path: 'orden_produccion',
        data: { breadcrumb: 'Orden Producción' },
        loadChildren: () => import('../components/orden_produccion/config/orden_produccion.module').then(m => m.ProduccionOrdenProduccionModule),
    }, {
        path: 'operarios',
        data: { breadcrumb: 'Operarios' },
        loadChildren: () => import('../components/operarios/config/operarios.module').then(m => m.ProduccionOperariosModule),
    }, {
        path: 'listados',
        data: { breadcrumb: 'Listados' },
        loadChildren: () => import('../components/listados/config/listados.module').then(m => m.ProduccionListadosModule),
    },
    ])],
    exports: [RouterModule],
})
export class ProduccionRoutingModule { }