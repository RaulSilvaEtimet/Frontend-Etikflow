import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servicio-tecnico-orden-consulta-cliente',
  templateUrl: './consulta-cliente.component.html',
  styleUrl: './consulta-cliente.component.scss'
})
export class ServicioTecnicoOrdenConsultaClienteComponent implements OnInit {
  countries: any[] | undefined;

  selectedCountry: string | undefined;

  ngOnInit() {
    this.countries = [
      { name: 'Cliente 1', code: 'AU' },
      { name: 'Cliente 2', code: 'BR' },
      { name: 'Cliente 3', code: 'CN' },
      { name: 'Cliente 4', code: 'EG' },
      { name: 'Cliente 5', code: 'FR' },
      { name: 'Cliente 6', code: 'DE' },
      { name: 'Cliente 7', code: 'IN' },
      { name: 'Cliente 8', code: 'JP' },
      { name: 'Cliente 9', code: 'ES' },
      { name: 'Cliente 10', code: 'US' }
    ];
  }
}
