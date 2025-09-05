import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { ConfiguracionesExtrasDocumentosPDFRoutingModule } from './documentos-pdf-routing.module';
import { ConfiguracionesExtrasDocumentosPDFOrdenCorteComponent } from '../components/orden-corte/orden-corte.component';
import { ConfiguracionesExtrasDocumentosPDFEtiquetaKardexComponent } from '../components/etiqueta-kardex/etiqueta-kardex.component';
import { ConfiguracionesExtrasDocumentosPDFOrdenProduccionComponent } from '../components/orden-produccion/orden-producion.component';
import { ConfiguracionesExtrasDocumentosPDFOrdenCompraComponent } from '../components/orden-compra/orden-compra.component';


@NgModule({
  declarations: [
    ConfiguracionesExtrasDocumentosPDFOrdenCorteComponent,
    ConfiguracionesExtrasDocumentosPDFEtiquetaKardexComponent,
    ConfiguracionesExtrasDocumentosPDFOrdenProduccionComponent,
    ConfiguracionesExtrasDocumentosPDFOrdenCompraComponent,
  ],
  imports: [
    CommonModule,
    ConfiguracionesExtrasDocumentosPDFRoutingModule,
    PrimeNgModule
  ]
})
export class ConfiguracionesExtrasDocumentosPDFModule { }
