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
import { authGuard } from './core/guards/auth.guard';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout/checkout.component';
import { AddAddressComponent } from './components/add-address/add-address/add-address.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { OrderstatusComponent } from './components/orderstatus/orderstatus.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },

    {
        path: 'auth', component: AuthComponent, children: [
            { path: '', redirectTo: 'explore', pathMatch: 'full' },
            {
                path: 'login', component: LoginComponent, title: 'login',
            },
            {path:'questions',component:QuestionsComponent,title:'questions'},
           {
      path: 'questions',
      loadComponent: () =>
        import('./components/questions/questions.component').then(
          (m) => m.QuestionsComponent
        ),
      title: 'questions',
    },
            { path: 'register', component: RegisterComponent, title: 'register' },
            { path: 'explore', component: FirstpageComponent, title: 'PharmAssist' },

             // OTP Flow
      {
        path: 'code-verification',
        component: CodeVerficationComponent,
        title: 'OTP Verification',
        data: { nextRoute: '/auth/questions' }
      },

       // Questions Flow
      {
        path: 'questions',
        loadComponent: () =>
          import('./components/questions/questions.component').then(
            (m) => m.QuestionsComponent
          ),
        title: 'Health Questions',
        data: { requiresAnswers: true }
         },
            { path: 'CodeVerfication', component: CodeVerficationComponent, title: 'OTP' },
            { path: 'reset-code', component: ResetCodeComponent, title: 'reset-code' },
            { path: 'emaildone', component: EmaildoneComponent, title: 'Done' },
            { path: 'forgetPassword', component: ForgetPasswordComponent, title: 'forgetPassword' },
            { path: 'reset-password', component: ResetPasswordComponent, title: 'reset-password' },
 

        ]
    },
    {
        path: 'main', component: MainComponent,canActivate:[authGuard] ,children: [
            { path: '', redirectTo: 'AllProducts', pathMatch: 'full' },
            { path: 'home', component: HomeComponent, title: 'home' },
            {path: 'AllProducts', component:AllproductsComponent, title:'AllProducts'},
            {path: 'productdetails/:PId', component:SpecficProductComponent, title:'Details'},
            {path: 'cart', component:CartComponent, title:'Cart'},
            
            // add checkout route
            {path:'checkout',component:CheckoutComponent, title:'Checkout'},
            // add address:
            { path: 'add-address', component: AddAddressComponent, title: 'Add Address' },
            {path:'order-success', component: OrderSuccessComponent, title:'Order Success'},
{path:'orderstatus', component:OrderstatusComponent, title:'Order Status'},
             //  Profile routes
      { path: 'profile', component: ProfileComponent, title: 'Profile' },
      { path: 'edit-profile', component: EditProfileComponent, title: 'Edit Profile' },
    
   



        ]
    },
    { path: '**', component: NotFoundComponent },

];
