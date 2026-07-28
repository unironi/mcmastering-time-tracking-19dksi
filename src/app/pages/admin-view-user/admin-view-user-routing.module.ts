import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminViewUserPage } from './admin-view-user.page';

const routes: Routes = [
  {
    path: '',
    component: AdminViewUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminViewUserPageRoutingModule {}
