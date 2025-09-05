import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { ComercialOperariosRoutingModule } from './operarios-routing.module';
import { SharedComponentModule } from "../../../../../shared/components/config/shared.module";
import { ProduccionOperariosBitacoraComponent } from '../components/bitacora/bitacora.component';
import { ProduccionOperariosRetornoMateriaPrimaComponent } from '../components/retorno_materia_prima/retorno_materia_prima.component';
import { ProduccionOperariosValoresProducidosComponent } from '../components/valores_producidos/valores_producidos.component';

@NgModule({
  declarations: [
    ProduccionOperariosBitacoraComponent,
    ProduccionOperariosRetornoMateriaPrimaComponent,
    ProduccionOperariosValoresProducidosComponent,
  ],
  imports: [
    CommonModule,
    ComercialOperariosRoutingModule,
    PrimeNgModule,
    FormsModule,
    SharedComponentModule
  ]
})
export class ProduccionOperariosModule { }
