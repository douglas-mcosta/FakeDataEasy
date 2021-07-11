import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CnpjOptionsComponent } from "./cnpj-options/cnpj-options.component";
import { CNPJAppComponent } from "./cnpj.app.component";


const CNPJRouterConfig: Routes = [{
    path: '',
    component: CNPJAppComponent,
    children: [{
        path:'cnpj-options', component: CnpjOptionsComponent
    }]
}]

@NgModule({
    imports:[
        RouterModule.forChild(CNPJRouterConfig)
    ],
    exports: [RouterModule]
})

export class CNPJRoutingModule{}