import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { OverlayEventDetail } from '@ionic/core/components';
import { IonToast, IonInput, IonModal, IonIcon, IonButtons, IonItem, IonLabel, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { SupabaseService } from '../../services/supabase.service';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DownloadService } from '../../services/download.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.page.html',
  styleUrls: ['./admin-home.page.scss'],
  imports: [RouterLink, FormsModule, AsyncPipe, IonToast, IonInput, IonModal, IonIcon, IonButtons, IonItem, IonLabel, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonButton]
})

export class AdminHomePage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  email!: string;
  error = false;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async confirm() {
    try {
      await this.inviteUser();
      this.modal.dismiss(this.email, 'confirm');
    } catch (e) {
      console.error(e);
      this.error = true;
    }
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      // this.email = `${event.detail.data}`;
     // this.inviteUser();
    }
  }

  private download = inject(DownloadService);
  private supabaseService = inject(SupabaseService);
  group_members$ = this.supabaseService.members;

  is_admin: boolean = false;

  constructor() { }

  async ngOnInit() {
    this.is_admin = await this.supabaseService.userIsAdmin();
    this.supabaseService.loadMembers();
  }

  async downloadCSV() {
    const csv_data = await this.supabaseService.downloadEntries();
    if (csv_data) {
      this.download.downloadFile(csv_data, 'pmm_entries.csv');
    }
    return;
  }

  async inviteUser() {
    try {
      await this.supabaseService.inviteUser(this.email);
    } catch (e) {
      throw e;
    }
    
  }

  removeUser(user_id: string) {
    this.supabaseService.removeMember(user_id);
    this.supabaseService.loadMembers();
  }

  setError(err: boolean) {
    this.error = err;
  }


}
