import {  Component, OnInit } from '@angular/core';
import { CPF } from 'src/app/cpf/models/cpf';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  cpf:string = "";

  constructor() {}

  ngOnInit(): void {
  }

  GenerateCPF() {
    let cpf = CPF.GenerateCPFWithPoints();
    CPF.CopyToClipboard(cpf);

    this.cpf = cpf;

    setTimeout(() => {
      this.cpf = ""
    }, 2000);

  }
}
