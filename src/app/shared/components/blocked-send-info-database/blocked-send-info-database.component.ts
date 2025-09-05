import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-blocked-send-info-database',
    templateUrl: './blocked-send-info-database.component.html',
})
export class BlockedSendInfoDatabaseComponent {
    @Input() blockedPanel: boolean = false;
}
