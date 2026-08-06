import { Component, inject, OnInit } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { CategoryComponent } from '../../components/category/category.component';
import { SupabaseService } from '../../services/supabase.service';
import { IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, IonList } from "@ionic/angular/standalone";
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonButton,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    CategoryComponent,
    AsyncPipe,
  ],
})
export class HomePage implements OnInit {
  private supabaseService = inject(SupabaseService);
  categories$ = this.supabaseService.categories.pipe(
    map((categories) => categories.filter((cat) => cat.admin_only == false)),
  ); // filtering out admin-only categories so regular users cannot access them and their roles

  constructor() {}

  ngOnInit() {
    this.supabaseService.loadCategories();
  }

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }
}