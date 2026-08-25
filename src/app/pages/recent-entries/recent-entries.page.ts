import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { IonLabel, IonItem, IonMenuToggle, IonButtons, IonMenuButton, IonMenu, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, IonList } from "@ionic/angular/standalone";
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ListedEntryComponent } from '../../components/listed-entry/listed-entry.component';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-recent-entries',
  templateUrl: './recent-entries.page.html',
  styleUrls: ['./recent-entries.page.scss'],
  imports: [
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
    RouterLink,
    ListedEntryComponent,
    MenuComponent,
    AsyncPipe,
  ],
})
export class RecentEntriesPage implements OnInit {

  private supabaseService = inject(SupabaseService);
  entries: any;
  entry_info_array: any[] = [];
  user: any;

  constructor() { }

  async ngOnInit() {
    this.user = await this.supabaseService.getUser();

    this.entries = await this.supabaseService.loadUserEntries(this.user.id);
    for (const entry of this.entries) {
      const role_info = await this.supabaseService.getRole(entry.role_id);
      const category_info = await this.supabaseService.getCategory(role_info!.category_id);
      this.entry_info_array.push([category_info, role_info, entry]);
    }
    console.log(this.entry_info_array)
  }

}
