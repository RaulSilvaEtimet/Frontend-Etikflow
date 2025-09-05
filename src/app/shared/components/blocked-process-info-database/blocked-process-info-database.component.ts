import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-blocked-process-info-database',
    templateUrl: './blocked-process-info-database.component.html',
})
export class BlockedProcessInfoDatabaseComponent {
    @Input() blockedPanel: boolean = false;
}
