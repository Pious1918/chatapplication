import { Routes } from '@angular/router';
import { LandingComponent } from './component/landing/landing.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { AuthService } from './services/auth.service';
import { ChatttyComponent } from './component/chattty/chattty.component';
import { HeaderComponent } from './component/common/header/header.component';
import { PollLandingComponent } from './component/poll-landing/poll-landing.component';
import { ProfileComponent } from './component/profile/profile.component';
import { PollresultComponent } from './component/pollresult/pollresult.component';

export const routes: Routes = [

   
    { path:'login' , component:LoginComponent},
    { path:'register' , component:RegisterComponent},
    {path:'',component:ChatttyComponent , canActivate:[AuthService]},
    {path:'poll',component:PollLandingComponent , canActivate:[AuthService]},
    {path:'profile',component:ProfileComponent , canActivate:[AuthService]},
    {path:'yourpolls',component:PollresultComponent , canActivate:[AuthService]},
 

];
