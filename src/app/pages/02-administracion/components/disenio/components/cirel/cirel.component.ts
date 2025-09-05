import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Table } from 'primeng/table';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsService } from 'src/app/shared/services/forms.service';
import { AdministracionDisenioCirelInterface, AdministracionDisenioPantoneInterface } from 'src/app/pages/02-administracion/interfaces/disenio.interface';
import { AdministracionProduccionMaquinaInterface, AdministracionProduccionRebobinadoInterface } from 'src/app/pages/02-administracion/interfaces/produccion.interface';

@Component({
  selector: 'app-administracion-disenio-cirel',
  templateUrl: './cirel.component.html',
})
export class AdministracionDisenioArtesComponent {
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
  loadingMaquina: boolean = false;
  listMaquina: AdministracionProduccionMaquinaInterface[] = [];

  modalCirel: boolean = false;
  myForm: FormGroup;
  idCirel: number = 0;

  uploadedFile: File | null = null;
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
      maquina: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.onGetAllCirel();
    this.onGetAllPantone();
    this.onGetAllRebobinado();
    this.onGetAllMaquina();
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

  onGetAllMaquina() {
    this.loadingMaquina = true;
    const parametros = {
      codigo: 1084,
      parametros: {
        'IdMaquina': null
      }
    }
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'get', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.listMaquina = [...resp.data];
        } else {
          this.sweetService.viewDanger(parametros.codigo, resp.message);
        }
        this.loadingMaquina = false;
      }, error: (err) => {
        this.sweetService.viewDanger(parametros.codigo, err.error);
        this.loadingMaquina = false;
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
    this.idCirel = 0;
  }

  onEditArte(info: AdministracionDisenioCirelInterface) {
    this.idCirel = info.IdCirel;
    this.myForm.patchValue({
      codigo: info.CodigoArte,
      nombre: info.NombreProducto,
      cliente: info.Cliente,
      diseniador: info.Diseniador,
      rebobinado: this.listRebobinado.find(item => item.DescripcionRebobinado === info.Rebobinado) ?? null,
      maquina: this.listMaquina.find(item => item.IdMaquina === info.IdMaquina),
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

  onInsertArte() {
    this.blockedSendData = true;

    let colors: string[] = [];
    for (let i = 1; i <= 8; i++) {
      if (this.myForm.value['color' + i]) {
        const color = this.myForm.value['color' + i];
        colors.push(color);
      }
    }
    const parametros = {
      codigo: 1143,
      parametros: {
        "FechaRegistro": new Date(),
        "CodigoArte": this.myForm.value.codigo,
        "NombreProducto": this.myForm.value.nombre,
        "Cliente": this.myForm.value.cliente,
        "Cilindro": this.myForm.value.cilindro,
        "Ancho": this.myForm.value.ancho,
        "Avance": this.myForm.value.avance,
        "GapAvance": this.myForm.value.gapAvance,
        "GapAncho": this.myForm.value.gapAncho,
        "RepeticionesAvance": this.myForm.value.repAvance,
        "RepeticionesAncho": this.myForm.value.repAncho,
        "CantidadColores": colors.length,
        "Color1": this.myForm.value.color1 ? this.myForm.value.color1.CodigoDescripcionPantone : null,
        "Color2": this.myForm.value.color2 ? this.myForm.value.color2.CodigoDescripcionPantone : null,
        "Color3": this.myForm.value.color3 ? this.myForm.value.color3.CodigoDescripcionPantone : null,
        "Color4": this.myForm.value.color4 ? this.myForm.value.color4.CodigoDescripcionPantone : null,
        "Color5": this.myForm.value.color5 ? this.myForm.value.color5.CodigoDescripcionPantone : null,
        "Color6": this.myForm.value.color6 ? this.myForm.value.color6.CodigoDescripcionPantone : null,
        "Color7": this.myForm.value.color7 ? this.myForm.value.color7.CodigoDescripcionPantone : null,
        "Color8": this.myForm.value.color8 ? this.myForm.value.color8.CodigoDescripcionPantone : null,
        "Color9": null,
        "Color10": null,
        "Color11": null,
        "Color12": null,
        "Rebobinado": this.myForm.value.rebobinado ? this.myForm.value.rebobinado.DescripcionRebobinado : null,
        "Path": null,
        "Diseniador": this.myForm.value.diseniador,
        "Usuario": this.loginService.usuario.UserName,
        "Estado": this.myForm.value.estado,
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Insert",
        "Referencia": "Cirel",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'insert', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalCirel = false;
          this.sweetService.viewSuccess('Se creo el nuevo cirel', () => { });
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
  }

  onUpdateArte() {
    this.blockedSendData = true;

    let colors: string[] = [];
    for (let i = 1; i <= 8; i++) {
      if (this.myForm.value['color' + i]) {
        const color = this.myForm.value['color' + i];
        colors.push(color);
      }
    }
    const parametros = {
      codigo: 1145,
      parametros: {
        "IdCirel": this.idCirel,
        "FechaRegistro": new Date(),
        "CodigoArte": this.myForm.value.codigo,
        "NombreProducto": this.myForm.value.nombre,
        "Cliente": this.myForm.value.cliente,
        "Cilindro": this.myForm.value.cilindro,
        "Ancho": this.myForm.value.ancho,
        "Avance": this.myForm.value.avance,
        "GapAvance": this.myForm.value.gapAvance,
        "GapAncho": this.myForm.value.gapAncho,
        "RepeticionesAvance": this.myForm.value.repAvance,
        "RepeticionesAncho": this.myForm.value.repAncho,
        "CantidadColores": colors.length,
        "Color1": this.myForm.value.color1 ? this.myForm.value.color1.CodigoDescripcionPantone : null,
        "Color2": this.myForm.value.color2 ? this.myForm.value.color2.CodigoDescripcionPantone : null,
        "Color3": this.myForm.value.color3 ? this.myForm.value.color3.CodigoDescripcionPantone : null,
        "Color4": this.myForm.value.color4 ? this.myForm.value.color4.CodigoDescripcionPantone : null,
        "Color5": this.myForm.value.color5 ? this.myForm.value.color5.CodigoDescripcionPantone : null,
        "Color6": this.myForm.value.color6 ? this.myForm.value.color6.CodigoDescripcionPantone : null,
        "Color7": this.myForm.value.color7 ? this.myForm.value.color7.CodigoDescripcionPantone : null,
        "Color8": this.myForm.value.color8 ? this.myForm.value.color8.CodigoDescripcionPantone : null,
        "Color9": null,
        "Color10": null,
        "Color11": null,
        "Color12": null,
        "Rebobinado": this.myForm.value.rebobinado ? this.myForm.value.rebobinado.DescripcionRebobinado : null,
        "Path": null,
        "Diseniador": this.myForm.value.diseniador,
        "Usuario": this.loginService.usuario.UserName,
        "Estado": this.myForm.value.estado,
        "IdMaquina": Number(this.myForm.value.maquina.IdMaquina)
      },
      infoLog: {
        "Fecha": new Date(),
        "Usuario": this.loginService.usuario.UserName,
        "Evento": "Update",
        "Referencia": "Cirel",
        "Detalle": null,
        "ServerName": null,
        "UserHostAddress": null,
      }
    };
    this.apiService.onGetApiExecuteNew(parametros, 'administracion', 'update', parametros.codigo).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.modalCirel = false;
          this.sweetService.viewSuccess('Se creo el nuevo cirel', () => { });
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
  }

  onSaveArte() {
    if (this.formService.validForm(this.myForm)) {
      if (this.idCirel === 0) {
        this.onInsertArte();
      } else {
        this.onUpdateArte();
      }
    } else {
      this.sweetService.toastWarning('Ingrese todos los datos');
    }
  }

  onRenameFile(file: File, newFileName: string): File {
    const newFile = new File([file], newFileName, { type: file.type });
    return newFile;
  }

  onUploadFile(event: any) {
    if (event) {
      this.blockedSendData = true;
      for (let file of event.files) {
        const codArte = this.listCirel.find(item => item.IdCirel === this.idCirel);
        const uploadFile = this.onRenameFile(file, `Arte_${codArte!.CodigoArte}.pdf`);
        const formData = new FormData();
        formData.append('files', uploadFile);
        formData.append('data', `/Artes`);
        const parametros = {
          codigo: 1145,
          parametros: {
            "IdCirel": this.idCirel,
            "FechaRegistro": null,
            "CodigoArte": null,
            "NombreProducto": null,
            "Cliente": null,
            "Cilindro": null,
            "Ancho": null,
            "Avance": null,
            "GapAvance": null,
            "GapAncho": null,
            "RepeticionesAvance": null,
            "RepeticionesAncho": null,
            "CantidadColores": null,
            "Color1": null,
            "Color2": null,
            "Color3": null,
            "Color4": null,
            "Color5": null,
            "Color6": null,
            "Color7": null,
            "Color8": null,
            "Color9": null,
            "Color10": null,
            "Color11": null,
            "Color12": null,
            "Rebobinado": null,
            "Path": null,
            "Diseniador": null,
            "Usuario": null,
            "Estado": null,
            "IdMaquina": null,
          },
          infoLog: {
            "Fecha": new Date(),
            "Usuario": this.loginService.usuario.UserName,
            "Evento": "Update",
            "Referencia": "Cirel PDF",
            "Detalle": null,
            "ServerName": null,
            "UserHostAddress": null,
          }
        };
        formData.append('SP', JSON.stringify(parametros));
        this.apiService.onGetApiExecuteNew(formData, 'administracion', 'uploadCirelPdf', parametros.codigo).subscribe({
          next: (resp: any) => {
            if (resp.success) {
              this.modalCirel = false
              this.sweetService.viewSuccess('Los archivos se subieron satisfactoriamente', () => { });
            } else {
              this.sweetService.viewDanger(parametros.codigo, resp.message);
            }
            this.blockedSendData = false;
          }, error: (err) => {
            this.sweetService.viewDanger(parametros.codigo, err.error);
            this.blockedSendData = false;
          }
        });
      }
    }
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
