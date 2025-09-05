import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeguridadesAdministracionRoutingModule } from './administracion-routing.module';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { SeguridadesAdministracionRolesComponent } from '../roles/roles.component';
import { SeguridadesAdministracionUsuariosComponent } from '../usuarios/usuarios.component';
import { SharedComponentModule } from 'src/app/shared/components/config/shared.module';

@NgModule({
  declarations: [
    SeguridadesAdministracionRolesComponent,
    SeguridadesAdministracionUsuariosComponent
  ],
  imports: [
    CommonModule,
    SeguridadesAdministracionRoutingModule,
    PrimeNgModule,
    SharedComponentModule,
  ]
})
export class SeguridadesAdministracionModule { }
