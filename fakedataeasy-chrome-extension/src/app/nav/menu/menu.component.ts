import {  Component, OnInit } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { CPF } from 'src/app/cpf/models/cpf';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  cpf:string = "";

  constructor(private hotkeysService: HotkeysService) { 
    this.hotkeysService.add(
      new Hotkey(
        's', // key combination
        (): boolean => { // callback function to execute after key combination
          this.GenerateCPF(); 
          return false; // prevent bubbling
        },
        ['INPUT', 'TEXTAREA', 'SELECT','HTML'], // allow shortcut execution in these html elements
        'atalho' // shortcut name
      )
    );
  }


  ngOnInit(): void {
  }

  GenerateCPF() {
    let cpf = new CPF().GenerateCPF();
    this.cpf = cpf;
  }
}
