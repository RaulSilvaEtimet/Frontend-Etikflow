import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ConfiguracionesExtrasDocumentosPDFService } from '../../services/documentos-pddf.service';
import { BodegaOrdenCorteDescripcionInterface, BodegaOrdenCorteKardexInterface, BodegaOrderCorteCabeceraInterface } from 'src/app/pages/04-bodega/interfaces/order-corte';

@Component({
  selector: 'app-configuraciones-extras-documentos-pdf-orden-corte',
  templateUrl: './orden-corte.component.html',
})
export class ConfiguracionesExtrasDocumentosPDFOrdenCorteComponent {
  pdfService = inject(ConfiguracionesExtrasDocumentosPDFService);

  ordCorCabecera: BodegaOrderCorteCabeceraInterface = {
    IdOrdenCorte: 8,
    Secuencial: 8,
    FechaRegistroOrdenCorte: new Date(),
    Usuario: "pedro.jibaja",
    Estado: 11,
    DescripcionEstado: "Pendiente"
  };
  listOrdCorKardex: BodegaOrdenCorteKardexInterface[] = [{ IdOrdenCorteKardex: 1, IdOrdenCorte: 8, IdKardex: 1, DescripcionInventario: "TERMICO NUEVO", CodigoBarras: "MP0101B000000000031", Ancho: 1530, Largo: 3000, CortesIguales: null, NumeroCortes: 18, MedidasDiferentes: null, AnchoMedido: null, LargoMedido: null, FechaHoraInicio: new Date(), UsuarioInicio: "pedro.jibaja", FechaHoraFin: null, UsuarioFin: null, Estado: 14, IdProveedor: 117, IdentificacionProveedor: "ADE9712225T0", DescripcionEstado: "En Proceso", Peso: 150, Observacion: null, RazonSocialProveedor: '' }, { IdOrdenCorteKardex: 2, IdOrdenCorte: 8, IdKardex: 3, DescripcionInventario: "TERMICO NUEVO", CodigoBarras: "MP0101B000000000033", Ancho: 1530, Largo: 3000, CortesIguales: null, NumeroCortes: 18, MedidasDiferentes: null, AnchoMedido: null, LargoMedido: null, FechaHoraInicio: null, UsuarioInicio: null, FechaHoraFin: null, UsuarioFin: null, Estado: 11, IdProveedor: 117, IdentificacionProveedor: "ADE9712225T0", DescripcionEstado: "Pendiente", Peso: 150, Observacion: null, RazonSocialProveedor: '' }];
  listOrdCorDetalle: BodegaOrdenCorteDescripcionInterface[] = [{ IdDescripcionOrdenCorte: 1, IdOrdenCorte: 8, AnchoCorte: "250,250,250,250,250,280", LargoCorte: 1000, Parada: 1 }, { IdDescripcionOrdenCorte: 2, IdOrdenCorte: 8, AnchoCorte: "250,250,250,250,250,280", LargoCorte: 1000, Parada: 2 }, { IdDescripcionOrdenCorte: 3, IdOrdenCorte: 8, AnchoCorte: "250,250,250,250,250,280", LargoCorte: 1000, Parada: 3 }];

  @ViewChild('pdfEmbed', { static: false }) pdfEmbed!: ElementRef;

  async generarPDF() {
    const pdf = await this.pdfService.pdfOrdenCorte(this.ordCorCabecera, this.listOrdCorKardex, this.listOrdCorDetalle);
    this.previsualizarPDF(pdf);
  }

  previsualizarPDF(pdfOutput: string) {
    this.pdfEmbed.nativeElement.src = pdfOutput;
  }

}
