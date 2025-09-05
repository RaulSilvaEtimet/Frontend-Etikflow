import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Table } from 'primeng/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { AdministracionProduccionCargoConsumosInterface } from '../../../interfaces/produccion.interface';

@Component({
  selector: 'app-administracion-produccion-cargo-consumo',
  templateUrl: './cargo-consumo.component.html',
})
export class AdministracionProduccionCargoConsumoComponent {
  apiService = inject(ApiService);
  sweetService = inject(SweetAlertService);
  loginService = inject(LoginService);
  formService = inject(ReactiveFormsService);

  loadingCargoConsumo: boolean = false;
  listCargoConsumos: AdministracionProduccionCargoConsumosInterface[] = [];
  searchCargoConsumo: string | undefined;
  modalCargoConsumo: boolean = false;

  myForm: FormGroup;
  idCargoConsumo: number = 0;

  blockedSendData: boolean = false;

  constructor() {
    this.myForm = new FormGroup({
      "descripcion": new FormControl('', [Validators.required]),
      "valorUnitario": new FormControl('', [Validators.required]),
      "medida": new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.onGetAllCargoConsumos();
  }

  onGetAllCargoConsumos() {
    this.loadingCargoConsumo = true;
    const parametros = {
      codigo: 1087,
      parametros: {
        "IdGastosVariosMaquinas": null,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listCargoConsumos = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingCargoConsumo = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingCargoConsumo = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onCreateCargoConsumo() {
    this.modalCargoConsumo = true;
    this.idCargoConsumo = 0;
    this.myForm.reset();
  }

  onEditCargoConsumo(infoCargoConsumo: AdministracionProduccionCargoConsumosInterface) {
    this.idCargoConsumo = infoCargoConsumo.IdGastosVariosMaquinas ?? 0;
    this.myForm.patchValue({
      descripcion: infoCargoConsumo.DescripcionGasto,
      valorUnitario: infoCargoConsumo.ValorUnitario,
      medida: infoCargoConsumo.DescripcionMedidaGasto,
    });
    this.modalCargoConsumo = true;
  }

  onInsertCargoConsumo() {
    if (this.formService.validForm(this.myForm)) {
      this.blockedSendData = true;
      const parametros = {
        codigo: 1086,
        parametros: {
          "DescripcionGasto": this.myForm.value.descripcion,
          "ValorUnitario": this.myForm.value.valorUnitario,
          "DescripcionMedidaGasto": this.myForm.value.medida,
        },
        infoLog: {
          "Fecha": new Date(),
          "Usuario": this.loginService.usuario.UserName,
          "Evento": "Insert",
          "Referencia": "Cargo por consumo",
          "Detalle": null,
          "ServerName": null,
          "UserHostAddress": null,
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.modalCargoConsumo = false;
            this.sweetService.viewSuccess('Se creo el nuevo cargo por consumo', () => { });
            this.ngOnInit();
          } else {
            this.sweetService.viewDanger(parametros.codigo, resp.message);
          }
          this.blockedSendData = false;
        }, error: (err) => {
          this.blockedSendData = false;
          this.sweetService.viewDanger(parametros.codigo, err.error);
        }
      });
    } else {
      this.sweetService.toastWarning('Ingrese todos los parametros');
    }
  }

  onUpdateCargoConsumo() {
    if (this.formService.validForm(this.myForm)) {
      this.blockedSendData = true;
      const parametros = {
        codigo: 1088,
        parametros: {
          "IdGastosVariosMaquinas": this.idCargoConsumo,
          "DescripcionGasto": this.myForm.value.descripcion,
          "ValorUnitario": this.myForm.value.valorUnitario,
          "DescripcionMedidaGasto": this.myForm.value.medida,
        },
        infoLog: {
          "Fecha": new Date(),
          "Usuario": this.loginService.usuario.UserName,
          "Evento": "Update",
          "Referencia": "Cargo por consumo",
          "Detalle": null,
          "ServerName": null,
          "UserHostAddress": null,
        }
      };
      this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.modalCargoConsumo = false;
            this.sweetService.viewSuccess('Se creo el nuevo cargo por consumo', () => { });
            this.ngOnInit();
          } else {
            this.sweetService.viewDanger(parametros.codigo, resp.message);
          }
          this.blockedSendData = false;
        }, error: (err) => {
          this.blockedSendData = false;
          this.sweetService.viewDanger(parametros.codigo, err.error);
        }
      });
    } else {
      this.sweetService.toastWarning('Ingrese todos los parametros');
    }
  }

  onSaveCargoConsumo() {
    if (this.idCargoConsumo === 0) {
      this.onInsertCargoConsumo();
    } else {
      this.onUpdateCargoConsumo();
    }
  }
}
