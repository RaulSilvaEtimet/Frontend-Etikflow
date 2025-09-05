import { LOCALE_ID, NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
//Cambiar fechas a Español
import localEsEc from '@angular/common/locales/es-EC';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localEsEc);
//

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: LOCALE_ID, useValue: 'es-EC' }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
