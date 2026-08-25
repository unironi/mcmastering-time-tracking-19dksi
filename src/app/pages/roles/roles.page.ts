import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Role, SupabaseService } from '../../services/supabase.service';
import { IonButtons, IonBackButton, IonHeader, IonToolbar, IonTitle, IonContent, IonList } from "@ionic/angular/standalone";
import { RoleComponent } from '../../components/role/role.component';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';

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

  roles: any;
  
  constructor() {}

  // unlikely that user can access admin-only roles since admin-only categories are filtered out, but this is in place just in case
  // also there is one category that has a mixture of admin-only and regular-user roles
  // roles$ = this.supabaseService.roles.pipe(
  //     map((roles) => roles.filter((r) => r.admin_only == false)),
  //   ); 


  async ngOnInit() {
    const cat_id = this.activatedRoute.snapshot.paramMap.get('category_id') as string;
    // this.supabaseService.loadRoles(cat_id);
    
    this.roles = (await this.supabaseService.loadRoles(cat_id))?.filter((r => r.admin_only == false)); // changed to async/await instead of observable to avoid shared state glitch in roles list when switching categories
    
  }
  
}

