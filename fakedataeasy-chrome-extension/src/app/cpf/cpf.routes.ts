import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CpfOptionsComponent } from "./cpf-options/cpf-options.component";
import { CPFAppComponent } from "./cpf.app.component";

const CPFRouterConfig: Routes = [
    {
        path: '', component: CPFAppComponent,
        children: [{
            path: 'cpf-options', component: CpfOptionsComponent
        }]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(CPFRouterConfig)
    ],
    exports: [RouterModule]
})
export class CPFRoutingModule { }