import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Table } from 'primeng/table';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { AdministracionComercialClientesInterface } from '../../../interfaces/comercial.interface';

@Component({
  selector: 'app-administracion-clientes',
  templateUrl: './clientes.component.html',
})
export class AdministracionComercialClientesComponent {
  apiService = inject(ApiService);
  loginService = inject(LoginService);
  sweetService = inject(SweetAlertService);

  listClientes: AdministracionComercialClientesInterface[] = [];
  loadingClientes: boolean = false;
  searchValue: string | undefined;

  ngOnInit() {
    this.onGetClientes();
  }

  onGetClientes() {
    this.loadingClientes = true;
    const parametros = {
      codigo: 1010,
      parametros: {
        "nombreusuario": null,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listClientes = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingClientes = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingClientes = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onUpdateRating(cliente: any, rating: number) {
    this.loadingClientes = true;
    const parametros = {
      codigo: 1011,
      parametros: {
        "id": cliente.IdCliente,
        "codigo": null,
        "identificacion": null,
        "razonsocial": null,
        "nombrecomercial": null,
        "direccion": null,
        "zona": null,
        "provincia": null,
        "ciudad": null,
        "parroquia": null,
        "telefono": null,
        "celular": null,
        "email": null,
        "tipoprecio": null,
        "monto": null,
        "descuento": null,
        "dias": null,
        "informacionburo": null,
        "sexo": null,
        "estadocivil": null,
        "origeningresos": null,
        "nombreusuario": null,
        "estadocliente": null,
        "calificacion": rating,
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Update",
        "Referencia": "Cliente",
        "Detalle": cliente.IdCliente,
        "ServerName": null,
        "UserHostAddress": null,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.onGetClientes();
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingClientes = false;
        this.onGetClientes();
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingClientes = false;
      }
    });
  }
}
