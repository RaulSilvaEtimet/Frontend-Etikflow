import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { AdministracionProduccionCargoConsumoComponent } from '../cargo-consumos/cargo-consumo.component';
import { AdministracionProduccionMaquinasComponent } from '../maquinas/maquinas.component';
import { AdministracionProduccionCilindrosComponent } from '../cilindros/cilindros.component';
import { AdministracionProduccionTroquelesComponent } from '../troqueles/troqueles.component';
import { AdministracionProduccionConosComponent } from '../conos/conos.component';
import { AdministracionProduccionRebobinadosComponent } from '../rebobinados/rebobinados.component';
import { AdministracionProduccionAcabadosComponent } from '../acabados/acabados.component';

@NgModule({
   imports: [RouterModule.forChild([
      {
         path: 'maquinas',
         data: { breadcrumb: 'Listado de maquinas' },
         component: AdministracionProduccionMaquinasComponent,
         canActivate: [permisosGuard],
      }, {
         path: 'cargoConsumos',
         data: { breadcrumb: 'Cargos por consumos' },
         component: AdministracionProduccionCargoConsumoComponent,
         canActivate: [permisosGuard],
      }, {
         path: 'cilindros',
         data: { breadcrumb: 'Cilindros' },
         component: AdministracionProduccionCilindrosComponent,
         canActivate: [permisosGuard],
      }, {
         path: 'troqueles',
         data: { breadcrumb: 'Troqueles' },
         component: AdministracionProduccionTroquelesComponent,
         canActivate: [permisosGuard],
      }, {
         path: 'conos',
         data: { breadcrumb: 'Conos' },
         component: AdministracionProduccionConosComponent,
         canActivate: [permisosGuard],
      }, {
         path: 'rebobinados',
         data: { breadcrumb: 'Rebobinados' },
         component: AdministracionProduccionRebobinadosComponent,
         canActivate: [permisosGuard],
      }, {
         path: 'acabados',
         data: { breadcrumb: 'Acabados' },
         component: AdministracionProduccionAcabadosComponent,
         canActivate: [permisosGuard],
      },
   ])],
   exports: [RouterModule],
})
export class AdministracionProduccionRoutingModule { }