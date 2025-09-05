import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'inventario',
            data: { breadcrumb: 'Inventario' },
            loadChildren: () => import('../components/inventario/config/inventario.module').then(m => m.BodegaInventarioModule),
        }, {
            path: 'cortes',
            data: { breadcrumb: 'Cortes' },
            loadChildren: () => import('../components/cortes/config/cortes.module').then(m => m.BodegaCortesModule),
        }, {
            path: 'materia_prima',
            data: { breadcrumb: 'materia_prima' },
            loadChildren: () => import('../components/materia_prima/config/materia_prima.module').then(m => m.BodegaMateriaPrimaModule),
        },
    ])],
    exports: [RouterModule],
})
export class BodegaRoutingModule { }