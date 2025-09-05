import { inject, Injectable } from '@angular/core';
import { LoginSearchInterface, LoginSearchInterfaceData } from '../interfaces/login.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private httpClient = inject(HttpClient);
  private _usuario!: LoginSearchInterfaceData;
  private apiUrl: string = environment.apiRest;

  get usuario() {
    return { ...this._usuario };
  }

  set usuario(value: LoginSearchInterfaceData) {
    this._usuario = value;
  }

  getValidarToken(): Observable<boolean> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', localStorage.getItem('token') || '');

    const parametros = {
      codigo: 2,
      parametros: {}
    }

    return this.httpClient.post<LoginSearchInterface>(`${this.apiUrl}/validarToken`, parametros, { headers })
      .pipe(
        tap(({ success, data }) => {
          this._usuario = data[0];
        }),
        map(resp => {
          return resp;
        }),
        catchError(err => of(err.error.success))
      );
  }

  checkPermisos(url: string): Observable<boolean> {
    const find = url.lastIndexOf('?id=');
    if (find !== -1) {
      url = url.substring(0, find);

    }
    const rutas = url.split('/');

    const parametros = {
      codigo: 3,
      parametros: {
        "rol": this.usuario.RoleName,
        "url": rutas[1]
      }
    }

    const headers = new HttpHeaders().set(
      'Authorization',
      localStorage.getItem('token') || ''
    );

    return this.httpClient.post<any>(`${this.apiUrl}/home/get/${parametros.codigo}`, parametros, { headers })
      .pipe(
        map(resp => {
          let check: boolean = true;
          rutas.forEach((item, key) => {
            if (key > 1) {
              if (resp.data.filter((elem: any) => elem.Url === item).length === 0)
                check = false;
            }
          })
          return check;
        }),
        catchError(err => of(err.error.success))
      );
  }
}
