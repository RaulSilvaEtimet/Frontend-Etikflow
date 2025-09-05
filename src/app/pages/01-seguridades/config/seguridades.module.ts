import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeguridadesRoutingModule } from './seguridades-routing.module';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';

@NgModule({
  imports: [
    CommonModule,
    SeguridadesRoutingModule,
    PrimeNgModule
  ]
})
export class SeguridadesModule { }
