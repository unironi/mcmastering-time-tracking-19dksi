import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonGrid, IonRow, IonCol, IonBackButton, IonInput, IonModal, IonIcon, IonButtons, IonItem, IonLabel, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { SupabaseService } from '../../services/supabase.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-admin-view-user',
  templateUrl: './admin-view-user.page.html',
  styleUrls: ['./admin-view-user.page.scss'],
    imports: [AsyncPipe, IonGrid, IonRow, IonCol, IonBackButton, IonInput, IonModal, IonIcon, IonButtons, IonItem, IonLabel, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButton]

})
export class AdminViewUserPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private platform = inject(Platform);
  private supabaseService = inject(SupabaseService);

  // user_entries$ = this.supabaseService.userEntries;
  user_entries!: any;

  constructor() {}

  async ngOnInit() {
    const user_id = this.activatedRoute.snapshot.paramMap.get('user_id') as string;
    this.user_entries = await this.supabaseService.loadUserEntries(user_id);
     console.log(this.user_entries);
  }

  getBackButtonText() {
    const isIos = this.platform.is('ios')
    return isIos ? 'Categories' : '';
  }
}
