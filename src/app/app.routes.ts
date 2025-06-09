import { AuthComponent } from './layouts/auth/auth.component';
import { Routes } from '@angular/router';
import { MainComponent } from './layouts/main/main.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { FirstpageComponent } from './components/firstpage/firstpage.component';
import { CodeVerficationComponent } from './components/code-verfication/code-verfication.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { EmailforgetPassComponent } from './components/emailforget-pass/emailforget-pass.component';
import { EmaildoneComponent } from './components/emaildone/emaildone.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ResetCodeComponent } from './components/reset-code/reset-code.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AllproductsComponent } from './components/allproducts/allproducts.component';
import { SpecficProductComponent } from './components/specfic-product/specfic-product.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },

  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: '', redirectTo: 'explore', pathMatch: 'full' },
      {
        path: 'login',
        component: LoginComponent,
        title: 'login',
      },
      { path: 'Questions', component: QuestionsComponent, title: 'Questions' },
      { path: 'register', component: RegisterComponent, title: 'register' },
      { path: 'explore', component: FirstpageComponent, title: 'PharmAssist' },
      {
        path: 'CodeVerfication',
        component: CodeVerficationComponent,
        title: 'OTP',
      },
      {
        path: 'reset-code',
        component: ResetCodeComponent,
        title: 'reset-code',
      },
      { path: 'emaildone', component: EmaildoneComponent, title: 'Done' },
      {
        path: 'forgetPassword',
        component: ForgetPasswordComponent,
        title: 'forgetPassword',
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        title: 'reset-password',
      },
    ],
  },
  {
    path: 'main',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'AllProducts', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, title: 'home' },
      {
        path: 'AllProducts',
        component: AllproductsComponent,
        title: 'AllProducts',
      },
      {
        path: 'productdetails/:PId',
        component: SpecficProductComponent,
        title: 'Details',
      },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
