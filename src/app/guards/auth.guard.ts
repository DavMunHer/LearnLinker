import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import * as jwtDecode from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    if (localStorage.getItem('Token') && jwtDecode.jwtDecode(localStorage.getItem('Token')!).iat)
        return true;
    else {
        router.navigate(['/welcome']);
        return false;
    }
};
