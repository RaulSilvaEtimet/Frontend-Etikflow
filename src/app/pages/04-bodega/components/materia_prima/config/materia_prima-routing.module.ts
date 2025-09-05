import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { BodegaMateriaPrimaLiberacionComponent } from '../components/liberacion/liberacion.component';
import { BodegaMateriaPrimaDevolucionComponent } from '../components/devolucion/devolucion.component';


@NgModule({
    imports: [RouterModule.forChild([{
        path: 'liberacion',
        data: { breadcrumb: 'Liberación' },
        component: BodegaMateriaPrimaLiberacionComponent,
        canActivate: [permisosGuard],
    }, {
        path: 'devolucion',
        data: { breadcrumb: 'Devolución' },
        component: BodegaMateriaPrimaDevolucionComponent,
        canActivate: [permisosGuard],
    },
    ])],
    exports: [RouterModule],
})
export class BodegaMateriaPrimaRoutingModule { }