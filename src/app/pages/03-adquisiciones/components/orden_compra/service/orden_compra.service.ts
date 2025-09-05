import { Injectable } from '@angular/core';
import { AdquisicionOrdenCompraCabeceraInterface } from '../../../interface/adquisicion-cabecera';
import { AdquisicionOrdenCompraDetalleInterface } from '../../../interface/adquisicion-detalle';

@Injectable({
  providedIn: 'root'
})
export class OrdenCompraService {
  newOC: boolean = true;
  cabecera: AdquisicionOrdenCompraCabeceraInterface = {
    Adjuntos: null,
    IdCompra: null,
    RazonSocialProveedor: null,
    IdentificacionProveedor: null,
    DirecionProveedor: null,
    TelefonoProveedor: null,
    CiudadProveedor: null,
    OrdenCompra: null,
    SecuencialOrdenCompra: null,
    FechaRegistroOrdenCompra: new Date(),
    UsuarioRegistroOrdenCompra: null,
    Compra: null,
    SecuencialCompra: null,
    FechaRegistroRecepcionCompra: null,
    FechaEntrega: new Date(),
    EstadoCompra: null,
    Plazo: null,
    FechaPago: null,
    NumeroFactura: null,
    FacturaRemision: null,
    Comentario: null,
    NumeroItems: null,
    ValorBruto: null,
    ValorDescuento: null,
    TarifaIva: null,
    ValorBaseImponibleIva: null,
    ValorIva: null,
    ValorRetencionIva: null,
    ValorRetencionFuente: null,
    ValorTotal: null,
    ValorNetoCalculado: null,
    ValorCree: null,
    IdProveedor: null,
  };
  detalles: AdquisicionOrdenCompraDetalleInterface[] = [];
  packingList: AdquisicionOrdenCompraDetalleInterface[] = [];
}
