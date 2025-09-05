import { Component, inject } from '@angular/core';
import { Table } from 'primeng/table';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { ConfiguracionesExtrasDocumentosPDFService } from 'src/app/pages/01-configuraciones-extras/components/documentos_pdf/services/documentos-pddf.service';
import { AdministracionDisenioCirelInterface } from 'src/app/pages/02-administracion/interfaces/disenio.interface';
import { AdministracionProduccionTroquelesInterface } from 'src/app/pages/02-administracion/interfaces/produccion.interface';
import { BodegaInventarioKardexInterface } from 'src/app/pages/04-bodega/interfaces/inventario';
import { ComercialCotizacionesCabeceraInterface, ComercialCotizacionesDetalleInterface } from 'src/app/pages/05-comercial/interfaces/cotizaciones.interface';
import { ProduccionOrdenProduccionInterface } from 'src/app/pages/06-produccion/interfaces/orden_produccion.interface';
import { ProduccionProcesoFabricacionInterface } from 'src/app/pages/06-produccion/interfaces/proceso_fabricacion.interface';
import { ProduccionProductoTerminadoInterface } from 'src/app/pages/06-produccion/interfaces/producto_terminado.interface';
import { ApiService } from 'src/app/shared/services/api.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';

@Component({
  selector: 'app-orden-produccion',
  templateUrl: './orden_produccion.component.html',
})
export class ComercialListadoOrdenProduccionComponent {
  apiService = inject(ApiService);
  loginService = inject(LoginService);
  sweetService = inject(SweetAlertService);
  formService = inject(ReactiveFormsService);
  pdfService = inject(ConfiguracionesExtrasDocumentosPDFService);

  blockedSend: boolean = false;
  blockedGet: boolean = false;

  loadingOP: boolean = false;
  listOP: ProduccionOrdenProduccionInterface[] = [];
  searchValue: string | undefined;

  infoOP: ProduccionOrdenProduccionInterface | undefined;
  infoProdTerm: ProduccionProductoTerminadoInterface | undefined;
  infoProcFabr: ProduccionProcesoFabricacionInterface | undefined;
  infoCirel: AdministracionDisenioCirelInterface | undefined;
  infoTroquel: AdministracionProduccionTroquelesInterface | undefined;
  infoCabecera: ComercialCotizacionesCabeceraInterface | undefined;
  infoDetalle: ComercialCotizacionesDetalleInterface | undefined;
  listMPLiberada: BodegaInventarioKardexInterface[] = [];
  loadingMPLiberada: boolean = false;
  modalInfoAllOP: boolean = false;

  ngOnInit() {
    this.onGetAllOrdenProduccion();
  }

  onGetAllOrdenProduccion() {
    this.loadingOP = true;
    const parametros = {
      codigo: 1152,
      parametros: {
        "IdOrdenProduccion": null,
        "SecuencialOrdenProduccion": null,
        "SecuencialCotizacion": null,
        "OrdenCompra": null,
        "IdentificacionCliente": null,
        "CodigoTrabajo": null,
        "IdEstadoOrdenProduccion": null,
        "NombreAsesor": this.loginService.usuario.UserName,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listOP = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingOP = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingOP = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  //OBTENER 
  onGetInfoAllOP(info: ProduccionOrdenProduccionInterface) {
    this.blockedGet = true;
    const parametros = {
      codigo: 1161,
      parametros: {
        "IdOrdenProduccion": info.IdOrdenProduccion,
      },
      tablas: ['TablaOrdenProduccion', 'TablaCabeceraCotizacion', 'TablaDetalleCotizacion', 'TablaProductoTerminado', 'TablaCirel', 'TablaProcesoFabricacion', 'TablaMaterialKardexOrdenProduccion', 'TablaTroquel']
    };
    this.infoOP = undefined;
    this.infoProdTerm = undefined;
    this.infoProcFabr = undefined;
    this.infoCirel = undefined;
    this.infoTroquel = undefined;
    this.infoCabecera = undefined;
    this.infoDetalle = undefined;
    this.listMPLiberada = [];
    this.apiService.onGetApiExecuteNew(parametros, 'produccion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.infoOP = { ...resp.data[0].TablaOrdenProduccion[0] };
          this.infoProdTerm = { ...resp.data[0].TablaProductoTerminado[0] };
          this.infoProcFabr = { ...resp.data[0].TablaProcesoFabricacion[0] };
          this.infoCirel = { ...resp.data[0].TablaCirel[0] };
          this.infoTroquel = { ...resp.data[0].TablaTroquel[0] };
          this.infoCabecera = { ...resp.data[0].TablaCabeceraCotizacion[0] };
          this.infoDetalle = { ...resp.data[0].TablaDetalleCotizacion[0] };
          this.listMPLiberada = [...resp.data[0].TablaMaterialKardexOrdenProduccion];
          this.modalInfoAllOP = true;
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.blockedGet = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.blockedGet = false;
      }
    });
  }

}
