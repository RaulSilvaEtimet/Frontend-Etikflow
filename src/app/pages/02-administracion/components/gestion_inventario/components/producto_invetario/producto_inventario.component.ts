import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Table } from 'primeng/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { GestionInventarioGrupoInventarioInterface, GestionInventarioLineaInventarioInterface, GestionInventarioProductoInventarioInterface, GestionInventarioTipoInventarioInterface } from '../../../../interfaces/gestion-inventario.interface';
import { AdministracionProveedorInterface } from '../../../../interfaces/proveedor.interface';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-administracion-gestion-inventario-productos-inventario',
  templateUrl: './producto_inventario.component.html',
})
export class AdministracionGestionInventarioProductosInventarioComponent implements OnInit {
  apiService = inject(ApiService);
  loginService = inject(LoginService);
  sweetService = inject(SweetAlertService);
  formService = inject(ReactiveFormsService);

  loadingProductosInventario: boolean = false;
  listProductosInventario: GestionInventarioProductoInventarioInterface[] = [];
  searchProductosInventario: string | undefined;
  modalCreateProducto: boolean = false;

  files1: File | null = null;
  @ViewChild('fileUpload1') fileUpload1!: FileUpload;
  myFormCreate: FormGroup;
  codLineaInventario: string = "";
  codGrupoInventario: string = "";
  codTipoInventario: string = "";

  loadingLineaInventario: boolean = false;
  listLineaInventario: GestionInventarioLineaInventarioInterface[] = [];
  loadingGrupoInventario: boolean = false;
  listGrupoInventario: GestionInventarioGrupoInventarioInterface[] = [];
  loadingTipoInventario: boolean = false;
  listTipoInventario: GestionInventarioTipoInventarioInterface[] = [];
  loadingProveedores: boolean = false;
  listProveedores: AdministracionProveedorInterface[] = [];
  listAdherencia: string[] = ['Alta', 'Media', 'Baja', 'Sin Adherencia'];
  listUnidadMedida: any[] = [];
  listUnidadMedidaMP = ['Gramo / metro cuadrado'];
  listUnidadMedidaPA = ['Unidad', 'Docena'];

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

  blockedSend: boolean = false;

  loadingMedida: boolean = false;
  listMedida: any[] = [];
  modalAddMedida: boolean = false;
  myFormMedida: FormGroup;

  myFormEdit: FormGroup;
  modalEditProducto: boolean = false;

  constructor() {
    this.myFormCreate = new FormGroup({
      "descripcion": new FormControl('', [Validators.required]),
      "lineaInventario": new FormControl('', [Validators.required]),
      "grupoInventario": new FormControl('', [Validators.required]),
      "tipoInventario": new FormControl('', [Validators.required]),
      "proveedor": new FormControl('', [Validators.required]),
      "adherencia": new FormControl('', [Validators.required]),
      "unidadMedida": new FormControl('', [Validators.required]),
      "peso": new FormControl('', [Validators.required]),
      "valor": new FormControl('', [Validators.required]),
      "valormsi": new FormControl('', [Validators.required]),
    });
    this.myFormMedida = new FormGroup({
      "medidaML": new FormControl('', [Validators.required]),
    });
    this.myFormEdit = new FormGroup({
      "descripcion": new FormControl('', [Validators.required]),
      "proveedor": new FormControl('', [Validators.required]),
      "adherencia": new FormControl('', [Validators.required]),
      "unidadMedida": new FormControl('', [Validators.required]),
      "peso": new FormControl('', [Validators.required]),
      "valor": new FormControl('', [Validators.required]),
      "valormsi": new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.onGetProductoInventario();
    this.onGetProveedores();
    this.onGetLineaInventario();
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

  onGetProveedores() {
    this.loadingProveedores = true;
    const parametros = {
      codigo: 1013,
      parametros: {
        'IdentificacionProveedor': null
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listProveedores = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingProveedores = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingProveedores = false;
      }
    });
  }

  onGetLineaInventario() {
    this.loadingLineaInventario = true;
    const parametros = {
      codigo: 1066,
      parametros: {
        'CodigoLineaInventario': null
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listLineaInventario = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingLineaInventario = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingLineaInventario = false;
      }
    });
  }

  onChangeLineaInventario(infoLineaInventario: GestionInventarioLineaInventarioInterface) {
    if (infoLineaInventario !== null) {
      this.onGetGrupoInventario(infoLineaInventario.IdLineaInventario ?? 0);
      this.myFormCreate.patchValue({
        "grupoInventario": null,
        "tipoInventario": null,
      });
      this.codLineaInventario = infoLineaInventario.CodigoLineaInventario ?? "";
      this.codGrupoInventario = "";
      this.codTipoInventario = "";
      if (this.codLineaInventario === 'MP') {
        this.listUnidadMedida = [...this.listUnidadMedidaMP];
      }
      else if (this.codLineaInventario === 'PA') {
        this.listUnidadMedida = [...this.listUnidadMedidaPA];
      }
      else {
        this.listUnidadMedida = [];
      }
    }
  }

  onGetGrupoInventario(idLineaInventario: number) {
    this.loadingGrupoInventario = true;
    const parametros = {
      codigo: 1016,
      parametros: {
        "GrupoInventario": null,
        "IdLineaInventario": idLineaInventario,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listGrupoInventario = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingGrupoInventario = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingGrupoInventario = false;
      }
    });
  }

  onChangeGrupoInventario(infoGrupoInvetario: GestionInventarioGrupoInventarioInterface) {
    if (infoGrupoInvetario !== null) {
      this.onGetTipoInventario(infoGrupoInvetario.IdGrupoInventario ?? 0);
      this.myFormCreate.patchValue({
        "tipoInventario": null,
      });
      this.codGrupoInventario = infoGrupoInvetario.GrupoInventario ?? "";
      this.codTipoInventario = "";
    }
  }

  onGetTipoInventario(idGrupoInventario: number) {
    this.loadingTipoInventario = true;
    const parametros = {
      codigo: 1019,
      parametros: {
        "CodigoTipoInventario": null,
        "IdGrupoInventario": idGrupoInventario,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listTipoInventario = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingTipoInventario = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingTipoInventario = false;
      }
    });
  }

  onChangeTipoInventario(infoTipoInventario: GestionInventarioTipoInventarioInterface) {
    if (infoTipoInventario) {
      this.codTipoInventario = infoTipoInventario.CodigoTipoInventario ?? "";
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onOpenModalCreate() {
    this.codLineaInventario = "";
    this.codGrupoInventario = "";
    this.codTipoInventario = "";
    this.myFormCreate.reset();
    this.modalCreateProducto = true;
  }

  onInsertProductoInventario() {
    if (this.formService.validForm(this.myFormCreate)) {
      this.blockedSend = true;
      const parametros = {
        codigo: 1021,
        parametros: {
          "CodigoInternoSustrato": `${this.codLineaInventario}${this.codGrupoInventario}${this.codTipoInventario}`,
          "DescripcionSustrato": this.myFormCreate.value.descripcion.toUpperCase(),
          "ValorUsd": this.myFormCreate.value.valor,
          "ValorUsdMsi": this.myFormCreate.value.valormsi,
          "Peso": this.myFormCreate.value.peso,
          "IdProveedor": this.myFormCreate.value.proveedor,
          "AdherenciaSustrato": this.myFormCreate.value.adherencia,
          "IdTipoInventario": this.myFormCreate.value.tipoInventario.IdTipoInventario,
          "UnidadMedida": this.myFormCreate.value.unidadMedida,
          "Adjuntos": null,
        },
        infoLog: {
          "Fecha": new Date(),
          "Usuario": this.loginService.usuario.UserName,
          "Evento": "Insert",
          "Referencia": "Producto de inventario",
          "Detalle": null,
          "ServerName": null,
          "UserHostAddress": null,
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.modalCreateProducto = false;
            this.ngOnInit();
            this.sweetService.viewSuccess('Se creo el nuevo producto', () => { });
          } else {
            this.sweetService.viewDanger(parametros.codigo, resp.message);
          }
          this.blockedSend = false;
        }, error: (err) => {
          this.blockedSend = false;
          this.sweetService.viewDanger(parametros.codigo, err.error);
        }
      });
    } else {
      this.sweetService.toastWarning('Ingrese todos los parametros');
    }
  }

  onOpenModalEdit(infoProducto: GestionInventarioProductoInventarioInterface) {
    this.infoProductoInventario = { ...infoProducto };
    this.modalEditProducto = true;
    this.myFormEdit.patchValue({
      "descripcion": infoProducto.DescripcionSustrato,
      "proveedor": infoProducto.IdProveedor,
      "adherencia": infoProducto.AdherenciaSustrato,
      "unidadMedida": infoProducto.UnidadMedida,
      "peso": infoProducto.Peso,
      "valor": infoProducto.ValorUsd,
      "valormsi": infoProducto.ValorUsdMsi,
    });
  }

  onUpdateProductoInventario() {
    if (this.formService.validForm(this.myFormEdit)) {
      this.blockedSend = true;
      const parametros = {
        codigo: 1023,
        parametros: {
          "IdSustrato": this.infoProductoInventario.CodigoCatalogoSustrato,
          "CodigoInternoSustrato": null,
          "DescripcionSustrato": this.myFormEdit.value.descripcion.toUpperCase(),
          "ValorUsd": this.myFormEdit.value.valor,
          "ValorUsdMsi": this.myFormEdit.value.valormsi,
          "Peso": this.myFormEdit.value.peso,
          "IdProveedor": this.myFormEdit.value.proveedor,
          "AdherenciaSustrato": this.myFormEdit.value.adherencia,
          "IdTipoInventario": null,
          "UnidadMedida": this.myFormEdit.value.unidadMedida,
          "Adjuntos": null
        },
        infoLog: {
          "Fecha": new Date(),
          "Usuario": this.loginService.usuario.UserName,
          "Evento": "Update",
          "Referencia": "Producto de inventario",
          "Detalle": this.infoProductoInventario.CodigoCatalogoSustrato,
          "ServerName": null,
          "UserHostAddress": null,
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.modalEditProducto = false;
            this.blockedSend = false;
            this.ngOnInit();
            this.sweetService.viewSuccess('Se modifico el producto', () => { });
          } else {
            this.sweetService.viewDanger(parametros.codigo, resp.message);
          }
        }, error: (err) => {
          this.blockedSend = false;
          this.sweetService.viewDanger(parametros.codigo, err.error);
        }
      });
    } else {
      this.sweetService.toastWarning('Ingrese todos los parametros');
    }
  }

  onOpenModalView(infoProducto: GestionInventarioProductoInventarioInterface) {
    this.infoProductoInventario = { ...infoProducto };
    this.modalInfoProducto = true;
    if (infoProducto.CodigoLineaInventario === 'MP') {
      this.onGetMedida(infoProducto.CodigoCatalogoSustrato ?? 0);
    }
    this.fileUpload1.clear();
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

  onOpenAddMedida() {
    this.modalAddMedida = true;
    this.myFormMedida.reset();
  }

  onInsertMedida() {
    if (this.formService.validForm(this.myFormMedida)) {
      this.blockedSend = true;
      const parametros = {
        codigo: 1024,
        parametros: {
          "CodigoCatalogoSustrato": this.infoProductoInventario.CodigoCatalogoSustrato,
          "AnchoSustrato": this.myFormMedida.value.medidaML,
        },
        infoLog: {
          "Fecha": new Date(),
          "Usuario": this.loginService.usuario.UserName,
          "Evento": "Insert",
          "Referencia": "Medida de Producto",
          "Detalle": null,
          "ServerName": null,
          "UserHostAddress": null,
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.modalAddMedida = false;
            this.onGetMedida(this.infoProductoInventario.CodigoCatalogoSustrato ?? 0);
            this.sweetService.viewSuccess('Se creo la neuva medida', () => { });
          } else {
            this.sweetService.viewDanger(parametros.codigo, resp.message);
          }
          this.blockedSend = false;
        }, error: (err) => {
          this.sweetService.viewDanger(parametros.codigo, err.error);
          this.blockedSend = false;
        }
      });
    } else {
      this.sweetService.toastWarning('Ingrese todos los parametros');
    }
  }

  onRenameFile(file: File, newFileName: string): File {
    const newFile = new File([file], newFileName, { type: file.type });
    return newFile;
  }

  onUploadFichaTecnica(event: any) {
    this.blockedSend = true;

    const originalFile = event.files[0];
    this.files1 = this.onRenameFile(originalFile, `Ficha Tecnica ${this.infoProductoInventario.CodigoCatalogoSustrato}.pdf`);

    const allFiles = [this.files1];
    const formData = new FormData();
    allFiles.forEach((file: File | null) => {
      formData.append('files', file!);
      formData.append('data', `/Administracion/Fichas Tecnicas`);
    });

    const parametros = {
      codigo: 1023,
      parametros: {
        "IdSustrato": this.infoProductoInventario.CodigoCatalogoSustrato,
        "CodigoInternoSustrato": null,
        "DescripcionSustrato": null,
        "ValorUsd": null,
        "ValorUsdMsi": null,
        "Peso": null,
        "IdProveedor": null,
        "AdherenciaSustrato": null,
        "IdTipoInventario": null,
        "UnidadMedida": null,
        "Adjuntos": null,
      }, infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Update",
        "Referencia": "Ficha tecnica",
        "Detalle": this.infoProductoInventario.CodigoCatalogoSustrato,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    formData.append('SP', JSON.stringify(parametros));
    this.apiService.onGetApiExecuteNew(formData, 'administracion', 'uploadPdf', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.sweetService.viewSuccess('Los archivos se subieron satisfactoriamente', () => { });
          this.modalInfoProducto = false;
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.blockedSend = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.blockedSend = false;
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
