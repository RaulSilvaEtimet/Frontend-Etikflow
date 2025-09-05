import { Component, inject } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { OrdenServicioTecnicoService } from '../../services/orden-servicio-tecnico.service';

@Component({
  selector: 'app-servicio-tecnico-orden-evidencias',
  templateUrl: './evidencias.component.html',
  styles: ``
})
export class ServicioTecnicoOrdenEvidenciasComponent {
  showWebcam = false;
  deviceId: string = '';
  getImage: Subject<void> = new Subject<void>();
  webCamImage: WebcamImage | null = null;
  allowCameraSwitch = true;
  multipleWebcamsAvailable = false;
  videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  arrayWebCamImage: WebcamImage[] = [];
  serviceOrden = inject(OrdenServicioTecnicoService);

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  onActivarWebCam() {
    this.showWebcam = !this.showWebcam;
  }

  onCapturarFoto(): void {
    this.getImage.next();
  }

  onControlarImagen(webCamImage: WebcamImage): void {
    this.webCamImage = webCamImage;
    this.arrayWebCamImage.push(webCamImage);
    this.serviceOrden.dataEvidencias.set([...this.arrayWebCamImage]);
  }

  get getImageObservable(): Observable<void> {
    return this.getImage.asObservable();
  }

  onDeleteImage(key: number) {
    this.arrayWebCamImage.splice(key, 1);
    this.serviceOrden.dataEvidencias.set([...this.arrayWebCamImage]);
  }



  public errors: WebcamInitError[] = [];
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }
  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }
  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }
  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
