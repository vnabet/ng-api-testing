import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/**
 * Validation d'un champs dont la valeur doit être supérieure à celle passée en paramètre
 * @param test valeur à tester
 * @returns
 */
export function greaterThan(test:number):ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value:number = parseInt(control.value);

    return (value <= test)?{greaterThan: test}:null
  }
}
