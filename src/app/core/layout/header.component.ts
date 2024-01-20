import { Component, inject } from "@angular/core";
// import { UserService } from "../services/user.service";
import { RouterLink, RouterLinkActive } from "@angular/router";
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";
// import { IfAuthenticatedDirective } from "../../shared/directives/if-authenticated.directive";

@Component({
  selector: "app-layout-header",
  templateUrl: "./header.component.html",
  imports: [
    RouterLinkActive,
    RouterLink,
    AsyncPipe,
    NgIf,
    NgOptimizedImage,
    // IfAuthenticatedDirective,
  ],
  standalone: true,
})
export class HeaderComponent {
  // currentUser$ = inject(UserService).currentUser;
}
