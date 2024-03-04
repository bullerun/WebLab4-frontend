import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";

import { JwtService } from "./jwt.service";
import { map, distinctUntilChanged, tap, shareReplay } from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { User } from "../models/user.model";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  public isAuthenticated = this.currentUser.pipe(map((user) => !!user));

  constructor(
    private readonly http: HttpClient,
    private readonly jwtService: JwtService,
    private readonly router: Router
  ) {}

  login(credentials: {
    username: string;
    password: string;
  }): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Формируем объект SignUpRequest на основе переданных данных
    const signInRequest = {
      username: credentials.username,
      password: credentials.password
    };
    const body = JSON.stringify(signInRequest);
    return this.http
      .post<User>("http://localhost:8080/login", body, { headers })
      .pipe(tap(user => this.setAuth(user)));
  }

  register(credentials: {
    username: string;
    email: string;
    password: string;
  }): Observable<User> {

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const signUpRequest = {
      username: credentials.username,
      email: credentials.email,
      password: credentials.password
    };
    const body = JSON.stringify(signUpRequest);
    return this.http
      .post<User>("http://localhost:8080/register", body, { headers })
      .pipe(tap( user  => this.setAuth(user)));
  }

  logout(): void {
    this.purgeAuth();
    void this.router.navigate(["/"]);
  }

  getCurrentUser(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>("/user").pipe(
      tap({
        next: ({ user }) => this.setAuth(user),
        error: () => this.purgeAuth(),
      }),
      shareReplay(1)
    );
  }


  setAuth(user: User): void {
    this.jwtService.saveToken(user.token);
    this.currentUserSubject.next(user);
  }

  purgeAuth(): void {
    this.jwtService.destroyToken();
    this.currentUserSubject.next(null);
  }
}
