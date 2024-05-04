import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { E404Component } from './e404/e404.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
    {
        path: 'welcome',
        component: WelcomeComponent,
        canActivate: [guestGuard],
        title: 'Welcome'
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [authGuard],
        title: 'Home'
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [guestGuard],
        title: 'Login'
    },
    {
        path: 'signup',
        component: SignupComponent,
        canActivate: [guestGuard],
        title: 'Sign up for free!'
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard],
        title: 'User profile!'
    },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: E404Component, pathMatch: 'full' }
    // {
    //     path: 'menu',
    //     component: MenuComponent,
    //     resolve: {
    //         user: userResolver
    //     },
    //     title: 'Carta'
    // },
];
