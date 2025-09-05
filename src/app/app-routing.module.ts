import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { loginGuard } from './shared/guards/login.guard';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./pages/00-login/config/login.module').then(m => m.LoginModule)
    }, {
        path: 'home',
        loadChildren: () => import('./pages/00-home/config/home.module').then(m => m.HomeModule),
        canActivate: [loginGuard],
    }, {
        path: 'seguridades',
        component: AppLayoutComponent,
        loadChildren: () => import('./pages/01-seguridades/config/seguridades.module').then(m => m.SeguridadesModule),
        canActivate: [loginGuard]
    }, {
        path: 'configuraciones_extras',
        component: AppLayoutComponent,
        loadChildren: () => import('./pages/01-configuraciones-extras/config/configuraciones-extras.module').then(m => m.ConfiguracionesExtrasModule),
        canActivate: [loginGuard]
    }, {
        path: 'administracion',
        component: AppLayoutComponent,
        loadChildren: () => import('./pages/02-administracion/config/administracion.module').then(m => m.AdministracionModule),
        canActivate: [loginGuard]
    }, {
        path: 'adquisiciones',
        component: AppLayoutComponent,
        loadChildren: () => import('./pages/03-adquisiciones/config/adquisiciones.module').then(m => m.AdquisicionesModule),
        canActivate: [loginGuard],
    }, {
        path: 'bodega',
        component: AppLayoutComponent,
        loadChildren: () => import('./pages/04-bodega/config/bodega.module').then(m => m.BodegaModule),
        canActivate: [loginGuard],
    }, {
        path: 'comercial',
        component: AppLayoutComponent,
        loadChildren: () => import('./pages/05-comercial/config/comercial.module').then(m => m.ComercialModule),
        canActivate: [loginGuard],
    }, {
        path: 'produccion',
        component: AppLayoutComponent,
        loadChildren: () => import('./pages/06-produccion/config/produccion.module').then(m => m.ProduccionModule),
        canActivate: [loginGuard],
    },
    /*
    {
        path: 'servicioTecnico',
        component: AppLayoutComponent,
        loadChildren: () => import('./pages/01-servicio-tecnico/config/servicio-tecnico.module').then(m => m.ServicioTecnicoModule),
    }, 




    */
    { path: 'notfound', loadChildren: () => import('./shared/components/notfound/notfound.module').then(m => m.NotfoundModule) },
    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
