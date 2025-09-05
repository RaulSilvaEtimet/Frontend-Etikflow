import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FieldsetModule } from 'primeng/fieldset';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { NgModule } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';
import { WebcamModule } from 'ngx-webcam';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PanelModule } from 'primeng/panel';
import { TreeTableModule } from 'primeng/treetable';
import { TreeModule } from 'primeng/tree'
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { BlockUIModule } from 'primeng/blockui';
import { FileUploadModule } from 'primeng/fileupload';
import { PickListModule } from 'primeng/picklist';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ListboxModule } from 'primeng/listbox';
import { SidebarModule } from 'primeng/sidebar';

@NgModule({
  exports: [
    ButtonModule,
    CalendarModule,
    FieldsetModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    TableModule,
    TabViewModule,
    ReactiveFormsModule,
    InputTextareaModule,
    CheckboxModule,
    DropdownModule,
    AccordionModule,
    WebcamModule,
    ImageModule,
    CardModule,
    TagModule,
    RatingModule,
    TooltipModule,
    DialogModule,
    ToastModule,
    RadioButtonModule,
    PanelModule,
    TreeTableModule,
    TreeModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputNumberModule,
    BlockUIModule,
    FileUploadModule,
    PickListModule,
    TriStateCheckboxModule,
    InputSwitchModule,
    MultiSelectModule,
    ProgressSpinnerModule,
    ListboxModule,
    SidebarModule,
  ],
  providers: [
    MessageService,
  ]
})
export class PrimeNgModule { }
