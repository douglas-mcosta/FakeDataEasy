import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MASKS, NgBrazilValidators } from 'ng-brazil';
import { StringUtils } from 'src/app/utils/string-utils';
import { CNPJ } from '../models/cnpj';

@Component({
  selector: 'app-cnpj-options',
  templateUrl: './cnpj-options.component.html',
  styleUrls: ['./cnpj-options.component.css']
})
export class CnpjOptionsComponent implements OnInit {

  public cnpjForm: FormGroup;
  public MASKS = MASKS;
  public cnpjMaskWithoutMask: Array<string | RegExp>
  public CpfIsValid = false;
  constructor(private fb: FormBuilder) {
    this.cnpjMaskWithoutMask = CNPJ.CNPJMaskWithoutMask;
    this.cnpjForm = fb.group({
      cnpj: ['', [NgBrazilValidators.cnpj]],
      cnpjType: ['0', []],
    });
  }

  ngOnInit(): void {
  }

  GerarCNPJ() {

    let cnpj = CNPJ.GerarCNPJ();

    StringUtils.CopyToClipboard(cnpj);
    this.cnpjForm.controls['cnpj'].setValue(cnpj);
  }

  cnpjTypeForm() {
    return this.cnpjForm.controls.cnpjType.value;
  }
}
