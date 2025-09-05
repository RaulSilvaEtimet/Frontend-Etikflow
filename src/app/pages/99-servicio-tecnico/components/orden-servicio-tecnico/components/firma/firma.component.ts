import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ct } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-servicio-tecnico-orden-firma',
  templateUrl: './firma.component.html',
  styles: `
  canvas {
    border: 2px solid green;
  }
  `
})
export class ServicioTecnicoOrdenFirmaComponent {
  @ViewChild('canvasRef') canvasRef: any;
  cx!: CanvasRenderingContext2D;
  dibujando: boolean = false;
  x: number = 0;
  y: number = 0;
  stringImg: string = '';


  @HostListener('document:mousedown', ['$event'])
  onMouseDown = (e: any) => {
    if (e.target.id == 'canvasId') {
      const canvasEl = this.canvasRef.nativeElement;
      const rect = canvasEl.getBoundingClientRect();
      this.x = e.clientX - rect.left;
      this.y = e.clientY - rect.top;
      this.dibujando = true;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove = (e: any) => {
    if (this.dibujando && e.target.id == 'canvasId') {
      const canvasEl = this.canvasRef.nativeElement;
      const rect = canvasEl.getBoundingClientRect();
      this.onDibujarFirma(this.x, this.y, e.clientX - rect.left, e.clientY - rect.top);
      this.x = e.clientX - rect.left;
      this.y = e.clientY - rect.top;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp = (e: any) => {
    if (this.dibujando && e.target.id == 'canvasId') {
      const canvasEl = this.canvasRef.nativeElement;
      const rect = canvasEl.getBoundingClientRect();
      this.onDibujarFirma(this.x, this.y, e.clientX - rect.left, e.clientY - rect.top);
      this.x = 0;
      this.y = 0;
      this.dibujando = false;
    }
  }

  onDibujarFirma(x1: number, y1: number, x2: number, y2: number) {
    const canvasEl = this.canvasRef.nativeElement;
    this.cx = canvasEl.getContext('2d');
    this.cx.beginPath();
    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
    this.cx.moveTo(x1, y1);
    this.cx.lineTo(x2, y2);
    this.cx.stroke();
    this.cx.closePath();
  }

  onLimpiarFirma() {
    const canvasEl = this.canvasRef.nativeElement;
    this.cx = canvasEl.getContext('2d');
    this.cx.clearRect(0, 0, 500, 500);
    this.stringImg = '';
  }

  onCapturarFirma() {
    const canvasEl = this.canvasRef.nativeElement;
    this.stringImg = canvasEl.toDataURL("imagen/png");
  }
}
