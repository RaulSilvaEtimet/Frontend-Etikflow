import { Component, inject, OnInit } from '@angular/core';
import { ServicioTecnicoOrdenEquiposInterface } from '../../interfaces/interfaces';
import { OrdenServicioTecnicoService } from '../../services/orden-servicio-tecnico.service';

@Component({
  selector: 'app-servicio-tecnico-orden-formulario',
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss',
})
export class ServicioTecnicoOrdenFormularioComponent implements OnInit {
  serviceOrden = inject(OrdenServicioTecnicoService);

  listaVerificacion: string[] = [];
  arrayEquipos: ServicioTecnicoOrdenEquiposInterface[] = [];
  arrayVerificacion: string[] = [];
  clonedProducts: { [s: number]: ServicioTecnicoOrdenEquiposInterface } = {};

  ngOnInit(): void {
    this.listaVerificacion = [...this.serviceOrden.listaVerificacion];
    this.arrayEquipos = [...this.serviceOrden.dataEquipos()];
  }

  onAddEquipos() {
    this.arrayEquipos.push({
      id: -1,
      modelo: '',
      marca: '',
      serial: '',
      ubicacion: '',
      pgLinealesRecibidos: '',
      pgLinealesEntregados: '',
      observaciones: '',
    });
    this.serviceOrden.dataEquipos.set([...this.arrayEquipos]);
  }

  onDeleteEquipos(index: number) {
    this.arrayEquipos.splice(index, 1);
    this.serviceOrden.dataEquipos.set([...this.arrayEquipos]);
  }

  onChangeVerificacion(value: string) {
    const pos = this.arrayVerificacion.indexOf(value);
    if (pos == -1) {
      this.arrayVerificacion.push(value);
    } else {
      this.arrayVerificacion.splice(pos, 1);
    }
    this.serviceOrden.dataVerificacion.set([...this.arrayVerificacion]);
  }


  //TODO: REVISAR
  onRowEditInitEquipos(product: ServicioTecnicoOrdenEquiposInterface) {
    this.clonedProducts[product.id as number] = { ...product };
  }

  onRowEditSaveEquipos(product: ServicioTecnicoOrdenEquiposInterface) {
    //if (product.price > 0) {
    delete this.clonedProducts[product.id as number];
    //this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
    //} else {
    //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
    //}
  }

  onRowEditCancelEquipos(product: ServicioTecnicoOrdenEquiposInterface, index: number) {
    this.arrayEquipos[index] = this.clonedProducts[product.id as number];
    delete this.clonedProducts[product.id as number];
  }

  onRowEditInitRepuestos(product: ServicioTecnicoOrdenEquiposInterface) {
    this.clonedProducts[product.id as number] = { ...product };
  }

  onRowEditSaveRepuestos(product: ServicioTecnicoOrdenEquiposInterface) {
    //if (product.price > 0) {
    delete this.clonedProducts[product.id as number];
    //this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
    //} else {
    //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
    //}
  }

  onRowEditCancelRepuestos(product: ServicioTecnicoOrdenEquiposInterface, index: number) {
    //this.equipos[index] = this.clonedProducts[product.id as number];
    delete this.clonedProducts[product.id as number];
  }
}
