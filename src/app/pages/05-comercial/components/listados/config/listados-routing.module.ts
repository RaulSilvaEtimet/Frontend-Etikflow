import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { ComercialListadosProductoTerminadoComponent } from '../components/producto_terminado/producto_terminado.component';
import { ComercialListadosTroquelesComponent } from '../components/troqueles/troqueles.component';
import { ComercialListadoOrdenProduccionComponent } from '../components/orden_produccion/orden_produccion.component';

@NgModule({
    imports: [RouterModule.forChild([{
        path: 'producto_terminado',
        data: { breadcrumb: 'Producto Terminado' },
        component: ComercialListadosProductoTerminadoComponent,
        canActivate: [permisosGuard],
    }, {
        path: 'troqueles',
        data: { breadcrumb: 'Troqueles' },
        component: ComercialListadosTroquelesComponent,
        canActivate: [permisosGuard],
    }, {
        path: 'orden_produccion',
        data: { breadcrumb: 'Orden de Producción' },
        component: ComercialListadoOrdenProduccionComponent,
        canActivate: [permisosGuard],
    },
    ])],
    exports: [RouterModule],
})
export class ComercialListadosRoutingModule { }