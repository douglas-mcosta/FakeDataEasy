import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './nav/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'cpf',
    loadChildren: () => import('./cpf/cpf.module')
      .then(m => m.CpfModule),
  },
  {
    path: 'cnpj',
    loadChildren: () => import('./cnpj/cnpj.module')
      .then(m => m.CnpjModule),
  },
  {
    path: 'nome',
    loadChildren: () => import('./nome/nome.module')
      .then(m => m.NomeModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
