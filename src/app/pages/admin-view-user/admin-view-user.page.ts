import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonGrid, IonRow, IonCol, IonBackButton, IonInput, IonModal, IonIcon, IonButtons, IonItem, IonLabel, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { SupabaseService } from '../../services/supabase.service';
import { Platform } from '@ionic/angular';
import { DownloadService } from '../../services/download.service';

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
  private download = inject(DownloadService);

  // user_entries$ = this.supabaseService.userEntries;
  user_entries!: any;
  user_info!: any;
  role_info_array: any[] = [];

  constructor() {}

  async ngOnInit() {
    const user_id = this.activatedRoute.snapshot.paramMap.get('user_id') as string;
    
    this.user_info = await this.supabaseService.getMemberInfo(user_id);

    this.user_entries = await this.supabaseService.loadUserEntries(user_id);
    console.log(this.user_entries);
    
    for (const entry of this.user_entries) {
      const role_info = await this.supabaseService.getRole(entry.role_id);
      this.role_info_array.push([entry, role_info]);
    }
  }

   async downloadCSV() {
    const csv_data = await this.supabaseService.downloadEntries(this.user_info?.user_id);
    if (csv_data) {
      this.download.downloadFile(csv_data, `${this.user_info?.full_name}_entries.csv`);
    }
    return;
  }
}
