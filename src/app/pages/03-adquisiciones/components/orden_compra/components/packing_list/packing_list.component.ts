import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { AdquisicionOrdenCompraDetalleInterface } from '../../../../interface/adquisicion-detalle';
import Swal from 'sweetalert2';
import { OrdenCompraService } from '../../service/orden_compra.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';

@Component({
  selector: 'app-adquisiciones-orden-compra-packing-list',
  templateUrl: './packing_list.component.html',
})
export class AdquisicionesOrdenCompraPackingListComponent {
  apiService = inject(ApiService);
  loginService = inject(LoginService);
  apiRouter = inject(Router);
  compraService = inject(OrdenCompraService);
  sweetService = inject(SweetAlertService);
  apiActivateRoute = inject(ActivatedRoute);
  formService = inject(ReactiveFormsService);

  blockedSendInfo: boolean = false;
  blockedGetInfo: boolean = false;

  myForm: FormGroup;
  infoDetalle!: AdquisicionOrdenCompraDetalleInterface;

  valorSubtotal: number = 0;
  valorIva: number = 0;
  valorTotal: number = 0;
  pesoTotal: number = 0;
  newPesoTotal: number = 0;
  metrosCuadradosTotal: number = 0;
  newMetrosCuadradosTotal: number = 0;

  modalActCantidades: boolean = false;
  newDetalle: AdquisicionOrdenCompraDetalleInterface[] = [];

  oldLargo: number = 0;
  alertLargo: boolean = false;
  iva: number = 0;

  listCheck: boolean[] = [];

  constructor() {
    this.myForm = new FormGroup({
      "newLargo": new FormControl(0, [Validators.required]),
    });
  }

  ngOnInit(): void {
    Object.values(this.compraService.cabecera).forEach(item => { item === null });
    this.compraService.detalles = [];
    this.compraService.packingList = [];
    this.onGetParams();
  }

  onGetParams() {
    this.apiActivateRoute.queryParamMap.subscribe(params => {
      const idCompra = params.get('id');
      if (idCompra !== null) {
        this.onGetDetalleCompra(Number(idCompra));
      } else {
        this.sweetService.viewWarning(
          'Para acceder a esta funcionalidad lo debe hacer desde el listado de ordenes de compra',
          'Redirigir',
          (result: any) => {
            if (result.isConfirmed)
              this.apiRouter.navigate(['/adquisiciones/orden_compra/listado']);
          });
      }
    });
  }

  onGetDetalleCompra(idCompra: number) {
    this.blockedGetInfo = true;
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
            this.compraService.cabecera = { ...resp.data[0].TablaCabecera[0] };
            if (this.compraService.cabecera.EstadoCompra === 2 || this.compraService.cabecera.EstadoCompra === 3 || this.compraService.cabecera.EstadoCompra === 8) {
              this.compraService.detalles = [...resp.data[0].TablaDetalle];
              this.iva = this.compraService.cabecera.TarifaIva ?? 0;
              this.valorSubtotal = this.compraService.cabecera.ValorBaseImponibleIva ?? 0;
              this.valorIva = this.compraService.cabecera.ValorIva ?? 0;
              this.valorTotal = this.compraService.cabecera.ValorTotal ?? 0;
              this.pesoTotal = this.compraService.detalles.reduce((acum, value) => acum + (value.PesoProductoDetalleCompra ?? 0), 0);
              this.metrosCuadradosTotal = this.compraService.detalles.reduce((acum, value) => acum + (value.CantidadDetalleCompra ?? 0), 0);
              this.compraService.cabecera.ValorBaseImponibleIva = 0;
              this.compraService.cabecera.ValorIva = 0;
              this.compraService.cabecera.ValorTotal = 0;
              this.listCheck = [...this.compraService.detalles.map(() => true)];
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
        this.blockedGetInfo = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.blockedGetInfo = false;
      }
    });
  }

  onOpenModalEdit(detalle: AdquisicionOrdenCompraDetalleInterface) {
    this.newDetalle = [];
    this.oldLargo = detalle.CantidadDetalleCompra ?? 0;
    this.alertLargo = false;
    this.myForm.reset();
    const info = this.compraService.packingList.filter(item => item.IdDetalleCompra === detalle.IdDetalleCompra);
    if (info.length !== 0) {
      this.newDetalle = [...info];
    } else {
      this.infoDetalle = { ...detalle };
      this.infoDetalle.BaseIvaDetalleCompra = null;
      this.infoDetalle.CantidadDetalleCompra = null;
      this.infoDetalle.DescuentoDetalleCompra = null;
      this.infoDetalle.IdCompra = null;
      this.infoDetalle.NumeroItemDetalleCompra = null;
      this.infoDetalle.ValorIvaDetalleCompra = null;
      this.infoDetalle.ValorTotalDetalleCompra = null;
      this.infoDetalle.CantidadCompra = 0;
      this.infoDetalle.LargoDetalleCompra = 0;
    }
    this.modalActCantidades = true;
  }

  onCheckNewDetalle(item: AdquisicionOrdenCompraDetalleInterface, key: number) {
    this.compraService.packingList.push({ ...item });
    this.listCheck[key] = false;

    this.onCalcularValoresPackingList();
  }

  onAddNewDetalle() {
    this.newDetalle.push({ ...this.infoDetalle });
  }

  onChangeMetrosTotales(valor: number) {
    if (valor) {
      if (this.oldLargo !== this.myForm.value.newLargo) {
        this.alertLargo = true;
      } else {
        this.alertLargo = false;
      }
    }
  }

  onCalculateM2(detalle: AdquisicionOrdenCompraDetalleInterface) {
    const ancho = detalle.AnchoDetalleCompra;
    const bobina = detalle.CantidadCompra;
    const largo = detalle.LargoDetalleCompra;
    if (ancho && bobina && largo) {
      detalle.CantidadDetalleCompra = (ancho * largo * bobina) / 1000;
    } else {
      detalle.CantidadDetalleCompra = 0;
    }
  }

  onCalcularValoresPackingList() {
    let newIva = 0;
    let newSubtotal = 0;
    let newTotal = 0;
    this.newPesoTotal = 0;
    this.newMetrosCuadradosTotal = 0;
    this.compraService.packingList.forEach(item => {
      newIva = newIva + (item.ValorIvaDetalleCompra ?? 0);
      newSubtotal = newSubtotal + (item.BaseIvaDetalleCompra ?? 0);
      newTotal = newSubtotal + newIva;
      this.newPesoTotal = this.newPesoTotal + (item.PesoProductoDetalleCompra ?? 0);
      this.newMetrosCuadradosTotal = this.newMetrosCuadradosTotal + (item.CantidadDetalleCompra ?? 0);
    });
    this.compraService.cabecera.ValorBaseImponibleIva = newSubtotal;
    this.compraService.cabecera.ValorBruto = newSubtotal;
    this.compraService.cabecera.ValorIva = newIva;
    this.compraService.cabecera.ValorNetoCalculado = newTotal;
    this.compraService.cabecera.ValorTotal = newTotal;
  }

  onSaveNewDetalle() {
    if (this.formService.validForm(this.myForm)) {
      let validacionCero = false;
      this.newDetalle.forEach(item => (item.CantidadDetalleCompra ?? 0) > 0 ? validacionCero = true : validacionCero = false);

      if (validacionCero) {
        const total = this.newDetalle.reduce(
          (accumulator, currentValue) => accumulator + (currentValue.CantidadDetalleCompra!),
          0,
        );
        if (total > 0) {
          if (total === this.myForm.value.newLargo) {
            this.newDetalle.forEach(item => {
              item.NumeroItemDetalleCompra = this.compraService.packingList.length + 1;
              item.BaseIvaDetalleCompra = (item.CantidadDetalleCompra ?? 0) * (item.ValorDetalleCompra ?? 0);
              item.ValorIvaDetalleCompra = item.BaseIvaDetalleCompra * ((item.PorcentajeIvaDetalleCompra ?? 0) / 100);
              item.ValorTotalDetalleCompra = item.BaseIvaDetalleCompra + item.ValorIvaDetalleCompra;
              item.PesoProductoDetalleCompra = ((item.PesoDetalleCompra ?? 0) / 1000) * (item.AnchoDetalleCompra ?? 0) / 1000 * (item.LargoDetalleCompra ?? 0) * (item.CantidadCompra ?? 0);
              this.compraService.packingList.push({ ...item });
            });

            this.onCalcularValoresPackingList();
            this.modalActCantidades = false;
          } else {
            this.sweetService.toastWarning('El total de los detalles no es igual al largo total');
          }
        } else {
          this.sweetService.toastWarning('El total de los detalles no puede ser 0');
        }
      } else {
        this.sweetService.toastWarning('Ingrese los nuevos valores');
      }
    } else {
      this.sweetService.toastWarning('Ingrese todos los campos');
    }
  }

  finalizar() {
    if (this.compraService.cabecera.ValorTotal !== 0 && this.compraService.cabecera.IdentificacionProveedor !== "") {
      this.blockedSendInfo = true;
      this.compraService.cabecera.UsuarioRegistroOrdenCompra = this.loginService.usuario.UserName;
      this.compraService.cabecera.NumeroItems = this.compraService.packingList.length;

      this.compraService.packingList.map((item, index) => {
        item.NumeroItemDetalleCompra = index + 1;
      });

      const parametros = {
        codigo: 1033,
        parametros: {
          "TipoDocumento": 2,
          "TipoEmision": this.compraService.cabecera.SecuencialCompra ? 2 : 1,
          "Cabecera": this.compraService.cabecera,
          "Detalle": this.compraService.packingList,
        }
      };

      this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'insert', parametros.codigo).subscribe({
        next: ((resp: any) => {
          if (resp.success) {
            Swal.fire({
              title: 'Correcto',
              text: "Los datos se guardaron correctamente",
              icon: 'success',
              allowEscapeKey: false,
              allowOutsideClick: false,
              confirmButtonColor: 'green',
            }).then(result => {
              if (result.isConfirmed) {
                this.apiRouter.navigateByUrl('/adquisiciones/orden_compra/listado');
              }
            });
          } else {
            this.sweetService.viewDanger(parametros.codigo, resp.message);
            this.blockedSendInfo = false;
          }
        }), error: (err) => {
          this.sweetService.viewDanger(parametros.codigo, err.error);
          this.blockedSendInfo = false;
        }
      });
    } else {
      this.sweetService.toastWarning('Ingrese todos los datos');
    }
  }
}
