import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Table } from 'primeng/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { AdministracionProveedorInterface as AdministracionProveedorInterface } from '../../../interfaces/proveedor.interface';
import { ReactiveFormsService as FormsService } from 'src/app/shared/services/forms.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';

@Component({
  selector: 'app-administracion-proveedores-listado',
  templateUrl: './listado.component.html',
})
export class AdministracionProveedoresListadoComponent {
  apiService = inject(ApiService);
  loginService = inject(LoginService);
  sweetService = inject(SweetAlertService);
  formService = inject(FormsService);

  loadingProveedores: boolean = false;
  listProveedores: AdministracionProveedorInterface[] = [];
  buscarProveedor: string | undefined;
  modalProveedor: boolean = false;
  headerModalProveedor: boolean = false;
  idProveedor: number = 0;
  myForm: FormGroup;

  constructor() {
    this.myForm = new FormGroup({
      "razonSocial": new FormControl('', [Validators.required]),
      "identificacion": new FormControl('', [Validators.required]),
      "tipoIdentificacion": new FormControl('', [Validators.required]),
      "direccion": new FormControl('', [Validators.required]),
      "tipoCuenta": new FormControl('', [Validators.required]),
      "ubicacion": new FormControl('', [Validators.required]),
      "plazoPago": new FormControl('', [Validators.required]),
      "tipoPlazo": new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.onGetAllProveedores();
  }

  onGetAllProveedores() {
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

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onOpenModalCreate() {
    this.modalProveedor = true;
    this.headerModalProveedor = true;
    this.idProveedor = 0;
    this.myForm.reset();
  }

  onOpenModalEdit(infoProveedor: AdministracionProveedorInterface) {
    this.myForm.reset();
    this.modalProveedor = true;
    this.headerModalProveedor = false;
    this.idProveedor = infoProveedor.IdProveedor ?? 0;
    this.myForm.patchValue({
      "razonSocial": infoProveedor.RazonSocialProveedor,
      "identificacion": infoProveedor.IdentificacionProveedor,
      "tipoIdentificacion": infoProveedor.TipoIdentificacionProveedor,
      "direccion": infoProveedor.DireccionProveedor,
      "tipoCuenta": infoProveedor.TipoCuenta,
      "ubicacion": infoProveedor.ProveedorNacional ? 'NACIONAL' : 'INTERNACIONAL',
      "plazoPago": infoProveedor.PlazoPago,
      "tipoPlazo": infoProveedor.TipoPago,
    });
  }

  onSaveOrEdit() {
    if (this.idProveedor === 0) {
      this.onSaveProveedor();
    } else {
      this.onEditProveedor();
    }
  }

  onSaveProveedor() {
    if (this.formService.validForm(this.myForm)) {
      this.loadingProveedores = true;
      const parametros = {
        codigo: 1012,
        parametros: {
          "IdentificacionProveedor": this.myForm.value.identificacion,
          "TipoIdentificacionProveedor": this.myForm.value.tipoIdentificacion,
          "RazonSocialProveedor": this.myForm.value.razonSocial,
          "DireccionProveedor": this.myForm.value.direccion,
          "Telefono1": null,
          "Celular": null,
          "Email": null,
          "Cash": null,
          "Identificacion": null,
          "Beneficiario": null,
          "Banco": null,
          "Cuenta": null,
          "TipoCuenta": this.myForm.value.tipoCuenta,
          "Spi": null,
          "IdProveedor": null,
          "ProveedorNacional": Number(this.myForm.value.ubicacion),
          "EstadoProveedor": null,
          "PlazoPago": this.myForm.value.plazoPago,
          "TipoPago": this.myForm.value.tipoPlazo,
        }, infoLog: {
          "Fecha": new Date(),
          "Usuario": this.loginService.usuario.UserName,
          "Evento": "Insert",
          "Referencia": "Proveedor",
          "Detalle": null,
          "ServerName": null,
          "UserHostAddress": null,
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.loadingProveedores = false;
            this.sweetService.viewSuccess('Se creo el nuevo proveedor', () => { });
            this.ngOnInit();
          } else {
            this.sweetService.viewDanger(parametros.codigo, resp.mess);
          }
          this.modalProveedor = false;
        }, error: (err) => {
          this.loadingProveedores = false;
          this.modalProveedor = false;
          this.sweetService.viewDanger(parametros.codigo, err.error);
        }
      });
    } else {
      this.sweetService.toastWarning('Ingrese todos los campos');
    }
  }

  onEditProveedor() {
    if (this.formService.validForm(this.myForm)) {
      const parametros = {
        codigo: 1014,
        parametros: {
          IdProveedor: this.idProveedor,
          IdentificacionProveedor: this.myForm.value.identificacion,
          TipoIdentificacionProveedor: this.myForm.value.tipoIdentificacion,
          RazonSocialProveedor: this.myForm.value.razonSocial,
          DireccionProveedor: this.myForm.value.direccion,
          Telefono1: null,
          Celular: null,
          Email: null,
          Cash: null,
          Identificacion: null,
          Beneficiario: null,
          Banco: null,
          Cuenta: null,
          TipoCuenta: this.myForm.value.tipoCuenta,
          Spi: null,
          EstadoProveedor: null,
          ProveedorNacional: this.myForm.value.ubicacion === 'NACIONAL' ? true : false,
          PlazoPago: this.myForm.value.plazoPago,
          TipoPago: this.myForm.value.tipoPlazo,
        }, infoLog: {
          "Fecha": new Date(),
          "Usuario": this.loginService.usuario.UserName,
          "Evento": "Update",
          "Referencia": "Proveedor",
          "Detalle": this.idProveedor,
          "ServerName": null,
          "UserHostAddress": null,
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.sweetService.viewSuccess('Se modificaron los datos correctamente', () => { });
            this.onGetAllProveedores();
            this.modalProveedor = false;
          } else {
            this.sweetService.viewDanger(parametros.codigo, resp.message);
            this.loadingProveedores = false;
          }
        }, error: (err) => {
          this.sweetService.viewDanger(parametros.codigo, err.error);
          this.loadingProveedores = false;
        }
      });
    } else {
      this.sweetService.toastWarning('Ingrese todos los campos');
    }
  }
}
