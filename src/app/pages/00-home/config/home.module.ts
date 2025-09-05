import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { HomeComponent } from '../components/home/home.component';
import { SharedComponentModule } from 'src/app/shared/components/config/shared.module';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    PrimeNgModule,
    SharedComponentModule,
  ]
})
export class HomeModule { }
