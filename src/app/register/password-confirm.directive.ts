import { AbstractControl, Validator, ValidatorFn, NG_VALIDATORS } from '@angular/forms';
import { Directive, Input } from '@angular/core';

function confirmPasswordValidator(valueToMatch: String): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const result = (valueToMatch !== control.value);
        return result ? { 'appConfirmPassword': { 'value': control.value } } : null;
    };
}

@Directive({
    selector: '[appConfirmPassword]',
    providers: [{ provide: NG_VALIDATORS, useExisting: ConfirmPasswordDirective, multi: true }]
})
export class ConfirmPasswordDirective implements Validator {
    @Input() appConfirmPassword: string;

    validate(control: AbstractControl): { [key: string]: any } {
        return this.appConfirmPassword ? confirmPasswordValidator(this.appConfirmPassword)(control) : null;
    }
}
