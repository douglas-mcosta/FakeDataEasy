import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CPF } from '../models/cpf';

@Component({
  selector: 'app-cpf-options',
  templateUrl: './cpf-options.component.html',
  styleUrls: ['./cpf-options.component.css']
})
export class CpfOptionsComponent implements OnInit {

  public cpfForm: FormGroup;
  constructor(private fb: FormBuilder) {

    this.cpfForm = fb.group({
      cpf: ['', []],
      cpfType: ['1',[]],
    });
  }

  ngOnInit(): void {
  }

  GerarCPF() {
    let cpf = "";

    if (this.cpfForm.controls.cpfType.value === "1") 
      cpf = CPF.GenerateCPFWithPoints();
     else
      cpf = CPF.GenerateCPFWithoutPoints();

    this.cpfForm.controls['cpf'].setValue(cpf);
  }

  ValidateCPF(){
    let cpf = this.cpfForm.controls.cpf.value;
    let isValid =  CPF.Validate(cpf);
    //TODO: Terminar a validação do CPF
  }
}
