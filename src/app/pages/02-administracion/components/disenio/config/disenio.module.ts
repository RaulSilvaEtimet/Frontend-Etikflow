import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { SharedComponentModule } from 'src/app/shared/components/config/shared.module';
import { AdministracionDisenioArtesComponent } from '../components/cirel/cirel.component';
import { AdministracionDisenioPantonesComponent } from '../components/pantones/pantones.component';
import { AdministracionDisenioRoutingModule } from './disenio-routing.module';

@NgModule({
  declarations: [
    AdministracionDisenioArtesComponent,
    AdministracionDisenioPantonesComponent,
  ],
  imports: [
    CommonModule,
    AdministracionDisenioRoutingModule,
    PrimeNgModule,
    SharedComponentModule,
  ]
})
export class AdministracionDisenioModule { }
