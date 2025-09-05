import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { BodegaRoutingModule } from './bodega-routing.module';

@NgModule({
  imports: [
    CommonModule,
    BodegaRoutingModule,
    PrimeNgModule
  ]
})
export class BodegaModule { }
