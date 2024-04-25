import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login'
    },
    {
        path: 'welcome',
        component: WelcomeComponent,
        title: 'Welcome'
    },
    // {
    //     path: 'menu',
    //     component: MenuComponent,
    //     resolve: {
    //         user: userResolver
    //     },
    //     title: 'Carta'
    // },
];
