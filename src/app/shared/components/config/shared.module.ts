import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockedSendInfoDatabaseComponent } from '../blocked-send-info-database/blocked-send-info-database.component';
import { BlockedGetInfoDatabaseComponent } from '../blocked-get-info-database/blocked-get-info-database.component';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { BlockedProcessInfoDatabaseComponent } from '../blocked-process-info-database/blocked-process-info-database.component';

@NgModule({
    imports: [
        CommonModule,
        PrimeNgModule,
    ],
    declarations: [
        BlockedSendInfoDatabaseComponent,
        BlockedGetInfoDatabaseComponent,
        BlockedProcessInfoDatabaseComponent,
    ],
    exports: [
        BlockedSendInfoDatabaseComponent,
        BlockedGetInfoDatabaseComponent,
        BlockedProcessInfoDatabaseComponent,
    ],

})
export class SharedComponentModule { }
