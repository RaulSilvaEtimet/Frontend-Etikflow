import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Table } from 'primeng/table';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { AdministracionDisenioCirelInterface, AdministracionDisenioPantoneInterface } from 'src/app/pages/02-administracion/interfaces/disenio.interface';
import { AdministracionProduccionRebobinadoInterface } from 'src/app/pages/02-administracion/interfaces/produccion.interface';

@Component({
  selector: 'app-produccion-listados-artes',
  templateUrl: './artes.component.html',
})
export class ProduccionListadosArtesComponent {
  apiService = inject(ApiService);
  loginService = inject(LoginService);
  sweetService = inject(SweetAlertService);
  formService = inject(ReactiveFormsService);

  blockedSendData: boolean = false;

  listCirel: AdministracionDisenioCirelInterface[] = [];
  loadingCirel: boolean = false;
  searchValue: string | undefined;

  listDiseniador: string[] = ['Giovani Andrade', 'Andres Rodriguez'];

  listPantone: AdministracionDisenioPantoneInterface[] = [];
  loadingPantone: boolean = false;
  listRebobinado: AdministracionProduccionRebobinadoInterface[] = [];
  loadingRebobinado: boolean = false;

  modalCirel: boolean = false;
  myForm: FormGroup;

  getFile: string = '';

  constructor() {
    this.myForm = new FormGroup({
      codigo: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      cliente: new FormControl('', [Validators.required]),
      diseniador: new FormControl('', [Validators.required]),
      rebobinado: new FormControl('', [Validators.required]),
      estado: new FormControl('', [Validators.required]),
      cilindro: new FormControl('', [Validators.required]),
      avance: new FormControl('', [Validators.required]),
      ancho: new FormControl('', [Validators.required]),
      gapAvance: new FormControl('', [Validators.required]),
      gapAncho: new FormControl('', [Validators.required]),
      repAvance: new FormControl('', [Validators.required]),
      repAncho: new FormControl('', [Validators.required]),
      color1: new FormControl(''),
      color2: new FormControl(''),
      color3: new FormControl(''),
      color4: new FormControl(''),
      color5: new FormControl(''),
      color6: new FormControl(''),
      color7: new FormControl(''),
      color8: new FormControl(''),
    });
  }

  ngOnInit() {
    this.onGetAllCirel();
    this.onGetAllPantone();
    this.onGetAllRebobinado();
  }

  onGetAllCirel() {
    this.loadingCirel = true;
    const parametros = {
      codigo: 1144,
      parametros: {
        "CodigoArte": null,
        "Cliente": null,
        "Diseniador": null,
        "Estado": null
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listCirel = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingCirel = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingCirel = false;
      }
    });
  }

  onGetAllPantone() {
    this.loadingPantone = true;
    const parametros = {
      codigo: 1141,
      parametros: {
        "LineaColor": null,
        "CodigoDescripcionPantone": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listPantone = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingPantone = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingPantone = false;
      }
    });
  }

  onGetAllRebobinado() {
    this.loadingRebobinado = true;
    const parametros = {
      codigo: 1125,
      parametros: {
        "IdRebobinado": null,
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listRebobinado = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingRebobinado = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingRebobinado = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  //CREAR
  onCreateArte() {
    this.myForm.reset();
    this.modalCirel = true;
  }

  onEditArte(info: AdministracionDisenioCirelInterface) {
    this.myForm.patchValue({
      codigo: info.CodigoArte,
      nombre: info.NombreProducto,
      cliente: info.Cliente,
      diseniador: info.Diseniador,
      rebobinado: this.listRebobinado.find(item => item.DescripcionRebobinado === info.Rebobinado) ?? null,
      estado: info.Estado,
      cilindro: info.Cilindro,
      avance: info.Avance,
      ancho: info.Ancho,
      gapAvance: info.GapAvance,
      gapAncho: info.GapAncho,
      repAvance: info.RepeticionesAvance,
      repAncho: info.RepeticionesAncho,
      color1: this.listPantone.find(item => item.CodigoDescripcionPantone === info.Color1) ?? null,
      color2: this.listPantone.find(item => item.CodigoDescripcionPantone === info.Color2) ?? null,
      color3: this.listPantone.find(item => item.CodigoDescripcionPantone === info.Color3) ?? null,
      color4: this.listPantone.find(item => item.CodigoDescripcionPantone === info.Color4) ?? null,
      color5: this.listPantone.find(item => item.CodigoDescripcionPantone === info.Color5) ?? null,
      color6: this.listPantone.find(item => item.CodigoDescripcionPantone === info.Color6) ?? null,
      color7: this.listPantone.find(item => item.CodigoDescripcionPantone === info.Color7) ?? null,
      color8: this.listPantone.find(item => item.CodigoDescripcionPantone === info.Color8) ?? null,
    });
    this.getFile = info.Path;

    this.modalCirel = true;
  }

  onGetFileArte() {
    this.apiService.onGetApiFile(this.getFile).subscribe({
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
