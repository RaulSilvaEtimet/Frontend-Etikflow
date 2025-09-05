import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'documentos_pdf',
            data: { breadcrumb: 'Documentos PDF' },
            loadChildren: () => import('../components/documentos_pdf/config/documentos-pdf.module').then(m => m.ConfiguracionesExtrasDocumentosPDFModule),
        },
    ])],
    exports: [RouterModule],
})
export class ConfiguracionesExtrasRoutingModule { }