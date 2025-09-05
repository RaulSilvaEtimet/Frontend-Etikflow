import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { AdquisicionOrdenCompraDetalleInterface } from '../../../../interface/adquisicion-detalle';
import { AdquisicionOrdenCompraCabeceraInterface } from 'src/app/pages/03-adquisiciones/interface/adquisicion-cabecera';
import { AdquisicionOrdenCompraEnvioKardex as AdquisicionOrdenCompraEnvioKardexInterface } from 'src/app/pages/03-adquisiciones/interface/adquisicion-envio-kardex.';

@Component({
  selector: 'app-adquisiciones-compras-ingreso-lotes',
  templateUrl: './ingresar_lotes.component.html',
})
export class AdquisicionesComprasIngresoLotesComponent {
  apiService = inject(ApiService);
  loginService = inject(LoginService);
  apiRouter = inject(Router);
  sweetService = inject(SweetAlertService);
  apiActivateRoute = inject(ActivatedRoute);

  blockedPanel: boolean = false;
  cabecera: AdquisicionOrdenCompraCabeceraInterface = {
    Adjuntos: null,
    CiudadProveedor: null,
    Comentario: null,
    Compra: null,
    DirecionProveedor: null,
    EstadoCompra: null,
    FacturaRemision: null,
    FechaEntrega: null,
    FechaPago: null,
    FechaRegistroOrdenCompra: null,
    FechaRegistroRecepcionCompra: null,
    IdCompra: null,
    IdentificacionProveedor: null,
    IdProveedor: null,
    NumeroFactura: null,
    NumeroItems: null,
    OrdenCompra: null,
    Plazo: null,
    RazonSocialProveedor: null,
    SecuencialCompra: null,
    SecuencialOrdenCompra: null,
    TarifaIva: null,
    TelefonoProveedor: null,
    UsuarioRegistroOrdenCompra: null,
    ValorBaseImponibleIva: null,
    ValorBruto: null,
    ValorCree: null,
    ValorDescuento: null,
    ValorIva: null,
    ValorNetoCalculado: null,
    ValorRetencionFuente: null,
    ValorRetencionIva: null,
    ValorTotal: null,
  };
  detalles: AdquisicionOrdenCompraDetalleInterface[] = [];
  bobinas: AdquisicionOrdenCompraEnvioKardexInterface[] = [];

  ngOnInit(): void {
    this.detalles = [];
    this.onGetParams();
  }

  onGetParams() {
    this.apiActivateRoute.queryParamMap.subscribe(params => {
      const idCompra = params.get('id');
      if (idCompra !== null) {
        this.onGetDetalleCompra(Number(idCompra));
      } else {
        this.sweetService.viewWarning(
          'Para acceder a esta funcionalidad lo debe hacer desde el listado de compras pendientes',
          'Redirigir',
          (result: any) => {
            if (result.isConfirmed)
              this.apiRouter.navigate(['/adquisiciones/compras/pendientes']);
          });
      }
    });
  }

  onGetDetalleCompra(idCompra: number) {
    const parametros = {
      codigo: 1034,
      parametros: {
        "IdCompra": idCompra,
      },
      tablas: ['TablaCabecera', 'TablaDetalle', 'TablaLog'],
    };
    this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          if (resp.data[0].TablaCabecera.length !== 0) {
            this.cabecera = { ...resp.data[0].TablaCabecera[0] };
            if (this.cabecera.EstadoCompra === 5) {
              this.detalles = [...resp.data[0].TablaDetalle];
              this.bobinas = [];
              this.detalles.forEach(item => {
                for (let i = 0; i < (item.CantidadCompra ?? 0); i++) {
                  this.bobinas.push({
                    CodigoInterno: item.CodigoInternoSustrato,
                    DescripcionDetalleCompra: item.DescripcionDetalleCompra,
                    Ancho: item.AnchoDetalleCompra,
                    Largo: item.LargoDetalleCompra,
                    TotalM2: ((item.AnchoDetalleCompra ?? 0) / 1000) * (item.LargoDetalleCompra ?? 0),
                    PesoMaterial: (item.PesoProductoDetalleCompra ?? 0) / (item.CantidadCompra ?? 0),
                    IdCompra: Number(item.IdCompra),
                    TipoKardex: 'B',
                    IdEstado: 9,
                    Lote: null,
                    Usuario: this.loginService.usuario.UserName,
                    GrupoInventario: item.GrupoInventario,
                    CodigoTipoInventario: item.CodigoTipoMaterial,
                    IdProveedor: this.cabecera.IdProveedor,
                    SecuencialOrdenCompra: this.cabecera.SecuencialOrdenCompra,
                  });
                }
              })
            } else {
              this.sweetService.viewWarning('Esta orden de compra esta en un estado diferente', 'Salir', () => {
                this.apiRouter.navigateByUrl('/home');
              });
            }
          } else {
            this.sweetService.viewWarning('No existe la orden de compra', 'Salir', () => {
              this.apiRouter.navigateByUrl('/home');
            });
          }
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
      }
    });
  }

  onFinalizar() {
    let check: boolean = true;
    this.bobinas.forEach(item => {
      if (item.Lote === null) {
        item.Lote = 'NO PROPORCIONADO';
        //check = false;
        //return;
      }
    });
    if (check) {
      this.blockedPanel = true;
      const parametros = {
        codigo: 1050,
        parametros: this.bobinas,
      };
      this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'toInventario', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.sweetService.viewSuccess('La información se guardo correctamente', () => {
              this.apiRouter.navigateByUrl('/home');
            });
          } else {
            this.sweetService.viewDanger(parametros.codigo, resp.message);
          }
          this.blockedPanel = false;
        }, error: (err) => {
          this.sweetService.viewDanger(parametros.codigo, err.error);
          this.blockedPanel = false;
        }
      });
    } else {
      this.sweetService.toastWarning('Ingrese todos los lotes');
    }
  }
}
