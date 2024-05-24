import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UsersHttpService } from '../services/users-http.service';
import { EMPTY, catchError } from 'rxjs';
import { Project } from '../../interfaces/project';

export const userProjectsResolver: ResolveFn<Project[]> = (route, state) => {
    const authService = inject(AuthService);
    const usersHttpService = inject(UsersHttpService);
    return usersHttpService.getUserProjects(authService.getSessionUser().email).pipe(
        catchError(() => {
            return EMPTY;
        })
    );
};
