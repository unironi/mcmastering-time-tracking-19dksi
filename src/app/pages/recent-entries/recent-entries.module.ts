import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecentEntriesPageRoutingModule } from './recent-entries-routing.module';

import { RecentEntriesPage } from './recent-entries.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecentEntriesPageRoutingModule,
    RecentEntriesPage
  ],
})
export class RecentEntriesPageModule {}
