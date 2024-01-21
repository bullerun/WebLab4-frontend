import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user.model";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PointService} from "../../services/point.service";

interface PointForm {
  xCoordinate: FormControl;
  yCoordinate: FormControl;
  radius: FormControl;
}

@Component({
  selector: "app-home-page",
  templateUrl: "./main.component.html",
  standalone: true,
  imports: [
    ReactiveFormsModule
  ]
})
export class MainComponent implements OnInit {
  coordinateForm: FormGroup<PointForm>;

  constructor(private readonly userService: UserService, private readonly pointService: PointService,) {

    this.coordinateForm = new FormGroup<PointForm>({
      xCoordinate: new FormControl("", {
        validators: [Validators.required, Validators.min(-5), Validators.max(5)],
        nonNullable: true,
      }),
      yCoordinate: new FormControl("", {
        validators: [Validators.required, Validators.min(-5), Validators.max(5)],
        nonNullable: true,
      }),
      radius: new FormControl("", {
        validators: [Validators.required, Validators.min(-5), Validators.max(5)],
        nonNullable: true,
      }),
    });
  };

  rValue = 0;
  @ViewChild('coordinates', {static: true}) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private gradient!: CanvasGradient;
  private w!: number;
  private h!: number;
  private xCoordinate!: number;
  private yCoordinate!: number;
  private yCoordinateElement!: Element;
  private xCoordinateElement!: Element;


  ngOnInit(): void {
    this.userService.getCurrentUser() as Partial<User>
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.canvasRef.nativeElement.width = this.canvasRef.nativeElement.clientWidth;
    this.w = this.canvasRef.nativeElement.clientWidth;
    this.canvasRef.nativeElement.height = this.canvasRef.nativeElement.width
    this.h = this.canvasRef.nativeElement.height
    this.gradient = this.ctx.createLinearGradient(0, 0, this.w, this.h);
    this.gradient.addColorStop(0, "rgba(255,211,33,0.55)");
    this.drawCoordinatePlane("R");
    // this.yCoordinateElement = document.querySelector('#yCoordinate');
    // this.xCoordinateElement = document.querySelector('#xCoordinate');
  }


  private drawCoordinatePlane(rValueFun: string | number): void {
    if (rValueFun === undefined) return;
    if (typeof rValueFun === 'number') {
      this.rValue = rValueFun;
    }
    if (typeof rValueFun === "string") {
      rValueFun = "R"
    }
    this.ctx.clearRect(0, 0, this.w, this.h);
    let r = (this.w - this.w / 6.4) / 2;
    let lineLength = this.w / 30;
    this.ctx.lineWidth = this.w / 300;
    this.ctx.strokeStyle = "black";
    console.log(this.w)
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
    console.log(this.w)
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
    this.ctx.fillStyle = this.gradient;
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
      this.yCoordinateElement.innerHTML = this.yCoordinate.toString();
      this.xCoordinateElement.innerHTML = this.xCoordinate.toString();
    }
  }

  onClick() {
    if (this.xCoordinate === 0 && this.yCoordinate === 0) alert("select the radius")
    else {
      this.pointService.sendPoint(this.xCoordinate, this.yCoordinate, this.rValue)
    }
  }


  /**
   * Если хотите плакать то попробуйте понять почему этот код не сработает:
   * if (r === undefined) r = Number.parseInt(r);
   * if (-5 < r && r < 5) this.drawCoordinatePlane(r);
   * В отличии от финального
   */
  onChangeR() {
    let r = this.coordinateForm.get('radius')?.value;
    if (r !== undefined) {
      r = Number.parseInt(r)
      if (-5 < r && r < 5) this.drawCoordinatePlane(r);
    }
  }
}
