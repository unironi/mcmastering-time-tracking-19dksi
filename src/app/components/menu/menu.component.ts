import { Component, inject, input, OnInit } from '@angular/core';
import { DownloadService } from '../../services/download.service';
import { SupabaseService } from '../../services/supabase.service';
import {
  IonLabel,
  IonItem,
  IonMenuToggle,
  IonButtons,
  IonMenuButton,
  IonMenu,
  IonButton,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [
    IonList,
    IonLabel,
    IonItem,
    IonMenuToggle,
    IonButtons,
    IonMenuButton,
    IonMenu,
    IonButton,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  ],
})
export class MenuComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  private download = inject(DownloadService);

  user: any;

  async ngOnInit() {
    this.user = await this.supabaseService.getUser();
  }

  async downloadCSV() {
    const csv_data = await this.supabaseService.downloadEntries(this.user.id);
    if (csv_data) {
      this.download.downloadFile(csv_data, 'your_entries.csv');
    }
    return;
  }

  async signOut() {
    await this.supabaseService.signOut();
  }
}
