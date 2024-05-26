import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from 'express';

export const taskGuard: CanActivateFn = (route, state) => {
    // const router = inject(Router);
    // if ()
        return true;
    // else {
    //     router.navigate(['/home']);
    //     return false;
    // }
};
