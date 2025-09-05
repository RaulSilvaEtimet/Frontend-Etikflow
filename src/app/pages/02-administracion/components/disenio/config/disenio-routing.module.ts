import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { permisosGuard } from 'src/app/shared/guards/permisos.guard';
import { AdministracionDisenioArtesComponent } from '../components/cirel/cirel.component';
import { AdministracionDisenioPantonesComponent } from '../components/pantones/pantones.component';

@NgModule({
    imports: [RouterModule.forChild([{
        path: 'artes',
        data: { breadcrumb: 'Artes' },
        component: AdministracionDisenioArtesComponent,
        canActivate: [permisosGuard],
    }, {
        path: 'pantones',
        data: { breadcrumb: 'Pantones' },
        component: AdministracionDisenioPantonesComponent,
        canActivate: [permisosGuard],
    },
    ])],
    exports: [RouterModule],
})
export class AdministracionDisenioRoutingModule { }