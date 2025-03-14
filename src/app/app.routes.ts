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
                path: 'Transaction',
                component: TransactionStatusComponent
            }
        ]
    }
];
