import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { AutoCompleteModule} from 'primeng/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { StepperModule } from 'primeng/stepper';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
 

@NgModule({
  imports: [
    CommonModule,
    ToastModule,
    InputTextModule,
    FloatLabel,
    TextareaModule,
    InputNumberModule,
    ButtonModule,
    ChipModule,
    AutoCompleteModule,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    MessageModule,
    ConfirmDialogModule,
    BlockUIModule,
    ProgressSpinnerModule,
    StepperModule,
    CardModule,
    SelectModule,
    DatePickerModule
  ],
  exports: [
    ToastModule,
    InputTextModule,
    FloatLabel,
    TextareaModule,
    InputNumberModule,
    ButtonModule,
    ChipModule,
    AutoCompleteModule,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    MessageModule,
    ConfirmDialogModule,
    BlockUIModule,
    ProgressSpinnerModule,
    StepperModule,
    CardModule,
    SelectModule,
    DatePickerModule
  ]
})
export class SharedModule { }
