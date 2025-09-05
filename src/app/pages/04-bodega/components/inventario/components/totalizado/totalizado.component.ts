
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { BodegaInventarioDesgloseDisBobCorInterface, BodegaInventarioInformacionInterface, BodegaInventarioTotalizadoInterface } from 'src/app/pages/04-bodega/interfaces/inventario';

@Component({
    selector: 'app-bodega-inventario-totalizado',
    templateUrl: './totalizado.component.html',
})
export class BodegaInventarioTotalizadoComponent {
    apiService = inject(ApiService);
    loginService = inject(LoginService);
    apiRouter = inject(Router);
    sweetService = inject(SweetAlertService);

    loadingInventario: boolean = false;
    modalInfoInventario: boolean = false;
    listInventario: BodegaInventarioTotalizadoInterface[] = [];
    searchValue: string | undefined;

    listInfoInventario: BodegaInventarioInformacionInterface[] = [];
    loadingInfoInventario: boolean = false;

    listDesglose: BodegaInventarioDesgloseDisBobCorInterface[] = [];
    loadingDesglose: boolean = false;

    ngOnInit(): void {
        this.onGetInventario();
    }

    onGetInventario() {
        this.loadingInventario = true;
        const parametros = {
            codigo: 1067,
            parametros: {
                "CodigoInternoInventario": null,
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listInventario = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingInventario = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingInventario = false;
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onOpenInfo(info: BodegaInventarioTotalizadoInterface) {
        this.listInfoInventario = [];
        this.onGetInfoInventario(info.CodigoInternoInventario);
        this.onGetInventarioDesglose(info.CodigoInternoInventario);
    }

    onGetInfoInventario(codInterno: string) {
        this.loadingInfoInventario = true;
        const parametros = {
            codigo: 1043,
            parametros: {
                "CodigoInternoInventario": codInterno,
                "CodigoTipoInventario": null,
                "GrupoInventario": null,
                "IdProveedor": null,
            }
        }
        this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listInfoInventario = [...resp.data];
                    this.listInfoInventario.sort((a, b) => a.RazonSocialProveedor.localeCompare(b.RazonSocialProveedor));

                    this.modalInfoInventario = true;
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingInfoInventario = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingInfoInventario = false;
            }
        });
    }

    onGetInventarioDesglose(codInterno: string) {
        this.loadingDesglose = true;
        const parametros = {
            codigo: 1163,
            parametros: {
                "Anio": 2025,
                "Mes": null,
                "CodigoInterno": codInterno,
                "IdProveedor": null
            }
        };
        this.apiService.onGetApiExecuteNew(parametros, 'bodega', 'get', parametros.codigo).subscribe({
            next: (resp: any) => {
                if (resp.success) {
                    this.listDesglose = [...resp.data];
                } else {
                    this.sweetService.viewDanger(parametros.codigo, resp.message);
                }
                this.loadingDesglose = false;
            }, error: (err) => {
                this.sweetService.viewDanger(parametros.codigo, err.error);
                this.loadingDesglose = false;
            }
        });
    }

    getTotalM2() {
        return this.listInfoInventario.reduce((acc, item) => acc + item.TotalInventarioM2, 0);
    }

    getTotalM2Estado(opcion: number) {
        switch (opcion) {
            case 1:
                return this.listDesglose.reduce((acc, item) => acc + (item.BobinasM2 + item.CortesM2), 0);
            case 2:
                return this.listDesglose.reduce((acc, item) => acc + (item.BobinasEnCorteM2 + item.CortesEnCorteM2), 0);
            case 3:
                return this.listDesglose.reduce((acc, item) => acc + (item.BobinasEnProduccionM2 + item.CortesEnProduccionM2), 0);
            default:
                return 0;
        }
    }
}
