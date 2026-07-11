import { Component, inject, OnInit } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { CategoryComponent } from '../../components/category/category.component';
import { Category, SupabaseService } from '../../services/supabase.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList } from "@ionic/angular/standalone";
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [ IonHeader, IonToolbar, IonTitle, IonContent, IonList, CategoryComponent, AsyncPipe ]
})
export class HomePage implements OnInit {
  private supabaseService = inject(SupabaseService);
  categories$ = this.supabaseService.categories;

  constructor() {
  }

  ngOnInit() {
    this.supabaseService.loadCategories();
    console.log(this.categories$)
  }

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }

}