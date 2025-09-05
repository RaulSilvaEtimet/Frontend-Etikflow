import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-blocked-get-info-database',
    templateUrl: './blocked-get-info-database.component.html',
})
export class BlockedGetInfoDatabaseComponent {
    @Input() blockedPanel: boolean = false;
}
