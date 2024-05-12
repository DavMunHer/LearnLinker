import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { E404Component } from './e404/e404.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { CreateProjectComponent } from './project/create-project/create-project.component';
import { EditProjectComponent } from './project/edit-project/edit-project.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { ProjectsManagementComponent } from './project/projects-management/projects-management.component';
import { userRoleResolver } from './resolvers/user-role.resolver';

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
    {
        path: 'project-management',
        component: ProjectsManagementComponent,
        canActivate: [authGuard],
        title: 'Manage projects'
    },
    {
        path: 'create-project',
        component: CreateProjectComponent,
        canActivate: [authGuard],
        title: 'Create a new project'
    },
    {
        path: 'edit-project/:id',
        component: EditProjectComponent,
        resolve: {
            role: userRoleResolver
        },
        canActivate: [authGuard],
        title: 'Edit an existing project'
    },
    {
        path: 'project/:id',
        component: ProjectDetailsComponent,
        canActivate: [authGuard],
        title: 'Project details'
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
