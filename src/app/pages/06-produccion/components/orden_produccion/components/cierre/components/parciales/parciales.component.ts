import { Component, inject } from '@angular/core';
import { ProduccionOrdenProduccionCierreService } from '../../services/cierre.service';

@Component({
  selector: 'app-produccion-orden-produccion-cierre-parciales',
  templateUrl: './parciales.component.html',
})
export class ProduccionOrdenProduccionCierreParcialesComponent {
  cierreService = inject(ProduccionOrdenProduccionCierreService);

}
