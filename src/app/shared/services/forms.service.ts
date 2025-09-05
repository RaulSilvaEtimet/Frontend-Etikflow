import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ReactiveFormsService {

  constructor() { }

  validForm(formulario: FormGroup) {
    if (formulario.invalid) {
      Object.values(formulario.controls).forEach(control => {
        control.markAsDirty();
      });
      return false;
    }
    return true;
  }
}
