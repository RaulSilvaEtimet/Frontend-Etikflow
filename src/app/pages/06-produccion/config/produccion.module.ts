import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { SharedComponentModule } from 'src/app/shared/components/config/shared.module';
import { ProduccionRoutingModule } from './produccion-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ProduccionRoutingModule,
    PrimeNgModule,
    SharedComponentModule,
  ]
})
export class ProduccionModule { }
