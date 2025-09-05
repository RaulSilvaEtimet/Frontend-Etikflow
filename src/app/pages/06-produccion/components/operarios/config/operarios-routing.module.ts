import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { ProduccionOperariosBitacoraComponent } from '../components/bitacora/bitacora.component';
import { ProduccionOperariosRetornoMateriaPrimaComponent } from '../components/retorno_materia_prima/retorno_materia_prima.component';
import { ProduccionOperariosValoresProducidosComponent } from '../components/valores_producidos/valores_producidos.component';


@NgModule({
    imports: [RouterModule.forChild([{
        path: 'bitacora',
        data: { breadcrumb: 'Bitacora' },
        component: ProduccionOperariosBitacoraComponent,
        canActivate: [permisosGuard],
    }, {
        path: 'retorno_materia_prima',
        data: { breadcrumb: 'Retorno Materia Prima' },
        component: ProduccionOperariosRetornoMateriaPrimaComponent,
        canActivate: [permisosGuard],
    }, {
        path: 'valores_producidos',
        data: { breadcrumb: 'Valores Producidos' },
        component: ProduccionOperariosValoresProducidosComponent,
        canActivate: [permisosGuard],
    },
    ])],
    exports: [RouterModule],
})
export class ComercialOperariosRoutingModule { }