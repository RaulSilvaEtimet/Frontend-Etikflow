import { Component, inject } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { environment } from 'src/environments/environment';
import { LoginService } from '../pages/00-login/services/login.service';

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html',
})
export class AppFooterComponent {
    version: string = environment.version;
    apiService = inject(LoginService)
    ambiente: string = '';

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.ambiente = this.apiService.usuario.Ambiente;
    }

    get logo() {
        return this.layoutService.config().colorScheme === 'light'
            ? 'dark'
            : 'white';
    }
}
