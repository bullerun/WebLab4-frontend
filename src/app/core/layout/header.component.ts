import {Component, inject, OnInit} from "@angular/core";
import {UserService} from "../services/user.service";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AsyncPipe, NgIf} from "@angular/common";
import {IfAuthenticatedDirective} from "../../shared/directives/if-authenticated.directive";
import {User} from "../models/user.model";

@Component({
  selector: "app-layout-header",
  templateUrl: "./header.component.html",
  imports: [
    RouterLinkActive,
    RouterLink,
    AsyncPipe,
    NgIf,
    IfAuthenticatedDirective,
  ],
  standalone: true,
})
export class HeaderComponent implements OnInit {
  constructor(
    private readonly userService: UserService,
  ) {
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.userService.logout();
  }
}
