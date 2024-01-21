import {inject, NgModule} from "@angular/core";
import {Routes, RouterModule, PreloadAllModules} from "@angular/router";
import {UserService} from "./core/services/user.service";
import {map} from "rxjs/operators";
import {MainComponent} from "./core/pages/main/main.component";
import AuthComponent from "./core/auth/auth.component";


export const routes: Routes = [
  {path: '', component: MainComponent, pathMatch: "full"},
  {
    path: 'login',
    component: AuthComponent,
    canActivate: [
      () => inject(UserService).isAuthenticated.pipe(map((isAuth) => !isAuth)),
    ],
  },
  {
    path: "register",
    component: AuthComponent,
    canActivate: [
      () => inject(UserService).isAuthenticated.pipe(map((isAuth) => !isAuth)),
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
