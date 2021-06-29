import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpfOptionsComponent } from './cpf-options/cpf-options.component';
import { CPFRoutingModule } from './cpf.routes';
import { CPFAppComponent } from './cpf.app.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CpfOptionsComponent,
    CPFAppComponent
  ],
  imports: [
    CommonModule,
    CPFRoutingModule,
    ReactiveFormsModule
  ]
})
export class CpfModule { }
