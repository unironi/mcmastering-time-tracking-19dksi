import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { OverlayEventDetail } from '@ionic/core/components';
import { IonInput, IonModal, IonIcon, IonButtons, IonItem, IonLabel, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { SupabaseService } from '../../services/supabase.service';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DownloadService } from '../../services/download.service';
@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.page.html',
  styleUrls: ['./admin-home.page.scss'],
  imports: [FormsModule, AsyncPipe, IonInput, IonModal, IonIcon, IonButtons, IonItem, IonLabel, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButton]
})

export class AdminHomePage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  email!: string;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.email, 'confirm');
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      this.email = `${event.detail.data}`;
      this.inviteUser(this.email);
    }
  }

  private download = inject(DownloadService);
  private supabaseService = inject(SupabaseService);
  group_members$ = this.supabaseService.members;

  constructor() { }

  ngOnInit() {
    this.supabaseService.loadMembers();
  }

  async downloadCSV() {
    const csv_data = await this.supabaseService.downloadEntries();
    if (csv_data) {
      this.download.downloadFile(csv_data, 'pmm_entries.csv');
    }
    return;
  }

  inviteUser(email: string) {
    this.supabaseService.inviteUser(email);
  }

  removeUser(user_id: string) {
    this.supabaseService.removeMember(user_id);
    this.supabaseService.loadMembers();
  }


}
