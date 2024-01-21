import {Injectable} from "@angular/core";
import {Observable, BehaviorSubject} from "rxjs";

import {JwtService} from "./jwt.service";
import {map, distinctUntilChanged, tap, shareReplay} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../models/user.model";
import {Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Point} from "../models/point.model";

@Injectable({providedIn: "root"})
export class PointService {
  constructor(
    private readonly http: HttpClient,
  ) {
  }

  sendPoint(xCoordinate: number,
            yCoordinate: number,
            radius: number,
  )
  {
    // : Observable<Point []>
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // Формируем объект SignUpRequest на основе переданных данных
    const sendPointRequest = {
      x: xCoordinate,
      y: yCoordinate,
      r: radius
    };
    const body = JSON.stringify(sendPointRequest);
    console.log(body)
    this.http.post<Point []>("http://localhost:8080/addpoint", body, {headers}).subscribe(data=>{console.log(data)})
  }
}
