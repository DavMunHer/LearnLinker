import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersHttpService } from '../../services/users-http.service';
import { AuthService } from '../../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const managerLeaderGuard: CanActivateFn = (route, state) => {
    const usersHttpService = inject(UsersHttpService);
    const authService = inject(AuthService);
    const userEmail = authService.getSessionUser().email;
    const router = inject(Router);
    return usersHttpService.checkExistingUserWithRole(userEmail, route.params['id']).pipe(
        map((response) => {
            if (response.role && response.role === 'manager' || response.role && response.role === 'leader') {
                return true;
            } else {
                // Cuando el usuario no tiene permisos para editar el proyecto, se le redirige al home
                router.navigate(['/home']);
                return false;
            }

        }),
        catchError(() => {
            router.navigate(['/home'])
            return of(false);
            // Cuando no se pueda manejar la petición, se navega al home, sin dejar entrar al usuario al componente
        })
    );
};
