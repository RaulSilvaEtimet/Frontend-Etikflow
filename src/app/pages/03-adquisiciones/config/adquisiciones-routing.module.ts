import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'orden_compra',
            data: { breadcrumb: 'Orden de compra' },
            loadChildren: () => import('../components/orden_compra/config/orden_compra.module').then(m => m.AdquisicionesOrdenCompraModule),
        }, {
            path: 'compras',
            data: { breadcrumb: 'Compras' },
            loadChildren: () => import('../components/compras/config/compras.module').then(m => m.AdquisicionesComprasModule),
        }, {
            path: 'importaciones',
            data: { breadcrumb: 'Importaciones' },
            loadChildren: () => import('../components/importaciones/config/importaciones.module').then(m => m.AdquisicionesImportacionesModule),
        }, {
            path: 'gestion_inventario',
            data: { breadcrumb: 'Gestión Inventario' },
            loadChildren: () => import('../components/gestion_inventario/config/gestion_inventario.module').then(m => m.AdquisicionesGestionInventarioModule),
        },
    ])],
    exports: [RouterModule],
})
export class AdquisicionesRoutingModule { }