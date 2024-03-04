import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {UserService} from "../../services/user.service";
import {NgTemplateOutlet} from "@angular/common";
import {User} from "../../models/user.model";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PointService} from "../../services/point.service";
import {Point} from "../../models/point.model";
import {IfAuthenticatedDirective} from "../../../shared/directives/if-authenticated.directive";
import {Router} from "@angular/router";

interface PointForm {
  xCoordinate: FormControl;
  yCoordinate: FormControl;
  radius: FormControl;
}

@Component({
  selector: "app-home-page",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgTemplateOutlet,
    IfAuthenticatedDirective
  ]
})
export class MainComponent implements OnInit {
  coordinateForm: FormGroup<PointForm>;
  points: Array<Point>;
  rValue = 0;
  @ViewChild('coordinates', {static: true}) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('xCoordinate', {static: true}) xCoordinateElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('yCoordinate', {static: true}) yCoordinateElement!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private gradient!: CanvasGradient;
  private w!: number;
  private h!: number;
  private xCoordinate!: number;
  private yCoordinate!: number;
  isAuthenticated = false;

  constructor(private readonly userService: UserService, private readonly pointService: PointService, private readonly router: Router,) {

    this.points = []
    this.coordinateForm = new FormGroup<PointForm>({
      xCoordinate: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
      yCoordinate: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
      radius: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  };


  ngOnInit(): void {
    this.userService.isAuthenticated.pipe().subscribe((isAuthenticated: boolean) => (this.isAuthenticated = isAuthenticated),);
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.canvasRef.nativeElement.width = this.canvasRef.nativeElement.clientWidth;
    this.w = this.canvasRef.nativeElement.clientWidth;
    this.canvasRef.nativeElement.height = this.canvasRef.nativeElement.width
    this.h = this.canvasRef.nativeElement.height
    this.gradient = this.ctx.createLinearGradient(0, 0, this.w, this.h);
    this.gradient.addColorStop(0, "rgba(255,211,33,0.55)");
    this.drawCoordinatePlane("R");
    this.pointService.getAllPoints().subscribe(data => {
      this.points = data.reverse()
    })
    this.yCoordinateElement.nativeElement.innerHTML = "0.00"
    this.xCoordinateElement.nativeElement.innerHTML = "0.00"
  }


  private drawCoordinatePlane(rValueFun: string | number): void {
    if (rValueFun === undefined) return;

    this.ctx.clearRect(0, 0, this.w, this.h);
    let r = (this.w - this.w / 6.4) / 2;
    let lineLength = this.w / 30;
    this.ctx.lineWidth = this.w / 300;
    this.ctx.strokeStyle = "black";
    this.ctx.fillStyle = this.gradient;

    // заливка
    this.ctx.beginPath();
    this.ctx.moveTo(this.w / 2, this.h / 2);
    this.ctx.arc(this.w / 2, this.h / 2, r, 1 / 2 * Math.PI, Math.PI, false);

    this.ctx.lineTo(this.w / 2 - r, this.h / 2 - r);
    this.ctx.lineTo(this.w / 2, this.h / 2 - r);
    this.ctx.lineTo(this.w / 2, this.h / 2);
    this.ctx.lineTo(this.w / 2 + r / 2, this.h / 2);
    this.ctx.lineTo(this.w / 2, this.h / 2 + r / 2);
    this.ctx.lineTo(this.w / 2, this.h / 2 + r);
    // ctx.lineTo(w / 2 - r / 2, h / 2);
    // ctx.lineTo(w / 2, h / 2 - r / 2);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();
    if (typeof rValueFun === 'number') {
      this.rValue = rValueFun;
      this.drawPoint(this.points)
    }
    if (typeof rValueFun === "string") {
      rValueFun = "R"
    }

    // y axis
    this.ctx.beginPath();
    this.ctx.moveTo(this.w / 2, 0);
    this.ctx.lineTo(this.w / 2 - 10, 15);
    this.ctx.moveTo(this.w / 2, 0);
    this.ctx.lineTo(this.w / 2 + 10, 15);
    this.ctx.moveTo(this.w / 2, 0);
    this.ctx.lineTo(this.w / 2, this.h);
    this.ctx.stroke();
    this.ctx.closePath();
    // x axis
    this.ctx.beginPath();
    this.ctx.moveTo(this.w, this.h / 2);
    this.ctx.lineTo(this.w - 15, this.h / 2 - 10);
    this.ctx.moveTo(this.w, this.h / 2);
    this.ctx.lineTo(this.w - 15, this.h / 2 + 10);
    this.ctx.moveTo(this.w, this.h / 2);
    this.ctx.lineTo(0, this.h / 2);
    this.ctx.stroke();
    this.ctx.closePath();
    //
    this.ctx.beginPath();
    this.ctx.moveTo(this.w / 2 - lineLength, this.h / 2 + r);
    this.ctx.lineTo(this.w / 2 + lineLength, this.h / 2 + r);
    this.ctx.moveTo(this.w / 2 - lineLength, this.h / 2 + r / 2);
    this.ctx.lineTo(this.w / 2 + lineLength, this.h / 2 + r / 2);
    this.ctx.moveTo(this.w / 2 - lineLength, this.h / 2 - r);
    this.ctx.lineTo(this.w / 2 + lineLength, this.h / 2 - r);
    this.ctx.moveTo(this.w / 2 - lineLength, this.h / 2 - r / 2);
    this.ctx.lineTo(this.w / 2 + lineLength, this.h / 2 - r / 2);

    this.ctx.moveTo(this.w / 2 + r, this.h / 2 - lineLength);
    this.ctx.lineTo(this.w / 2 + r, this.h / 2 + lineLength);
    this.ctx.moveTo(this.w / 2 + r / 2, this.h / 2 - lineLength);
    this.ctx.lineTo(this.w / 2 + r / 2, this.h / 2 + lineLength);
    this.ctx.moveTo(this.w / 2 - r, this.h / 2 - lineLength);
    this.ctx.lineTo(this.w / 2 - r, this.h / 2 + lineLength);
    this.ctx.moveTo(this.w / 2 - r / 2, this.h / 2 - lineLength);
    this.ctx.lineTo(this.w / 2 - r / 2, this.h / 2 + lineLength);
    this.ctx.stroke();
    this.ctx.closePath();

    // заливка

    // эрка рисуется
    let label1, label2, labelMinus2, labelMinus1;

    if (typeof rValueFun === 'number') {
      label1 = rValueFun
      label2 = rValueFun / 2
      labelMinus1 = rValueFun * -1
      labelMinus2 = rValueFun / 2 * -1
    } else {
      label1 = rValueFun
      label2 = rValueFun + '/2'
      labelMinus1 = "-" + rValueFun
      labelMinus2 = "-" + rValueFun + '/2'
    }
    const fontSize = this.w / 40;
    this.ctx.fillStyle = 'black'

    this.ctx.font = `500 ${fontSize * 1.4}px sans-serif`;
    this.ctx.fillText('y', this.w / 2 + lineLength, 15)
    this.ctx.fillText('x', this.w - 20, this.h / 2 - lineLength)


    this.ctx.fillText(label1.toString(), this.w / 2 + lineLength, this.h / 2 - r);
    this.ctx.fillText(label2.toString(), this.w / 2 + lineLength, this.h / 2 - r / 2);
    this.ctx.fillText(labelMinus1.toString(), this.w / 2 + lineLength, this.h / 2 + r);
    this.ctx.fillText(labelMinus2.toString(), this.w / 2 + lineLength, this.h / 2 + r / 2);
    //
    // //x
    this.ctx.fillText(label1.toString(), this.w / 2 + r - lineLength, this.h / 2 - lineLength);
    this.ctx.fillText(label2.toString(), this.w / 2 + r / 2 - lineLength, this.h / 2 - lineLength);
    this.ctx.fillText(labelMinus1.toString(), this.w / 2 - r - lineLength, this.h / 2 - lineLength);
    this.ctx.fillText(labelMinus2.toString(), this.w / 2 - r / 2 - lineLength, this.h / 2 - lineLength);
  }


  onMouseMove(event: MouseEvent) {
    this.xCoordinate = ((event.offsetX - this.w / 2) / ((this.w - this.w / 6.4) / 2) * this.rValue)!;
    this.yCoordinate = ((this.h / 2 - event.offsetY) / ((this.w - this.w / 6.4) / 2) * this.rValue)!;
    if (this.yCoordinateElement && this.xCoordinateElement) {
      this.yCoordinateElement.nativeElement.innerHTML = this.yCoordinate.toFixed(2);
      this.xCoordinateElement.nativeElement.innerHTML = this.xCoordinate.toFixed(2);
    }
  }

  onClick() {
    if (!this.isAuthenticated) {
      void this.router.navigate(["/login"]);
      return;
    }
    if (this.xCoordinate === 0 && this.yCoordinate === 0) alert("select the radius")
    else {
      this.pointService.sendPoint(this.xCoordinate, this.yCoordinate, this.rValue).subscribe(data => {
        this.points = data.reverse()
        this.drawPoint(this.points)
      })
    }
  }

  drawPoint(points: Point[]) {
    for (const point of points) {
      const res = this.checkTriangle(point.x, point.y, this.rValue) || this.checkCircle(point.x, point.y, this.rValue) || this.checkSquare(point.x, point.y, this.rValue)
      this.ctx.fillStyle = res ? "green" : "red"
      this.ctx.beginPath();
      this.ctx.arc(point.x * ((this.w - this.w / 6.4) / 2) / this.rValue + this.w / 2, -point.y * ((this.w - this.w / 6.4) / 2) / this.rValue + this.h / 2, 5, 0, 2 * Math.PI, false);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  checkTriangle(x: number, y: number, r: number) {
    return 0 <= x && x <= r / 2 && -r / 2 <= y && y <= 0 && Math.abs(y) + x <= r / 2;
  }

  checkCircle(x: number, y: number, r: number) {

    return x * x + y * y <= r * r && -r <= x && x <= 0 && 0 >= y && y >= -r;
  }

  checkSquare(x: number, y: number, r: number) {
    return -r <= x && x <= 0 && 0 <= y && y <= r;
  }


  onChangeR() {
    let r = this.coordinateForm.get('radius')?.value;
    if (r !== undefined) {
      r = Number.parseFloat(r)
      if (-5 < r && r < 5) this.drawCoordinatePlane(r);
    }
  }

  submitForm() {
    if (!this.isAuthenticated) void this.router.navigate(["/login"]);
    else {
      let x = this.coordinateForm.get('xCoordinate')?.value;
      let y = this.coordinateForm.get('yCoordinate')?.value;
      let r = this.coordinateForm.get('radius')?.value;
      if (x !== undefined && y !== undefined && r !== undefined) {
        x = Number.parseFloat(x)
        y = Number.parseFloat(y)
        r = Number.parseFloat(r)
        if (-5 >= x || x >= 5) {
          alert("x should be in the range (-5, 5)")
          return;
        }
        if (-5 >= y || y >= 5) {
          alert("y should be in the range (-5, 5)")
          return;
        }
        if (-5 >= r || r >= 5) {
          alert("r should be in the range (-5, 5)")
          return;
        }
        this.pointService.sendPoint(x, y, r).subscribe(data => {
          this.points = data.reverse()
          this.drawPoint(this.points)
        })
      }
    }
  }
}
