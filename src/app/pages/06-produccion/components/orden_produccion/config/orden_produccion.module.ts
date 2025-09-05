import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { ComercialOrdenProduccionRoutingModule } from './orden_produccion-routing.module';
import { SharedComponentModule } from "../../../../../shared/components/config/shared.module";
import { ProduccionOrdenProduccionListadoComponent } from '../components/listado/listado.component';
import { ProduccionOrdenProduccionCierreComponent } from '../components/cierre/cierre.component';
import { ProduccionOrdenProduccionCierreInfoOPComponent } from '../components/cierre/components/info_orden_produccion/info_orden_produccion.component';
import { ProduccionOrdenProduccionCierreMpLiberadaComponent } from '../components/cierre/components/mp_liberada/mp_liberada.component';
import { ProduccionOrdenProduccionCierreBitacoraComponent } from '../components/cierre/components/bitacora/bitacora.component';
import { ProduccionOrdenProduccionCierreValoresGeneradosComponent } from '../components/cierre/components/valores_generados/valores_generados.component';
import { ProduccionOrdenProduccionCierreCalcularComponent } from '../components/cierre/components/enviar/enviar.component';
import { ProduccionOrdenProduccionCierreParcialesComponent } from '../components/cierre/components/parciales/parciales.component';
import { ProduccionOrdenProduccionTaurusComponent } from '../components/taurus/taurus.component';


@NgModule({
  declarations: [
    ProduccionOrdenProduccionListadoComponent,
    ProduccionOrdenProduccionCierreComponent,
    ProduccionOrdenProduccionCierreInfoOPComponent,
    ProduccionOrdenProduccionCierreMpLiberadaComponent,
    ProduccionOrdenProduccionCierreBitacoraComponent,
    ProduccionOrdenProduccionCierreValoresGeneradosComponent,
    ProduccionOrdenProduccionCierreCalcularComponent,
    ProduccionOrdenProduccionCierreParcialesComponent,
    ProduccionOrdenProduccionTaurusComponent,
  ],
  imports: [
    CommonModule,
    ComercialOrdenProduccionRoutingModule,
    PrimeNgModule,
    FormsModule,
    SharedComponentModule
  ]
})
export class ProduccionOrdenProduccionModule { }
