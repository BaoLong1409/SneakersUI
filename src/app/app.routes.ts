import { Routes } from '@angular/router';
import { AppLayoutComponent } from './core/components/app-layout/app-layout.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { EmailConfirmedComponent } from './features/components/email-confirmed/email-confirmed.component';
import { HomeComponent } from './features/components/home/home.component';
import { AllProductsComponent } from './features/components/all-products/all-products.component';
import { UploadProductComponent } from './features/admin/components/upload-product/upload-product.component';
import { DetailProductComponent } from './features/components/detail-product/detail-product.component';
import { OrderComponent } from './features/components/order/order.component';
import { TransactionStatusComponent } from './features/components/transaction-status/transaction-status.component';
import { OrderDetailComponent } from './features/components/order-detail/order-detail.component';
import { AllOrderComponent } from './features/components/all-order/all-order.component';
import { ProfileSettingComponent } from './features/components/profile-setting/profile-setting.component';
import { ChangePasswordComponent } from './features/components/change-password/change-password.component';
import { ForgetPasswordComponent } from './features/components/forget-password/forget-password.component';
import { PasswordCanActivateTeam } from './core/routeGuard/passwordCanActivateTeam';
import { ReviewComponent } from './features/components/review/review.component';

export const routes: Routes = [
    {
        path: 'Login',
        component: LoginComponent
    },
    {
        path: 'Register',
        component: RegisterComponent
    }
    ,
    {
        path: 'EmailConfirmed/:status',
        component: EmailConfirmedComponent
    },
    {
        path: '',
        component: AppLayoutComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'Home'
            },
            {
                path: 'Home',
                component: HomeComponent
            },
            {
                path: 'All',
                component: AllProductsComponent
            },
            {
                path: 'Admin/Upload',
                component: UploadProductComponent
            },
            {
                path: 'Detail/:id/:colorName',
                component: DetailProductComponent
            },
            {
                path: 'Order/:id',
                component: OrderComponent
            },
            {
                path: 'OrderDetail/:orderId',
                component: OrderDetailComponent
            },
            {
                path: 'AllOrder',
                component: AllOrderComponent
            },
            {
                path: 'Transaction',
                component: TransactionStatusComponent
            },
            {
                path: 'Profile/Setting',
                component: ProfileSettingComponent
            },
            {
                path: 'Password/Change',
                component: ChangePasswordComponent,
                canActivate: [PasswordCanActivateTeam]
            },
            {
                path: 'Password/Forget',
                component: ForgetPasswordComponent
            },
            {
                path: 'Review',
                component: ReviewComponent
            }
        ]
    }
];
