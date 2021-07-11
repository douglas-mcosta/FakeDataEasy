import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpfOptionsComponent } from './cpf-options/cpf-options.component';
import { CPFRoutingModule } from './cpf.routes';
import { CPFAppComponent } from './cpf.app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBrazil } from 'ng-brazil';
import { TextMaskModule } from 'angular2-text-mask';



@NgModule({
  declarations: [
    CpfOptionsComponent,
    CPFAppComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CPFRoutingModule,
    ReactiveFormsModule,
    TextMaskModule,
    NgBrazil
  ]
})
export class CpfModule { }
