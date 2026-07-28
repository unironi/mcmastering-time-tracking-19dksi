import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canMatch: [authGuard]
  },
  {
    path: 'category/:category_id',
    loadChildren: () => import('./pages/roles/roles.module').then( m => m.RolesPageModule),
    canMatch: [authGuard]
  },
  {
    path: 'category/:category_id/role/:role_id',
    loadChildren: () => import('./pages/entry/entry.module').then( m => m.EntryPageModule),
    canMatch: [authGuard]
  },
  {
    path: 'admin-home',
    loadChildren: () => import('./pages/admin-home/admin-home.module').then( m => m.AdminHomePageModule)
  },
  {
    path: 'admin-home/:user_id',
    loadChildren: () => import('./pages/admin-view-user/admin-view-user.module').then( m => m.AdminViewUserPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
