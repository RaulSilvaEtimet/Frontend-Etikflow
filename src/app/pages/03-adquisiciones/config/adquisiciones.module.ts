import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { AdquisicionesRoutingModule } from './adquisiciones-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AdquisicionesRoutingModule,
    PrimeNgModule
  ]
})
export class AdquisicionesModule { }
