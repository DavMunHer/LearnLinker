import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { E404Component } from './e404/e404.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { CreateProjectComponent } from './projects/create-project/create-project.component';
import { EditProjectComponent } from './projects/edit-project/edit-project.component';
import { ProjectDetailsComponent } from './projects/project-details/project-details.component';
import { ProjectsManagementComponent } from './projects/projects-management/projects-management.component';
import { userRoleResolver } from './resolvers/user-role.resolver';
import { EditPhaseComponent } from './phases/edit-phase/edit-phase.component';
import { CreatePhaseComponent } from './phases/create-phase/create-phase.component';
import { userProjectsResolver } from './resolvers/user-projects.resolver';
import { taskGuard } from './guards/task.guard';
import { TaskDetailsComponent } from './tasks/task-details/task-details.component';

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
        resolve: {
            projects: userProjectsResolver
        },
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
    {
        path: 'project/:id/create-phase',
        component: CreatePhaseComponent,
        canActivate: [authGuard],
        title: 'Create a new Phase'
    },
    {
        path: 'edit-phase/:id',
        component: EditPhaseComponent,
        canActivate: [authGuard],
        title: 'Edit an existing phase'
    },
    {
        path: 'task/:id/details',
        component: TaskDetailsComponent,
        canActivate: [authGuard, taskGuard],
        title: 'Task details'
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
