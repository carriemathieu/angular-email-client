import { Injectable } from '@angular/core';
import { Validator, AbstractControl } from '@angular/forms'

// allows us to use dependency injection
@Injectable({ providedIn: 'root' })
export class MatchPassword implements Validator {
    validate(formGroup: AbstractControl) {
        const { password, passwordConfirmation } = formGroup.value;

        // if passwords match, don't return anything. otherwise, return passwordsDontMatch
        if (password === passwordConfirmation) {
            return null;
        } else {
            return { passwordsDontMatch: true };
        }
    }
}