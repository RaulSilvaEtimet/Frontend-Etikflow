import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { ConfiguracionesExtrasDocumentosPDFOrdenCorteComponent } from '../components/orden-corte/orden-corte.component';
import { ConfiguracionesExtrasDocumentosPDFEtiquetaKardexComponent } from '../components/etiqueta-kardex/etiqueta-kardex.component';
import { ConfiguracionesExtrasDocumentosPDFOrdenProduccionComponent } from '../components/orden-produccion/orden-producion.component';
import { ConfiguracionesExtrasDocumentosPDFOrdenCompraComponent } from '../components/orden-compra/orden-compra.component';

@NgModule({
    imports: [RouterModule.forChild([{
        path: 'orden_corte',
        data: { breadcrumb: 'Orden Corte' },
        component: ConfiguracionesExtrasDocumentosPDFOrdenCorteComponent,
        canActivate: [permisosGuard],
    }, {
        path: 'etiqueta_kardex',
        data: { breadcrumb: 'Etiqueta kardex' },
        component: ConfiguracionesExtrasDocumentosPDFEtiquetaKardexComponent,
        canActivate: [permisosGuard],
    }, {
        path: 'orden_produccion',
        data: { breadcrumb: 'Orden Produccion' },
        component: ConfiguracionesExtrasDocumentosPDFOrdenProduccionComponent,
        canActivate: [permisosGuard],
    }, {
        path: 'orden_compra',
        data: { breadcrumb: 'Orden Compra' },
        component: ConfiguracionesExtrasDocumentosPDFOrdenCompraComponent,
        canActivate: [permisosGuard],
    },
    ])],
    exports: [RouterModule],
})
export class ConfiguracionesExtrasDocumentosPDFRoutingModule { }