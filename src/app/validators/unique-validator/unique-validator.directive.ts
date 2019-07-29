import { Directive, Input } from '@angular/core';
import {
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  FormControl
} from '@angular/forms';

@Directive({
  selector: '[unique]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: UniqueValidator,
      multi: true
    }
  ]
})
export class UniqueValidator implements Validator {
  @Input() unique: any[];

  validate(control: FormControl): ValidationErrors | null {
    return control.pristine ||
      this.unique.every(value => value !== control.value)
      ? null
      : { unique: 'values must be unique' };
  }
}
