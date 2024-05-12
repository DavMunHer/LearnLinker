import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProjectUserHttpService } from '../services/project-user-http.service';
import { AuthService } from '../services/auth.service';
import { EMPTY, catchError } from 'rxjs';

export const userRoleResolver: ResolveFn<string> = (route, state) => {
    const authService = inject(AuthService);
    const projectUserHttpService = inject(ProjectUserHttpService);
    return projectUserHttpService.getRole(authService.getSessionUser().email, route.params['id']).pipe(
        catchError(() => {
            return EMPTY;
        })
    );
};
