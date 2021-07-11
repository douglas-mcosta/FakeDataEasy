import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StringUtils } from 'src/app/utils/string-utils';
import { NOME } from '../models/nome';

@Component({
  selector: 'app-nome-options',
  templateUrl: './nome-options.component.html',
  styleUrls: ['./nome-options.component.css']
})
export class NomeOptionsComponent implements OnInit {

  public nomeForm: FormGroup;
  constructor(private fb: FormBuilder) {

    this.nomeForm = fb.group({
      nome: ['', []],
      nomeType: ['0', []],
    });
  }



  ngOnInit(): void {
  }

  GerarNome() {
    let nome = "";
    if (this.nomeTypeForm() == 1)
      nome = NOME.GerarNomeMasculino();
    else
      nome = NOME.GerarNomeFeminimo();

    this.nomeForm.controls.nome.setValue(nome);
    StringUtils.CopyToClipboard(nome);

  }

  nomeTypeForm() {
    return this.nomeForm.controls.nomeType.value;
  }
}
