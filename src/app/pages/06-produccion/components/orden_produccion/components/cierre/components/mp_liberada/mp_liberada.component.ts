import { Component, inject } from '@angular/core';
import { ProduccionOrdenProduccionCierreService } from '../../services/cierre.service';

@Component({
  selector: 'app-produccion-orden-produccion-cierre-mp-liberada',
  templateUrl: './mp_liberada.component.html',
})
export class ProduccionOrdenProduccionCierreMpLiberadaComponent {
  cierreService = inject(ProduccionOrdenProduccionCierreService);

}
