import { inject, Injectable } from '@angular/core';
import { EnviarCierreOrdenProduccionTaurusInterface, OrdenProduccionParcialTaurusInterface } from 'src/app/pages/06-produccion/interfaces/op_taurus.interface';
import { ProduccionMateriaPrimaLiberadaInterface, ProduccionMateriaPrimaLiberadaTipoInventarioInterface, ProduccionOrdenProduccionBitacoraInterface, ProduccionOrdenProduccionInterface, ProduccionValoresProduccionInterface } from 'src/app/pages/06-produccion/interfaces/orden_produccion.interface';
import { ProduccionProcesoFabricacionInterface } from 'src/app/pages/06-produccion/interfaces/proceso_fabricacion.interface';
import { ProduccionProductoTerminadoInterface } from 'src/app/pages/06-produccion/interfaces/producto_terminado.interface';
import { ApiService } from 'src/app/shared/services/api.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';

interface ListMpUtilizadaInterface {
  Nombre: string;
  CodigoInterno: string;
  ALiberado: number;
  MLiberado: number;
  M2Liberado: number;
  MDevuelto: number;
  M2Devuelto: number;
  M2Total: number;
}

export interface ListMpEnvioInterface {
  CodigoInterno: string;
  Liberado: number;
  Producido: number;
  Desperdicio: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProduccionOrdenProduccionCierreService {
  apiService = inject(ApiService);
  sweetService = inject(SweetAlertService);

  infoOP: ProduccionOrdenProduccionInterface | undefined;
  infoProdTerm: ProduccionProductoTerminadoInterface | undefined;

  listMpUtilizada: ListMpUtilizadaInterface[] = [];
  listMPLiberadoTipInv: ProduccionMateriaPrimaLiberadaTipoInventarioInterface[] = [];
  listMPLiberado: ProduccionMateriaPrimaLiberadaInterface[] = [];
  infoProcFabricacion: ProduccionProcesoFabricacionInterface | undefined;
  listBitacora: ProduccionOrdenProduccionBitacoraInterface[] = [];
  listValoresProduccion: ProduccionValoresProduccionInterface[] = [];
  listParciales: OrdenProduccionParcialTaurusInterface[] = [];

  infoJSON: EnviarCierreOrdenProduccionTaurusInterface | undefined;
  listMpEnvio: ListMpEnvioInterface[] = [];

  blockedGet: boolean = false;
  blockedSend: boolean = false;

  etiquetasLiberadas: number = 0;
  etiquetasProducidas: number = 0;

  constructor() { }

  onResetService() {
    this.infoOP = undefined;
    this.infoProdTerm = undefined;
    this.listMpUtilizada = [];
    this.listMPLiberadoTipInv = [];
    this.listMPLiberado = [];
    this.listBitacora = [];
    this.listValoresProduccion = [];
    this.infoProcFabricacion = undefined;
    this.blockedGet = false;
    this.blockedSend = false;
    this.etiquetasLiberadas = 0;
    this.etiquetasProducidas = 0;
    this.infoJSON = undefined;
    this.listMpEnvio = [];
  }

  onGetOrdenProduccion(numOp: number) {
    const parametros = {
      codigo: 1152,
      parametros: {
        "IdOrdenProduccion": null,
        "SecuencialOrdenProduccion": numOp,
        "SecuencialCotizacion": null,
        "OrdenCompra": null,
        "IdentificacionCliente": null,
        "CodigoTrabajo": null,
        "IdEstadoOrdenProduccion": null,
        "NombreAsesor": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          if (resp.data.length === 1) {
            if (resp.data[0].IdEstadoOrdenProduccion === 4 || resp.data[0].IdEstadoOrdenProduccion === 5) {
              this.onGetInfoAllOP(resp.data[0].IdOrdenProduccion);
            } else {
              this.sweetService.toastWarning('La OP no se encuentra en un estado disponible');
              this.blockedGet = false;
            }
          } else {
            this.sweetService.toastWarning('La OP que esta buscando no existe');
            this.blockedGet = false;
          }
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
          this.blockedGet = false;
        }
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.blockedGet = false;
      }
    });
  }

  onGetInfoAllOP(idOP: number) {
    this.blockedGet = true;

    const parametros = {
      codigo: 1161,
      parametros: {
        "IdOrdenProduccion": idOP,
      },
      tablas: ['TablaOrdenProduccion', 'TablaCabeceraCotizacion', 'TablaDetalleCotizacion', 'TablaProductoTerminado', 'TablaCirel', 'TablaTroquel', 'TablaProcesoFabricacion', 'TablaMaterialKardexOrdenProduccion', 'TablaBitacoraOrdenProduccion', 'TablaMPLiberado', 'TablaGlobalRegistroOperador', 'TablaImpresoraYTrPlano', 'TablaRebobinadora', 'TablaCargaInventarioTaurus']
    };
    this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {

          this.infoOP = { ...resp.data[0].TablaOrdenProduccion[0] };
          this.infoProdTerm = { ...resp.data[0].TablaProductoTerminado[0] };
          this.listMPLiberadoTipInv = [...resp.data[0].TablaMPLiberado];
          this.listMPLiberado = [...resp.data[0].TablaMaterialKardexOrdenProduccion];
          this.listBitacora = [...resp.data[0].TablaBitacoraOrdenProduccion];
          this.listValoresProduccion = [...resp.data[0].TablaGlobalRegistroOperador];
          this.infoProcFabricacion = { ...resp.data[0].TablaProcesoFabricacion[0] };
          this.listParciales = [...resp.data[0].TablaCargaInventarioTaurus];

          this.onCreateJsonCierre();
          this.onCalcMpLiberada();
          //this.onCalcularValoresComprobacion();
          this.blockedGet = false;
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
          this.blockedGet = false;
        }
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.blockedGet = false;
      }
    });
  }

  onCreateJsonCierre() {
    if (this.infoOP !== undefined && this.infoProdTerm !== undefined) {
      const fecha = new Date();

      this.infoJSON = {
        IdentificacionCliente: this.infoOP.IdentificacionCliente,
        ProductoCodigo: this.infoProdTerm.CodigoFinalProductoTerminado,
        ProductoNombre: this.infoProdTerm.NombreProductoEtimet,
        AplicaIva: '',
        UnidadMedida: '',
        OpCantidadSolicitada: 0,
        OpFechaInicio: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 0, 0, 0, 0),
        OpFechaTerminado: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 0, 0, 0),
        OpObservaciones: '',
        OpNumeroLote: '',
        OpCantidadProducida: 0,
        OpCantidadDesperdicio: 0,
        OpNumeroHoras: 0,
        OpNumeroEmpleados: 0,
        OpManoObra: 0,
        OpCostoIndirecto: 0,
        OpCostoUnitario: 0,
      };
    }
  }

  onCalcMpLiberada() {
    this.listMpUtilizada = [];
    this.listMpEnvio = [];

    this.listMPLiberadoTipInv.forEach(item => {
      const anchos: number[] = [...new Set(this.listMPLiberado.filter(item3 => item3.CodigoBarras.indexOf(item.CodigoInterno) !== -1).map(item => item.Ancho))];

      anchos.forEach(item2 => {
        const auxListLib = [...this.listMPLiberado.filter(item3 => item3.CodigoBarras.indexOf(item.CodigoInterno) !== -1 && item3.TipoRegistro === 1 && item3.Ancho === item2)];
        const metrosLib = auxListLib.reduce((acc, item3) => acc += item3.Largo, 0);
        const valLib = auxListLib.reduce((acc, item3) => acc += (item3.Ancho / 1000 * item3.Largo), 0);

        const auxListDev = [...this.listMPLiberado.filter(item3 => item3.CodigoBarras.indexOf(item.CodigoInterno) !== -1 && item3.TipoRegistro === 2 && item3.IdPadreKardex !== null && item3.Ancho === item2)];
        const metrosDev = auxListDev.reduce((acc, item3) => acc += item3.Largo, 0);
        const valDev = auxListDev.reduce((acc, item3) => acc += (item3.Ancho / 1000 * item3.Largo), 0);

        this.listMpUtilizada.push({
          Nombre: item.NombreTipoInventario,
          CodigoInterno: item.CodigoInterno,
          MLiberado: metrosLib,
          ALiberado: item2,
          M2Liberado: valLib,
          MDevuelto: metrosDev,
          M2Devuelto: valDev,
          M2Total: valLib - valDev
        });
      });

      const liberado = this.listMPLiberado.reduce((acc, item2) => {
        if (item2.CodigoBarras.indexOf(item.CodigoInterno) !== -1) {
          if (item2.TipoRegistro === 1)
            acc += (item2.Ancho / 1000) * item2.Largo;
          else if (item2.TipoRegistro === 2 && item2.IdPadreKardex !== null)
            acc -= (item2.Ancho / 1000) * item2.Largo;
        }
        return acc;
      }, 0);

      const producido = this.listParciales.reduce((acc, item2) => {
        if (item2.UnidadMedida === 'MILLAR') {
          const avance = (this.infoProdTerm!.AvanceEtiqueta / 100) + (this.infoProdTerm!.GapAvance / 1000);
          const ancho = (this.infoProdTerm!.AnchoEtiqueta / 100) + (this.infoProdTerm!.Gapancho / 1000);
          acc += (avance * ancho) * item2.OpCantidadProducida * 1000;
        } else {
          const avance = (this.infoProdTerm!.AvanceEtiqueta);
          const ancho = (this.infoProdTerm!.AnchoEtiqueta / 100) + (this.infoProdTerm!.Gapancho / 1000);
          acc += (avance * ancho) * item2.OpCantidadProducida;
        }
        return acc;
      }, 0);

      this.listMpEnvio.push({
        CodigoInterno: item.CodigoInterno,
        Liberado: liberado,
        Producido: producido,
        Desperdicio: 0,
      });


    });
  }

  /*
  onCalcularValoresComprobacion() {
    this.listValoresEntregados = [];

    this.listMPLiberadoTipInv.forEach((tipInv) => {
      const metrosLiberados = this.listMpUtilizada.filter(item => item.CodigoInterno === tipInv.CodigoInterno).reduce((acc, item) => {
        return acc += (item.MLiberado - item.MDevuelto);
      }, 0);

      const metros2Liberados = this.listMpUtilizada.filter(item => item.CodigoInterno === tipInv.CodigoInterno).reduce((acc, item) => {
        return acc += (item.MLiberado - item.MDevuelto) * (item.ALiberado / 1000);
      }, 0);

      const metrosUtilizados = this.listValoresProduccion.filter(item => item.CodigoMaterial === tipInv.CodigoInterno && (item.Proceso === 'Inicio' || item.Proceso === 'Unico')).reduce((acc, item) => {
        return acc += (item.MetroLineal + item.ValorMetrosCalibracion);
      }, 0);

      const metros2Utilizados = this.listValoresProduccion.filter(item => item.CodigoMaterial === tipInv.CodigoInterno && (item.Proceso === 'Inicio' || item.Proceso === 'Unico')).reduce((acc, item) => {
        return acc += (item.MetroLineal + item.ValorMetrosCalibracion) * (item.Ancho / 1000);
      }, 0);

      this.listValoresEntregados.push({
        Codigo: tipInv.CodigoInterno,
        Material: tipInv.NombreTipoInventario,
        Entregado: metrosLiberados,
        Usado: metrosUtilizados,
        EntregadoM2: metros2Liberados,
        UsadoM2: metros2Utilizados,
      });
    });

    this.etiquetasProducidas = this.listValoresProduccion.filter(item => item.Proceso === 'Fin' || item.Proceso === 'Unico').reduce((acc, item) => {
      return acc += item.CantidadProduccion;
    }, 0);

  }
  */
}
