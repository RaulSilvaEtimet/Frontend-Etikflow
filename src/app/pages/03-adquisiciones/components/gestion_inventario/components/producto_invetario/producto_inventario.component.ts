import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Table } from 'primeng/table';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { GestionInventarioProductoInventarioInterface } from 'src/app/pages/02-administracion/interfaces/gestion-inventario.interface';

@Component({
  selector: 'app-administracion-gestion-inventario-productos-inventario',
  templateUrl: './producto_inventario.component.html',
})
export class AdquisicionesGestionInventarioProductosInventarioComponent implements OnInit {
  apiService = inject(ApiService);
  loginService = inject(LoginService);
  sweetService = inject(SweetAlertService);
  formService = inject(ReactiveFormsService);

  loadingProductosInventario: boolean = false;
  listProductosInventario: GestionInventarioProductoInventarioInterface[] = [];
  searchProductosInventario: string | undefined;
  modalCreateProducto: boolean = false;

  modalInfoProducto: boolean = false;
  infoProductoInventario: GestionInventarioProductoInventarioInterface = {
    AdherenciaSustrato: null,
    CodigoCatalogoSustrato: null,
    CodigoInternoSustrato: null,
    CodigoLineaInventario: null,
    CodigoTipoInventario: null,
    DescripcionLineaInventario: null,
    DescripcionSustrato: null,
    GrupoInventario: null,
    IdLineaInventario: null,
    IdProveedor: null,
    NombreGrupo: null,
    NombreTipoInventario: null,
    Peso: null,
    RazonSocialProveedor: null,
    UnidadMedida: null,
    ValorUsd: null,
    ValorUsdMsi: null,
    Adjuntos: null,
    IdentificacionProveedor: null,
  };

  loadingMedida: boolean = false;
  listMedida: any[] = [];

  constructor() {

  }

  ngOnInit() {
    this.onGetProductoInventario();
  }

  onGetProductoInventario() {
    this.loadingProductosInventario = true;
    const parametros = {
      codigo: 1022,
      parametros: {
        'GrupoInventario': null,
        'CodigoTipoInventario': null,
        'CodigoInternoSustrato': null,
        'IdentificacionProveedor': null,
        "CodigoLineaInventario": null,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listProductosInventario = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingProductosInventario = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingProductosInventario = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onOpenModalView(infoProducto: GestionInventarioProductoInventarioInterface) {
    this.infoProductoInventario = { ...infoProducto };
    this.modalInfoProducto = true;
    if (infoProducto.CodigoLineaInventario === 'MP') {
      this.onGetMedida(infoProducto.CodigoCatalogoSustrato ?? 0);
    }
  }

  onGetMedida(idProducto: number) {
    this.loadingMedida = true;
    const parametros = {
      codigo: 1025,
      parametros: {
        'CodigoCatalogoSustrato': idProducto,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listMedida = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingMedida = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingMedida = false;
      }
    });
  }

  onGetFile() {
    const rutas = this.infoProductoInventario.Adjuntos!;
    this.apiService.onGetApiFile(rutas).subscribe({
      next: (resp) => {
        if (resp instanceof Blob) {
          const url = window.URL.createObjectURL(resp);
          window.open(url, '_blank',);
          window.URL.revokeObjectURL(url);
        } else {
          this.sweetService.toastWarning('La respuesta no es un archivo');
        }
      }, error: (err) => {
        this.sweetService.toastWarning('Error en la API');
      }
    });
  }
}
