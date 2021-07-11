import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MASKS, NgBrazilValidators } from 'ng-brazil';
import { StringUtils } from 'src/app/utils/string-utils';
import { CPF } from '../models/cpf';

@Component({
  selector: 'app-cpf-options',
  templateUrl: './cpf-options.component.html',
  styleUrls: ['./cpf-options.component.css']
})
export class CpfOptionsComponent implements OnInit {

  public cpfForm: FormGroup;
  public MASKS = MASKS;
  public cpfMaskWithoutMask: Array<string | RegExp>
  public CpfIsValid = false;
  constructor(private fb: FormBuilder) {
    this.cpfMaskWithoutMask = CPF.CPFMaskWithoutMask;
    this.cpfForm = fb.group({
      cpf: ['', [NgBrazilValidators.cpf]],
      cpfType: ['0', []],
    });
  }

  ngOnInit(): void {
  }

  GerarCPF() {

    let cpf = CPF.GerarCPFSemPontos();

    StringUtils.CopyToClipboard(cpf);
    this.cpfForm.controls['cpf'].setValue(cpf);
  }

  ValidarCPF() {
    let cpf = this.cpfForm.controls.cpf.value;
    this.CpfIsValid = CPF.Validar(cpf);
  }

  cpfTypeForm() {
    return this.cpfForm.controls.cpfType.value;
  }
}
