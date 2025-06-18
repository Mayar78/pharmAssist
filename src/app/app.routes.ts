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

import { GetMyRecommendationsComponent } from './components/get-my-recommendations/get-my-recommendations.component';

import { CheckoutComponent } from './components/checkout/checkout/checkout.component';
import { AddAddressComponent } from './components/add-address/add-address/add-address.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { OrderstatusComponent } from './components/orderstatus/orderstatus.component';
import { FeatureCardComponent } from './components/feature-card/feature-card.component';
import { SafetyRecComponent } from './components/safety-rec/safety-rec.component';
import { CheckSafetyComponent } from './components/check-safety/check-safety.component';
import { ConflictComponent } from './components/conflict/conflict.component';


export const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' },

    {
        path: 'auth', component: AuthComponent, children: [
            { path: '', redirectTo: 'explore', pathMatch: 'full' },
            {
                path: 'login', component: LoginComponent, title: 'login',
            },
            // {path:'questions',component:QuestionsComponent,title:'questions'},
    //        {
    //   path: 'questions',
    //   loadComponent: () =>
    //     import('./components/questions/questions.component').then(
    //       (m) => m.QuestionsComponent
    //     ),
    //   title: 'questions',
    // },
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
      // {
      //   path: 'questions',
      //   loadComponent: () =>
      //     import('./components/questions/questions.component').then(
      //       (m) => m.QuestionsComponent
      //     ),
      //   title: 'Health Questions',
      //   data: { requiresAnswers: true }
      //    },
            { path: 'CodeVerfication', component: CodeVerficationComponent, title: 'OTP' },
            { path: 'reset-code', component: ResetCodeComponent, title: 'reset-code' },
            { path: 'emaildone', component: EmaildoneComponent, title: 'Done' },
            { path: 'forgetPassword', component: ForgetPasswordComponent, title: 'forgetPassword' },
            { path: 'reset-password', component: ResetPasswordComponent, title: 'reset-password' },


        ]
    },
    {
        path: 'main', component: MainComponent, canActivate: [authGuard], children: [
            { path: '', redirectTo: 'AllProducts', pathMatch: 'full' },
            { path: 'home', component: HomeComponent, title: 'home' },

            { path: 'AllProducts', component: AllproductsComponent, title: 'AllProducts' },
            { path: 'productdetails/:PId', component: SpecficProductComponent, title: 'Details' },
            { path: 'cart', component: CartComponent, title: 'Cart' },
            { path: 'MyRecommendation', component: GetMyRecommendationsComponent, title: 'MyRecommendation' },
            { path: 'safety', component: SafetyRecComponent, title: 'safety summray' },
            { path: 'CheckSafety/:PId', component: CheckSafetyComponent, title: 'Check Safety' },
            { path: 'Conflict', component: ConflictComponent, title: 'Conflict' },



           
            
            // add checkout route
            {path:'checkout',component:CheckoutComponent, title:'Checkout'},
            // add address:
            { path: 'add-address', component: AddAddressComponent, title: 'Add Address' },
            {path:'order-success', component: OrderSuccessComponent, title:'Order Success'},
{path:'orderstatus', component:OrderstatusComponent, title:'Order Status'},
             //  Profile routes
      { path: 'profile', component: ProfileComponent, title: 'Profile' },
      { path: 'edit-profile', component: EditProfileComponent, title: 'Edit Profile' },

          { path: 'FeatureCard', component: FeatureCardComponent, title: 'Feature Card' },

          // { path: 'RecommendedMedications', component: FeatureCardComponent, title: 'Recommended Medications' },


    {
      path: 'side-effects-questions',
      loadComponent: () =>
        import('./components/questions/questions.component').then(
          (m) => m.QuestionsComponent
        ),
      title: 'Side Effects Questions'
    },


            {
                path: 'chatbot',
                loadComponent: () =>
                    import('./components/diagnosis-chat/diagnosis-chat.component').then(m => m.DiagnosisChatComponent),
                title: 'Chatbot'
            },
            { path: 'orders-list', loadComponent: () => import('./components/orders-list/orders-list.component').then(m => m.OrdersListComponent) }
        ]
    },
    { path: '**', component: NotFoundComponent },

];
