import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ConfiguracionesExtrasDocumentosPDFService } from '../../services/documentos-pddf.service';
import { AdquisicionOrdenCompraCabeceraInterface } from 'src/app/pages/03-adquisiciones/interface/adquisicion-cabecera';
import { AdquisicionOrdenCompraDetalleInterface } from 'src/app/pages/03-adquisiciones/interface/adquisicion-detalle';

@Component({
  selector: 'app-configuraciones-extras-documentos-pdf-orden-compra',
  templateUrl: './orden-compra.component.html',
})
export class ConfiguracionesExtrasDocumentosPDFOrdenCompraComponent {
  pdfService = inject(ConfiguracionesExtrasDocumentosPDFService);

  cabecera: AdquisicionOrdenCompraCabeceraInterface = {
    Adjuntos: null,
    CiudadProveedor: null,
    Comentario: null,
    Compra: "CI000004",
    DirecionProveedor: "16. WEIXIN ROAD, SHUANGFENG TOWN, TAICANG, JANGSU, CHINA",
    EstadoCompra: 2,
    FacturaRemision: null,
    FechaEntrega: new Date("2025-03-31T05:00:00.000Z"),
    FechaPago: null,
    FechaRegistroOrdenCompra: new Date("2025-03-27T13:36:37.637Z"),
    FechaRegistroRecepcionCompra: null,
    IdCompra: 15,
    IdProveedor: 1,
    IdentificacionProveedor: "0",
    NumeroFactura: null,
    NumeroItems: 2,
    OrdenCompra: "PO000005",
    Plazo: 4,
    RazonSocialProveedor: "SUZHOU PIAOZHIHUA COMPOSITE MATERIALS TECHNOLOGY CO., LIMITED",
    SecuencialCompra: 4,
    SecuencialOrdenCompra: 5,
    TarifaIva: null,
    TelefonoProveedor: "",
    UsuarioRegistroOrdenCompra: "pedro.jibaja",
    ValorBaseImponibleIva: 9415.8,
    ValorBruto: 9415.8,
    ValorCree: null,
    ValorDescuento: 0,
    ValorIva: 0,
    ValorNetoCalculado: 9415.8,
    ValorRetencionFuente: null,
    ValorRetencionIva: null,
    ValorTotal: 9415.8,
  };
  detalle: AdquisicionOrdenCompraDetalleInterface[] = [{
    AnchoDetalleCompra: 1530,
    BaseIvaDetalleCompra: 2417.4,
    CantidadCompra: 10,
    CantidadDetalleCompra: 30600,
    CodigoInternoSustrato: "MP0102",
    CodigoTipoMaterial: "02",
    DescargadoDetalleCompra: null,
    DescripcionDetalleCompra: "TERMICO FREZZING RZ5031",
    DescuentoDetalleCompra: null,
    GrupoInventario: "01",
    IdCompra: 15,
    IdDetalleCompra: 99,
    LargoDetalleCompra: 2000,
    NumeroItemDetalleCompra: 1,
    PesoDetalleCompra: 0,
    PesoProductoDetalleCompra: 0,
    PorcentajeDescuentoDescuentoDetalleCompra: null,
    PorcentajeIvaDetalleCompra: 0,
    UnidadMedidaDetalleCompra: "M2",
    ValorDetalleCompra: 0.079,
    ValorIvaDetalleCompra: 0,
    ValorTotalDetalleCompra: 2417.4,
  }];

  @ViewChild('pdfEmbed', { static: false }) pdfEmbed!: ElementRef;

  async generarPDF() {
    const pdf = await this.pdfService.pdfOrdenCompra(this.cabecera, this.detalle);
    this.previsualizarPDF(pdf);
  }

  previsualizarPDF(pdfOutput: string) {
    this.pdfEmbed.nativeElement.src = pdfOutput;
  }

}
