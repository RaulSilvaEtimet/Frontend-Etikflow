import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { AdministracionProveedorInterface } from 'src/app/pages/02-administracion/interfaces/proveedor.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { OrdenCompraService } from '../../service/orden_compra.service';
import { AdquisicionOrdenCompraDetalleInterface } from '../../../../interface/adquisicion-detalle';
import { GestionInventarioProductoInventarioInterface } from 'src/app/pages/02-administracion/interfaces/gestion-inventario.interface';


@Component({
  selector: 'app-adquisiciones-ordem-compra-materia-prima',
  templateUrl: './materia_prima.component.html',
  styleUrls: ['./materia_prima.component.css'],
})
export class AdquisicionesOrdenCompraMateriaPrimaComponent {
  apiService = inject(ApiService);
  loginService = inject(LoginService);
  apiRouter = inject(Router);
  compraService = inject(OrdenCompraService);
  sweetService = inject(SweetAlertService);
  apiActivateRoute = inject(ActivatedRoute);
  formService = inject(ReactiveFormsService);

  blockedSendData: boolean = false;
  blockedGetData: boolean = false;
  minDate: Date = new Date();

  myForm: FormGroup;
  listProveedor: AdministracionProveedorInterface[] = [];
  infoProveedor: AdministracionProveedorInterface | undefined;
  loadingProveedor: boolean = false;
  selectedProveedor: any | undefined = {};
  listIva: number[] = [0, 12, 14, 15, 8, 5, 13];

  valorSubtotal: number = 0;
  valorIva: number = 0;
  valorTotal: number = 0;
  pesoTotal: number = 0;
  metroscuadradoTotal: number = 0;

  headerModalCrear: boolean = false;
  modalAddDetalle: boolean = false;
  listProducto: GestionInventarioProductoInventarioInterface[] = [];
  loadingProducto: boolean = false;
  medidas: any[] = [];
  loadingMedidas: boolean = false;

  metroscuadrados: number = 0;
  kilogramos: number = 0;
  totalMetroscuadrados: number = 0;
  totalKilogramos: number = 0;
  selectProducto: GestionInventarioProductoInventarioInterface | undefined;
  keyDetalle: number = -1;

  constructor() {
    this.myForm = new FormGroup({
      "iva": new FormControl('', [Validators.required]),
      "producto": new FormControl('', [Validators.required]),
      "ancho": new FormControl(0, [Validators.required]),
      "bobina": new FormControl('', [Validators.required]),
      "largo": new FormControl('', [Validators.required]),
      "precio": new FormControl('', [Validators.required]),
      "valor": new FormControl('', [Validators.required]),
    });
    this.compraService.cabecera = {
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
    }
    this.compraService.newOC = true;
    this.compraService.detalles = [];
    this.compraService.cabecera.FechaRegistroOrdenCompra = new Date();
    this.compraService.cabecera.FechaEntrega = new Date();
  }

  ngOnInit(): void {
    this.onGetAllProveedores();
  }

  onChangeFecha() {
    const diffInMs = Math.abs(this.compraService.cabecera.FechaEntrega!.getTime() - this.compraService.cabecera.FechaRegistroOrdenCompra!.getTime());
    this.compraService.cabecera.Plazo = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  }

  onGetAllProveedores() {
    this.loadingProveedor = true;
    const parametros = {
      codigo: 1013,
      parametros: {
        'IdentificacionProveedor': null
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listProveedor = [...resp.data];
          this.onGetParams();
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingProveedor = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingProveedor = false;
      }
    });
  }

  onGetParams() {
    this.apiActivateRoute.queryParamMap.subscribe(params => {
      const idCompra = params.get('id');
      if (idCompra !== null) {
        this.onGetDetalleCompra(Number(idCompra));
      }
    });
  }

  onChangeProveedor(infoProveedor: AdministracionProveedorInterface) {
    if (infoProveedor) {
      this.infoProveedor = this.listProveedor.find(item => item.IdProveedor === infoProveedor.IdProveedor)!;
      this.compraService.cabecera.RazonSocialProveedor = this.infoProveedor.RazonSocialProveedor;
      this.compraService.cabecera.IdentificacionProveedor = this.infoProveedor.IdentificacionProveedor;
      this.compraService.cabecera.DirecionProveedor = this.infoProveedor.DireccionProveedor;
      this.compraService.cabecera.TelefonoProveedor = this.infoProveedor.Telefono1;
      this.onGetProductosInventario(infoProveedor.IdProveedor ?? 0);
      this.myForm.reset();
    } else {
      this.infoProveedor = undefined;
    }
    this.metroscuadrados = 0;
    this.compraService.detalles = [];
    this.valorSubtotal = 0;
    this.valorIva = 0;
    this.valorTotal = 0;
  }

  onGetProductosInventario(idProveedor: number) {
    this.loadingProducto = true;
    const parametros = {
      codigo: 1022,
      parametros: {
        'GrupoInventario': null,
        'CodigoTipoInventario': null,
        'CodigoInternoSustrato': null,
        'IdentificacionProveedor': idProveedor,
        'CodigoLineaInventario': 'MP',
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listProducto = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingProducto = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingProducto = false;
      }
    });
  }

  onChangeProducto(idProducto: number) {
    if (idProducto) {
      this.medidas = [];
      this.onGetAllMedidas(idProducto);
      this.selectProducto = this.listProducto.find(item => item.CodigoCatalogoSustrato === idProducto)!;
      this.myForm.patchValue({
        'ancho': null,
        'precio': this.selectProducto.ValorUsd,
        'valor': this.selectProducto.Peso,
      });
    }
  }

  onGetAllMedidas(idSustrato: number) {
    this.loadingMedidas = true;
    const parametros = {
      codigo: 1025,
      parametros: {
        'CodigoCatalogoSustrato': idSustrato,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.medidas = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingMedidas = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingMedidas = false;
      }
    });
  }

  onCalculateM2() {
    if (this.selectProducto !== undefined) {
      const ancho = this.myForm.value.ancho;
      const largo = this.myForm.value.largo;
      const bobina = this.myForm.value.bobina;
      if (ancho && largo && bobina) {
        this.metroscuadrados = ((ancho / 1000) * largo);
        this.kilogramos = ((this.selectProducto.Peso ?? 0) / 1000) * ((ancho / 1000) * largo);
        this.totalMetroscuadrados = this.metroscuadrados * bobina;
        this.totalKilogramos = this.kilogramos * bobina;
      } else {
        this.metroscuadrados = 0;
        this.kilogramos = 0;
        this.totalMetroscuadrados = 0;
        this.totalKilogramos = 0;
      }
    }
  }

  onOpenModalAddDetalle() {
    this.modalAddDetalle = true;
    this.medidas = [];
    this.keyDetalle = -1;
    this.myForm.reset();
  }

  onSaveOrEditDetalle() {
    if (this.selectProducto !== undefined) {
      if (this.formService.validForm(this.myForm)) {
        const iva = this.myForm.value.iva;
        const ancho = this.myForm.value.ancho;
        const bobina = this.myForm.value.bobina;
        const largo = this.myForm.value.largo;
        const precio = this.myForm.value.precio;
        const valorUM = this.myForm.value.valor;

        if (this.totalMetroscuadrados !== 0 && precio !== 0) {
          const info: AdquisicionOrdenCompraDetalleInterface = {
            AnchoDetalleCompra: ancho,
            BaseIvaDetalleCompra: (precio * this.totalMetroscuadrados),
            CantidadCompra: bobina,
            CantidadDetalleCompra: this.totalMetroscuadrados,
            CodigoInternoSustrato: this.selectProducto.CodigoInternoSustrato,
            CodigoTipoMaterial: this.selectProducto.CodigoTipoInventario,
            DescargadoDetalleCompra: null,
            DescripcionDetalleCompra: this.selectProducto.DescripcionSustrato,
            DescuentoDetalleCompra: null,
            GrupoInventario: this.selectProducto.GrupoInventario,
            IdCompra: null,
            IdDetalleCompra: null,
            LargoDetalleCompra: largo,
            NumeroItemDetalleCompra: null,
            PesoDetalleCompra: valorUM,
            PesoProductoDetalleCompra: this.totalKilogramos,
            PorcentajeDescuentoDescuentoDetalleCompra: null,
            PorcentajeIvaDetalleCompra: iva,
            UnidadMedidaDetalleCompra: 'M2',
            ValorDetalleCompra: precio,
            ValorIvaDetalleCompra: (precio * this.totalMetroscuadrados) * (iva / 100),
            ValorTotalDetalleCompra: (precio * this.totalMetroscuadrados),
          }

          if (this.keyDetalle === -1) {
            this.compraService.detalles.push({ ...info });
          } else {
            this.compraService.detalles[this.keyDetalle] = { ...info };
          }

          this.valorSubtotal = 0;
          this.valorIva = 0;
          this.valorTotal = 0;
          this.pesoTotal = 0;
          this.metroscuadradoTotal = 0;
          this.compraService.detalles.forEach(item => {
            this.valorSubtotal = this.valorSubtotal + (item.BaseIvaDetalleCompra ?? 0);
            this.valorIva = this.valorIva + (item.ValorIvaDetalleCompra ?? 0);
            this.valorTotal = this.valorSubtotal + this.valorIva;
            this.pesoTotal = this.pesoTotal + (item.PesoProductoDetalleCompra ?? 0);
            this.metroscuadradoTotal = this.metroscuadradoTotal + (item.CantidadDetalleCompra ?? 0)
          })
          this.modalAddDetalle = false;
          this.myForm.reset();
        } else {
          this.sweetService.toastWarning('Los metros cuadrados y el precio no pueden ser cero');
        }
      } else {
        this.sweetService.toastWarning('Ingrese todos los campos');
      }
    } else {
      this.sweetService.toastWarning('Error al obtener datos del producto seleccionado');
    }
  }

  onOpenModalEdit(detalle: AdquisicionOrdenCompraDetalleInterface, key: number) {
    this.keyDetalle = key;
    this.modalAddDetalle = true;
    const idProducto = this.listProducto.find((item: any) => item.CodigoInternoSustrato === detalle.CodigoInternoSustrato)!.CodigoCatalogoSustrato;
    this.myForm.patchValue({
      "iva": detalle.PorcentajeIvaDetalleCompra,
      "producto": idProducto,
      "ancho": detalle.AnchoDetalleCompra,
      "bobina": detalle.CantidadCompra,
      "largo": detalle.LargoDetalleCompra,
      "precio": detalle.ValorDetalleCompra,
    });
    this.metroscuadrados = (detalle.CantidadDetalleCompra ?? 0) / (detalle.CantidadCompra ?? 0);
    this.totalMetroscuadrados = (detalle.CantidadDetalleCompra ?? 0);
    this.kilogramos = (detalle.PesoProductoDetalleCompra ?? 0) / (detalle.CantidadCompra ?? 0);
    this.totalKilogramos = (detalle.PesoProductoDetalleCompra ?? 0);
  }

  onDeleteDetalle(key: number) {
    this.compraService.detalles.splice(key, 1);
  }

  finalizar() {
    if (this.valorTotal !== 0 && this.compraService.cabecera.IdentificacionProveedor !== "") {
      if (this.compraService.cabecera.Plazo ?? 0 > 0) {
        this.blockedSendData = true;
        this.compraService.cabecera.UsuarioRegistroOrdenCompra = this.loginService.usuario.UserName;
        if (this.compraService.newOC)
          this.compraService.cabecera.EstadoCompra = 1;
        this.compraService.cabecera.NumeroItems = this.compraService.detalles.length;
        this.compraService.cabecera.ValorBruto = this.valorSubtotal;
        this.compraService.cabecera.ValorDescuento = 0;
        this.compraService.cabecera.TarifaIva = null;
        this.compraService.cabecera.ValorBaseImponibleIva = this.valorSubtotal;
        this.compraService.cabecera.ValorIva = this.valorIva;
        this.compraService.cabecera.ValorTotal = this.valorTotal;
        this.compraService.cabecera.ValorNetoCalculado = this.valorTotal;

        this.compraService.detalles.map((item, index) => {
          item.NumeroItemDetalleCompra = index + 1;
        });

        const parametros = {
          codigo: 1033,
          parametros: {
            "TipoDocumento": 1,
            "TipoEmision": this.compraService.newOC ? 1 : 2,
            "Cabecera": this.compraService.cabecera,
            "Detalle": this.compraService.detalles,
          }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'adquisiciones', 'insert', parametros.codigo).subscribe({
          next: ((resp: any) => {
            if (resp.success) {
              this.sweetService.viewSuccess('Los datos se guardaron correctamente',
                () => { this.apiRouter.navigateByUrl('/adquisiciones/orden_compra/listado'); }
              );
            } else {
              this.sweetService.viewDanger(parametros.codigo, resp.message);
              this.blockedSendData = false;
            }
          }), error: (err) => {
            this.sweetService.viewDanger(parametros.codigo, err.error);
            this.blockedSendData = false;
          }
        });
      } else {
        this.sweetService.toastWarning('El plazo debe ser diferente de 0');
      }
    } else {
      this.sweetService.toastWarning('Ingrese todos los datos');
    }
  }

  onGetDetalleCompra(idCompra: number) {
    this.blockedGetData = true;
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
          this.compraService.newOC = false;
          this.compraService.cabecera = { ...resp.data[0].TablaCabecera[0] };
          this.compraService.detalles = [...resp.data[0].TablaDetalle];
          this.valorSubtotal = this.compraService.cabecera.ValorBaseImponibleIva ?? 0;
          this.valorIva = this.compraService.cabecera.ValorIva ?? 0;
          this.valorTotal = this.compraService.cabecera.ValorTotal ?? 0;

          this.pesoTotal = this.compraService.detalles.reduce((acum, value) => acum + (value.PesoProductoDetalleCompra ?? 0), 0);
          this.metroscuadradoTotal = this.compraService.detalles.reduce((acum, value) => acum + (value.CantidadDetalleCompra ?? 0), 0);
          this.onGetProductosInventario(this.compraService.cabecera.IdProveedor ?? 0);
          this.blockedGetData = false;
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
      }
    });
  }
}
