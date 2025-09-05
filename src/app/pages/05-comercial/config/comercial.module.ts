import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';

import { SharedComponentModule } from 'src/app/shared/components/config/shared.module';
import { ComercialRoutingModule } from './comercial-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ComercialRoutingModule,
    PrimeNgModule,
    SharedComponentModule,
  ]
})
export class ComercialModule { }
