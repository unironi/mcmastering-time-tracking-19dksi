import { Component, inject, OnInit } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { CategoryComponent } from '../../components/category/category.component';
import { SupabaseService } from '../../services/supabase.service';
import { IonLabel, IonItem, IonButtons, IonMenuButton, IonMenu, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, IonList } from "@ionic/angular/standalone";
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonLabel,
    IonItem,
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
    CategoryComponent,
    MenuComponent,
    AsyncPipe,
  ],
})
export class HomePage implements OnInit {
  private supabaseService = inject(SupabaseService);
  categories$ = this.supabaseService.categories.pipe(
    map((categories) => categories.filter((cat) => cat.admin_only == false)),
  ); // filtering out admin-only categories so regular users cannot access them and their roles

  in_group: boolean = false;
  user: any;
  
  constructor() {}

  async ngOnInit() {
    this.user = await this.supabaseService.getUser();
    console.log(this.user);
    const user_in_group = this.user? await this.supabaseService.getMemberInfo(this.user.id) : null;
    console.log(user_in_group);
    this.in_group = user_in_group ? true : false; // if user_in_group is not null, user is in group
    
    this.supabaseService.loadCategories();
  }

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }
}