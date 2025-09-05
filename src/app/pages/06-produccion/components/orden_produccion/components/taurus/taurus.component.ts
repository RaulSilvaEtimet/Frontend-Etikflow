import { Component, inject } from "@angular/core";
import { Table } from "primeng/table";
import { LoginService } from "src/app/pages/00-login/services/login.service";
import { ConfiguracionesExtrasDocumentosPDFService } from "src/app/pages/01-configuraciones-extras/components/documentos_pdf/services/documentos-pddf.service";
import { ApiService } from "src/app/shared/services/api.service";
import { ReactiveFormsService } from "src/app/shared/services/forms.service";
import { SweetAlertService } from "src/app/shared/services/sweet-alert.service";

@Component({
    selector: 'app-produccion-orden-produccion-taurus',
    templateUrl: './taurus.component.html',
    styles: [`
        .txtObservacion {  
            white-space: pre-line; line-height: 1;
        }
    `]
})
export class ProduccionOrdenProduccionTaurusComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    sweetService = inject(SweetAlertService);
    formService = inject(ReactiveFormsService);
    pdfService = inject(ConfiguracionesExtrasDocumentosPDFService);

    blockedSend: boolean = false;
    blockedGet: boolean = false;

    loadingOP: boolean = false;
    listOP: any[] = [];

    searchValue: string | undefined;

    ngOnInit() {
        this.onGetAllOpTaurus();
    }

    onGetAllOpTaurus() {
        this.loadingOP = true;
        const parametros = {
            codigo: 1170,
            parametros: {
                "Estado": 1,
            },
            tablas: ['NotificacionCabecera', 'TablaMPLiberado']
        };
        this.apiService.onGetApiExecuteNew(parametros, 'taurus', 'get', parametros.codigo).subscribe({
            next: (respOne: any) => {
                if (respOne.success) {
                    const parametros = {
                        codigo: 1170,
                        parametros: {
                            "Estado": 2,
                        },
                        tablas: ['NotificacionCabecera', 'TablaMPLiberado']
                    };
                    this.apiService.onGetApiExecuteNew(parametros, 'taurus', 'get', parametros.codigo).subscribe({
                        next: (respTwo: any) => {
                            if (respTwo.success) {
                                this.listOP = [...respOne.data[0].NotificacionCabecera, ...respTwo.data[0].NotificacionCabecera];
                            } else {
                                this.sweetService.viewDanger(parametros.codigo, respTwo.message);
                            }
                            this.loadingOP = false;
                        }, error: (err) => {
                            this.sweetService.viewDanger(parametros.codigo, err.error);
                            this.loadingOP = false;
                        }
                    });

                } else {
                    this.sweetService.viewDanger(parametros.codigo, respOne.message);
                }
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingOP = false;
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
