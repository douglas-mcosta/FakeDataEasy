import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NomeOptionsComponent } from "./nome-options/nome-options.component";
import { NOMEAppComponent } from "./nome.app.component";

const NomeRouterConfig: Routes = [{
    path: '',
    component: NOMEAppComponent,
    children: [{
        path:'nome-options',
        component: NomeOptionsComponent
    }]
}]

@NgModule({
    imports:[
        RouterModule.forChild(NomeRouterConfig)
    ],
    exports: [RouterModule]
})

export class NOMERoutingModule{}