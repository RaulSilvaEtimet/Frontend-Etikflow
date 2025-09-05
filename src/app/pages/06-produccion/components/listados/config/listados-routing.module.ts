import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { ProduccionListadosArtesComponent } from '../components/artes/artes.component';
import { ProduccionListadosProductoTerminadoComponent } from '../components/producto_terminado/producto_terminado.component';

@NgModule({
    imports: [RouterModule.forChild([{
        path: 'artes',
        data: { breadcrumb: 'Artes' },
        component: ProduccionListadosArtesComponent,
        canActivate: [permisosGuard],
    }, {
        path: 'producto_terminado',
        data: { breadcrumb: 'Producto Terminado' },
        component: ProduccionListadosProductoTerminadoComponent,
        canActivate: [permisosGuard],
    },
    ])],
    exports: [RouterModule],
})
export class ProduccionListadosRoutingModule { }