import { Injectable } from '@angular/core';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import JsBarcode from 'jsbarcode';
import { BodegaOrdenCorteDescripcionInterface, BodegaOrdenCorteKardexInterface, BodegaOrderCorteCabeceraInterface } from 'src/app/pages/04-bodega/interfaces/order-corte';
import { BodegaPrintKardexInterface } from 'src/app/pages/04-bodega/interfaces/print-kardex.';
import { AdquisicionOrdenCompraCabeceraInterface } from 'src/app/pages/03-adquisiciones/interface/adquisicion-cabecera';
import { AdquisicionOrdenCompraDetalleInterface } from 'src/app/pages/03-adquisiciones/interface/adquisicion-detalle';
import { ProduccionOrdenProduccionInterface } from 'src/app/pages/06-produccion/interfaces/orden_produccion.interface';
import { ComercialCotizacionesCabeceraInterface, ComercialCotizacionesDetalleInterface } from 'src/app/pages/05-comercial/interfaces/cotizaciones.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionesExtrasDocumentosPDFService {

  pdfOrdenCorte(cabecera: BodegaOrderCorteCabeceraInterface, kardex: BodegaOrdenCorteKardexInterface[], detalle: BodegaOrdenCorteDescripcionInterface[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const doc = new jsPDF();

      const imageUrl = 'assets/intranet/01-configuraciones-extras/etimet-documentos.png';
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        doc.addImage(img, 'PNG', 10, 17.5, 45, 37.5);

        doc.setFont('times', 'normal', 'bold');
        doc.setFontSize(20)
        doc.text('IMPORTADORA CARPIO & CORDERO CIA. LTDA ', 105, 10, { align: 'center' });
        doc.line(10, 12.5, 200, 12.5);

        doc.setFont('times', 'normal', 'bold');
        doc.setFontSize(12)
        doc.text('Encargado:', 60, 20);
        doc.text('Fecha:', 60, 27.5);
        doc.text('Total cortes:', 60, 35);
        doc.text('# de Orden:', 60, 42.5);
        doc.text('Proveedor:', 60, 50);

        doc.setFont('times', 'normal', 'normal');
        doc.text(cabecera.Usuario ?? '', 85, 20);
        doc.text(new Date(cabecera.FechaRegistroOrdenCorte!).toLocaleString(), 85, 27.5);
        doc.text(detalle.reduce((acc, item) => { return acc += item.AnchoCorte!.split(',').length; }, 0).toString(), 85, 35);
        doc.text(cabecera.Secuencial?.toString() ?? '', 85, 42.5);
        doc.text(kardex[0].RazonSocialProveedor ?? '', 85, 50);

        doc.line(10, 60, 200, 60);

        const columnsKardex = ['IdKardex', 'CodigoBarras', 'DescripcionInventario', 'Ancho', 'Largo'];
        const dataKardex = kardex.map((item: any) => {
          const filteredItem: any[] = [];
          columnsKardex.forEach(column => {
            filteredItem.push(item[column]);
          });
          return filteredItem;
        });
        (doc as any).autoTable({
          head: [['Id', 'Codigo Barras', 'Sustrato', 'Ancho', 'Largo', 'Calibracion', '1ra Parada', '2da Parada']],
          body: dataKardex,
          startY: 65,
        });

        const lastY = (doc as any).lastAutoTable.finalY;
        const columnsDetalle = ['Parada', 'AnchoCorte', 'LargoCorte'];
        const dataDetalle = detalle.map((item: any) => {
          const filteredItem: any[] = [];
          columnsDetalle.forEach(column => {
            filteredItem.push(item[column]);
          });
          return filteredItem;
        });

        (doc as any).autoTable({
          head: [['Parada', 'Ancho Corte', 'Largo Corte']],
          body: dataDetalle,
          startY: lastY + 10,
        });

        const pdfOutput: string = doc.output('datauristring');
        doc.output('dataurlnewwindow'); //para exportar directo
        resolve(pdfOutput);
      };

      img.onerror = (error) => {
        reject('Error al cargar la imagen: ' + error);
      };
    });
  }

  pdfEtiquetaKardex(jsonData: BodegaPrintKardexInterface[], exportar: boolean): string {
    const doc = new jsPDF({
      unit: 'mm',
      format: [100, 150],
      orientation: 'portrait'
    });
    doc.setFont("helvetica", "bold");

    jsonData.forEach((item, key) => {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, item.CodigoInterno, {
        format: 'CODE128',
        lineColor: '#000',
        width: 2,
        height: 100,
        font: 'sans-serif',
        fontOptions: 'bold',
        fontSize: 30,
        margin: 0,
        textMargin: 0,
        displayValue: false
      });
      doc.addImage(canvas.toDataURL('image/png'), 'JPEG', 5, 36, 35, 20);

      const canvas2 = document.createElement('canvas');
      JsBarcode(canvas2, item.CodigoBarras, {
        format: 'CODE128',
        lineColor: '#000',
        width: 2,
        height: 100,
        font: 'sans-serif',
        fontOptions: 'bold',
        fontSize: 30,
        margin: 0,
        textMargin: 0,
        displayValue: false
      });
      doc.addImage(canvas2.toDataURL('image/png'), 'JPEG', 5, 105, 90, 27.5);

      doc.setFontSize(12);
      const grupoInventario = doc.splitTextToSize(item.NombreGrupo, 90);
      doc.text(grupoInventario, 5, 7.5);

      doc.setFontSize(12);
      const tipoInventario = doc.splitTextToSize(item.NombreTipoInventario, 90);
      doc.text(tipoInventario, 5, 13.5);

      doc.setFontSize(12);
      const material = doc.splitTextToSize(item.DescripcionInventario, 90);
      doc.text(material, 5, 19.5);

      doc.rect(18, 28, 8, 6.5, 'F');
      doc.setFontSize(14).setTextColor(255, 255, 255);
      doc.text('MP', 18.25, 33);

      doc.setFontSize(10).setTextColor(0, 0, 0);
      doc.text('OC', 42.5, 35);
      doc.text(item.OrdenCompra ?? '', 58, 35);
      doc.text('PROV', 42.5, 40);
      let prov = doc.splitTextToSize(item.RazonSocialProveedor, 40);

      if (prov.length > 3) {
        prov = prov.slice(0, 3);
        prov[2] += ' ....';
      }

      doc.text(prov, 58, 40);
      doc.text('F. OC', 42.5, 52.5);
      doc.text(item.FechaRegistroOrdenCompra ?? '', 58, 52.5);
      doc.text('F. REG', 42.5, 57.5);
      doc.text(item.FechaRegistro, 58, 57.5);

      doc.rect(4, 64, 36.5, 6.5, 'F');
      doc.setFontSize(14).setTextColor(255, 255, 255);
      doc.text('DIMENSIONES', 5, 69);

      doc.setFontSize(12).setTextColor(0, 0, 0);
      doc.text('ANCHO mm', 5, 77);
      doc.text(item.Ancho.toFixed(2), 32.5, 77);
      doc.text('LARGO m', 5, 83);
      doc.text(item.Largo.toFixed(2), 32.5, 83);
      doc.text('LOTE #', 5, 89);
      doc.text(item.Lote, 32.5, 89);
      doc.text('SALDO m2 ', 53, 77);
      doc.text(item.TotalM2.toFixed(2), 77.5, 77);
      doc.text('PESO kg', 53, 83);
      doc.text(item.PesoMaterial.toFixed(2), 77.5, 83);

      doc.rect(4, 95, 7, 6.5, 'F');
      doc.setFontSize(14).setTextColor(255, 255, 255);
      doc.text('ID', 5, 100);
      doc.setTextColor(0, 0, 0);
      doc.text(item.IdKardex.toString(), 15, 100);

      doc.setFontSize(16);
      doc.text(item.CodigoInterno, 22.5, 62, { align: 'center' });
      doc.text(item.CodigoBarras, 50, 138.5, { align: 'center' });

      if (key !== jsonData.length - 1)
        doc.addPage();
    });

    const pdfOutput: string = doc.output('datauristring');
    if (exportar)
      this.openPdfInNewTab(pdfOutput);
    return pdfOutput
  }

  pdfOrdenProduccion(
    cliente: string, asesorComercial: string, nombreProducto: string, numOP: number, codNuevo: string, codAntiguo: string, tipoTrabajo: string, fechaIngreso: string, cantFabricar: number, cantXRollo: number, unidadTrabajo: string, codTroquel: string, descTroque: string, gapAvance: number, cilindro: number, desarrollo: number, repAncho: number, corteSeguridad: string, numFilas: number, acabado: string, avanceEtiq: number, anchoEtiq: number, cono: string, tipoCorte: string, mLineales: number, mCuadrados: number, rolloProd: number, maquina1: string, maquina2: string, maquina3: string, maquina4: string, materiaPrima: string, anchoMaterial: number, rebobinado: string, cajas: string, codArte: string, color1: string, color2: string, color3: string, color4: string, color5: string, color6: string, color7: string, color8: string, obsAsesor: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const doc = new jsPDF();

      const imageUrl = 'assets/intranet/01-configuraciones-extras/etimet-documentos.png';
      const controlInsumos = 'assets/intranet/01-configuraciones-extras/orden_produccion/control_insumos.jpg';
      const controlProduccion = 'assets/intranet/01-configuraciones-extras/orden_produccion/control_produccion.jpg';

      const imgControlInsumos = new Image();
      imgControlInsumos.src = controlInsumos;
      const imgControlProduccion = new Image();
      imgControlProduccion.src = controlProduccion;

      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        doc.addImage(img, 'PNG', 15, 5, 20, 15);

        // Título
        doc.setFontSize(20);
        doc.setTextColor(30, 170, 226);
        doc.setFont('', 'bold');
        doc.text(`ORDEN DE PRODUCCIÓN #${numOP}`, 105, 15, { align: 'center' });

        // Cliente y asesor
        const body = [
          ['CLIENTE', cliente],
          ['ASESOR COMERCIAL', asesorComercial],
          ['PRODUCTO', { content: nombreProducto, styles: { fontSize: 10, textColor: 'FF0000', styles: { fontStyle: 'bold' } } }],
        ];
        autoTable(doc, {
          body: body,
          theme: 'grid',
          startY: 25,
          tableWidth: 195,
          head: [[{
            content: 'INFORMACIÓN',
            colSpan: 2,
            styles: { halign: 'center', fillColor: [30, 170, 226], cellPadding: 1 },
          }]],
          bodyStyles: { fontSize: 8, halign: 'center', cellPadding: 1 },
          columnStyles: { 0: { halign: 'left', cellWidth: 35 } },
          margin: { left: 7.5 },
        });

        const posYOne = (doc as any).lastAutoTable.finalY;
        //DATOS GENERALES
        const bodyOp = [
          ['NO ORDEN', { content: numOP, styles: { fontSize: 10, textColor: 'FF0000', styles: { fontStyle: 'bold' } } }],
          ['COD NUEVO', codNuevo],
          ['COD ANTIGUO', codAntiguo],
          ['GRUPO', { content: tipoTrabajo, styles: { fontSize: 10, textColor: 'FF0000', styles: { fontStyle: 'bold' } } }],
          ['FEC. INGRESO', fechaIngreso],
          ['CANT. FABRICAR', cantFabricar],
          ['UNIDAD X ROLLO', cantXRollo],
          ['UNIDAD TRABAJO', unidadTrabajo],
        ];
        doc.setFontSize(12);
        autoTable(doc, {
          body: bodyOp,
          theme: 'grid',
          startY: posYOne + 5,
          tableWidth: 95,
          head: [[{
            content: 'DATOS GENERALES',
            colSpan: 2,
            styles: { halign: 'center', fillColor: [30, 170, 226], cellPadding: 1 },
          }]],
          bodyStyles: { fontSize: 8, halign: 'center', cellPadding: 1 },
          columnStyles: { 0: { halign: 'left', cellWidth: 27.5 } },
          margin: { left: 7.5 },
        });

        //DATOS ELABORACION
        const bodyElaboracion = [
          ['TROQUEL', { content: codTroquel, styles: { fontSize: 10, textColor: 'FF0000', styles: { fontStyle: 'bold' } } }],
          ['DESCRIPCION', descTroque],
          ['GAP', gapAvance],
          ['CILINDRO', cilindro],
          ['DESARROLLO', desarrollo],
          ['REP ANCHO', repAncho],
          ['CORTE SEGURIDAD', { content: corteSeguridad, styles: { fontSize: 10, textColor: 'FF0000', styles: { fontStyle: 'bold' } } }],
          ['NUMERO DE FILAS', numFilas]
        ];
        doc.setFontSize(12);
        autoTable(doc, {
          body: bodyElaboracion,
          theme: 'grid',
          startY: posYOne + 5,
          tableWidth: 95,
          head: [[{
            content: 'DATOS ELABORACIÓN',
            colSpan: 2,
            styles: { halign: 'center', fillColor: [30, 170, 226], cellPadding: 1 },
          }]],
          bodyStyles: { fontSize: 8, halign: 'center', cellPadding: 1 },
          columnStyles: { 0: { halign: 'left', cellWidth: 30 } },
          margin: { left: 107.5 },
        });

        const posYTwo = (doc as any).lastAutoTable.finalY;

        //DATOS PRODUCTO
        const bodyProdTerm = [
          ['ACABADO', { content: acabado, styles: { fontSize: 10, textColor: 'FF0000', styles: { fontStyle: 'bold' } } }],
          ['AVANCE', avanceEtiq],
          ['ANCHO', anchoEtiq],
          ['NUCLEO', { content: cono, styles: { fontSize: 10, textColor: 'FF0000', styles: { fontStyle: 'bold' } } }],
          ['TIPO', { content: tipoCorte, styles: { fontSize: 10, textColor: 'FF0000', styles: { fontStyle: 'bold' } } }],
          ['METROS LINEALES', new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(mLineales)],
          ['METROS CUADRADOS', new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(mCuadrados)],
          ['ROLLOS PRODUCIDOS', rolloProd],
        ];
        autoTable(doc, {
          body: bodyProdTerm,
          theme: 'grid',
          startY: posYTwo + 5,
          tableWidth: 95,
          head: [[{
            content: 'INFORMACION DEL PRODUCTO',
            colSpan: 2,
            styles: { halign: 'center', fillColor: [30, 170, 226], cellPadding: 1 },
          }]],
          bodyStyles: { fontSize: 8, halign: 'center', cellPadding: 1 },
          columnStyles: { 0: { halign: 'left', cellWidth: 35 } },
          margin: { left: 7.5 },
        });

        //DATOS PROCESO
        const bodyProCESO = [
          ['MAQUINA 1', maquina1],
          ['MAQUINA 2', maquina2],
          ['MAQUINA 3', maquina3],
          ['MAQUINA 4', maquina4],
          ['MATERIA PRIMA', { content: materiaPrima, styles: { fontSize: 10, textColor: 'FF0000', styles: { fontStyle: 'bold' } } }],
          ['ANCHO MATERIAL', { content: anchoMaterial, styles: { fontSize: 10, textColor: 'FF0000', styles: { fontStyle: 'bold' } } }],
          ['REBOBINADO', { content: rebobinado, styles: { fontSize: 10, textColor: 'FF0000', styles: { fontStyle: 'bold' } } }],
          ['CAJAS', cajas],
        ];
        autoTable(doc, {
          body: bodyProCESO,
          theme: 'grid',
          startY: posYTwo + 5,
          tableWidth: 95,
          head: [[{
            content: 'INFORMACION DEL PROCESO',
            colSpan: 2,
            styles: { halign: 'center', fillColor: [30, 170, 226], cellPadding: 1 },
          }]],
          bodyStyles: { fontSize: 8, halign: 'center', cellPadding: 1 },
          columnStyles: { 0: { halign: 'left', cellWidth: 30 } },
          margin: { left: 107.5 },
        });

        const posYThree = (doc as any).lastAutoTable.finalY;

        //COLORES
        const bodyColor = [
          ['CODIGO ARTE', codArte],
          ['COLOR 1', color1],
          ['COLOR 2', color2],
          ['COLOR 3', color3],
          ['COLOR 4', color4],
          ['COLOR 5', color5],
          ['COLOR 6', color6],
          ['COLOR 7', color7],
          ['COLOR 8', color8],
        ];
        autoTable(doc, {
          body: bodyColor,
          theme: 'grid',
          startY: posYThree + 5,
          tableWidth: 95,
          head: [[{
            content: 'INFORMACION DEL COLORES',
            colSpan: 2,
            styles: { halign: 'center', fillColor: [30, 170, 226], cellPadding: 1 },
          }]],
          bodyStyles: { fontSize: 8, halign: 'center', cellPadding: 1 },
          columnStyles: { 0: { halign: 'left', cellWidth: 35 } },
          margin: { left: 7.5 },
        });

        const posYFour = (doc as any).lastAutoTable.finalY;

        //OBSERVACIONES
        const bodyObservación = [
          ['OBSERVACION ASESOR', obsAsesor],
          ['OBSERVACION PRODUCCION', ''],
        ];
        autoTable(doc, {
          body: bodyObservación,
          theme: 'grid',
          startY: posYFour + 5,
          tableWidth: 195,
          head: [[{
            content: 'OBSERVACIONES',
            colSpan: 2,
            styles: { halign: 'center', fillColor: [30, 170, 226], cellPadding: 1 },
          }]],
          bodyStyles: { fontSize: 8 },
          columnStyles: { 0: { halign: 'left', cellWidth: 30 } },
          margin: { left: 7.5 },
        });

        //AGREGAR EL RESTO
        doc.addPage();
        doc.addImage(imgControlProduccion, 'PNG', 0, 0, 210, 297);
        doc.addPage();
        doc.addImage(imgControlInsumos, 'PNG', 0, 0, 210, 297);

        const pdfOutput: string = doc.output('datauristring');
        doc.output('dataurlnewwindow'); //para exportar directo
        resolve(pdfOutput);
      };

      img.onerror = (error) => {
        reject('Error al cargar la imagen: ' + error);
      };
    });
  }

  openPdfInNewTab(pdfBase64: string) {
    // Decodificar el base64 a un Blob (Tipo 'application/pdf')
    const byteCharacters = atob(pdfBase64.split(',')[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    // Crear el Blob con el contenido decodificado
    const pdfBlob = new Blob(byteArrays, { type: 'application/pdf' });
    // Crear una URL para el Blob
    const pdfUrl = URL.createObjectURL(pdfBlob);
    // Abrir el PDF en una nueva pestaña
    window.open(pdfUrl, '_blank');
  }

  pdfOrdenCompra(cabecera: AdquisicionOrdenCompraCabeceraInterface, detalle: AdquisicionOrdenCompraDetalleInterface[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const doc = new jsPDF();

      const imageUrl = 'assets/intranet/01-configuraciones-extras/etimet-documentos.png';

      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        doc.addImage(img, 'PNG', 15, 5, 20, 15);

        // Título
        doc.setFontSize(20);
        doc.setTextColor(30, 170, 226);
        doc.setFont('', 'bold');
        doc.text("ORDEN DE COMPRA", 105, 15, { align: 'center' });
        doc.text(cabecera.OrdenCompra ?? '', 185, 15, { align: 'center' });

        // Cliente y asesor
        const body = [
          ['PROVEEDOR', { content: cabecera.RazonSocialProveedor ?? '', colSpan: 3, styles: { fontSize: 8, styles: { fontStyle: 'bold' } } }],
          ['DIRECCION', { content: cabecera.DirecionProveedor ?? '', colSpan: 3, styles: { fontSize: 8, styles: { fontStyle: 'bold' } } }],
          ['ORDEN COMPRA',
            { content: cabecera.OrdenCompra ?? '', styles: { fontSize: 8, styles: { fontStyle: 'bold' } } },
            'COMPRA',
            { content: cabecera.Compra ?? '', styles: { fontSize: 8, styles: { fontStyle: 'bold' } } }
          ],
          [
            'FECHA CREACION',
            {
              content: new Date(cabecera.FechaRegistroOrdenCompra!).toLocaleDateString('es-ES'), styles: { fontSize: 8, styles: { fontStyle: 'bold' } }
            },
            'FECHA ENTREGA',
            { content: new Date(cabecera.FechaEntrega!).toLocaleDateString('es-ES'), styles: { fontSize: 8, styles: { fontStyle: 'bold' } } }
          ]
        ];
        autoTable(doc, {
          body: body,
          theme: 'grid',
          startY: 25,
          tableWidth: 195,
          head: [[{
            content: 'INFORMACIÓN',
            colSpan: 4,
          }]],
          headStyles: { halign: 'center', fillColor: [30, 170, 226], cellPadding: 1 },
          bodyStyles: { fontSize: 8, halign: 'center', cellPadding: 1 },
          columnStyles: { 0: { halign: 'left', cellWidth: 35 } },
          margin: { left: 7.5 },
        });

        const posYOne = (doc as any).lastAutoTable.finalY;
        //DATOS DETALLE
        const bodyDetalle = detalle.map((item) => {
          const filteredItem: any[] = [];
          filteredItem.push(item.CodigoInternoSustrato);
          filteredItem.push(item.DescripcionDetalleCompra);
          filteredItem.push(item.CantidadCompra);
          filteredItem.push(item.AnchoDetalleCompra);
          filteredItem.push(item.LargoDetalleCompra);
          filteredItem.push(item.CantidadDetalleCompra)
          filteredItem.push(item.ValorDetalleCompra);
          filteredItem.push(item.ValorTotalDetalleCompra);
          return filteredItem;
        });

        bodyDetalle.map(item => {
          item[3] = new Intl.NumberFormat('en-US', {}).format(item[3]);
          item[4] = new Intl.NumberFormat('en-US', {}).format(item[4]);
          item[5] = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 3
          }).format(item[5]);
          item[6] = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 3
          }).format(item[6]);
          item[7] = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
          }).format(item[7]);
        });

        doc.setFontSize(12);
        autoTable(doc, {
          body: bodyDetalle,
          theme: 'grid',
          startY: posYOne + 5,
          tableWidth: 195,
          head: [['Codigo', 'Descripcion', 'Cantidad', 'Ancho', 'Largo', 'M2', 'Valor m2', 'Total']],
          headStyles: { halign: 'center', fillColor: [30, 170, 226], cellPadding: 1 },
          bodyStyles: { fontSize: 8, halign: 'center', cellPadding: 1 },
          columnStyles: {
            0: { halign: 'left' },
            1: { halign: 'left' },
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'right' },
            5: { halign: 'right' },
            6: { halign: 'right' },
            7: { halign: 'right' },
          },
          margin: { left: 7.5 },
        });

        //DATOS ELABORACION
        const finalTable: any = {
          ValorBaseImponibleIva: cabecera.ValorBaseImponibleIva,
          ValorIva: cabecera.ValorIva,
          ValorTotal: cabecera.ValorTotal
        };

        const bodyElaboracion = [
          [
            'SUBTOTAL',
            new Intl.NumberFormat('en-US',
              { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(finalTable.ValorBaseImponibleIva)
          ],
          [
            'IVA',
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(finalTable.ValorIva)
          ],
          [
            'TOTAL',
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(finalTable.ValorTotal)
          ],
        ];

        doc.setFontSize(12);
        autoTable(doc, {
          body: bodyElaboracion,
          theme: 'grid',
          startY: 250,
          tableWidth: 50,
          head: [[{
            content: 'VALORES',
            colSpan: 2,
            styles: { halign: 'center', fillColor: [30, 170, 226], cellPadding: 1 },
          }]],
          bodyStyles: { fontSize: 8, halign: 'center', cellPadding: 1 },
          columnStyles: {
            0: { halign: 'left', cellWidth: 30 },
            1: { halign: 'right' }
          },
          margin: { left: 152.5 },
        });

        const pdfOutput: string = doc.output('datauristring');
        doc.output('dataurlnewwindow'); //para exportar directo
        resolve(pdfOutput);
      };

      img.onerror = (error) => {
        reject('Error al cargar la imagen: ' + error);
      };
    });
  }

  pdfCotizacionItem(cabecera: ComercialCotizacionesCabeceraInterface, detalle: ComercialCotizacionesDetalleInterface, oP: ProduccionOrdenProduccionInterface | null): Promise<string> {
    return new Promise((resolve, reject) => {
      const doc = new jsPDF();

      const imageUrl = 'assets/intranet/01-configuraciones-extras/etimet-documentos.png';

      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        doc.addImage(img, 'PNG', 15, 5, 20, 15);

        // Título
        doc.setFontSize(20);
        doc.setTextColor(30, 170, 226);
        doc.setFont('', 'bold');
        doc.text(`COTIZACION #${cabecera.SecuencialCotizacion}`, 105, 15, { align: 'center' });

        const body = [
          ['CLIENTE', cabecera.RazonSocialCliente ?? ''],
          ['DIRECCION', cabecera.Direccioncliente ?? ''],
          ['IDENTIFICACION', cabecera.IdentificacionCliente ?? ''],
          ['NOMBRE PRODUCTO', oP?.NombreTrabajo ?? ''],
          ['CODIGO PRODUCTO', oP?.CodigoTrabajo ?? ''],
          ['NOMBRE COMERCIAL', detalle.DescripcionTrabajo],
        ];
        autoTable(doc, {
          body: body,
          theme: 'grid',
          startY: 25,
          tableWidth: 195,
          head: [[{
            content: 'INFORMACIÓN',
            colSpan: 2,
          }]],
          headStyles: { halign: 'center', fillColor: [30, 170, 226], cellPadding: 1 },
          bodyStyles: { fontSize: 8, cellPadding: 1 },
          columnStyles: { 0: { halign: 'left', cellWidth: 35 } },
          margin: { left: 7.5 },
        });

        const posYOne = (doc as any).lastAutoTable.finalY;
        const bodyOp = [
          ['TIPO TRABAJO', detalle.TipoTrabajo],
          ['MATERIAL', detalle.TipoInventario],
          ['TIPO', detalle.TipoCorte.split('-')[1]],
          ['NUCLEO', detalle.Cono],
          ['ROBOBINADO', detalle.Rebobinado],
          ['ARTE/PANTONE', `${detalle.EspecificacionTipoBFD}-${detalle.CodigoEspecificacionTipoBFD}`],
        ];
        doc.setFontSize(12);
        autoTable(doc, {
          body: bodyOp,
          theme: 'grid',
          startY: posYOne + 5,
          tableWidth: 95,
          head: [[{
            content: 'DATOS TRABAJO',
            colSpan: 2,
            styles: { halign: 'center', fillColor: [30, 170, 226], cellPadding: 1 },
          }]],
          bodyStyles: { fontSize: 8, cellPadding: 1 },
          columnStyles: { 0: { halign: 'left', cellWidth: 27.5 } },
          margin: { left: 7.5 },
        });

        const bodyElaboracion = [
          ['CANTIDAD', detalle.CantidadPorFabricar],
          ['ACABADO', detalle.DescripcionAcabado ?? ''],
          ['UNIDADES ROLLO', detalle.UnidadesPorRollo],
          ['FILAS', detalle.FilasPorRollo],
          ['AVANCE', detalle.Avance],
          ['ANCHO', detalle.Ancho],
        ];
        doc.setFontSize(12);
        autoTable(doc, {
          body: bodyElaboracion,
          theme: 'grid',
          startY: posYOne + 5,
          tableWidth: 95,
          head: [[{
            content: 'DATOS ETIQUETA',
            colSpan: 2,
            styles: { halign: 'center', fillColor: [30, 170, 226], cellPadding: 1 },
          }]],
          bodyStyles: { fontSize: 8, cellPadding: 1 },
          columnStyles: { 0: { halign: 'left', cellWidth: 30 } },
          margin: { left: 107.5 },
        });

        const posYTwo = (doc as any).lastAutoTable.finalY;
        const bodyExtra = [
          ['FORMA', detalle.FormatoTroquel],
          ['PREPICADO', detalle.Prepicado ? 'SI' : 'NO'],
          ['CORTE SEGURIDAD', detalle.CorteSeguridad ? 'SI' : 'NO'],
          ['DISTRIBUIDOR', detalle.Distribuidor ? 'SI' : 'NO'],
        ];
        doc.setFontSize(12);
        autoTable(doc, {
          body: bodyExtra,
          theme: 'grid',
          startY: posYTwo + 5,
          tableWidth: 95,
          head: [[{
            content: 'DATOS EXTRA',
            colSpan: 2,
            styles: { halign: 'center', fillColor: [30, 170, 226], cellPadding: 1 },
          }]],
          bodyStyles: { fontSize: 8, cellPadding: 1 },
          columnStyles: { 0: { halign: 'left', cellWidth: 30 } },
          margin: { left: 7.5 },
        });

        const bodyColor = [
          ['COLOR 1', detalle.Color1 ?? ''],
          ['COLOR 2', detalle.Color2 ?? ''],
          ['COLOR 3', detalle.Color3 ?? ''],
          ['COLOR 4', detalle.Color4 ?? ''],
          ['COLOR 5', detalle.Color5 ?? ''],
          ['COLOR 6', detalle.Color6 ?? ''],
          ['COLOR 7', detalle.Color7 ?? ''],
          ['COLOR 8', detalle.Color8 ?? ''],
        ];
        autoTable(doc, {
          body: bodyColor,
          theme: 'grid',
          startY: posYTwo + 5,
          tableWidth: 95,
          head: [[{
            content: 'INFORMACION DEL COLORES',
            colSpan: 2,
            styles: { halign: 'center', fillColor: [30, 170, 226], cellPadding: 1 },
          }]],
          bodyStyles: { fontSize: 8, cellPadding: 1 },
          columnStyles: { 0: { halign: 'left', cellWidth: 35 } },
          margin: { left: 107.5 },
        });


        const posYThree = (doc as any).lastAutoTable.finalY;
        const bodyObservación = [
          ['OBSERVACION ASESOR', detalle.ObservacionTrabajo],
        ];
        autoTable(doc, {
          body: bodyObservación,
          theme: 'grid',
          startY: posYThree + 5,
          tableWidth: 195,
          head: [[{
            content: 'OBSERVACIONES',
            colSpan: 2,
            styles: { halign: 'center', fillColor: [30, 170, 226], cellPadding: 1 },
          }]],
          bodyStyles: { fontSize: 8 },
          columnStyles: { 0: { halign: 'left', cellWidth: 30 } },
          margin: { left: 7.5 },
        });

        const pdfOutput: string = doc.output('datauristring');
        doc.output('dataurlnewwindow'); //para exportar directo
        resolve(pdfOutput);
      };

      img.onerror = (error) => {
        reject('Error al cargar la imagen: ' + error);
      };
    });
  }

  pdfEtiquetaTrazabilidad(nomProducto: string, fecha: Date, lote: string, op: number, operador: string, codProd: string, exportar: boolean) {
    const doc = new jsPDF({
      unit: 'mm',
      format: [57, 25],
      orientation: 'landscape'
    });
    doc.setFont("helvetica", "bold");

    const canvas = document.createElement('canvas');
    JsBarcode(canvas, codProd, {
      format: 'CODE128',
      lineColor: '#000',
      width: 2,
      height: 100,
      font: 'sans-serif',
      fontOptions: 'bold',
      fontSize: 30,
      margin: 0,
      textMargin: 0,
      displayValue: false
    });
    doc.addImage(canvas.toDataURL('image/png'), 'JPEG', 13.5, 14.5, 30, 7);
    doc.setFontSize(6);

    let nomProdParrafo = doc.splitTextToSize(nomProducto, 52);
    if (nomProdParrafo.length > 2) {
      nomProdParrafo = nomProdParrafo.slice(0, 2);
      nomProdParrafo[1] += ' ....';
    }
    doc.text(nomProdParrafo, 2.5, 2.5);

    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = Number(fecha.getFullYear());
    doc.text(`FE: ${dia}-${mes}-${anio}`, 2.5, 7.5);
    doc.text(`FV: ${dia}-${mes}-${anio + 1}`, 28.5, 7.5);

    doc.text(`OPERADOR: ${operador.split('.')[0].toUpperCase()} ${operador.split('.')[1].toUpperCase()}`, 2.5, 10);
    doc.text(`OP: ${op}`, 2.5, 12.5);

    doc.line(2, 13.5, 55, 13.5);

    const pdfOutput: string = doc.output('datauristring');
    if (exportar)
      this.openPdfInNewTab(pdfOutput);
    return pdfOutput
  }
}
