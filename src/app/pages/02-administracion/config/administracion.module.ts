import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministracionRoutingModule } from './administracion-routing.module';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';

@NgModule({
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    PrimeNgModule
  ]
})
export class AdministracionModule { }
