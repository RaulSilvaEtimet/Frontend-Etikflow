import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { Table } from 'primeng/table';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { AdministracionPersonalColaboradorInterface } from '../../../interfaces/personal.interface';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';

@Component({
  selector: 'app-administracion-personal-colaboradores',
  templateUrl: './colaboradores.component.html',
})
export class AdministracionPersonalColaboradoresComponent {
  apiService = inject(ApiService);
  loginService = inject(LoginService);
  sweetService = inject(SweetAlertService);
  formService = inject(ReactiveFormsService);

  blockedSend: boolean = false;

  listColaboradores: AdministracionPersonalColaboradorInterface[] = [];
  loadingColaboradores: boolean = false;
  modalColaborador: boolean = false
  myFormColaborador: FormGroup;
  idColaborador: number = 0;
  searchValue: string | undefined;

  listCargos: any[] = [];
  loadingCargos: boolean = false;
  selectCargo: string | undefined;

  constructor() {
    this.myFormColaborador = new FormGroup({
      "idCargo": new FormControl('', [Validators.required]),
      "nombres": new FormControl('', [Validators.required]),
      "apellidos": new FormControl('', [Validators.required]),
      "identificacion": new FormControl('', [Validators.required]),
      "salario": new FormControl('', [Validators.required]),
      "estado": new FormControl('', [Validators.required]),
      "usuario": new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.onGetAllColaboradores();
    this.onGetAllCargos();
  }

  onGetAllColaboradores() {
    this.loadingColaboradores = true;
    const parametros = {
      codigo: 1005,
      parametros: {
        "identificacion": null,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listColaboradores = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingColaboradores = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingColaboradores = false;
      }
    });
  }

  onGetAllCargos() {
    this.loadingCargos = true;
    const parametros = {
      codigo: 1002,
      parametros: {
        "idcargo": null,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listCargos = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingCargos = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingCargos = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onCreateColaborador() {
    this.myFormColaborador.reset();
    this.idColaborador = 0;
    this.modalColaborador = true;
  }

  onEditColaborador(colaborador: AdministracionPersonalColaboradorInterface) {
    this.idColaborador = Number(colaborador.IdColaborador);
    this.myFormColaborador.patchValue({
      "idCargo": colaborador.IdCargo,
      "nombres": colaborador.NombreColaborador,
      "apellidos": colaborador.ApellidoColaborador,
      "identificacion": colaborador.IdentificacionColaborador,
      "salario": colaborador.Salario,
      "estado": colaborador.EstadoUsuario,
      "usuario": colaborador.NombreUsuario,
    });
    this.modalColaborador = true;
  }

  onSaveColaborador() {
    if (this.formService.validForm(this.myFormColaborador)) {
      if (this.idColaborador === 0) {
        this.onInsertColaborador();
      } else {
        this.onUpdateColaborador();
      }
    } else {
      this.sweetService.toastWarning('Ingrese todos los campos');
    }
  }

  onInsertColaborador() {
    this.blockedSend = true;
    const parametros = {
      codigo: 1004,
      parametros: {
        "IdentificacionColaborador": this.myFormColaborador.value.identificacion,
        "NombreColaborador": this.myFormColaborador.value.nombres.toUpperCase(),
        "ApellidoColaborador": this.myFormColaborador.value.apellidos.toUpperCase(),
        "IdCargo": this.myFormColaborador.value.idCargo,
        "NombreUsuario": this.myFormColaborador.value.usuario,
        "FechaIngreso": null,
        "FechaSalida": null,
        "FechaRegistro": null,
        "EstadoUsuario": this.myFormColaborador.value.estado,
        "Salario": this.myFormColaborador.value.salario,
      }, infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Insert",
        "Referencia": "Colaborador",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.ngOnInit();
          this.sweetService.viewSuccess('Se creo el nuevo usuario', () => { });
          this.modalColaborador = false;
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

  onUpdateColaborador() {
    this.blockedSend = true;
    const parametros = {
      "codigo": 1006,
      "parametros": {
        "IdColaborador": this.idColaborador,
        "IdentificacionColaborador": this.myFormColaborador.value.identificacion,
        "NombreColaborador": this.myFormColaborador.value.nombres,
        "ApellidoColaborador": this.myFormColaborador.value.apellidos,
        "IdCargo": this.myFormColaborador.value.idCargo,
        "NombreUsuario": this.myFormColaborador.value.usuario,
        "FechaIngreso": null,
        "FechaSalida": null,
        "FechaRegistro": null,
        "EstadoUsuario": null,
        "Salario": this.myFormColaborador.value.salario,
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Update",
        "Referencia": "Colaborador",
        "Detalle": this.idColaborador,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.sweetService.viewSuccess('Se edito el usuario correctamente', () => { });
          this.modalColaborador = false;
          this.ngOnInit();
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
}
