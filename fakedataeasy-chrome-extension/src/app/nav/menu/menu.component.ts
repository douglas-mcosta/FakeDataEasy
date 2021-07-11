import { Component, OnInit } from '@angular/core';
import { Guid } from 'guid-typescript';
import { CNPJ } from 'src/app/cnpj/models/cnpj';
import { CPF } from 'src/app/cpf/models/cpf';
import { GUID } from 'src/app/guid/models/guid';
import { NOME } from 'src/app/nome/models/nome';
import { StringUtils } from 'src/app/utils/string-utils';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  cpf: string;
  cnpj: string;
  guid: string;
  nome: string;

  constructor() {
    this.cpf = "";
    this.cnpj = "";
    this.guid = "";
    this.nome = "";
  }

  ngOnInit(): void {
  }

  GenerateCPF() {
    let cpf = CPF.GerarCPFSemPontos();
    StringUtils.CopyToClipboard(cpf);

    this.cpf = cpf;

    setTimeout(() => {
      this.cpf = ""
    }, 2000);

  }

  GenerateCNPJ() {

    let cnpj = CNPJ.GerarCNPJ();
    StringUtils.CopyToClipboard(cnpj);

    this.cnpj = cnpj;

    setTimeout(() => {
      this.cnpj = ""
    }, 2000);

  }

  GerarGuid() {

    let guid = GUID.gerarGuid();
    StringUtils.CopyToClipboard(guid);

    this.guid = guid;

    setTimeout(() => {
      this.guid = ""
    }, 2000);

  }

  GerarNome() {

    let nome = NOME.GerarNome();
    StringUtils.CopyToClipboard(nome);

    this.nome = nome;

    setTimeout(() => {
      this.nome = ""
    }, 2000);

  }
}
