import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { SignupComponent } from '../app/auth/signup/signup.component';
import { LoginComponent } from '../app/auth/login/login.component';
import { DashboardComponent } from '../app/dashboard/dashboard.component';
import { HomeComponent } from '../app/home/home.component';


const routes: Routes = [
    { path: '', redirectTo: 'home/dashboard', pathMatch: 'full'},
    {
        path: 'home', component: HomeComponent, children: [
            { path: 'dashboard', component: DashboardComponent, outlet: 'app' },
            { path: 'units', component: DashboardComponent, outlet: 'app' },
            { path: 'project', component: DashboardComponent, outlet: 'app' },
            { path: 'users', component: DashboardComponent, outlet: 'app' },
            { path: 'settings', component: DashboardComponent, outlet: 'app' }
        ]
    },
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent }
]

@NgModule({
    imports: [RouterModule.forRoot(routes), HttpClientModule],
    exports: [RouterModule]
})

export class AppRoutingModule { }