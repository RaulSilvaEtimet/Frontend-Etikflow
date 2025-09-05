import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ConfiguracionesExtrasDocumentosPDFService } from '../../services/documentos-pddf.service';
import { BodegaPrintKardexInterface } from 'src/app/pages/04-bodega/interfaces/print-kardex.';

@Component({
  selector: 'app-configuraciones-extras-documentos-pdf-etiqueta-kardex',
  templateUrl: './etiqueta-kardex.component.html',
})
export class ConfiguracionesExtrasDocumentosPDFEtiquetaKardexComponent {
  pdfService = inject(ConfiguracionesExtrasDocumentosPDFService);

  @ViewChild('pdfEmbed', { static: false }) pdfEmbed!: ElementRef;

  listKardex: BodegaPrintKardexInterface[] = [
    {
      Ancho: 1530,
      CodigoBarras: "MP0101B000000000031",
      CodigoInterno: "MP0101",
      DescripcionInventario: "TERMICO ACRILICO PERMANENTE 25NWS/HP103/BG40",
      FechaRegistro: "2024-12-02",
      FechaRegistroOrdenCompra: "2024-11-25",
      IdKardex: 1,
      Largo: 1000,
      Lote: "1",
      OrdenCompra: "PO000002",
      PesoMaterial: 226.44,
      RazonSocialProveedor: "AVERY DANNISON S.A DE C.V",
      Tipo: "MP",
      TotalM2: 1530,
      NombreGrupo: 'ADHESIVO',
      NombreTipoInventario: 'TERMICO ACRILICO',
    }, {
      Ancho: 1530,
      CodigoBarras: "MP0101B000000000031",
      CodigoInterno: "MP0101",
      DescripcionInventario: "TERMICO ACRILICO PERMANENTE 25NWS/HP103/BG40",
      FechaRegistro: "2024-12-02",
      FechaRegistroOrdenCompra: "2024-11-25",
      IdKardex: 1,
      Largo: 1000,
      Lote: "1",
      OrdenCompra: "PO000002",
      PesoMaterial: 226.44,
      RazonSocialProveedor: "AVERY DANNISON S.A DE C.V",
      Tipo: "MP",
      TotalM2: 1530,
      NombreGrupo: 'ADHESIVO',
      NombreTipoInventario: 'TERMICO ACRILICO',
    }
  ];

  async generarPDF() {
    const pdf = this.pdfService.pdfEtiquetaKardex(this.listKardex, false);
    this.previsualizarPDF(pdf);
  }

  previsualizarPDF(pdfOutput: string) {
    this.pdfEmbed.nativeElement.src = pdfOutput;
  }

}
