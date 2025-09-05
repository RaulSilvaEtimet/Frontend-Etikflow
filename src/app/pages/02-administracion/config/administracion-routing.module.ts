import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'comercial',
            data: { breadcrumb: 'Comercial' },
            loadChildren: () => import('../components/comercial/config/comercial.module').then(m => m.AdministracionClientesModule),
        },
        {
            path: 'personal',
            data: { breadcrumb: 'Personal' },
            loadChildren: () => import('../components/personal/config/personal.module').then(m => m.AdministracionPersonalModule)
        },
        {
            path: 'proveedores',
            data: { breadcrumb: 'Proveedores' },
            loadChildren: () => import('../components/proveedores/config/proveedores.module').then(m => m.AdministracionProveedoresModule)
        }, {
            path: 'gestion_inventario',
            data: { breadcrumb: 'Gestion Inventario' },
            loadChildren: () => import('../components/gestion_inventario/config/gestion_inventario.module').then(m => m.AdministracionGestionInventarioModule)
        }, {
            path: 'produccion',
            data: { breadcrumb: 'Produccion' },
            loadChildren: () => import('../components/produccion/config/produccion.module').then(m => m.AdministracionProduccionModule)
        }, {
            path: 'disenio',
            data: { breadcrumb: 'Diseño' },
            loadChildren: () => import('../components/disenio/config/disenio.module').then(m => m.AdministracionDisenioModule)
        },
    ])],
    exports: [RouterModule],
})
export class AdministracionRoutingModule { }