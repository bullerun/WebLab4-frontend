import {AfterViewInit, Component, ElementRef, ViewChild} from "@angular/core";
// import { UserService } from "../../services/user.service";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";

// import { IfAuthenticatedDirective } from "../../../shared/directives/if-authenticated.directive";

@Component({
  selector: "app-main-page",
  templateUrl: "./main.component.html",
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
export class MainComponent implements AfterViewInit {
  // currentUser$ = inject(UserService).currentUser;
  private rValue = 0;
  @ViewChild('coordinates', {static: true}) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private gradient!: CanvasGradient;
  private w!: number;
  private h!: number;

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.canvasRef.nativeElement.width= this.canvasRef.nativeElement.clientWidth;
    this.w =this.canvasRef.nativeElement.clientWidth;
    this.canvasRef.nativeElement.height = this.canvasRef.nativeElement.width
    this.h = this.canvasRef.nativeElement.height
    this.gradient = this.ctx.createLinearGradient(0, 0, this.w, this.h);
    this.gradient.addColorStop(0, "rgba(255,211,33,0.55)");
    this.drawCoordinatePlane("R");
  }

  private drawCoordinatePlane(rValueFun: string | number): void {
    if (typeof rValueFun === 'number') {
      this.rValue = rValueFun;
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
    let label1, label2;

    if (typeof rValueFun === 'number') {
      label1 = rValueFun
      label2 = rValueFun / 2
    } else {
      label1 = rValueFun
      label2 = rValueFun + '/2'
    }
    const fontSize = this.w / 40;
    this.ctx.fillStyle = 'black'

    this.ctx.font = `500 ${fontSize * 1.4}px sans-serif`;
    this.ctx.fillText('y', this.w / 2 + lineLength, 15)
    this.ctx.fillText('x', this.w - 20, this.h / 2 - lineLength)


    this.ctx.fillText('-' + label2, this.w / 2 + lineLength, this.h / 2 + r / 2);
    this.ctx.fillText('-' + label1, this.w / 2 + lineLength, this.h / 2 + r);
    this.ctx.fillText(label2.toString(), this.w / 2 + lineLength, this.h / 2 - r / 2);
    this.ctx.fillText(label1.toString(), this.w / 2 + lineLength, this.h / 2 - r);
    //
    // //x
    this.ctx.fillText(label1.toString(), this.w / 2 + r - lineLength, this.h / 2 - lineLength);
    this.ctx.fillText(label2.toString(), this.w / 2 + r / 2 - lineLength, this.h / 2 - lineLength);
    this.ctx.fillText('-' + label1, this.w / 2 - r - lineLength, this.h / 2 - lineLength);
    this.ctx.fillText('-' + label2, this.w / 2 - r / 2 - lineLength, this.h / 2 - lineLength);
    console.log(this.canvasRef.nativeElement.getContext("2d"))
  }
}
