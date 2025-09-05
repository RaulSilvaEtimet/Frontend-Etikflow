import { Component, inject } from '@angular/core';
import { ProduccionOrdenProduccionCierreService } from '../../services/cierre.service';

@Component({
  selector: 'app-produccion-orden-produccion-cierre-bitacora',
  templateUrl: './bitacora.component.html',
})
export class ProduccionOrdenProduccionCierreBitacoraComponent {
  cierreService = inject(ProduccionOrdenProduccionCierreService);

}
