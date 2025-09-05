import { Component, inject } from '@angular/core';
import { ProduccionOrdenProduccionCierreService } from '../../services/cierre.service';

@Component({
  selector: 'app-produccion-orden-produccion-cierre-info-op',
  templateUrl: './info_orden_produccion.component.html',
})
export class ProduccionOrdenProduccionCierreInfoOPComponent {
  cierreService = inject(ProduccionOrdenProduccionCierreService);
}
