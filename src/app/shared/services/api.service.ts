import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginSearchInterface } from 'src/app/pages/00-login/interfaces/login.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  httpClient = inject(HttpClient);
  private apiRest: string = environment.apiRest;

  onGetApiUser(parametros: Object, tipo: string) {
    return this.httpClient.post<LoginSearchInterface>(`${this.apiRest}/login/${tipo}`, parametros);
  }

  onGetApiExecuteNew(parametros: Object, modulo: string, tipoSp: string, numSP: number) {
    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token') || '');

    return this.httpClient.post(`${this.apiRest}/${modulo}/${tipoSp}/${numSP}`, parametros, { headers });
  }

  onGetApiFile(path: string) {
    const params = new HttpParams().set('ruta', path);
    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token') || '');

    return this.httpClient.get(`${this.apiRest}/getFile`, {
      params: params,
      responseType: 'blob',
      headers,
    });
  }

  onSendEmail(parametros: Object, opcion: number) {
    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token') || '');

    return this.httpClient.post(`${this.apiRest}/sendEmail/${opcion}`, parametros, { headers });
  }

  //TODO: ELIMINAR
  onGetInfoTaurus() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiRGFubnkiLCJyb2xlIjoiYWRtaW4iLCJuYmYiOjE3NDUzNzQzODAsImV4cCI6MTc0Nzk2NjM4MCwiaWF0IjoxNzQ1Mzc0MzgwLCJpc3MiOiJUdVByb3llY3RvQVBJIiwiYXVkIjoiVHVQcm95ZWN0b0FQSSJ9.RuXJRZM-Ooyhw3W6wA7AKDNe2B2IzjtOqFhwAWISit4');

    return this.httpClient.post('http://68.168.213.182:8083/api/StockInventario', { "fechaCorte": new Date() }, { headers });
  }
}
