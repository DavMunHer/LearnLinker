import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SignupComponent } from './signup/signup.component';

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
    {
        path: 'signup',
        component: SignupComponent,
        title: 'Sign up for free!'
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
