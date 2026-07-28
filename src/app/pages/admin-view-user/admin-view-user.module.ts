import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminViewUserPageRoutingModule } from './admin-view-user-routing.module';

import { AdminViewUserPage } from './admin-view-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminViewUserPageRoutingModule,
    AdminViewUserPage
  ],
})
export class AdminViewUserPageModule {}
