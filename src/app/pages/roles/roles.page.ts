import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SupabaseService } from '../../services/supabase.service';
import { IonButtons, IonBackButton, IonHeader, IonToolbar, IonTitle, IonContent, IonList } from "@ionic/angular/standalone";
import { RoleComponent } from '../../components/role/role.component';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.page.html',
  styleUrls: ['./roles.page.scss'],
  imports: [ IonButtons, IonBackButton, IonHeader, IonToolbar, IonTitle, IonContent, IonList, RoleComponent, AsyncPipe, RouterLink ]
})

export class RolesPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private platform = inject(Platform);
  private supabaseService = inject(SupabaseService);

  roles$ = this.supabaseService.roles;

  constructor() {}

  ngOnInit() {
    const cat_id = this.activatedRoute.snapshot.paramMap.get('category_id') as string;
    this.supabaseService.loadRoles(cat_id);
    console.log(this.roles$);
  }

  getBackButtonText() {
    const isIos = this.platform.is('ios')
    return isIos ? 'Categories' : '';
  }
}

