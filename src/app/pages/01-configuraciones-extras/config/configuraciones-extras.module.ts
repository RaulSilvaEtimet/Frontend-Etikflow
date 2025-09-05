import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionesExtrasRoutingModule } from './configuraciones-extras-routing.module';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';

@NgModule({
  imports: [
    CommonModule,
    ConfiguracionesExtrasRoutingModule,
    PrimeNgModule
  ]
})
export class ConfiguracionesExtrasModule { }
