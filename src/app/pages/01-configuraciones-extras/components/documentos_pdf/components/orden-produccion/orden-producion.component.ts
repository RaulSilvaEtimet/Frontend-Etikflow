import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ConfiguracionesExtrasDocumentosPDFService } from '../../services/documentos-pddf.service';
import { BodegaOrdenCorteDescripcionInterface, BodegaOrdenCorteKardexInterface, BodegaOrderCorteCabeceraInterface } from 'src/app/pages/04-bodega/interfaces/order-corte';

@Component({
  selector: 'app-configuraciones-extras-documentos-pdf-orden-produccion',
  templateUrl: './orden-produccion.component.html',
})
export class ConfiguracionesExtrasDocumentosPDFOrdenProduccionComponent {
  pdfService = inject(ConfiguracionesExtrasDocumentosPDFService);

  @ViewChild('pdfEmbed', { static: false }) pdfEmbed!: ElementRef;

  cliente: string = 'CORPORACION EL ROSADO';
  asesorComercial: string = 'GEORGINA MATOS';
  nombreProducto: string = 'ETIQ TERMICO RECUBIERTO C1 TR 14.5 X 8 1000UR 1F MAGENTA LAMINADO MATE';
  numOP: number = 1;
  codNuevo: string = '01010101F00030001';
  codAntiguo: string = 'NA';
  tipoTrabajo: string = 'ETIQUETA ADHESIVA IMPRESA';
  fechaIngreso: string = '12-FEB-2025';
  cantFabricar: number = 10000;
  cantXRollo: number = 1000;
  unidadTrabajo = 'ETIQUETA';
  codTroquel: string = 'T5302';
  descTroque: string = "T5302-145-80-Z96-TP";
  gapAvance: number = 7.4;
  cilindro: number = 96;
  desarrollo: number = 304.8;
  repAncho: number = 1;
  corteSeguridad: string = 'NO';
  numeroFilas: number = 1;
  acabado: string = 'LAMINADO MATE';
  avanceEtiq: number = 14.5;
  anchoEtiq: number = 8;
  cono: string = 'C1';
  tipoCorte: string = "TR"
  mLineales: number = 1676.4;
  mCuadrados: number = 167.64;
  rolloProd: number = 10;
  maquina1: string = 'MARK ANDY 2100';
  maquina2: string = 'TROQUELADORA PLANA 1';
  maquina3: string = 'REBOBINADORA 1';
  maquina4: string = "";
  materiaPrima: string = "0101-TERMICO RECUBIERTO";
  anchoMaterial: number = 10;
  rebobinado: string = 'R1';
  cajas: string = 'CON LOGO';
  codArte: string = '0605';
  color1: string = "BLACK";
  color2: string = "CYAN";
  color3: string = "P3502C";
  color4: string = "";
  color5: string = "";
  color6: string = "";
  color7: string = "";
  color8: string = "";
  obsAsesor: string = "";


  async generarPDF() {
    const pdf = await this.pdfService.pdfOrdenProduccion(this.cliente, this.asesorComercial, this.nombreProducto, this.numOP, this.codNuevo, this.codAntiguo, this.tipoTrabajo, this.fechaIngreso, this.cantFabricar, this.cantXRollo, this.unidadTrabajo, this.codTroquel, this.descTroque, this.gapAvance, this.cilindro, this.desarrollo, this.repAncho, this.corteSeguridad, this.numeroFilas, this.acabado, this.avanceEtiq, this.anchoEtiq, this.cono, this.tipoCorte, this.mLineales, this.mCuadrados, this.rolloProd, this.maquina1, this.maquina2, this.maquina3, this.maquina4, this.materiaPrima, this.anchoMaterial, this.rebobinado, this.cajas, this.codArte, this.color1, this.color2, this.color3, this.color4, this.color5, this.color6, this.color7, this.color8, this.obsAsesor);
    this.previsualizarPDF(pdf);
  }

  previsualizarPDF(pdfOutput: string) {
    this.pdfEmbed.nativeElement.src = pdfOutput;
  }

}
