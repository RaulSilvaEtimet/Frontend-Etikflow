import { Component, inject, OnInit } from '@angular/core';
import { LayoutService } from './layout/service/app.layout.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    layoutService = inject(LayoutService);

    ngOnInit(): void {
        console.log(environment.env);

        this.layoutService.config.set({
            ripple: true,
            inputStyle: 'outlined',
            menuMode: 'slim',
            colorScheme: 'light',
            theme: 'blue',
            scale: 14,
            menuTheme: 'darkgray',
        });
    }
}
