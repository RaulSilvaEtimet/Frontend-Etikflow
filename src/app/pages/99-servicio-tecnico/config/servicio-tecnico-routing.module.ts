import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServicioTecnicoOrdenComponent } from '../components/orden-servicio-tecnico/orden-servicio-tecnico.component';
import { ServicioTecnicoInventarioComponent } from '../components/inventario/inventario.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'ordenServicioTecnico', component: ServicioTecnicoOrdenComponent },
    { path: 'inventario', component: ServicioTecnicoInventarioComponent }
  ])],
  exports: [RouterModule],
})
export class ServicioTecnicoRoutingModule { }
