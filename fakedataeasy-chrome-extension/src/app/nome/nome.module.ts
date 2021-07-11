import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NomeOptionsComponent } from './nome-options/nome-options.component';
import { NOMERoutingModule } from './nome.routes';
import { NOMEAppComponent } from './nome.app.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    NomeOptionsComponent,
    NOMEAppComponent
  ],
  imports: [
    CommonModule,
    NOMERoutingModule,
    ReactiveFormsModule
  ]
})
export class NomeModule { }
