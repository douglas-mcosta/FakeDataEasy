import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnpjOptionsComponent } from './cnpj-options/cnpj-options.component';
import { CNPJAppComponent } from './cnpj.app.component';
import { CNPJRoutingModule } from './cnpj.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { NgBrazil } from 'ng-brazil';
import { TextMaskModule } from 'angular2-text-mask';



@NgModule({
  declarations: [
    CnpjOptionsComponent,
    CNPJAppComponent
  ],
  imports: [
    CommonModule,
    CNPJRoutingModule,
    ReactiveFormsModule,
    NgBrazil,
    TextMaskModule,
  ]
})
export class CnpjModule { }
