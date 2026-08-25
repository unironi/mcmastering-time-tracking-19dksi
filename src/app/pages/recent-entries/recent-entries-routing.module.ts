import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecentEntriesPage } from './recent-entries.page';

const routes: Routes = [
  {
    path: '',
    component: RecentEntriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecentEntriesPageRoutingModule {}
